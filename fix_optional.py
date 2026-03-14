import os
import re

for filename in os.listdir('.'):
    if filename.endswith(".jsx"):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix chatEndRef.current?.scrollIntoView
        content = re.sub(r'chatEndRef\.current\?\.scrollIntoView', 'chatEndRef.current && chatEndRef.current.scrollIntoView', content)
        
        # Fix document.getElementById(id)?.scrollIntoView
        content = re.sub(r'document\.getElementById\(id\)\?\.scrollIntoView', 'document.getElementById(id) && document.getElementById(id).scrollIntoView', content)
        
        # Check any others
        content = re.sub(r'(\w+)\?\.(\w+)', r'\1 && \1.\2', content)

        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filename}")
