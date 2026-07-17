import csv
import re
import os

TXT_FILE = "data/lac_quan_abcde_extracted_cases.txt"
CSV_FILE = "data/abcde_cases_library.csv"

def parse_txt(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by Tình huống
    case_blocks = re.split(r'###\s+Tình huống\s+\d+:', content)[1:]
    
    cases = []
    for idx, block in enumerate(case_blocks):
        # Extract title
        lines = block.strip().split('\n')
        title = lines[0].strip()
        
        # Helper regex to find fields
        env_match = re.search(r'\*\s+Môi trường:\s*(.*?)(?=\n\*|\Z)', block, re.DOTALL)
        a_match = re.search(r'\*\s+A\s*\(Nghịch cảnh\):\s*(.*?)(?=\n\*|\Z)', block, re.DOTALL)
        b_match = re.search(r'\*\s+B\s*\(Niềm tin tiêu cực\):\s*(.*?)(?=\n\*|\Z)', block, re.DOTALL)
        c_match = re.search(r'\*\s+C\s*\(Hậu quả\):\s*(.*?)(?=\n\*|\Z)', block, re.DOTALL)
        d_match = re.search(r'\*\s+D\s*\(Phản biện chi tiết\):\s*(.*?)(?=\n\*|\Z)', block, re.DOTALL)
        e_match = re.search(r'\*\s+E\s*\(Hành động & Kết quả mới\):\s*(.*?)(?=\n\*|\Z)', block, re.DOTALL)
        
        env = env_match.group(1).strip() if env_match else "Thực tế"
        a = a_match.group(1).strip() if a_match else ""
        b = b_match.group(1).strip() if b_match else ""
        c = c_match.group(1).strip() if c_match else ""
        d = d_match.group(1).strip() if d_match else ""
        e = e_match.group(1).strip() if e_match else ""
        
        # clean bullets from fields
        d = re.sub(r'^\s*-\s*', '', d, flags=re.MULTILINE)
        d = re.sub(r'^\s*\*\s*', '', d, flags=re.MULTILINE)
        
        cases.append({
            "Tier": "⭐⭐⭐⭐⭐",
            "Mã Case": f"CASE-{16 + idx}",
            "Tên tình huống": title,
            "Môi trường": env,
            "Nguồn": "Audio Lạc quan",
            "A — Adversity (Nghịch cảnh)": a,
            "B — Belief (Niềm tin tiêu cực)": b,
            "C — Consequence (Hậu quả)": c,
            "D — Disputation (Phản biện)": d,
            "E — Effect (Năng lượng mới & Hành động)": e,
            "Kỹ thuật D chính": "Evidence + Alternatives + De-catastrophize + Utility"
        })
    return cases

def append_to_csv(cases, csv_path):
    # Read existing columns
    file_exists = os.path.isfile(csv_path)
    
    with open(csv_path, 'a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            "Tier", "Mã Case", "Tên tình huống", "Môi trường", "Nguồn",
            "A — Adversity (Nghịch cảnh)", "B — Belief (Niềm tin tiêu cực)",
            "C — Consequence (Hậu quả)", "D — Disputation (Phản biện)",
            "E — Effect (Năng lượng mới & Hành động)", "Kỹ thuật D chính"
        ])
        
        for case in cases:
            writer.writerow(case)

def main():
    if not os.path.exists(TXT_FILE):
        print(f"Error: {TXT_FILE} not found.")
        return
        
    cases = parse_txt(TXT_FILE)
    print(f"Parsed {len(cases)} cases from transcript.")
    append_to_csv(cases, CSV_FILE)
    print(f"Appended cases to {CSV_FILE} successfully!")

if __name__ == '__main__':
    main()
