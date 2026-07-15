import os
import hashlib
import json

base_dir = r"c:\Users\usuario\Documents\Aniversario"
img_dir = os.path.join(base_dir, "img")
dir_2 = os.path.join(base_dir, "2")
script_path = os.path.join(base_dir, "script.js")

def get_hash(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

seen_hashes = {}
duplicates = []
kept_files = []

# Process img dir first
for filename in os.listdir(img_dir):
    filepath = os.path.join(img_dir, filename)
    if os.path.isfile(filepath):
        h = get_hash(filepath)
        if h not in seen_hashes:
            seen_hashes[h] = filepath
            kept_files.append(f"img/{filename}")
        else:
            duplicates.append(filepath)

# Process 2 dir
for filename in os.listdir(dir_2):
    filepath = os.path.join(dir_2, filename)
    if os.path.isfile(filepath):
        h = get_hash(filepath)
        if h not in seen_hashes:
            seen_hashes[h] = filepath
            kept_files.append(f"2/{filename}")
        else:
            duplicates.append(filepath)

# Delete duplicates
for dup in duplicates:
    os.remove(dup)
    print(f"Deleted duplicate: {dup}")

# Update script.js
with open(script_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the array
import re
new_array_str = "const mediaFiles = " + json.dumps(kept_files, indent=2) + ";"
content = re.sub(r'const mediaFiles = \[.*?\];', new_array_str, content, flags=re.DOTALL)

with open(script_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Kept {len(kept_files)} unique files. Updated script.js.")
