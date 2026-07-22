---
phase: 5
title: "Production Rollout and Live UAT"
status: pending
effort: "90-150 phút"
---

# Phase 5: Production Rollout and Live UAT

## Overview

Thực hiện các mutation production đã được gọi tên trong gói phê duyệt, theo thứ tự giảm blast radius (phạm vi ảnh hưởng). Mỗi cổng thất bại sẽ dừng và rollback, không cố chạy hết checklist.

## Implementation Steps

1. Chụp preflight ngay trước mutation:
   - Vercel alias/deployment/rollback target;
   - env names và giá trị cần thay đổi được lưu vào file cục bộ bảo vệ, report chỉ ghi present/absent;
   - Apps Script deployments/version 69 và probe read-only các route đăng ký hiện hành.
2. Tạo deployment Apps Script riêng, không push source và không cập nhật deployment cũ:
   - `npx.cmd --yes @google/clasp deploy --versionNumber 69 --description "ABCDE submission dedicated deployment 20260721"`.
   - Lưu deployment ID/URL mới; probe POST/GET vô hại để xác nhận web app truy cập được và có contract ABCDE.
   - Nếu deployment mới không public/không đúng contract, dừng; không thay env Vercel.
3. Cập nhật đúng các Vercel production env bằng `vercel env add <NAME> production --value <VALUE> --yes --force`:
   - `ABCDE_RAG_ENABLED=true`;
   - `DHM_PASSCODE=DHM8,DHM9,ABCDE`;
   - `ABCDE_APPS_SCRIPT_URL=https://script.google.com/macros/s/<NEW_DEPLOYMENT_ID>/exec`;
   - `RAG_TOP_K=3`;
   - `RAG_MIN_SCORE=0.075`;
   - `RAG_MIN_COVERAGE=0.82`.
4. Deploy từ `C:\tmp\dh4hn-abcde-rag-release-clean-20260722` bằng `vercel deploy --prod --yes`. Ghi deployment ID, URL, thời gian, function size và alias.
5. API smoke test (kiểm tra nhanh):
   - 7 URL public nền trả 200 sau redirect;
   - Stable verify passcode và một lượt chat A không lỗi;
   - `rag_health` báo enabled, local KB available, 79 chunks, retrievalModel=`local-tfidf-ngram-v1`, vectorDimensions=0, manifest và SHA-256 khớp;
   - 5 ca STEP_D trong miền có `ragUsed=true`, citation hợp lệ; một ca ngoài miền không bịa nguồn;
   - Vercel logs không có `Local knowledge base file not found`, secret hoặc stack trace mới.
6. Browser UAT trên `https://delivering-happiness.vercel.app`:
   - desktop 1440x900 và mobile 390x844;
   - ở A, nhập “sếp bất công và cố tình phá cuối tuần”: bot phải giữ A, chỉ ra đây có suy diễn ý định và hỏi đúng một câu về sự kiện quan sát được;
   - nhập lại A khách quan; bot mới được sang B; sau đó hoàn thành đủ B-C-D-E, không bỏ bước;
   - dữ liệu A dùng cho retrieval và submit chỉ chứa câu khách quan đã được chấp nhận, không giữ lại câu suy diễn bị từ chối;
   - tại mỗi bước kiểm tra chỉ một câu hỏi Socratic, không trả lời hộ; tại D kiểm tra citation hiển thị đúng title/source từ manifest;
   - tại E kiểm tra bot yêu cầu mức cảm xúc mới, góc nhìn và hành động cụ thể trước khi cho submit; kiểm tra fallback Stable;
   - chụp screenshot; lưu console errors, network request `/api/chat-abcde-rag` và DOM evidence (bằng chứng cấu trúc trang);
   - mirror vào `UAT/abcde_rag_hardening_live_20260721.md` và các PNG cùng tiền tố.
7. Chạy đúng một end-to-end submit (gửi xuyên suốt hệ thống):
   - marker/FullName `CODEX_UAT_ABCDE_RAG_20260721`;
   - email `vuhoang2708@gmail.com`;
   - `chatVersion=beta`, dữ liệu A-E tổng hợp không chứa dữ liệu cá nhân;
   - ghi timestamp/UUID, xác minh một dòng Sheet `ABCDE_Data` có cột `ChatVersion=beta` và email nhận được ghi đúng phiên bản.
8. Re-probe route DHM8, DHM9, Program Interest sau deploy để chứng minh deployment riêng ABCDE không gây hồi quy backend chung.
9. Nếu tất cả pass, cập nhật report, commit/push bằng chứng lần hai trên feature branch và gửi đúng một Gmail báo cáo cuối đến `vuhoang2708@gmail.com`; xác minh message ID và delivery bằng Gmail search.

## Go/No-Go Và Rollback

- `NO-GO`: stable lỗi, health thiếu KB, citation trong miền = 0, lỗi console/network nghiêm trọng, Apps Script riêng không truy cập được, `ChatVersion` sai, hoặc route registration cũ hồi quy.
- Rollback nhanh nhất: `vercel rollback https://delivering-happiness-cox2r4mqb-vuhoang2708s-projects.vercel.app` rồi xác minh alias và Stable.
- Kill switch có redeploy: đặt `ABCDE_RAG_ENABLED=false` và deploy lại gói sạch; không hiểu nhầm việc đổi env là có hiệu lực ngay trên deployment cũ.
- Apps Script: bỏ sử dụng `ABCDE_APPS_SCRIPT_URL` trong deployment kế tiếp/rollback Vercel; deployment ABCDE mới được để nguyên để đối soát, không undeploy nếu chưa có approval xóa riêng.
- Dòng UAT: giữ lại với marker để audit, không xóa tự động.
- Sau rollback vẫn phải gửi báo cáo sự cố, không gửi email "go-live thành công".

## Success Criteria

- [ ] Production alias trỏ deployment mới và toàn bộ API/browser gate pass.
- [ ] Stable vẫn hoạt động; Beta dùng KB thật và công khai trạng thái RAG.
- [ ] Beta áp dụng Socratic đúng ở đủ A-B-C-D-E; ca A suy diễn bị giữ lại và ca A khách quan mới được chuyển bước.
- [ ] D dùng context A-B-C và citation trên UI khớp source manifest.
- [ ] Apps Script deployment ABCDE riêng hoạt động, deployment DHM8/DHM9 không đổi.
- [ ] Đúng một dòng UAT có `ChatVersion=beta`; email ABCDE đúng phiên bản.
- [ ] Report/screenshot/log được mirror về repo và push trên feature branch.
- [ ] Gmail báo cáo cuối có message ID và `VERIFIED_DELIVERY=True`.
