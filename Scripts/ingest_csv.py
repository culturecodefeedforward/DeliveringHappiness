import os
import json
import urllib.request
import urllib.error
import csv

# We will read from the new CSV file
CSV_FILE = 'data/abcde_cases_library.csv'

# Thử load API key như script cũ
def load_gemini_api_key():
    shared_env = r"C:\Users\vu.hoang\.gemini\antigravity\scratch\.env"
    try:
        with open(shared_env, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    return line.strip().split('=', 1)[1].strip('"\'')
    except IOError:
        pass
        
    try:
        with open('.env.production.local', 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    return line.strip().split('=', 1)[1].strip('"\'')
    except IOError:
        pass
        
    try:
        with open('.env.local', 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('GEMINI_API_KEY='):
                    return line.strip().split('=', 1)[1].strip('"\'')
    except IOError:
        pass

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

def parse_csv_to_chunks(csv_path):
    chunks = []
    
    # Giữ lại lý thuyết từ script cũ (1-4)
    chunks.extend([
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
        }
    ])
    
    chunk_counter = 5
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            case_id = row['Mã Case']
            title = row['Tên tình huống']
            source = row['Nguồn']
            
            # Xây dựng text theo format ABCDE
            text = f"Tình huống: {row['Tên tình huống']}\n"
            text += f"A (Adversity - Nghịch cảnh): {row['A — Adversity (Nghịch cảnh)']}\n"
            text += f"B (Belief - Niềm tin tiêu cực): {row['B — Belief (Niềm tin tiêu cực)']}\n"
            text += f"C (Consequence - Hậu quả): {row['C — Consequence (Hậu quả)']}\n"
            text += f"D (Disputation - Phản biện): {row['D — Disputation (Phản biện)']}\n"
            text += f"E (Effect - Kết quả/Năng lượng mới): {row['E — Effect (Năng lượng mới & Hành động)']}"
            
            chunks.append({
                "source_id": case_id,
                "title": title,
                "source_type": "case_study",
                "lesson": "Library",
                "abcde_step": "A,B,C,D,E",
                "chunk_id": chunk_counter,
                "citation": source,
                "text": text,
                "tier": row['Tier']
            })
            chunk_counter += 1
            
    return chunks

def main():
    api_key = load_gemini_api_key()
    if not api_key:
        print("Error: GEMINI_API_KEY not found in env files.")
        return

    print("Gemini API Key loaded successfully.")
    
    chunks = parse_csv_to_chunks(CSV_FILE)
    print(f"Parsed {len(chunks)} chunks from theory and CSV.")
    
    output_dir = 'data/artifacts'
    os.makedirs(output_dir, exist_ok=True)
    
    output_chunks = []
    
    print(f"Generating embeddings for {len(chunks)} knowledge chunks...")
    for chunk in chunks:
        print(f"Processing chunk {chunk['chunk_id']} ({chunk['title']})...")
        try:
            vector = get_embedding(chunk['text'], api_key)
            output_chunks.append({
                "id": chunk['source_id'],
                "vector": vector,
                "metadata": chunk
            })
        except Exception as e:
            print(f"Skipping chunk {chunk['chunk_id']} due to error: {e}")
            
    output_file = os.path.join(output_dir, 'knowledge_base_abcde.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_chunks, f, ensure_ascii=False, indent=2)
        
    print(f"Knowledge base generated successfully with {len(output_chunks)} items and saved to {output_file}!")

if __name__ == '__main__':
    main()
