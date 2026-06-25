#!/usr/bin/env python3
import glob
import re

# Use placeholders for multi-word replacements to prevent repeated matching inside new strings.
placeholder_map = {
    '__ENG_FULL_BRAND__': 'Silvora Talenza World',
    '__AR_FULL_BRAND__': 'سيلفورا تالينزا وورلد للستشارات ش.ذ.م.م',
}

patterns = [
    # English brand phrase replacements
    (re.compile(r'TALENZA HR WORLD'), '__ENG_FULL_BRAND__'),
    (re.compile(r'TALENZA HR World'), '__ENG_FULL_BRAND__'),
    (re.compile(r'Talenza HR World'), '__ENG_FULL_BRAND__'),
    # Arabic full brand phrase replacement first
    (re.compile(r'تالينزا HR وورلد'), '__AR_FULL_BRAND__'),
]

# Standalone brand names
patterns += [
    (re.compile(r'\bTALENZA\b'), 'Silvora Talenza World'),
    (re.compile(r'\bTalenza\b'), 'Silvora Talenza World'),
    (re.compile(r'(?<!\w)تالينزا(?!\w)'), 'سيلفورا تالينزا وورلد'),
]

# Exact title replacement if still present
patterns.append((re.compile(r'<title>Thank You - Talenza HR World</title>'), '<title>Thank You - Silvora Talenza World</title>'))

files = glob.glob('*.html') + glob.glob('*.php')
updated_files = []
for filename in files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for pattern, replacement in patterns:
        content = pattern.sub(replacement, content)
    for placeholder, actual in placeholder_map.items():
        content = content.replace(placeholder, actual)
    if content != original:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        updated_files.append(filename)
        print('Updated', filename)
print('Files updated:', len(updated_files))
