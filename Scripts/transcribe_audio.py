import os
import requests
import json
import time

AUDIO_FILE = r"C:\Users\vu.hoang\.gemini\antigravity\scratch\dh4hn-website_backup_conflict\backup_13042026\data\artifacts\lac_quan_abcde.mp3"
OUTPUT_FILE = "data/lac_quan_abcde_extracted_cases.txt"

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

def main():
    api_key = load_gemini_api_key()
    if not api_key:
        print("Error: GEMINI_API_KEY not found.")
        return

    print("Gemini API Key loaded.")
    print(f"Uploading file: {AUDIO_FILE}...")

    # 1. Start resumable upload session
    url = f"https://generativelanguage.googleapis.com/upload/v1beta/files?key={api_key}"
    headers = {
        "X-Goog-Upload-Protocol": "resumable",
        "X-Goog-Upload-Command": "start",
        "X-Goog-Upload-Header-Content-Length": str(os.path.getsize(AUDIO_FILE)),
        "X-Goog-Upload-Header-Content-Type": "audio/mp3",
        "Content-Type": "application/json"
    }
    metadata = {
        "file": {
            "displayName": "lac_quan_abcde"
        }
    }
    
    r = requests.post(url, headers=headers, json=metadata)
    if r.status_code != 200:
        print(f"Failed to start upload session: {r.text}")
        return
        
    upload_url = r.headers.get("X-Goog-Upload-URL")
    print(f"Upload session started. URL: {upload_url}")

    # 2. Upload the file
    headers = {
        "X-Goog-Upload-Offset": "0",
        "X-Goog-Upload-Command": "upload, finalize",
        "Content-Length": str(os.path.getsize(AUDIO_FILE))
    }
    
    with open(AUDIO_FILE, 'rb') as f:
        r = requests.post(upload_url, headers=headers, data=f)
        
    if r.status_code != 200:
        print(f"Failed to upload file content: {r.text}")
        return
        
    file_info = r.json()
    file_uri = file_info["file"]["uri"]
    file_name = file_info["file"]["name"]
    print(f"Upload complete. File URI: {file_uri}, Name: {file_name}")

    # 3. Wait for the file to be processed (ACTIVE)
    status_url = f"https://generativelanguage.googleapis.com/v1beta/{file_name}?key={api_key}"
    print("Waiting for file processing to complete on Google backend...")
    while True:
        res = requests.get(status_url)
        state = res.json().get("state")
        print(f"Current file state: {state}")
        if state == "ACTIVE":
            break
        elif state == "FAILED":
            print("File processing failed on Google servers.")
            return
        time.sleep(10)

    # 4. Generate content (Transcribe)
    print("Transcribing audio using Gemini...")
    gen_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={api_key}"
    data = {
        "contents": [{
            "parts": [
                {"file_data": {"mime_type": "audio/mp3", "file_uri": file_uri}},
                {"text": "Hãy lắng nghe file âm thanh và trích xuất tất cả các tình huống thực tế, câu chuyện, hoặc ví dụ áp dụng mô hình ABCDE (Nghịch cảnh - Niềm tin - Hậu quả - Phản biện - Năng lượng mới). Với mỗi tình huống tìm thấy, hãy viết lại chi tiết theo cấu trúc: Tên tình huống, Môi trường (Công sở, Gia đình, Quan hệ...), A (Nghịch cảnh), B (Niềm tin tiêu cực), C (Hậu quả), D (Phản biện chi tiết gồm Bằng chứng/Cách giải thích khác/Giảm thảm họa/Lợi ích), E (Hành động & Kết quả mới). Hãy viết bằng tiếng Việt tự nhiên, gãy gọn, bỏ các thông tin thừa liên quan đến tên người thật hoặc khóa học cụ thể."}
            ]
        }]
    }
    
    r = requests.post(gen_url, json=data)
    if r.status_code != 200:
        print(f"Transcription failed: {r.text}")
        return
        
    result = r.json()
    try:
        transcript = result["candidates"][0]["content"]["parts"][0]["text"]
        
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as out_f:
            out_f.write(transcript)
        print(f"Transcription saved to {OUTPUT_FILE}!")
    except (KeyError, IndexError) as e:
        print(f"Failed to parse response: {e}")
        print(json.dumps(result, indent=2))

    # 5. Clean up File API
    print("Deleting uploaded file from Google servers...")
    requests.delete(f"https://generativelanguage.googleapis.com/v1beta/{file_name}?key={api_key}")
    print("Cleanup done.")

if __name__ == '__main__':
    main()
