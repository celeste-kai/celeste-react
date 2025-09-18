# shadcn/ui Migration Roadmap

## Overview
Detailed implementation plan for migrating Celeste React from CSS Modules to shadcn/ui components.

## Pre-Migration Assessment

### Current Component Inventory
| Component | Lines (TSX) | Lines (CSS) | Complexity | Migration Priority | shadcn/ui Equivalent |
|-----------|-------------|-------------|------------|-------------------|---------------------|
| SimpleDropdown | 75 | 127 | Medium | High | Select |
| AuthScreen | 138 | 394 | High | High | Card + Form + Button |
| InputBar | 195 | 150+ | High | Medium | Textarea + Button |
| CapabilityButtons | 100 | 80 | Low | High | ToggleGroup |
| ProviderSelect | 42 | 69 | Low | Medium | Select with Icons |
| ModelSelect | 31 | 0 | Low | Medium | Select |
| Greeting | 50 | 45 | Low | Low | Card |

### Total Impact
- **Lines Reduction**: ~2,505 CSS → ~500 CSS (80% reduction)
- **Component Simplification**: ~1,148 TSX → ~800 TSX (30% reduction)
- **Maintenance Reduction**: 14 CSS modules → 0 CSS modules

## Phase 1: Foundation Setup (Week 1)

### Day 1-2: Install and Configure
```bash
# Install shadcn/ui and dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge

# Initialize shadcn/ui
npx shadcn-ui@latest init
```

### Day 3-4: Design Token Migration
Create `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Map existing design tokens
        border: "var(--color-border)",
        input: "var(--color-border)",
        ring: "var(--color-primary)",
        background: "var(--color-bg)",
        foreground: "var(--color-text)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-text)",
        },
        secondary: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-text)",
        },
        destructive: {
          DEFAULT: "var(--color-error)",
          foreground: "var(--color-error-text)",
        },
        muted: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-text-muted)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-text)",
        },
        popover: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-text)",
        },
        card: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-text)",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      fontFamily: {
        sans: ["var(--font-family-sans)"],
        mono: ["var(--font-family-mono)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### Day 5: Theme Provider Setup
```tsx
// src/components/ui/theme-provider.tsx
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

export function ThemeProvider({ children, ...props }) {
  // Implementation that works with existing CSS variables
}
```

## Phase 2: High-Impact Migrations (Weeks 2-3)

### Week 2: SimpleDropdown → Select
**Priority**: Highest impact, lowest risk

**Current State**: 
- `SimpleDropdown.tsx`: 75 lines
- `SimpleDropdown.module.css`: 127 lines
- **Total**: 202 lines

**Migration Steps**:
1. Install select component: `npx shadcn-ui@latest add select`
2. Create new `ModelSelect` component using shadcn Select
3. Update all imports
4. Test functionality
5. Remove old files

**Expected Outcome**:
- New component: ~15 lines
- **Reduction**: 202 → 15 lines (92% reduction)

### Week 3: CapabilityButtons → ToggleGroup
**Current State**:
- `CapabilityButtons.tsx`: 100 lines
- CSS in `ChatInput.module.css`: ~80 lines
- **Total**: 180 lines

**Migration Steps**:
1. Install toggle-group: `npx shadcn-ui@latest add toggle-group`
2. Replace with ToggleGroup component
3. Add proper icons using lucide-react
4. Update state management

**Expected Outcome**:
- New component: ~25 lines
- **Reduction**: 180 → 25 lines (86% reduction)

## Phase 3: Complex Components (Weeks 4-5)

### Week 4: AuthScreen → Card + Form
**Current State**:
- `AuthScreen.tsx`: 138 lines
- `AuthScreen.module.css`: 394 lines
- **Total**: 532 lines

**Migration Steps**:
1. Install components: `npx shadcn-ui@latest add card form button input`
2. Restructure authentication UI
3. Implement form validation
4. Add responsive design
5. Test Google OAuth integration

**Expected Outcome**:
- New component: ~80 lines
- **Reduction**: 532 → 80 lines (85% reduction)

### Week 5: InputBar → Textarea + Button
**Current State**:
- `InputBar.tsx`: 195 lines
- CSS in `ChatInput.module.css`: ~150 lines
- **Total**: 345 lines

**Migration Steps**:
1. Install components: `npx shadcn-ui@latest add textarea button`
2. Rebuild input interface
3. Add drag-and-drop for images
4. Implement auto-resize functionality
5. Test with existing hooks

**Expected Outcome**:
- New component: ~100 lines
- **Reduction**: 345 → 100 lines (71% reduction)

## Phase 4: Enhanced Features (Week 6)

### Enhanced Model Selection with Search
Add Combobox for better model selection:
```bash
npx shadcn-ui@latest add command popover
```

### Chat Interface Improvements
Add scroll area and message components:
```bash
npx shadcn-ui@latest add scroll-area separator
```

### Notification System
Add toast notifications:
```bash
npx shadcn-ui@latest add toast
```

## Phase 5: Cleanup and Optimization (Week 7)

### Remove Legacy Files
1. Delete CSS module files
2. Remove CSS imports
3. Update design system documentation
4. Clean up unused design tokens

### Bundle Size Optimization
1. Tree-shake unused Tailwind classes
2. Optimize component imports
3. Add bundle analyzer
4. Performance testing

## Testing Strategy

### Component Testing
- **Unit Tests**: Each migrated component
- **Integration Tests**: Component interactions
- **Visual Regression**: Screenshot comparisons
- **Accessibility Tests**: WCAG compliance

### Migration Testing
- **Feature Parity**: All existing functionality works
- **Design Consistency**: Visual appearance matches
- **Performance**: Bundle size and runtime performance
- **Browser Compatibility**: Cross-browser testing

## Risk Mitigation

### Technical Risks
- **Design Token Conflicts**: Gradual migration prevents conflicts
- **State Management**: Keep existing Zustand stores unchanged
- **Bundle Size**: Monitor with webpack-bundle-analyzer

### Process Risks
- **Team Adoption**: Provide shadcn/ui training
- **Timeline Pressure**: Prioritize high-impact, low-risk components first
- **Quality Regression**: Comprehensive testing at each phase

## Success Metrics

### Code Quality
- [ ] 80% reduction in CSS lines
- [ ] 30% reduction in component complexity
- [ ] 100% WCAG 2.1 AA compliance
- [ ] Zero accessibility violations

### Developer Experience
- [ ] 50% faster new component development
- [ ] Consistent component API across project
- [ ] Comprehensive Storybook documentation
- [ ] Zero design system maintenance overhead

### Performance
- [ ] 15-20% bundle size reduction
- [ ] Improved Core Web Vitals scores
- [ ] Better mobile performance
- [ ] Faster initial page load

## Timeline Summary

| Phase | Duration | Components | Expected Reduction |
|-------|----------|------------|-------------------|
| Foundation | 1 week | Setup | 0% |
| High Impact | 2 weeks | SimpleDropdown, CapabilityButtons | 45% |
| Complex | 2 weeks | AuthScreen, InputBar | 75% |
| Enhanced | 1 week | New features | 80% |
| Cleanup | 1 week | Optimization | 85% |

**Total Duration**: 7 weeks  
**Total Code Reduction**: 85% CSS, 35% TSX  
**ROI**: Immediate improvement in development velocity and maintenance reduction