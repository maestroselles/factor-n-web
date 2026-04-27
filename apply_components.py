import os
import re
import glob

def process_html_files():
    files = glob.glob('*.html')
    for file in files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Replace Header
        # Matches <header ...> ... </header>
        content = re.sub(r'<header class="fixed top-0 w-full z-50 glass-panel">.*?</header>', '<div id="header-container"></div>', content, flags=re.DOTALL)

        # Replace Footer
        # Matches <footer ...> ... </footer>
        content = re.sub(r'<footer[^>]*>.*?</footer>', '<div id="footer-container"></div>', content, flags=re.DOTALL)

        # Remove mobile menu script
        # The script is usually at the bottom, looking for 'button i.fa-bars'
        content = re.sub(r'<script>\s*const btn = document\.querySelector\(\'button i\.fa-bars\'\).*?</script>', '', content, flags=re.DOTALL)

        # Remove duplicate mobile menu script if it was duplicated (some pages had 'slider and mobile-menu-script' combined)
        # We need to be careful with index.html as it has slider logic in the same script block.
        if file == 'index.html':
            # In index.html, we just replace the mobile menu part inside the script
            content = re.sub(r'// Mobile Menu.*?btn\.onclick = \(\) => \{.*?\n\s*\}\n\s*\}', '', content, flags=re.DOTALL)
        else:
            # Check if there is a remaining mobile menu script block
            content = re.sub(r'<!-- mobile-menu-script -->\s*<script>\s*const btn = document\.querySelector\(\'button i\.fa-bars\'\).*?</script>', '', content, flags=re.DOTALL)

        # Inject loadComponents.js before </body>
        if '<script src="js/loadComponents.js"></script>' not in content:
            content = content.replace('</body>', '    <script src="js/loadComponents.js"></script>\n</body>')

        if content != original_content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Processed: {file}")
        else:
            print(f"No changes needed: {file}")

if __name__ == '__main__':
    process_html_files()
