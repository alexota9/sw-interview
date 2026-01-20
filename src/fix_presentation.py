
original_file = 'src/Presentation.jsx'
clean_slides_file = 'src/clean_slides.txt'

with open(original_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open(clean_slides_file, 'r', encoding='utf-8') as f:
    clean_lines = f.readlines()

# Indices are 0-based in Python list
# Keep lines 0 to 644 (which is line 1 to 645 in 1-based editor)
# Lines[644] should be '};' or newline
head = lines[:645]

# Tail starts at line 1072 (1-based), so index 1071
# Verify content roughly
print(f"Index 1071 (Line 1072): {lines[1071]}")

tail = lines[1071:]

new_content = head + clean_lines + tail

with open(original_file, 'w', encoding='utf-8') as f:
    f.writelines(new_content)

print(f"Successfully patched {original_file}")
