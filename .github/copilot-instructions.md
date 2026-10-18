# SHABAKAH Website - AI Agent Instructions

## Project Overview
Premium **bilingual website** (Arabic/English) for SHABAKAH Integrated Technology - a Saudi ICT company. Pure vanilla HTML/CSS/JavaScript with glassmorphism design, RTL support, and premium animations. **No build tools or frameworks.**

## Architecture

### Bilingual System (CRITICAL)
- **Translation file**: `assets/js/language-complete.js` (3200+ lines) - **never use `language.js`**
- **Structure**: `translations.en.page.section.key` / `translations.ar.page.section.key`
- **Language toggle**: `window.toggleLanguage()` → saves to `localStorage('language')` → page reload
- **RTL activation**: `html[dir="rtl"]` + body class `rtl` triggers `rtl-support.css`

```javascript
// Translation pattern - always add BOTH languages
translations.en.home.hero.title = 'Saudi Vision.'
translations.ar.home.hero.title = 'رؤية سعودية.'
```

### Page Update Flow
1. `DOMContentLoaded` → `initLanguageSystem()` in language-complete.js
2. `setLanguage(lang)` → sets `html[dir]`, `html[lang]`, body classes
3. `updatePageContent(lang)` → calls page-specific updaters based on URL path
4. Each page has dedicated function: `updateHomePage()`, `updateAboutPage()`, `updateServicesPage()`, etc.

### CSS Architecture
| File | Purpose |
|------|---------|
| `main.css` | CSS variables (`:root`), reset, base typography |
| `glassmorphism.css` | Glass effects (`.glass-effect`, `.glass-card`) |
| `rtl-support.css` | All `html[dir="rtl"]` overrides |
| `components.css` | Reusable UI (`.btn`, `.service-card`, `.why-card`) |
| `pages.css` | Page-specific sections |

### Key CSS Variables
```css
--primary-navy: #0A1628;    --accent-blue: #3B82F6;
--teal-bright: #00D9FF;     --gold-bright: #FFB800;
--font-primary: 'Inter';    --font-arabic: 'Tajawal';
```

## Development Workflows

### Adding Translatable Content
1. Add HTML structure with target class (e.g., `.hero-title`, `.service-card h3`)
2. Add keys to BOTH `translations.en` and `translations.ar` in language-complete.js
3. Update the page's `update<PageName>()` function to query and populate elements
4. Test with `toggleLanguage()` in browser console

### Creating New Pages
1. Copy existing page HTML (e.g., `about.html`) - includes all CSS/JS refs
2. Add new section to `translations` object: `translations.en.newPage = {...}`
3. Add case to `updatePageContent()`:
```javascript
case 'newpage':
    updateNewPage(t.newPage);
    break;
```
4. Implement `updateNewPage()` function with DOM queries

### Glass Effect Pattern
```css
.glass-effect {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px) saturate(150%);
    border: 1px solid rgba(255, 255, 255, 0.125);
}
```
**Mobile**: Reduce blur to `blur(8px)` for performance. Apply `touch-action: pan-y pinch-zoom;` to prevent scroll blocking.

## Critical Conventions

### RTL Requirements (`rtl-support.css`)
- Navigation mirrors with `html[dir="rtl"]` (logo right, links/actions left); use logical CSS properties (`margin-inline-*`, `inset-inline-start`) in `main.css` for nav spacing
- Flip animations: `slideInRight` → `slideInLeft` for RTL
- Swap flex: `flex-direction: row-reverse` where needed
- Background elements: `pointer-events: none !important;`

### JavaScript Initialization (`main.js`)
```javascript
initializeApp() → {
    initCustomCursor()     // Desktop magnetic cursor
    initScrollProgress()   // Top progress bar
    initScrollAnimations() // IntersectionObserver triggers
    initHeroCounters()     // Animated stats with data-target
    init3DCardTilt()       // Hover effects on cards
}
```

### Translation Update Functions Pattern
```javascript
function updateHomePage(home) {
    // Query elements by class/structure, not ID
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.innerHTML = `${home.hero.title}...`;
    
    // Loop for repeated elements
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
        if (home.serviceCards[index]) {
            card.querySelector('h3').textContent = home.serviceCards[index].title;
        }
    });
}
```

## Common Pitfalls

1. **Hardcoding text in HTML** - All visible text must come from translations
2. **Forgetting Arabic translation** - Both EN/AR required or feature breaks in Arabic
3. **Using `language.js`** - Legacy file, use `language-complete.js` only
4. **Missing RTL styles** - Test every layout change in Arabic mode
5. **Blocking scroll with glass elements** - Add `touch-action: pan-y pinch-zoom;`

## Quick Debug Commands
```javascript
toggleLanguage()                    // Switch EN↔AR
localStorage.getItem('language')    // Check current
document.documentElement.dir        // Verify RTL/LTR
```

## External Dependencies
- **Fonts**: Google Fonts (Inter, Tajawal) - preconnected
- **Icons**: Lucide (`https://unpkg.com/lucide@latest`)
- **No npm/build**: Direct `<script>` and `<link>` tags only
