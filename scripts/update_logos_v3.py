#!/usr/bin/env python3
"""
Update tool logos in mock.ts to use external logo services.
The logos will be fetched by users' browsers when they visit the site.
"""

import re
import os

MOCK_FILE = "/Users/yinwen/WorkBuddy/2026-06-04-21-08-38/ai-design-hub/src/data/mock.ts"

def extract_domain(website_url):
    """Extract domain from URL."""
    if not website_url or website_url == "/images/tool-placeholder.png":
        return None
    # Remove protocol and path
    domain = re.sub(r'^https?://(www\.)?', '', website_url)
    domain = re.sub(r'/.*$', '', domain)
    return domain if domain else None

def update_mock_logos(file_path):
    """Update logo fields in mock.ts."""
    # Use absolute path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    abs_path = os.path.join(script_dir, file_path) if not os.path.isabs(file_path) else file_path
    
    with open(abs_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    updated = 0
    new_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if this line contains "logo: "/images/tool-placeholder.png""
        logo_match = re.match(r'^(\s*)logo:\s*"/images/tool-placeholder\.png",?\s*$', line)
        
        if logo_match:
            # Found a logo line - need to get the website_url for this tool
            # Look backwards for website_url
            website_url = ""
            for j in range(max(0, i - 20), i):
                url_match = re.search(r'website_url:\s*"([^"]+)"', lines[j])
                if url_match:
                    website_url = url_match.group(1)
                    break
            
            domain = extract_domain(website_url)
            
            if domain:
                # Use Clearbit Logo API
                new_logo_line = f'{logo_match.group(1)}logo: "https://logo.clearbit.com/{domain}?size=128",\n'
                new_lines.append(new_logo_line)
                updated += 1
                print(f"✅ Updated: {domain}")
                i += 1
                continue
        
        new_lines.append(line)
        i += 1
    
    # Write updated content
    backup_file = file_path + '.bak2'
    with open(backup_file, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f"\n📦 Backup saved to: {backup_file}")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"\n✅ Updated {updated} tool logos")
    print(f"📝 Updated file: {file_path}")
    print("\nNote: Logos will be fetched from Clearbit when users visit your site.")
    print("If Clearbit is blocked, browser will show alt text (tool name initial).")
    
    return updated

if __name__ == "__main__":
    print("🚀 Updating tool logos...")
    print(f"📖 Reading: {MOCK_FILE}\n")
    
    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    updated = update_mock_logos(MOCK_FILE)
    
    print(f"\n✅ Done! Updated {updated} tools.")
    print("\nNext steps:")
    print("1. Run: npm run build")
    print("2. Deploy to Netlify")
    print("3. Check if logos display correctly")
    print("4. If some logos are missing, manually update those tools in mock.ts")
