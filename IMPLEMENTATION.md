# Catppuccin Design System — Implementation Plan: Missing Components

## Overview

React has **28 component files** (the reference implementation). Angular and Vue each have **13 components** — meaning **15 components are missing** from both. All CSS is already complete in `packages/css/src/` (31 stylesheets). This plan covers filling the gap for Angular and Vue, plus adding router integration to the existing React Tabs component.

**Total scope:** 15 new components × 2 frameworks = 30 framework wrappers + 3 router-aware tab variants.

---

## Phase 1: Tabs + Router Integration (Priority: High)

> The React `Tabs` component (`packages/react/src/Tabs.tsx`) already exists but has **no router integration**. Angular and Vue have **no tabs component at all**. CSS is ready in `packages/css/src/tabs.css`.

### 1.1 React — Add Router-Aware Mode

**File:** `packages/react/src/Tabs.tsx`

- Add optional `router` prop or `mode` prop (`"state" | "router"`)
- When in router mode:
  - Each `TabsTrigger` accepts an optional `to` / `path` prop
  - Uses `react-router-dom` v6 (`useLocation`, `useNavigate`) to sync active tab with URL
  - `tabIndex` and `aria-selected` driven by current route match
- Keep backward-compatible: default mode is `"state"` (existing behavior)
- New export: `TabsRouterMode` type

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"state"` \| `"router"` | `"state"` | Routing mode |
| (on TabsTrigger) `to` | `string` | — | Route path (only in router mode) |
| (on TabsTrigger) `exact` | `boolean` | `false` | Exact route match |

```tsx
// Router mode usage
<Tabs mode="router">
  <TabsList>
    <TabsTrigger to="/settings/general" value="general">General</TabsTrigger>
    <TabsTrigger to="/settings/themes" value="themes">Themes</TabsTrigger>
  </TabsList>
  <TabsContent value="general">...</TabsContent>
  <TabsContent value="themes">...</TabsContent>
</Tabs>
```

### 1.2 Angular — New Tabs Component

**Files:**
- `packages/angular/src/tabs/tabs.component.ts` — Root component
- `packages/angular/src/tabs/tabs-list.component.ts` — Tab list
- `packages/angular/src/tabs/tabs-trigger.component.ts` — Individual trigger
- `packages/angular/src/tabs/tabs-content.component.ts` — Content panel
- `packages/angular/src/tabs/tabs.module.ts` or barrel index

**Selectors:**
| Selector | Role |
|----------|------|
| `ctp-tabs` | Root; manages `value`, `variant`, `size`, `color`, `orientation` |
| `ctp-tabs-list` | Container; keyboard navigation (Arrow keys) |
| `ctp-tabs-trigger` | Button; `aria-selected`, `aria-controls`, router support |
| `ctp-tabs-content` | Panel; `display` toggle via CSS class |

**Router Integration (primary):**
- `ctp-tabs-trigger` supports `routerLink` and `routerLinkActiveOptions` natively
- `ctp-tabs` reads `ActivatedRoute` to sync active tab from URL path
- Uses `@angular/router` `RouterLink`, `RouterLinkActive`, `Router`

```html
<ctp-tabs mode="router" [routerSync]="true">
  <ctp-tabs-list>
    <ctp-tabs-trigger value="general" routerLink="/settings/general">
      General
    </ctp-tabs-trigger>
    <ctp-tabs-trigger value="themes" routerLink="/settings/themes">
      Themes
    </ctp-tabs-trigger>
  </ctp-tabs-list>
  <ctp-tabs-content value="general">
    <router-outlet></router-outlet>
  </ctp-tabs-content>
</ctp-tabs>
```

**@Input() Props:**
| Input | Type | Default |
|-------|------|---------|
| `value` | `string` | auto-selects first |
| `variant` | `'default' \| 'underline' \| 'pills' \| 'segmented'` | `'default'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | `FormControlColor` | `'mauve'` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `mode` | `'state' \| 'router'` | `'state'` |
| `routerSync` | `boolean` | `false` |

**@Output() Events:**
| Output | Payload |
|--------|---------|
| `valueChange` | `string` |

### 1.3 Vue — New Tabs Component

**Files:**
- `packages/vue/src/Tabs.vue` — Root + List + Trigger + Content (SFC)
- Or split into: `Tabs.vue`, `TabsList.vue`, `TabsTrigger.vue`, `TabsContent.vue`

**Component names:** `CtpTabs`, `CtpTabsList`, `CtpTabsTrigger`, `CtpTabsContent`

**Router Integration:**
- `CtpTabsTrigger` supports `to` prop for `vue-router` `<router-link>`
- `CtpTabs` watches `$route` to sync active tab from URL
- Uses Vue's `useRoute()` and `useRouter()` composables

```html
<CtpTabs mode="router">
  <CtpTabsList>
    <CtpTabsTrigger value="general" to="/settings/general">General</CtpTabsTrigger>
    <CtpTabsTrigger value="themes" to="/settings/themes">Themes</CtpTabsTrigger>
  </CtpTabsList>
  <CtpTabsContent value="general">
    <router-view />
  </CtpTabsContent>
</CtpTabs>
```

**Props:**
| Prop | Type | Default |
|------|------|---------|
| `value` / `modelValue` | `string` | auto-select first |
| `variant` | `'default' \| 'underline' \| 'pills' \| 'segmented'` | `'default'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `color` | `FormControlColor` | `'mauve'` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `mode` | `'state' \| 'router'` | `'state'` |

**Emits:** `update:modelValue`

---

## Phase 2: Form Controls (Priority: Critical)

> React has them in `FormControls.tsx` (Input, TextArea, Select, Checkbox, Switch, RadioGroup, Slider, FormGroup). CSS is in `packages/css/src/form.css`. **None exist in Angular or Vue.**

### 2.1 Angular Form Controls

**Files (per component):**
- `input.component.ts` → selector `ctp-input` / `input[ctp-input]`
- `textarea.component.ts` → selector `ctp-textarea`
- `select.component.ts` → selector `ctp-select`
- `checkbox.component.ts` → selector `ctp-checkbox`
- `switch.component.ts` → selector `ctp-switch`
- `radio-group.component.ts` → selector `ctp-radio-group`
- `slider.component.ts` → selector `ctp-slider`
- `form-group.component.ts` → selector `ctp-form-group`

**Shared:** `FormControlColor`, `FormControlSize`, `FormControlShape` from existing React `FormControls.tsx` — re-create as TypeScript types + CSS class helpers in Angular.

**Key considerations:**
- All support `[(ngModel)]` (two-way binding) for Angular Forms integration
- Support `[formControl]` / `[formControlName]` for Reactive Forms
- `ctp-form-group` wraps label + control + error message
- Follow same props as React: `size`, `color`, `shape`, `disabled`, `placeholder`, `invalid`

### 2.2 Vue Form Controls

**Files:**
- `Input.vue` → component `CtpInput`
- `TextArea.vue` → component `CtpTextArea`
- `Select.vue` → component `CtpSelect`
- `Checkbox.vue` → component `CtpCheckbox`
- `Switch.vue` → component `CtpSwitch`
- `RadioGroup.vue` → component `CtpRadioGroup`
- `Slider.vue` → component `CtpSlider`
- `FormGroup.vue` → component `CtpFormGroup`

**Key considerations:**
- Support `v-model` (two-way binding)
- `CtpFormGroup` wraps label + control + error/helper text
- Same prop API as React

---

## Phase 3: Navigation & Overlay Components (Priority: High)

### 3.1 Drawer

| Framework | File | Selector/Name |
|-----------|------|---------------|
| Angular | `drawer.component.ts` | `ctp-drawer` |
| Vue | `Drawer.vue` | `CtpDrawer` |

- Props: `open`, `position` (`'left' | 'right' | 'top' | 'bottom'`), `size` (`'sm' | 'md' | 'lg'`), `closeOnOverlayClick`
- Uses `ctp-overlay` internally (already exists in both frameworks)
- Emits: `close`

### 3.2 Dropdown

| Framework | File | Selector/Name |
|-----------|------|---------------|
| Angular | `dropdown.component.ts` | `ctp-dropdown` |
| Vue | `Dropdown.vue` | `CtpDropdown` |

- Compound: `ctp-dropdown` + `ctp-dropdown-trigger` + `ctp-dropdown-content`
- Position: uses existing `usePortalPosition` pattern (React) — port to Angular directive / Vue composable
- Keyboard: Enter/Space to open, Escape to close, Arrow keys to navigate items
- Items: `ctp-dropdown-item`, `ctp-dropdown-divider`, `ctp-dropdown-header`

### 3.3 Tooltip

| Framework | File | Selector/Name |
|-----------|------|---------------|
| Angular | `tooltip.directive.ts` | `[ctp-tooltip]` (directive) |
| Vue | `Tooltip.vue` | `CtpTooltip` |

- Props: `content` (string), `placement` (`'top' | 'bottom' | 'left' | 'right'`), `delay`
- Uses portal positioning
- Show on hover/focus

---

## Phase 4: Data Display Components (Priority: High)

### 4.1 Pagination

| Framework | File | Selector/Name |
|-----------|------|---------------|
| Angular | `pagination.component.ts` | `ctp-pagination` |
| Vue | `Pagination.vue` | `CtpPagination` |

- Props: `page`, `totalPages`, `totalItems`, `perPage`, `showPerPageSelector`
- Emits: `pageChange`, `perPageChange`
- Sub-component: `ctp-page-size-selector` / `CtpPageSizeSelector`
- Logic: port `usePaginationRange` hook to Angular pipe / Vue composable (page range with ellipsis "\u2026")

### 4.2 Table

| Framework | File | Selector/Name |
|-----------|------|---------------|
| Angular | `table.component.ts` | `ctp-table` |
| Vue | `Table.vue` | `CtpTable` |

- `<ctp-table>` wraps native `<table>` with Catppuccin CSS classes
- `<ctp-table-column>` defines columns (field, header, sortable, width)
- Sortable headers, striped rows, hover, border variants
- Props: `data`, `striped`, `bordered`, `hoverable`, `sortable`

### 4.3 Icons (54 icons)

| Framework | File | Approach |
|-----------|------|----------|
| Angular | `icons/` directory, one component per icon | `ctp-icon-foo` selectors or `<ctp-icon [name]="'foo'">` |
| Vue | `icons/` directory, one SFC per icon | `<CtpIcon name="foo" />` |

**Recommendation:** Use a single component with `name` prop + `switch` rendering (avoids 54 files per framework).

- Props: `name`, `size`, `color` (`IconColor`)
- CSS: leverages existing `packages/css/src/icon.css`

---

## Phase 5: Layout Components (Priority: Medium)

### 5.1 Grid

| Framework | File | Selector/Name |
|-----------|------|---------------|
| Angular | `grid.component.ts` | `ctp-grid` + `ctp-grid-col` |
| Vue | `Grid.vue` | `CtpGrid` + `CtpGridCol` |

- Props (Grid): `gap`, `align`, `valign`
- Props (Col): `span`, `offset`, `order`
- 12-column CSS grid system (CSS already in `grid.css`)

### 5.2 Shell (Application Layout)

| Framework | File | Selector/Name |
|-----------|------|---------------|
| Angular | `shell.component.ts` | `ctp-shell` |
| Vue | `Shell.vue` | `CtpShell` |

- Compound: `ctp-shell` + `ctp-shell-header` + `ctp-shell-sidebar` + `ctp-shell-main` + `ctp-shell-content`
- Props: `layout` (`'sidebar' | 'header-sidebar' | 'header-only'`)
- CSS: `packages/css/src/shell.css`

### 5.3 Sidebar

| Framework | File | Selector/Name |
|-----------|------|---------------|
| Angular | `sidebar.component.ts` | `ctp-sidebar` |
| Vue | `Sidebar.vue` | `CtpSidebar` |

- Compound: `ctp-sidebar` + `ctp-sidebar-header` + `ctp-sidebar-section` + `ctp-sidebar-item`
- Props: `collapsed`, `collapsible`
- CSS: `packages/css/src/sidebar.css`

### 5.4 DatePicker

| Framework | File | Selector/Name |
|-----------|------|---------------|
| Angular | `date-picker.component.ts` | `ctp-date-picker` |
| Vue | `DatePicker.vue` | `CtpDatePicker` |

- Props: `value`, `mode` (`'single' | 'range'`), `min`, `max`
- Emits: `valueChange` / `update:modelValue`
- Calendar popover with month/year navigation
- CSS: `packages/css/src/datepicker.css`

---

## Phase 6: Advanced Components (Priority: Low)

### 6.1 TextEditor

| Framework | File | Selector/Name |
|-----------|------|---------------|
| Angular | `text-editor.component.ts` | `ctp-text-editor` |
| Vue | `TextEditor.vue` | `CtpTextEditor` |

- Rich text editor wrapper (React uses TipTap)
- Props: `value`, `placeholder`, `readOnly`, `size`, `color`
- Toolbar: Bold, Italic, Underline, Strike, Headings, Lists, Quote, Link, Image
- CSS: `packages/css/src/text-editor.css`

### 6.2 AdvancedSelect (MultiSelect + TreeSelect)

| Framework | File | Selector/Name |
|-----------|------|---------------|
| Angular | `advanced-select.component.ts` | `ctp-multi-select` + `ctp-tree-select` |
| Vue | `AdvancedSelect.vue` | `CtpMultiSelect` + `CtpTreeSelect` |

- MultiSelect: checkbox list with search, tag chips for selected
- TreeSelect: nested selectable tree with expand/collapse
- Props: `options`, `value`, `placeholder`, `searchable`, `hierarchical`
- CSS: `packages/css/src/advanced-select.css`

### 6.3 DynamicForm

| Framework | File | Selector/Name |
|-----------|------|---------------|
| Angular | `dynamic-form.component.ts` | `ctp-dynamic-form` |
| Vue | `DynamicForm.vue` | `CtpDynamicForm` |

- Schema-driven form generation (port from React's `FieldSchema` + `DynamicForm`)
- Renders form controls from JSON schema
- Handles validation, layout, submit
- Requires FormControls to be completed first (dependency)

---

## Implementation Order (Recommended Sequence)

```
Phase 1: Tabs + Router         (3 components, 1-2 days)
Phase 2: FormControls          (16 components, 3-4 days)
Phase 3: Drawer + Dropdown + Tooltip  (6 components, 2-3 days)
Phase 4: Pagination + Table + Icons   (6 components, 2-3 days)
Phase 5: Grid + Shell + Sidebar + DatePicker (8 components, 2-3 days)
Phase 6: TextEditor + AdvancedSelect + DynamicForm (6 components, 2-3 days)

Total: ~30 components across ~12-18 days
```

**Dependencies:**
- FormControls must come before DynamicForm (DynamicForm generates form controls)
- Overlay/Dropdown/Tooltip should be done together (reuse portal positioning)
- Grid is a pre-requisite for Shell/Sidebar layout (though not strictly required)

---

## Files to Update Per Component

For each new Angular component, update:
- New component file(s) in `packages/angular/src/<name>/`
- `packages/angular/src/index.ts` — add export

For each new Vue component, update:
- New SFC file(s) in `packages/vue/src/<name>.vue`
- `packages/vue/src/index.ts` — add export

No CSS changes needed — all styles already exist.
