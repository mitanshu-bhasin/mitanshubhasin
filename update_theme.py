import os
import re

# Directory to scan
DIRECTORY = r"C:\Users\mitan\Videos\MITANSHU"

# HTML Replacements
html_replacements = {
    # Backgrounds
    r"background-color:\s*#050505;": "background-color: #0f172a;",
    r"background-color:\s*#0a0a0a;": "background-color: #1e293b;",
    
    # Text
    r"color:\s*#00ff41;": "color: #f8fafc;",
    r"text-shadow:\s*0\s*0\s*10px\s*#00ff41;": "text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);",
    
    # Border & Box-Shadow for Glass Panels, scrollbars etc.
    r"border:\s*1px\s*solid\s*rgba\(0,\s*255,\s*65,\s*0\.3\);": "border: 1px solid rgba(59, 130, 246, 0.3);",
    r"box-shadow:\s*0\s*0\s*15px\s*rgba\(0,\s*255,\s*65,\s*0\.1\);": "box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);",
    r"border:\s*1px\s*solid\s*#003300;": "border: 1px solid #1e293b;",

    # Matrix Rain hex
    r"'#00ff41'": "'#06b6d4'",

    # Progress bar and cursor hex colors
    r"background:\s*#00ff41;": "background: #3b82f6;",
    r"box-shadow:\s*0\s*0\s*10px\s*#00ff41;": "box-shadow: 0 0 10px #3b82f6;",
    r"background-color:\s*#22c55e;": "background-color: #3b82f6;",
    r"box-shadow:\s*0\s*0\s*10px\s*#22c55e;": "box-shadow: 0 0 10px #3b82f6;",
    r"border-color:\s*rgba\(34,\s*197,\s*94,\s*0\.5\);": "border-color: rgba(59, 130, 246, 0.5);",
    r"box-shadow:\s*0\s*0\s*15px\s*rgba\(34,\s*197,\s*94,\s*0\.2\);": "box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);",
    r"background-color:\s*rgba\(34,\s*197,\s*94,\s*0\.1\);": "background-color: rgba(59, 130, 246, 0.1);"

}

# JSX/Tailwind Replacements
jsx_replacements = {
    # Texts
    r"text-green-300": "text-cyan-300",
    r"text-green-400": "text-blue-400",
    r"text-green-500": "text-blue-500",
    r"text-green-600": "text-blue-600",
    r"text-green-800": "text-slate-400",
    r"text-green-900": "text-slate-500",
    r"text-gray-400": "text-slate-400",
    
    # Backgrounds
    r"bg-green-400": "bg-blue-400",
    r"bg-green-500": "bg-blue-500",
    r"bg-green-600": "bg-blue-600",
    r"bg-green-800": "bg-slate-800",
    r"bg-green-900": "bg-slate-900",
    r"bg-black": "bg-[#0f172a]",
    r"bg-gray-900": "bg-slate-900",
    r"bg-gray-800": "bg-slate-800",

    # Borders & Rings
    r"border-green-400": "border-blue-400",
    r"border-green-500": "border-blue-500",
    r"border-green-800": "border-slate-700",
    r"border-green-900": "border-slate-800",
    r"ring-green-400": "ring-blue-400",
    r"ring-green-500": "ring-blue-500",
    r"ring-green-600": "ring-blue-600",
    
    # Shadows
    r"shadow-\[0_0_10px_#00ff41\]": "shadow-[0_0_10px_#3b82f6]",
    r"shadow-\[0_0_20px_rgba\(0,255,65,0\.15\)\]": "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
    r"shadow-\[0_0_20px_rgba\(0,255,65,0\.2\)\]": "shadow-[0_0_20px_rgba(59,130,246,0.2)]",
    r"shadow-\[0_0_20px_rgba\(0,255,65,0\.3\)\]": "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    r"shadow-\[0_0_40px_rgba\(0,255,65,0\.4\)\]": "shadow-[0_0_40px_rgba(59,130,246,0.4)]",
    r"shadow-\[0_0_40px_rgba\(0,255,65,0\.6\)\]": "shadow-[0_0_40px_rgba(59,130,246,0.6)]"

}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    if filepath.endswith('.html'):
        for pattern, replacement in html_replacements.items():
            content = re.sub(pattern, replacement, content)
            
    if filepath.endswith('.jsx'):
        for pattern, replacement in jsx_replacements.items():
             content = re.sub(pattern, replacement, content)
        
        # also apply html replacements to JSX since it has <style> tags and inline styles occasionally
        for pattern, replacement in html_replacements.items():
            content = re.sub(pattern, replacement, content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

def main():
    for filename in os.listdir(DIRECTORY):
        if filename.endswith(".html") or filename.endswith(".jsx"):
            filepath = os.path.join(DIRECTORY, filename)
            process_file(filepath)

if __name__ == "__main__":
    main()
