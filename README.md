# pwc-invoice-tracker

A comprehensive VAT (Value Added Tax) calculator built for the Nigerian tax
system. This Progressive Web Application allows users to calculate VAT on
products and services with different tax rates including standard, reduced,
zero-rated, and exempt categories.

## Features

### Core Functionality

- ✅ Product catalog with various VAT rates (7.5%, 0%)
- ✅ Real-time VAT calculations
- ✅ Shopping cart-style calculation interface
- ✅ Multiple product categories (Services, Financial, Zero-Rated, Exempt, etc.)
- ✅ Dynamic quantity adjustments
- ✅ Comprehensive calculation summaries
- ✅ **Custom service creation and management**
- ✅ **Persistent custom services with localStorage**

### Custom Services Management

- ✅ Create custom VAT services with custom rates
- ✅ Edit existing custom services
- ✅ Delete custom services with confirmation
- ✅ Custom services displayed at the top of the list
- ✅ Visual indicators for user-created services
- ✅ Form validation for all custom service fields
- ✅ Local storage persistence across sessions

### User Interface

- ✅ Responsive design (mobile and desktop)
- ✅ Grid and List view toggle for products
- ✅ Search and filter functionality
- ✅ Category-based filtering
- ✅ Dark/Light theme support with multiple color schemes (Orange, Red, Rose)
- ✅ Slide-out cart sheet for calculations
- ✅ Toast notifications for user feedback
- ✅ Intuitive dialog forms with real-time validation

### Calculations

- ✅ Subtotal calculation (pre-VAT)
- ✅ Individual item VAT calculation
- ✅ Total VAT amount across all items
- ✅ Grand total (including VAT)
- ✅ Currency formatting (Nigerian Naira ₦)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI Components:** Radix UI
- **Styling:** Tailwind CSS
- **State Management:** Zustand (with persist middleware)
- **Data Fetching:** TanStack Query (React Query)
- **Form Handling:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Testing:** Vitest

## VAT Categories

The application supports the following VAT categories aligned with Nigerian tax
law:

| Category      | VAT Rate | Examples                                                  |
| ------------- | -------- | --------------------------------------------------------- |
| Standard Rate | 7.5%     | Most services, consulting, banking                        |
| Zero-Rated    | 0%       | Exports, diplomatic services, EPZ goods                   |
| Exempt        | 0%       | Medical supplies, educational materials, basic food items |

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx              # Main calculator page
│   ├── providers.tsx         # React Query provider
│   └── globals.css           # Global styles & theme variables
├── modules/
│   ├── cart/
│   │   ├── components/       # Cart-related components
│   │   │   ├── cart-sheet.tsx
│   │   │   ├── cart-summary.tsx
│   │   │   ├── add-to-cart.tsx
│   │   │   ├── add-custom-product-dialog.tsx  # NEW
│   │   │   └── category-filter.tsx
│   │   └── store/            # Zustand stores
│   │       ├── cart-store.ts
│   │       └── custom-products-store.ts       # NEW
│   ├── products/
│   │   ├── components/       # Product display components
│   │   │   ├── product-grid.tsx
│   │   │   ├── product-card.tsx
│   │   │   └── product-list-item.tsx
│   │   └── types.ts          # Product interfaces
│   ├── layout/
│   │   └── components/       # Layout components
│   │       ├── header.tsx
│   │       ├── search-bar.tsx
│   │       └── view-toggle.tsx
│   └── utils/
│       ├── vat-calculator.ts # VAT calculation logic
│       ├── validation-schema.ts # Form validation
│       └── custom-product-validation.ts # NEW
├── lib/
│   └── api/
│       └── product.ts        # Product data API
└── primitives/
    ├── ui/                   # Radix UI components
    │   ├── form.tsx          # NEW
    │   ├── select.tsx        # NEW
    │   ├── textarea.tsx      # NEW
    │   ├── label.tsx         # NEW
    │   └── alert-dialog.tsx  # NEW
    └── theme-provider.tsx    # Theme context
```

## Installation

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm

### Install Dependencies

```bash
pnpm install
```

## Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

### Run Tests

```bash
pnpm test
```

### Run Tests with UI

```bash
pnpm test:ui
```

### Run Tests with Coverage

```bash
pnpm test:coverage
```

### Test Suites

The application includes comprehensive tests for:

- VAT calculation functions
- Item subtotal calculations
- Item total calculations (including VAT)
- Cart totals with multiple items
- Currency formatting
- Edge cases (zero VAT, decimal prices, large numbers)

## Build & Deploy

### Production Build

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Deployment Platforms

- **Vercel:** Recommended (Zero-config deployment for Next.js)
- **Netlify:** Fully supported
- **Cloudflare Pages:** Supported

## Key Features Implementation

### 1. Custom Services Management

Users can create, edit, and delete custom VAT services:

```typescript
// Add custom service
addCustomProduct({ name, category, basePrice, vatRate, description });

// Update custom service
updateCustomProduct(id, { name, category, basePrice, vatRate, description });

// Delete custom service
deleteCustomProduct(id);
```

**Features:**

- Form validation with Zod schema
- Required fields: name (3-100 chars), category, price (> 0), VAT rate (0-100%),
  description (10-500 chars)
- Real-time validation feedback
- Submit button disabled until all fields are valid
- Custom services persisted to localStorage
- Custom services automatically sorted to top of product list
- Visual "Custom" badge with sparkle icon
- Edit/Delete actions via dropdown menu
- Confirmation dialog for deletions

### 2. VAT Calculation Engine

The calculator uses precise decimal arithmetic to ensure accurate tax
calculations:

```typescript
// Calculate VAT for an item
calculateItemVat(basePrice, quantity, vatRate);

// Calculate subtotal (pre-VAT)
calculateItemSubtotal(basePrice, quantity);

// Calculate total including VAT
calculateItemTotal(basePrice, quantity, vatRate);

// Calculate cart-wide totals
calculateCartTotals(items);
```

### 3. State Management

- **Zustand Store (Cart):** Manages cart state with items and quantities
- **Zustand Store (Custom Products):** Manages custom services with localStorage
  persistence
- **React Query:** Handles product data fetching and caching
- **Form State:** React Hook Form with Zod validation

### 4. Responsive Design

- Mobile-first approach
- Collapsible header on mobile
- Sheet-based cart interface
- Touch-friendly controls
- Adaptive grid/list layouts
- Responsive dialog forms
- Compact button text on mobile screens

### 5. Theme Support

Multiple theme options:

- Dark mode
- Light mode
- Orange theme
- Red theme
- Rose theme

Themes are powered by `next-themes` with CSS variables for easy customization.

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 12+)
- Samsung Internet: Full support

## Usage Example

### Using Pre-defined Services

1. Browse the product catalog
2. Use search or category filters to find products
3. Click "Calculate" or select a product
4. Specify quantity in the cart sheet
5. Add multiple products as needed
6. View real-time VAT calculations
7. See breakdown of subtotal, VAT, and total

### Creating Custom Services

1. Click "Add Custom Service" button in the header
2. Fill in the service details:
   - Service name (e.g., "Web Development")
   - Category (select from existing categories)
   - Base price in Naira
   - VAT rate percentage (0-100%)
   - Service description
3. Click "Create Service" (enabled only when all fields are valid)
4. Your custom service appears at the top of the product list
5. Custom services are marked with a purple "Custom" badge

### Managing Custom Services

1. Locate your custom service (marked with "Custom" badge)
2. Click the three-dot menu icon
3. Choose "Edit Service" to modify details
4. Choose "Delete Service" and confirm to remove

## Nigerian VAT Compliance

This calculator follows the Nigerian Federal Inland Revenue Service (FIRS) VAT
guidelines:

- Standard VAT rate: 7.5%
- Proper categorization of goods and services
- Zero-rating for exports and exempt items
- Clear display of VAT amounts

## Performance Optimizations

- React Query caching for product data
- Memoized calculations to prevent unnecessary re-renders
- Optimized re-renders with Zustand selectors
- Lazy loading of components
- Efficient form validation
- localStorage persistence for custom services

## Data Persistence

Custom services are automatically saved to browser localStorage and will persist
across:

- Page refreshes
- Browser restarts
- Session changes

Data is stored under the key `custom-vat-products` and includes all custom
service details.

## Future Enhancements

- [ ] Export calculations to PDF
- [ ] Save calculation history
- [ ] Multi-currency support
- [ ] Bulk product import
- [ ] Bulk custom service import/export
- [ ] Invoice generation
- [ ] Print-friendly layouts
- [ ] Advanced reporting
- [ ] Custom service templates
- [ ] Service duplication feature

## Scripts Reference

| Command              | Description              |
| -------------------- | ------------------------ |
| `pnpm dev`           | Start development server |
| `pnpm build`         | Create production build  |
| `pnpm start`         | Start production server  |
| `pnpm lint`          | Run ESLint               |
| `pnpm test`          | Run Vitest tests         |
| `pnpm test:ui`       | Run tests with UI        |
| `pnpm test:coverage` | Generate coverage report |

## License

MIT

## Author

Built as part of the PwC Frontend Assessment

## Assessment Notes

This project demonstrates proficiency in:

- Modern React patterns and hooks
- TypeScript type safety
- State management (Zustand with persistence)
- Server/Client component architecture (Next.js App Router)
- Form handling and validation (React Hook Form + Zod)
- Unit testing with Vitest
- Responsive design with Tailwind CSS
- Component composition with Radix UI
- Real-world business logic implementation
- Data persistence with localStorage
- CRUD operations for user-generated content
- Accessibility best practices
