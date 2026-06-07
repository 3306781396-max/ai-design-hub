#!/usr/bin/env python3
"""
Update tool logos in mock.ts by downloading favicons from tool websites.
Uses multiple favicon sources with fallback.
"""

import re
import os
import sys
import json
from urllib.parse import urlparse

MOCK_FILE = "src/data/mock.ts"
OUTPUT_DIR = "public/images/tools"

def extract_domain(url):
    """Extract domain from URL."""
    if not url:
        return None
    try:
        parsed = urlparse(url)
        domain = parsed.netloc or url
        domain = re.sub(r'^www\.', '', domain)
        return domain
    except:
        return None

def generate_logo_url(website_url):
    """Generate logo URL using favicon services."""
    domain = extract_domain(website_url)
    if not domain:
        return "/images/tool-placeholder.png"
    
    # Use Google's favicon service (usually accessible)
    return f"https://www.google.com/s2/favicons?domain={domain}&sz=128"

def update_mock_logos(file_path):
    """Update logo fields in mock.ts."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all tool entries with their website_url
    # Pattern: match each tool object and extract id, website_url
    tool_pattern = r'\{\s*id:\s*"([^"]+)"[\s\S]*?website_url:\s*"([^"]*)"[\s\S]*?logo:\s*"[^"]*"'
    
    count = 0
    updated_content = content
    
    for match in re.finditer(tool_pattern, content):
        tool_id = match.group(1)
        website_url = match.group(2)
        
        logo_url = generate_logo_url(website_url)
        
        # Replace the logo line for this tool
        # Find the exact logo line within this tool's section
        tool_start = match.start()
        
        # Find the next tool or end of tools array
        next_tool = re.search(r'\n  \{', content[tool_start + 1:])
        if next_tool:
            tool_section = content[tool_start:tool_start + next_tool.start() + 1]
        else:
            # Last tool - find the closing bracket
            end_match = re.search(r'\n  \],', content[tool_start:])
            if end_match:
                tool_section = content[tool_start:tool_start + end_match.start()]
            else:
                continue
        
        # Replace logo in this tool section
        new_tool_section = re.sub(
            r'logo:\s*"[^"]*"',
            f'logo: "{logo_url}"',
            tool_section,
            count=1
        )
        
        if new_tool_section != tool_section:
            updated_content = updated_content.replace(tool_section, new_tool_section, 1)
            count += 1
            domain = extract_domain(website_url)
            print(f"✅ {tool_id}: {domain} -> {logo_url[:60]}...")
    
    # Write updated content
    backup_file = file_path + '.bak2'
    with open(backup_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"\n📦 Backup saved to: {backup_file}")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print(f"\n✅ Updated {count} tool logos")
    print(f"📝 Updated file: {file_path}")
    
    return count

if __name__ == "__main__":
    print("🚀 Updating tool logos...")
    print(f"📖 Reading: {MOCK_FILE}")
    
    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    count = update_mock_logos(MOCK_FILE)
    
    print(f"\n✅ Done! Updated {count} tools.")
    print("\nNext steps:")
    print("1. Run: npm run build")
    print("2. Check the logos display correctly")
    print("3. If some logos are missing, manually update those tools")
