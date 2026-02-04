// Minimal dark mode functionality - localStorage persistence + system preference detection

const themeToggle = document.getElementById('theme-toggle');

function applyTheme(isDark) {
    const html = document.documentElement;
    themeToggle.checked = isDark;
    if (isDark) {
        html.style.setProperty('--bg-primary', '#1a1a1a');
        html.style.setProperty('--bg-secondary', '#2d2d2d');
        html.style.setProperty('--bg-tertiary', '#3d3d3d');
        html.style.setProperty('--text-primary', '#ffffff');
        html.style.setProperty('--text-secondary', '#e0e0e0');
        html.style.setProperty('--text-tertiary', '#b0b0b0');
        html.style.setProperty('--border-color', '#404040');
        html.style.setProperty('--shadow-light', '0 2px 10px rgba(0, 0, 0, 0.3)');
        html.style.setProperty('--shadow-medium', '0 10px 30px rgba(0, 0, 0, 0.4)');
        html.style.setProperty('--shadow-large', '0 20px 60px rgba(0, 0, 0, 0.5)');
    } else {
        html.style.removeProperty('--bg-primary');
        html.style.removeProperty('--bg-secondary');
        html.style.removeProperty('--bg-tertiary');
        html.style.removeProperty('--text-primary');
        html.style.removeProperty('--text-secondary');
        html.style.removeProperty('--text-tertiary');
        html.style.removeProperty('--border-color');
        html.style.removeProperty('--shadow-light');
        html.style.removeProperty('--shadow-medium');
        html.style.removeProperty('--shadow-large');
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        applyTheme(true);
    } else if (savedTheme === 'light') {
        applyTheme(false);
    } else {
        // No saved preference, check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark);
        if (prefersDark) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }
}

themeToggle.addEventListener('change', () => {
    const isDark = themeToggle.checked;
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    applyTheme(isDark);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches);
        localStorage.setItem('theme', e.matches ? 'dark' : 'light');
    }
});

// Initialize theme when DOM is ready
document.addEventListener('DOMContentLoaded', initializeTheme);
