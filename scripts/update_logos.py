#!/usr/bin/env python3
"""
Update tool logos in mock.ts using Clearbit Logo API.
Generates logo URLs based on tool website URLs.
"""

import re
import json
import os

# Path to mock.ts
MOCK_FILE = "src/data/mock.ts"

def extract_tools_from_mock(file_path):
    """Extract tool data from mock.ts file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    tools = []
    # Find all tool objects
    pattern = r'\{\s*id:\s*"([^"]+)"\s*,\s*slug:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"'
    
    for match in re.finditer(pattern, content):
        tool_id = match.group(1)
        slug = match.group(2)
        name = match.group(3)
        
        # Find website_url for this tool
        # Look for website_url after this tool's id
        tool_section = content[match.end():]
        url_match = re.search(r'website_url:\s*"([^"]+)"', tool_section)
        website_url = url_match.group(1) if url_match else ""
        
        tools.append({
            'id': tool_id,
            'slug': slug,
            'name': name,
            'website_url': website_url
        })
    
    return tools, content

def generate_logo_url(website_url):
    """Generate logo URL using Clearbit Logo API."""
    if not website_url:
        return "/images/tool-placeholder.png"
    
    # Extract domain from URL
    domain = re.sub(r'^https?://(www\.)?', '', website_url)
    domain = re.sub(r'/.*$', '', domain)
    
    if not domain:
        return "/images/tool-placeholder.png"
    
    # Use Clearbit Logo API
    return f"https://logo.clearbit.com/{domain}?size=128"

def update_mock_file(file_path, tools):
    """Update mock.ts with real logo URLs."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    updated = 0
    for tool in tools:
        logo_url = generate_logo_url(tool['website_url'])
        
        # Find and replace the logo line for this tool
        # Pattern: logo: "..." after the tool's id
        pattern = rf'({{[^}}]*id:\s*"{tool["id"]}"[^}}]*logo:\s*")[^"]*(")'
        
        # Simpler approach: find the tool section and replace logo
        tool_pattern = rf'({{[^}}]*id:\s*"{tool["id"]}"[^}}]*?)logo:\s*"[^"]*"?'
        
        match = re.search(tool_pattern, content, re.DOTALL)
        if match:
            old_logo = re.search(r'logo:\s*"[^"]*"', match.group(0))
            if old_logo:
                old_text = old_logo.group(0)
                new_text = f'logo: "{logo_url}"'
                content = content.replace(old_text, new_text, 1)
                updated += 1
                print(f"✅ {tool['name']}: {logo_url[:60]}...")
    
    # Write updated content
    with open(file_path + '.updated', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ Updated {updated} tools")
    print(f"📝 Output: {file_path}.updated")
    
    return content

if __name__ == "__main__":
    print("🚀 Starting logo update process...")
    
    # Change to script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Extract tools
    print("\n📖 Reading mock.ts...")
    tools, _ = extract_tools_from_mock(MOCK_FILE)
    print(f" Found {len(tools)} tools")
    
    # Update logos
    print("\n🔄 Updating logos...")
    update_mock_file(MOCK_FILE, tools)
    
    print("\n✅ Done! Review the updated file and replace mock.ts if satisfied.")
