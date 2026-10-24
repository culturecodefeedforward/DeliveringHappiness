# scripts/patch_index_full_dhm10.py

def patch_index(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Top badge
    old_top_badge = '🚀 CỘT MỐC QUÝ 4/2026 — ĐỘT PHÁ MÔ HÌNH ĐÀO TẠO HYBRID ĐA ĐIỂM CẦU'
    new_top_badge = '🌟 CỘT MỐC SỐ 10 — DELIVERING HAPPINESS MASTERCLASS TẠI TP.HCM & NEXT DHM'
    c = c.replace(old_top_badge, new_top_badge)

    # 2. Hero card
    old_hero_card = '''    <div class="hero-hybrid-card">
      <div>
        <strong style="color: var(--warm-yellow); font-size: 1.28rem; display: block; margin-bottom: 0.4rem; letter-spacing: 0.5px;">DHM10 — Mô hình Hybrid Song Song 2 Điểm Cầu</strong>
        <strong style="color: #ffffff; font-size: 1.05rem;">📅 Dự kiến Quý 4/2026</strong>
        <div style="font-size: 0.88rem; color: rgba(255,255,255,0.7); margin-top: 0.2rem; font-style: italic;">(Sẽ công bố ngày chính thức sau khi chốt lịch)</div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 0.75rem; font-size: 0.92rem; color: rgba(255, 255, 255, 0.9); line-height: 1.4;">
          <span style="display: inline-flex; align-items: center; gap: 5px;">🏛️ Không gian đào tạo chuẩn quốc tế</span>
          <span style="opacity: 0.35;">•</span>
          <span style="display: inline-flex; align-items: center; gap: 5px; color: var(--warm-yellow); font-weight: 600;">👨‍🏫 Giảng viên cơ hữu đồng hành tại chỗ</span>
        </div>
      </div>

      <div class="hybrid-hubs-grid">
        <!-- Điểm cầu HN -->
        <div class="hybrid-hub-item">
          <div style="display: inline-flex; align-items: center; gap: 6px; color: var(--warm-yellow); font-weight: 700; font-size: 1.05rem;">
            <span>📍</span> Điểm cầu Hà Nội
          </div>
          <div style="color: #ffffff; font-weight: 600; font-size: 1rem; margin-top: 2px;">Cơ sở SBB</div>
        </div>

        <!-- Điểm cầu HCM -->
        <div class="hybrid-hub-item hcm-col">
          <div style="display: inline-flex; align-items: center; gap: 6px; color: var(--warm-yellow); font-weight: 700; font-size: 1.05rem;">
            <span>📍</span> Điểm cầu TP.HCM
          </div>
          <div style="color: #ffffff; font-weight: 600; font-size: 1rem; margin-top: 2px;">Cơ sở Apollo English</div>
        </div>
      </div>'''

    new_hero_card = '''    <div class="hero-hybrid-card">
      <div>
        <strong style="color: var(--warm-yellow); font-size: 1.35rem; display: block; margin-bottom: 0.4rem; letter-spacing: 0.5px;">DHM10 — Tổ Chức Trực Tiếp Offline Tại TP.HCM</strong>
        <strong style="color: #ffffff; font-size: 1.05rem; display: block;">🗓️ Chủ Nhật, 01/11/2026 (08:00 – 17:00)</strong>
        <div style="font-size: 0.88rem; color: rgba(255,255,255,0.85); margin-top: 0.3rem;">
          💻 Khởi động Webinar LMS Chặng 1: Tối Thứ Sáu, 30/10/2026 (19:30 – 21:00)
        </div>
        <div style="margin-top: 0.6rem;">
          <span style="display: inline-block; padding: 4px 14px; background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.5); border-radius: 20px; font-weight: 700; color: #fcd34d; font-size: 0.88rem;">
            ⚡ Giới hạn 35 suất học viên theo nguyên tắc First-Come, First-Served
          </span>
        </div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; margin-top: 0.75rem; font-size: 0.92rem; color: rgba(255, 255, 255, 0.9); line-height: 1.4;">
          <span style="display: inline-flex; align-items: center; gap: 5px;">🏛️ Cơ sở Apollo English Q.3</span>
          <span style="opacity: 0.35;">•</span>
          <span style="display: inline-flex; align-items: center; gap: 5px; color: var(--warm-yellow); font-weight: 600;">👨‍🏫 Giảng viên cơ hữu đồng hành thực chiến</span>
        </div>
      </div>

      <div class="hybrid-hubs-grid">
        <!-- Khu vực HCM -->
        <div class="hybrid-hub-item hcm-col" style="border-color: rgba(245, 158, 11, 0.6); background: rgba(245, 158, 11, 0.1);">
          <div style="display: inline-flex; align-items: center; gap: 6px; color: var(--warm-yellow); font-weight: 700; font-size: 1.05rem;">
            <span>📍</span> TP. Hồ Chí Minh (DHM10)
          </div>
          <div style="color: #ffffff; font-weight: 600; font-size: 0.95rem; margin-top: 2px;">Cơ sở Apollo English, Q.3</div>
          <div style="font-size: 0.8rem; color: #6ee7b7; font-weight: 700; margin-top: 4px;">🟢 Đang mở đăng ký (35 suất)</div>
        </div>

        <!-- Khu vực HN -->
        <div class="hybrid-hub-item">
          <div style="display: inline-flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.9); font-weight: 700; font-size: 1.05rem;">
            <span>📍</span> Hà Nội (Next DHM)
          </div>
          <div style="color: #ffffff; font-weight: 600; font-size: 0.95rem; margin-top: 2px;">Cơ sở SBB (Dự kiến DHM11)</div>
          <div style="font-size: 0.8rem; color: #fcd34d; font-weight: 700; margin-top: 4px;">🟡 Đăng ký nhận thông tin đợt tới</div>
        </div>
      </div>'''

    if old_hero_card in c:
        c = c.replace(old_hero_card, new_hero_card)
    else:
        c = c.replace(old_hero_card.replace('\n', '\r\n'), new_hero_card.replace('\n', '\r\n'))

    # 3. Bottom Register section
    old_sec_sub = 'Khóa học Delivering Happiness Masterclass 10 (DHM10) lần đầu tiên triển khai theo mô hình <strong>Hybrid đa điểm cầu</strong> kết nối song song tại Hà Nội (Cơ sở SBB) & TP.HCM (Cơ sở Apollo English). Hãy để lại thông tin quan tâm để nhận thông báo ngày học và giữ quyền ưu tiên tham dự!'
    new_sec_sub = 'Khóa <strong>Delivering Happiness Masterclass 10 (DHM10)</strong> được tổ chức Offline trọn vẹn tại <strong>TP.HCM</strong> vào <strong>Chủ Nhật 01/11/2026</strong> (Cơ sở Apollo English, 58 Phạm Ngọc Thạch, Q.3 • giới hạn 35 suất theo nguyên tắc First-Come, First-Served). Học viên tại Hà Nội vui lòng để lại thông tin tại <strong>Next DHM</strong> để nhận thông báo sớm nhất cho các khóa tiếp theo!'

    c = c.replace(old_sec_sub, new_sec_sub)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"Patched {filepath} successfully.")

if __name__ == '__main__':
    patch_index('index.html')
    patch_index('release_package/index.html')
