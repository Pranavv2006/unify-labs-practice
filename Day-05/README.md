# My Website - Responsive Web Design Project

A modern, fully responsive website built with HTML5, CSS3, and JavaScript.

## Features

### Responsive Design
- Mobile-First Approach
- Works on all screen sizes (mobile, tablet, desktop)
- Hamburger menu on mobile devices
- Three breakpoints: <768px, 768px-1024px, >1024px

### Animations & Transitions
- **slideUpFadeIn** - Hero entrance animation
- **pulseScale** - Logo pulse animation
- Smooth 0.3s transitions on all hover effects
- Card elevation and image zoom effects

### Advanced CSS
- CSS Variables for easy customization
- Glassmorphism effects (blur backgrounds)
- Pseudo-elements (::before/::after) for decorations
- Transform effects on hover (scale, translateY)
- OOCSS methodology for organized code

## Files

```
index.html    - HTML structure
style.css     - All styling and animations
README.md     - This file
```

## Quick Start

1. Open `index.html` in your web browser
2. That's it! No setup needed.

Optional - Run a local server:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

## Features Checklist

**Transitions:**
- Buttons and links smooth on hover
- Cards lift and change color on hover
- Images zoom on hover

**Responsive:**
- Mobile: Single column + hamburger menu
- Tablet: 2-column grids
- Desktop: 3-column grids

**Animations:**
- Hero section fades in and slides up
- Logo pulses continuously
- Nav underline animates on hover

**Design:**
- Decorative shapes with CSS (::before/::after)
- Gradient underlines on section titles
- Blurred header (glassmorphism)
- Floating shapes in contact section

**Mobile:**
- Hamburger menu that animates to X
- Auto-closes when you click a link
- All content readable on small screens

## Colors

| Name | Hex | Use |
|------|-----|-----|
| Primary | #667eea | Buttons, links |
| Secondary | #764ba2 | Accents |
| Dark | #333 | Text, backgrounds |
| Light | #f9f9f9 | Card backgrounds |

## Responsive Breakpoints

- **Mobile** (<768px): Single column, hamburger menu, small text
- **Tablet** (768px-1024px): 2 columns
- **Desktop** (>1024px): 3 columns, full features

## CSS Variables

```css
:root {
    --color-primary: #667eea;
    --color-secondary: #764ba2;
    --spacing-lg: 60px;
    --transition-base: 0.3s ease;
}
```

Change these in `style.css` to customize colors and spacing.

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome | Yes |
| Firefox | Yes |
| Safari | Yes |
| Edge | Yes |

## Accessibility

- Keyboard navigation works
- Focus states visible
- Respects reduced motion settings
- Good color contrast

## Learn More

- [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Responsive Design](https://web.dev/responsive-web-design-basics/)
- [Backdrop Filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)

## License

Open source - use for anything!

---

**Built with:** HTML5, CSS3, JavaScript  
**Updated:** February 1, 2026
