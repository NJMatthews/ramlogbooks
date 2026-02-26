

# Integrate Avenir Font Files

## Overview
Copy the Avenir font files into the project and configure `@font-face` declarations for the two weights required by the design system: **Medium (500)** and **Heavy (800)**.

## Steps

### 1. Copy font files to `public/fonts/`
Copy the two primary `.ttf` files into the project:
- `Avenir-Medium.ttf` -- used for weight 500
- `Avenir-Heavy.ttf` -- used for weight 800

The `.ttc` (TrueType Collection) files and duplicates (-2, -3) won't be used since browsers don't support `.ttc` and we only need one copy of each weight.

### 2. Add @font-face declarations in `src/index.css`
Add two `@font-face` rules before the Tailwind directives:

```css
@font-face {
  font-family: "Avenir";
  src: url("/fonts/Avenir-Medium.ttf") format("truetype");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Avenir";
  src: url("/fonts/Avenir-Heavy.ttf") format("truetype");
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}
```

### 3. Update Tailwind config
Add the font family to `tailwind.config.ts` under `theme.extend.fontFamily`:

```ts
fontFamily: {
  avenir: ['"Avenir"', '"Century Gothic"', 'sans-serif'],
}
```

### 4. Set as default body font
Update the base layer in `index.css` to apply `font-avenir` to the body so the entire app uses Avenir by default.

