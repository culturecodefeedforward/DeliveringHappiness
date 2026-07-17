import os
import json
import urllib.request
import urllib.error

# Tri thức chuẩn về mô hình ABCDE Socratic và các case study của sếp Vũ
KNOWLEDGE_CHUNKS = [
    {
        "source_id": "seligman_theory_01",
        "title": "Bằng chứng thực tế (Evidence)",
        "source_type": "book",
        "lesson": "General",
        "abcde_step": "D",
        "chunk_id": 1,
        "citation": "Martin Seligman, Learned Optimism (Trang 145)",
        "text": "Cách phản biện đầu tiên là tìm kiếm bằng chứng thực tế (Evidence). Hãy tự hỏi bản thân: Đâu là bằng chứng chứng minh niềm tin tiêu cực này là đúng? Đâu là bằng chứng chống lại nó? Thông thường, suy nghĩ tiêu cực tự động là sự phóng đại cảm tính và không có đầy đủ bằng chứng khách quan hỗ trợ. Ví dụ, nếu bạn nghĩ 'tôi bất tài', hãy liệt kê những việc cụ thể bạn đã làm tốt trong quá khứ để chứng minh suy nghĩ đó là sai lệch."
    },
    {
        "source_id": "seligman_theory_02",
        "title": "Cách giải thích thay thế (Alternatives)",
        "source_type": "book",
        "lesson": "General",
        "abcde_step": "D",
        "chunk_id": 2,
        "citation": "Martin Seligman, Learned Optimism (Trang 146)",
        "text": "Cách phản biện thứ hai là tìm kiếm các cách giải thích thay thế (Alternatives). Hầu hết các sự kiện xảy ra đều do nhiều nguyên nhân cấu thành, chứ không phải chỉ do một nguyên nhân duy nhất từ bản thân bạn. Hãy tự hỏi: Có những cách giải thích nào khác khách quan hơn cho sự việc này không? Thay vì nghĩ sếp ghét bạn nên mới giao việc gấp, hãy nghĩ rằng có thể sếp đang chịu áp lực lớn từ cấp trên nên mới cần báo cáo gấp."
    },
    {
        "source_id": "seligman_theory_03",
        "title": "Hệ quả nhận thức (Implications - Decatastrophizing)",
        "source_type": "book",
        "lesson": "General",
        "abcde_step": "D",
        "chunk_id": 3,
        "citation": "Martin Seligman, Learned Optimism (Trang 147)",
        "text": "Cách phản biện thứ ba là đánh giá hệ quả thực tế hay còn gọi là giải phóng sự phóng đại tiêu cực (Implications/Decatastrophizing). Hãy tự hỏi: Ngay cả khi niềm tin tiêu cực của tôi là đúng một phần, thì điều tồi tệ nhất có thể xảy ra là gì? Hệ quả của nó có thực sự là thảm họa hay không? Chúng ta thường có xu hướng biến một rắc rối nhỏ thành thảm họa lớn. Hãy nhìn nhận đúng quy mô thực tế của vấn đề."
    },
    {
        "source_id": "seligman_theory_04",
        "title": "Lợi ích của suy nghĩ (Utility)",
        "source_type": "book",
        "lesson": "General",
        "abcde_step": "D",
        "chunk_id": 4,
        "citation": "Martin Seligman, Learned Optimism (Trang 148)",
        "text": "Cách phản biện thứ tư là đánh giá lợi ích của suy nghĩ (Utility). Hãy hỏi bản thân: Việc tôi tiếp tục ôm giữ suy nghĩ tiêu cực này có mang lại lợi ích gì cho tôi lúc này không? Nó có giúp tôi giải quyết được vấn đề hay chỉ làm tôi thêm bế tắc và mệt mỏi? Đôi khi, việc một suy nghĩ có đúng hay không không quan trọng bằng việc nó có ích cho bạn ở thời điểm hiện tại để duy trì năng lượng hành động."
    },
    {
        "source_id": "vu_case_01",
        "title": "Deadline chiều thứ Sáu",
        "source_type": "slide",
        "lesson": "DHM8",
        "abcde_step": "D",
        "chunk_id": 5,
        "citation": "Kịch bản giảng dạy DH8 - Vũ (Tình huống 1)",
        "text": "Tình huống: Sếp đột ngột giao một báo cáo khẩn cấp và yêu cầu hoàn thành trước 5h chiều ngày thứ Sáu. Bạn đã lên kế hoạch đi xem phim cùng người yêu từ trước.\nNiềm tin tiêu cực thường gặp: 'Sếp đang ép mình, sếp thiếu tôn trọng thời gian cá nhân của mình, mọi kế hoạch cuối tuần đều tan vỡ'.\nCách phản biện D: Hãy tự hỏi sếp có thực sự trù dập mình không hay sếp cũng đang chịu áp lực báo cáo từ cấp trên? Việc hoàn thành báo cáo này mất khoảng bao nhiêu lâu? Có thể tập trung làm nhanh trong 2 tiếng rồi đi xem phim muộn hơn không?"
    },
    {
        "source_id": "vu_case_02",
        "title": "Kẻ kéo tụt KPI",
        "source_type": "slide",
        "lesson": "DHM8",
        "abcde_step": "D",
        "chunk_id": 6,
        "citation": "Kịch bản giảng dạy DH8 - Vũ (Tình huống 2)",
        "text": "Tình huống: Bạn làm việc trong một nhóm 4 người. Có một thành viên liên tục làm việc hời hợt, giao trễ deadline, khiến cả nhóm bị đánh giá thấp trong tháng.\nNiềm tin tiêu cực thường gặp: 'Cậu ta vô trách nhiệm, cố tình phá hoại nhóm, không thể thay đổi được'.\nCách phản biện D: Có thực sự cậu ta vô trách nhiệm ở mọi việc không hay đang gặp khó khăn cá nhân hoặc chưa hiểu rõ nhiệm vụ? Ôm giữ sự tức giận có giúp dự án tốt lên không? Hướng giải quyết là ngồi lại nói chuyện thẳng thắn và hỗ trợ chia nhỏ đầu việc."
    },
    {
        "source_id": "vu_case_03",
        "title": "Ý tưởng bị dội gáo nước lạnh",
        "source_type": "slide",
        "lesson": "DHM8",
        "abcde_step": "D",
        "chunk_id": 7,
        "citation": "Kịch bản giảng dạy DH8 - Vũ (Tình huống 3)",
        "text": "Tình huống: Bạn dành 3 đêm để chuẩn bị một ý tưởng tâm huyết. Trong cuộc họp toàn công ty, sếp và các phòng ban khác bác bỏ ý tưởng của bạn chỉ sau 5 phút trình bày.\nNiềm tin tiêu cực thường gặp: 'Mình bất tài, ý kiến của mình không có giá trị, công ty này không biết trân trọng nhân tài'.\nCách phản biện D: Việc ý tưởng bị bác bỏ có đồng nghĩa với việc mình bất tài không? Có thể ý tưởng chưa phù hợp với ngân sách hoặc định hướng hiện tại của công ty không? Hãy tập trung rút kinh nghiệm từ các góp ý khách quan thay vì tự trách bản thân."
    },
    {
        "source_id": "vu_case_04",
        "title": "Chuyển đổi cơ cấu",
        "source_type": "slide",
        "lesson": "DHM8",
        "abcde_step": "D",
        "chunk_id": 8,
        "citation": "Kịch bản giảng dạy DH8 - Vũ (Tình huống 4)",
        "text": "Tình huống: Công ty thực hiện tái cấu trúc, bạn bị chuyển sang một team mới với công việc không hoàn toàn đúng chuyên môn, và phải làm việc dưới quyền một người trẻ hơn bạn 5 tuổi.\nNiềm tin tiêu cực thường gặp: 'Mình đang bị đào thải, làm việc dưới quyền người trẻ thật mất mặt, mình không thể học hỏi được gì ở đây'.\nCách phản biện D: Người quản lý trẻ tuổi chắc chắn có điểm mạnh về công nghệ hoặc tư duy mới để mình học hỏi. Việc chuyển sang team mới cũng là cơ hội để mở rộng kỹ năng đa nhiệm thay vì dậm chân tại chỗ."
    },
    {
        "source_id": "vu_case_05",
        "title": "Con điểm kém liên tục",
        "source_type": "slide",
        "lesson": "DHM8",
        "abcde_step": "D",
        "chunk_id": 9,
        "citation": "Kịch bản giảng dạy DH8 - Vũ (Tình huống 5)",
        "text": "Tình huống: Bạn đã thuê gia sư, tốn nhiều tiền bạc và thời gian nhắc nhở, nhưng bài kiểm tra toán của con bạn tháng này lại tiếp tục dưới điểm trung bình.\nNiềm tin tiêu cực thường gặp: 'Con mình dốt nát, không thể dạy dỗ được, mọi nỗ lực của mình đều vô ích'.\nCách phản biện D: Bài kiểm tra kém lần này có đồng nghĩa với việc con dốt nát không? Phương pháp học hiện tại của gia sư đã phù hợp với con chưa? Cơn giận dữ và la mắng có giúp con học tốt hơn hay chỉ làm con sợ hãi và ghét môn Toán?"
    },
    {
        "source_id": "vu_case_06",
        "title": "Phút chót hủy kèo",
        "source_type": "slide",
        "lesson": "DHM8",
        "abcde_step": "D",
        "chunk_id": 10,
        "citation": "Kịch bản giảng dạy DH8 - Vũ (Tình huống 6)",
        "text": "Tình huống: Bạn đã lên kế hoạch đi du lịch Đà Lạt cùng gia đình từ 2 tháng trước. Vé đã mua, khách sạn đã đặt. Sáng ngày khởi hành, đứa con nhỏ bị sốt cao, chuyến đi phải hủy toàn bộ.\nNiềm tin tiêu cực thường gặp: 'Số mình quá đen đủi, mọi thứ luôn bị hủy hoại vào phút chót, cả kỳ nghỉ cuối tuần của gia đình đã bị phá hỏng hoàn toàn'.\nCách phản biện D: Con ốm là sự kiện bất khả kháng, không ai mong muốn. Việc hủy chuyến đi có nghĩa là gia đình sẽ có thời gian quây quần chăm sóc con ở nhà. Chúng ta có thể dời chuyến đi sang dịp khác khi con khỏe mạnh."
    },
    {
        "source_id": "vu_case_07",
        "title": "Anh/Em dạo này khác quá!",
        "source_type": "slide",
        "lesson": "DHM8",
        "abcde_step": "D",
        "chunk_id": 11,
        "citation": "Kịch bản giảng dạy DH8 - Vũ (Tình huống 7)",
        "text": "Tình huống: Vợ (hoặc chồng) phàn nàn và giận dỗi vì dạo này bạn quá bận rộn với công việc, không có thời gian cho gia đình, cho rằng bạn đã hết yêu thương họ.\nNiềm tin tiêu cực thường gặp: 'Cô ấy/Anh ấy không hiểu cho áp lực công việc của mình, ích kỷ chỉ nghĩ đến bản thân, cuộc hôn nhân này quá mệt mỏi'.\nCách phản biện D: Lời phàn nàn thực chất xuất phát từ việc họ đang nhớ bạn và muốn dành thời gian bên bạn. Thay vì phản ứng phòng thủ giận dữ, hãy thấu hiểu nhu cầu kết nối của đối phương và sắp xếp một khoảng thời gian chất lượng ngắn trong tuần cho gia đình."
    }
]

def load_gemini_api_key():
    # Thử đọc trực tiếp từ đường dẫn tuyệt đối của file .env chung
    shared_env = r"C:\Users\vu.hoang\.gemini\antigravity\scratch\.env"
    try:
        with open(shared_env, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    return line.strip().split('=', 1)[1].strip('"\'')
    except IOError:
        pass
        
    # Thử đọc từ .env.production.local
    try:
        with open('.env.production.local', 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    return line.strip().split('=', 1)[1].strip('"\'')
    except IOError:
        pass
        
    # Thử đọc từ .env.local
    try:
        with open('.env.local', 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    return line.strip().split('=', 1)[1].strip('"\'')
    except IOError:
        pass

    # Thử đọc từ environment variable
    key = os.environ.get('GEMINI_API_KEY')
    if key:
        return key
        
    return None

def get_embedding(text, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key={api_key}"
    data = {
        "model": "models/gemini-embedding-001",
        "content": {
            "parts": [{"text": text}]
        }
    }
    req_body = json.dumps(data).encode('utf-8')
    
    req = urllib.request.Request(
        url,
        data=req_body,
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read()
            res_json = json.loads(res_body.decode('utf-8'))
            return res_json['embedding']['values']
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
        print(e.read().decode('utf-8'))
        raise
    except Exception as e:
        print(f"Error calling embedding API: {e}")
        raise

def main():
    api_key = load_gemini_api_key()
    if not api_key:
        print("Error: GEMINI_API_KEY not found in env files.")
        return

    print("Gemini API Key loaded successfully.")
    
    output_dir = 'data/artifacts'
    os.makedirs(output_dir, exist_ok=True)
    
    output_chunks = []
    
    print(f"Generating embeddings for {len(KNOWLEDGE_CHUNKS)} knowledge chunks...")
    for chunk in KNOWLEDGE_CHUNKS:
        print(f"Processing chunk {chunk['chunk_id']}...")
        vector = get_embedding(chunk['text'], api_key)
        
        output_chunks.append({
            "id": chunk['source_id'],
            "vector": vector,
            "metadata": chunk
        })
        
    output_file = os.path.join(output_dir, 'knowledge_base_abcde.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_chunks, f, ensure_ascii=False, indent=2)
        
    print(f"Knowledge base generated successfully and saved to {output_file}!")

if __name__ == '__main__':
    main()
