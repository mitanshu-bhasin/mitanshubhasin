import os
import re

directory = '.'
for filename in os.listdir(directory):
    if filename.endswith(".jsx"):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix config?.active
        content = re.sub(r'config\?\.active(?:\s*&&\s*config\?\.text)?', 'config && config.active && config.text', content)
        content = re.sub(r'config\?\.text', 'config && config.text', content)

        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed syntax in {filename}")
