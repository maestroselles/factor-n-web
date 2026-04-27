async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
            // Execute any scripts in the loaded HTML
            const scripts = element.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });
        }
    } catch (error) {
        console.error(`Error loading ${componentPath}:`, error);
    }
}

// Automatically load components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('header-container')) {
        loadComponent('header-container', 'components/header.html');
    }
    if (document.getElementById('footer-container')) {
        loadComponent('footer-container', 'components/footer.html');
    }
});
