import re

files_to_extract = {
    'index_recovered.jsx': 'index.jsx',
    'exp_recovered.html': 'exp.jsx',
    'privacy_recovered.html': 'privacy.jsx',
    'toc_recovered.html': 'toc.jsx',
    '404_recovered.html': '404.jsx'
}

for src, dst in files_to_extract.items():
    try:
        with open(src, 'r', encoding='utf-8') as f:
            html_content = f.read()

        match = re.search(r'<script type="text/babel">(.*?)</script>', html_content, re.DOTALL)
        if match:
            jsx_content = match.group(1).strip()
            # In the original HTML, the babel scripts were rendered with "use strict"!
            # Also, fix the `config?.active` syntax issue on the fly!
            jsx_content = re.sub(r'config\?\.active(?:\s*&&\s*config\?\.text)?', 'config && config.active && config.text', jsx_content)
            jsx_content = re.sub(r'config\?\.text', 'config && config.text', jsx_content)

            with open(dst, 'w', encoding='utf-8') as f:
                f.write(jsx_content)
            print(f"Extracted and saved: {dst}")
        else:
            print(f"No babel script found in {src}")
    except Exception as e:
        print(f"Failed to process {src}: {e}")
