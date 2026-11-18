/**
 * reporting_outbox_worker.js (P1-OUTBOX-01)
 * Tiến trình ngầm xử lý Hàng đợi Xuất báo cáo Một chiều sang Google Sheets (Reporting Outbox Worker)
 * Tuân thủ nguyên tắc:
 * - Không dual-write trong luồng chính: Nghiệp vụ ghi vào Supabase + reporting_outbox trong cùng 1 transaction.
 * - Outbox worker quét các bản ghi PENDING và phản chiếu một chiều sang Sheets.
 * - Nếu lỗi kết nối, tăng retry_count và lưu last_error, KHÔNG làm ảnh hưởng luồng chính.
 */

async function updateOutboxRow(db, itemId, values) {
    let result;
    if (db.from) {
        result = await db.from('reporting_outbox').update(values).eq('id', itemId);
    } else if (db.reporting_outbox && typeof db.reporting_outbox.update === 'function') {
        result = await db.reporting_outbox.update({ id: itemId }, values);
    } else {
        throw new Error('OUTBOX_UPDATE_UNAVAILABLE');
    }

    if (!result || result.error) throw new Error('OUTBOX_UPDATE_FAILED');
    if (db.from && (!Array.isArray(result.data) || result.data.length !== 1)) {
        throw new Error('OUTBOX_ROW_NOT_UPDATED');
    }
    if (Array.isArray(result.data) && result.data.length !== 1) throw new Error('OUTBOX_ROW_NOT_UPDATED');
    return result;
}

async function findPersonEmailForHubUpdate(db, personId) {
    let rawEmail = '';
    if (db && db.from) {
        const { data, error } = await db.from('person_contacts')
            .select('person_id,contact_value,is_primary')
            .eq('person_id', personId)
            .eq('contact_type', 'email')
            .limit(10);
        if (error) throw new Error('HUB_PERSON_LOOKUP_FAILED');
        const matches = (data || []).filter(row =>
            typeof row.contact_value === 'string' && row.contact_value.trim() !== ''
        );
        if (matches.length === 0) throw new Error('HUB_PERSON_EMAIL_UNAVAILABLE');
        const primary = matches.find(row => row.is_primary === true);
        if (!primary && matches.length > 1) throw new Error('HUB_PERSON_NOT_UNIQUE');
        rawEmail = (primary || matches[0]).contact_value;
    } else if (db && db.people && typeof db.people.findOne === 'function') {
        const person = await db.people.findOne({ id: personId });
        rawEmail = person && person.email || '';
    } else {
        throw new Error('HUB_PERSON_LOOKUP_UNAVAILABLE');
    }

    const email = String(rawEmail || '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('HUB_PERSON_EMAIL_UNAVAILABLE');
    }
    return email;
}

async function processOutboxBatch(db, sheetsAdapter = null, maxBatch = 10, options = {}) {
    if (!db) {
        throw new Error('DATABASE_UNAVAILABLE');
    }

    let pendingItems = [];

    if (db.from) {
        let query = db.from('reporting_outbox')
            .select('*')
            .eq('status', 'PENDING');
        if (options.onlyId) query = query.eq('id', options.onlyId);
        const { data, error } = await query.limit(maxBatch);
        if (error) throw new Error(`OUTBOX_QUERY_ERROR: ${JSON.stringify(error)}`);
        pendingItems = data || [];
    } else if (db.reporting_outbox) {
        const all = await db.reporting_outbox.find({ status: 'PENDING' });
        pendingItems = (all || []).filter(item => !options.onlyId || item.id === options.onlyId).slice(0, maxBatch);
    }

    const report = {
        scanned: pendingItems.length,
        processed: 0,
        failed: 0,
        errors: []
    };

    for (const item of pendingItems) {
        try {
            let acknowledgement;
            if (item.event_type === 'PERSONAL_VALUES_HUB_COMPLETION') {
                if (item.target_sheet !== 'Leads_Directory' || !item.payload ||
                    item.payload.survey_type !== 'GTCL' || item.payload.target_column !== 'gtcl_completed' ||
                    !item.payload.person_id || item.payload.source_event_id !== item.id ||
                    typeof item.payload.completed_value !== 'string') {
                    throw new Error('INVALID_HUB_COMPLETION_EVENT');
                }
                if (!sheetsAdapter || typeof sheetsAdapter.updateExistingByEmail !== 'function') {
                    throw new Error('HUB_UPDATE_ADAPTER_REQUIRED');
                }
                const email = await findPersonEmailForHubUpdate(db, item.payload.person_id);
                acknowledgement = await sheetsAdapter.updateExistingByEmail(
                    email,
                    { gtcl_completed: item.payload.completed_value },
                    { idempotencyKey: item.id, targetSheet: 'Leads_Directory' }
                );
                if (!acknowledgement || acknowledgement.success !== true || acknowledgement.updatedCount !== 1) {
                    throw new Error(acknowledgement && acknowledgement.error || 'HUB_ROW_UPDATE_NOT_ACKNOWLEDGED');
                }
            } else {
                if (!sheetsAdapter || typeof sheetsAdapter.appendRow !== 'function') {
                    throw new Error('SHEETS_ADAPTER_REQUIRED');
                }
                // Adapter phải chống ghi lặp theo id ổn định của bản ghi Outbox.
                acknowledgement = await sheetsAdapter.appendRow(
                    item.target_sheet,
                    item.payload,
                    { idempotencyKey: item.id }
                );
            }
            if (!acknowledgement || acknowledgement.success !== true) {
                throw new Error('SHEETS_WRITE_NOT_ACKNOWLEDGED');
            }

            // Cập nhật trạng thái PROCESSED
            await updateOutboxRow(db, item.id, {
                status: 'PROCESSED',
                processed_at: new Date().toISOString()
            });

            report.processed += 1;
        } catch (err) {
            // Ghi nhận lỗi và tăng retry_count
            const retryCount = (item.retry_count || 0) + 1;
            const newStatus = retryCount >= 5 ? 'FAILED' : 'PENDING';
            const errorMsg = String(err.message || err).slice(0, 500);

            try {
                await updateOutboxRow(db, item.id, {
                    status: newStatus,
                    retry_count: retryCount,
                    last_error: errorMsg
                });
            } catch {
                // Báo lỗi của lần xử lý; trạng thái trong DB được coi là chưa xác nhận.
            }

            report.errors.push({ item_id: item.id, error: errorMsg });
            report.failed += 1;
        }
    }

    return report;
}

module.exports = {
    processOutboxBatch
};
