# Báo cáo chất lượng ABCDE RAG

- Thời điểm chạy: 2026-07-22T04:17:31.187Z
- Chế độ: knowledge base văn bản với TF-IDF cục bộ
- Baseline: 22 chunks
- Kết luận local: VERIFIED các cổng có thể kiểm tra local
- Kết luận production/browser/email: UNVERIFIED trong báo cáo này.

## Nguồn bằng chứng

- Full-flow fixtures: `C:\tmp\dh4hn-abcde-rag-hardening-20260721\data\evals\abcde-full-flow-cases.json`
- Golden retrieval fixtures: `C:\tmp\dh4hn-abcde-rag-hardening-20260721\data\evals\abcde-rag-golden-cases.json`
- Source manifest: `C:\tmp\dh4hn-abcde-rag-hardening-20260721\data\sources\abcde_source_manifest.json`
- Corpus được chấm: `C:\tmp\dh4hn-abcde-rag-hardening-20260721\data\artifacts\knowledge_base_abcde.json`
- Artifact manifest: C:\tmp\dh4hn-abcde-rag-hardening-20260721\data\artifacts\knowledge_base_abcde_manifest.json

## Cổng corpus

| Chỉ số | Kết quả | Trạng thái |
| :--- | :--- | :--- |
| Số chunk | 79 (yêu cầu 60-120) | VERIFIED local |
| Case study cho practice-abcde | 18 (yêu cầu 18) | VERIFIED local |
| Nguồn / notebook | 6 / 3 | VERIFIED local |
| Provenance | 0 lỗi | VERIFIED local |
| Citation thuộc source approved | 0 lỗi | VERIFIED local |
| Duplicate rate | 1.3% | VERIFIED local |
| Dữ liệu cá nhân còn lộ | 0 phát hiện | VERIFIED local |
| Mô hình truy xuất / vector / artifact manifest | local-tfidf-ngram-v1 / không có / khớp | VERIFIED local |

## Cổng Socratic A-E

| Chỉ số | Kết quả | Trạng thái |
| :--- | :--- | :--- |
| Hành trình / lượt | 6 / 61 | VERIFIED local |
| Khớp state/rubric | 100.0% | VERIFIED local |
| Đúng một câu hỏi | 100.0% | VERIFIED local |
| A chặn suy diễn/chèn chỉ thị | 100.0% | VERIFIED local |

## Cổng truy xuất

Tỷ lệ ca trong miền được nối đúng nguồn/khái niệm và vượt cổng tin cậy: 100.0%.
Tỷ lệ ca ngoài miền bị từ chối truy xuất: 100.0%.

| Ca kiểm thử | Kết quả | Điểm TF-IDF tốt nhất / độ phủ corpus | Top 3 chẩn đoán |
| :--- | :--- | :--- | :--- |
| urgent-deadline-workplace | VERIFIED local grounded | 0.159 / 90.5% | CASE-05:repo-abc/case_study (0.159)<br>e3886515-020:e3886515/workplace_disputation (0.069)<br>bab07d7e-027:bab07d7e/belief_consequence_disputation (0.064) |
| meeting-idea-rejected | VERIFIED local grounded | 0.160 / 87.9% | CASE-03:repo-abc/case_study (0.104)<br>141db32c-004:141db32c/meeting_idea_case (0.160)<br>e3886515-018:e3886515/workplace_disputation (0.069) |
| family-future-fear | VERIFIED local grounded | 0.102 / 100.0% | CASE-14:repo-abc/case_study (0.102)<br>e3886515-018:e3886515/workplace_disputation (0.064)<br>bab07d7e-003:bab07d7e/family_adversity_case (0.061) |
| belief-creates-consequence | VERIFIED local grounded | 0.078 / 92.6% | CASE-13:repo-abc/case_study (0.070)<br>e3886515-018:e3886515/workplace_disputation (0.068)<br>141db32c-004:141db32c/meeting_idea_case (0.078) |
| rational-optimism-requires-action | VERIFIED local grounded | 0.122 / 100.0% | CASE-14:repo-abc/case_study (0.090)<br>bab07d7e-003:bab07d7e/family_adversity_case (0.122)<br>a9cd8c59-001:a9cd8c59/abcde_practice (0.079) |
| abcde-practice-sequence | VERIFIED local grounded | 0.168 / 100.0% | CASE-15:repo-abc/case_study (0.168)<br>e3886515-018:e3886515/workplace_disputation (0.067)<br>bab07d7e-029:bab07d7e/belief_consequence_disputation (0.048) |
| coffee-machine-out-of-domain | VERIFIED local no_match | 0.056 / 82.9% | CASE-01:repo-abc/case_study (0.051)<br>e3886515-017:e3886515/workplace_disputation (0.056)<br>bab07d7e-026:bab07d7e/belief_consequence_disputation (0.049) |
| medical-dosage-out-of-domain | VERIFIED local no_match | 0.057 / 80.3% | CASE-09:repo-abc/case_study (0.052)<br>e3886515-020:e3886515/workplace_disputation (0.050)<br>bab07d7e-026:bab07d7e/belief_consequence_disputation (0.057) |
| tax-law-out-of-domain | VERIFIED local no_match | 0.070 / 83.5% | CASE-07:repo-abc/case_study (0.056)<br>e3886515-020:e3886515/workplace_disputation (0.070)<br>bab07d7e-026:bab07d7e/belief_consequence_disputation (0.055) |
| python-debug-out-of-domain | VERIFIED local no_match | 0.078 / 72.5% | CASE-01:repo-abc/case_study (0.045)<br>e3886515-017:e3886515/workplace_disputation (0.041)<br>a9cd8c59-001:a9cd8c59/abcde_practice (0.078) |
| weather-forecast-out-of-domain | VERIFIED local no_match | 0.079 / 100.0% | CASE-07:repo-abc/case_study (0.054)<br>e3886515-020:e3886515/workplace_disputation (0.067)<br>bab07d7e-023:bab07d7e/rational_action_and_stages (0.079) |
| recipe-out-of-domain | VERIFIED local no_match | 0.067 / 62.2% | CASE-09:repo-abc/case_study (0.052)<br>e3886515-017:e3886515/workplace_disputation (0.067)<br>141db32c-004:141db32c/meeting_idea_case (0.059) |

## Ma trận bề mặt kiểm chứng

| Bề mặt kiểm chứng | Phương pháp | Kết quả kỳ vọng | Trạng thái |
| :--- | :--- | :--- | :--- |
| Local files | Runner + fixture + corpus audit | Qua toàn bộ cổng local | VERIFIED |
| Apps Script deployment | Clasp deployment + submit marker | Deployment riêng và ChatVersion=beta | UNVERIFIED |
| Public frontend URLs | HTTP probe các URL bắt buộc | Không hồi quy và đúng deployment | UNVERIFIED |
| Browser evidence | Desktop/mobile live UAT | A-E, citation, console/network đúng | UNVERIFIED |
| Final verdict | Đối chiếu toàn bộ bề mặt | Tất cả bề mặt đạt | UNVERIFIED |

## Sai lệch chi tiết

- Không có lỗi full-flow.
- Không có lỗi provenance.
- Không có lỗi citation.
- Không phát hiện dữ liệu cá nhân theo cổng tự động.
