/**
 * supabase_client.js (V3.2 - Đã khắc phục triệt để P1-API-06 & P1-AUTH-03)
 * Adapter kết nối chính thức tới Supabase qua PostgREST và GoTrue REST API
 * Sử dụng native fetch của Node.js 18+, KHÔNG cài thêm package ngoài.
 * Tuân thủ nguyên tắc Fail-Closed: CẤM tuyệt đối việc fallback apiKey sang serviceRoleKey.
 */

class PostgrestQueryBuilder {
    constructor(baseUrl, activeKey) {
        this.baseUrl = baseUrl;
        this.activeKey = activeKey;
        this.method = 'GET';
        this.columns = '*';
        this.filters = [];
        this.orders = [];
        this.maxRows = null;
        this.expectMaybeSingle = false;
        this.body = undefined;
    }

    select(columns = '*') {
        this.columns = columns;
        return this;
    }

    eq(column, value) {
        this.filters.push([column, 'eq.' + String(value)]);
        return this;
    }

    in(column, values) {
        this.filters.push([column, 'in.(' + (values || []).map(value => String(value)).join(',') + ')']);
        return this;
    }

    order(column, options = {}) {
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(String(column || ''))) {
            throw new Error('INVALID_QUERY_ORDER');
        }
        this.orders.push(`${column}.${options.ascending === false ? 'desc' : 'asc'}`);
        return this;
    }

    limit(value) {
        this.maxRows = Number(value);
        return this;
    }

    maybeSingle() {
        this.expectMaybeSingle = true;
        if (this.maxRows === null) this.maxRows = 1;
        return this;
    }

    insert(records) {
        this.method = 'POST';
        this.body = records;
        return this;
    }

    update(values) {
        this.method = 'PATCH';
        this.body = values;
        return this;
    }

    async execute() {
        const url = new URL(this.baseUrl);
        if (this.method === 'GET') url.searchParams.set('select', this.columns);
        for (const [column, expression] of this.filters) url.searchParams.append(column, expression);
        if (this.orders.length > 0) url.searchParams.set('order', this.orders.join(','));
        if (this.maxRows !== null) url.searchParams.set('limit', String(this.maxRows));

        const headers = {
            'apikey': this.activeKey,
            'Authorization': 'Bearer ' + this.activeKey,
            'Accept': 'application/json'
        };
        const options = { method: this.method, headers };
        if (this.body !== undefined) {
            headers['Content-Type'] = 'application/json';
            headers['Prefer'] = 'return=representation';
            options.body = JSON.stringify(this.body);
        }

        const response = await fetch(url.toString(), options);
        let data = null;
        if (typeof response.text === 'function') {
            const responseText = await response.text();
            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = responseText;
                }
            }
        } else if (typeof response.json === 'function') {
            data = await response.json();
        }

        if (!response.ok) return { data: null, error: data || { message: 'POSTGREST_REQUEST_FAILED' } };
        if (this.expectMaybeSingle && Array.isArray(data)) {
            if (data.length > 1) {
                return { data: null, error: { code: 'PGRST116', message: 'MULTIPLE_ROWS_RETURNED' } };
            }
            return { data: data[0] || null, error: null };
        }
        return { data, error: null };
    }

    then(resolve, reject) {
        return this.execute().then(resolve, reject);
    }
}

class SupabaseClient {
    constructor(supabaseUrl, apiKey, options = {}) {
        if (!supabaseUrl || !apiKey) {
            throw new Error('SUPABASE_CONFIG_MISSING: Bắt buộc phải có supabaseUrl và apiKey (anonKey) để khởi tạo kết nối');
        }
        this.supabaseUrl = supabaseUrl.replace(/\/+$/, '');
        this.apiKey = apiKey;

        // [P1-API-06]: KHÔNG FALLBACK! serviceRoleKey phải được truyền rõ ràng nếu dùng cho backend đặc quyền
        this.serviceRoleKey = options.serviceRoleKey || null;

        // Quản lý xác thực chính thức (GoTrue Auth REST API)
        this.auth = {
            signInWithPassword: async ({ email, password }) => {
                const url = `${this.supabaseUrl}/auth/v1/token?grant_type=password`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'apikey': this.apiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (!res.ok) {
                    return { data: null, error: data };
                }
                return { data, error: null };
            },

            signInWithOtp: async ({ email, options = {} }) => {
                const url = new URL(`${this.supabaseUrl}/auth/v1/otp`);
                if (options.emailRedirectTo) url.searchParams.set('redirect_to', options.emailRedirectTo);
                const res = await fetch(url.toString(), {
                    method: 'POST',
                    headers: {
                        'apikey': this.apiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        create_user: options.shouldCreateUser !== false,
                        data: options.data || {}
                    })
                });
                const responseText = await res.text();
                let data = {};
                if (responseText) {
                    try { data = JSON.parse(responseText); } catch { data = { message: responseText }; }
                }
                if (!res.ok) return { data: null, error: data };
                return { data, error: null };
            },

            refreshSession: async (refreshToken) => {
                if (!refreshToken) return { data: null, error: new Error('REFRESH_TOKEN_REQUIRED') };
                const url = `${this.supabaseUrl}/auth/v1/token?grant_type=refresh_token`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'apikey': this.apiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ refresh_token: refreshToken })
                });
                const responseText = await res.text();
                let data = null;
                if (responseText) {
                    try { data = JSON.parse(responseText); } catch { data = { message: responseText }; }
                }
                if (!res.ok) return { data: null, error: data || { message: 'AUTH_REFRESH_FAILED' } };
                return { data, error: null };
            },

            getUser: async (accessToken) => {
                if (!accessToken) return { data: null, error: new Error('ACCESS_TOKEN_REQUIRED') };
                const url = `${this.supabaseUrl}/auth/v1/user`;
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'apikey': this.apiKey,
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const data = await res.json();
                if (!res.ok) {
                    return { data: null, error: data };
                }
                return { data: { user: data }, error: null };
            },

            updateUser: async (accessToken, updates = {}) => {
                if (!accessToken) return { data: null, error: new Error('ACCESS_TOKEN_REQUIRED') };
                if (!updates || typeof updates !== 'object' || typeof updates.password !== 'string') {
                    return { data: null, error: new Error('PASSWORD_UPDATE_REQUIRED') };
                }
                const url = `${this.supabaseUrl}/auth/v1/user`;
                const res = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'apikey': this.apiKey,
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ password: updates.password })
                });
                const responseText = await res.text();
                let data = null;
                if (responseText) {
                    try { data = JSON.parse(responseText); } catch { data = { message: responseText }; }
                }
                if (!res.ok) return { data: null, error: data || { message: 'AUTH_USER_UPDATE_FAILED' } };
                return { data: { user: data }, error: null };
            },

            signOut: async (accessToken) => {
                if (!accessToken) return { data: null, error: new Error('ACCESS_TOKEN_REQUIRED') };
                const url = `${this.supabaseUrl}/auth/v1/logout?scope=local`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'apikey': this.apiKey,
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!res.ok) {
                    const responseText = await res.text();
                    let data = null;
                    if (responseText) {
                        try { data = JSON.parse(responseText); } catch { data = { message: responseText }; }
                    }
                    return { data: null, error: data || { message: 'AUTH_LOGOUT_FAILED' } };
                }
                return { data: null, error: null };
            },

            // [P1-AUTH-04]: Admin API tạo người dùng mới có mật khẩu khởi tạo an toàn
            admin: {
                createUser: async ({ email, password, email_confirm = true, user_metadata = {} }) => {
                    if (!this.serviceRoleKey) {
                        throw new Error('CRITICAL_SECURITY_ERROR: Admin Auth API yêu cầu serviceRoleKey. Fail-closed.');
                    }
                    const url = `${this.supabaseUrl}/auth/v1/admin/users`;
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'apikey': this.serviceRoleKey,
                            'Authorization': `Bearer ${this.serviceRoleKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email,
                            password,
                            email_confirm,
                            user_metadata
                        })
                    });
                    const data = await res.json();
                    if (!res.ok) {
                        return { data: null, error: data };
                    }
                    return { data: { user: data }, error: null };
                }
            }
        };
    }

    // Truy vấn bảng qua PostgREST REST API
    from(table) {
        const baseUrl = `${this.supabaseUrl}/rest/v1/${table}`;
        // Dùng serviceRoleKey nếu có (cho backend), ngược lại dùng anon apiKey
        const activeKey = this.serviceRoleKey || this.apiKey;
        return new PostgrestQueryBuilder(baseUrl, activeKey);
    }

    // [P1-API-06]: Gọi Stored Procedure nguyên tử qua PostgREST RPC
    async rpc(functionName, params = {}, options = {}) {
        const useServiceRole = options.useServiceRole !== false;
        const key = useServiceRole ? this.serviceRoleKey : this.apiKey;
        if (useServiceRole && !this.serviceRoleKey) {
            throw new Error(`CRITICAL_SECURITY_ERROR: Gọi RPC đặc quyền '${functionName}' yêu cầu serviceRoleKey. Fail-closed.`);
        }

        const url = `${this.supabaseUrl}/rest/v1/rpc/${functionName}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        const data = await res.json();
        if (!res.ok) return { data: null, error: data };
        return { data, error: null };
    }
}

function createClient(supabaseUrl, apiKey, options = {}) {
    return new SupabaseClient(supabaseUrl, apiKey, options);
}

module.exports = {
    SupabaseClient,
    createClient
};
