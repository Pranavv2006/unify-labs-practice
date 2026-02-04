// Minimal dark mode functionality - localStorage persistence + system preference detection

const themeToggle = document.getElementById('theme-toggle');

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
    } else if (!savedTheme) {
        // No saved preference, check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        themeToggle.checked = prefersDark;
    }
}

themeToggle.addEventListener('change', () => {
    const theme = themeToggle.checked ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        themeToggle.checked = e.matches;
    }
});

// Initialize theme when DOM is ready
document.addEventListener('DOMContentLoaded', initializeTheme);
