# Playwright Testing Framework - Montana Hardcore Inventory

This repository includes comprehensive E2E testing coverage using Playwright for the Montana Hardcore Inventory application.

## Overview

The testing framework provides complete validation of the 5 completed user stories:
- **US-001**: Color Grid Display and Inventory Visualization
- **US-002**: Modal-based Quantity Management  
- **US-006**: LocalStorage Data Persistence
- **US-007**: Responsive Design (Mobile/Desktop)
- **US-008**: Error Handling and Recovery

## Test Architecture

### Cross-Browser Testing
Tests run across multiple browsers and devices:
- **Desktop**: Chromium, Firefox, WebKit
- **Mobile**: Chrome (Pixel 7), Safari (iPhone 14)
- **Tablet**: iPad Pro

### Test Structure
```
tests/
├── e2e/                           # End-to-end test suites
│   ├── inventory-management.spec.ts    # US-001: Color grid & visualization
│   ├── quantity-modal.spec.ts          # US-002: Modal interactions
│   ├── data-persistence.spec.ts        # US-006: LocalStorage persistence
│   ├── responsive-design.spec.ts       # US-007: Mobile/desktop responsive
│   └── error-handling.spec.ts          # US-008: Error scenarios
├── utils/                         # Test utilities and helpers
│   ├── test-helpers.ts                 # Common test utilities
│   ├── page-objects/                   # Page Object Models
│   │   ├── ColorGridPage.ts           # Color grid interactions
│   │   └── QuantityModalPage.ts       # Modal management
│   └── fixtures/                       # Test data and constants
│       └── test-data.ts               # Montana Hardcore test data
└── playwright.config.ts          # Playwright configuration
```

## Key Features

### 🎯 **E2E Test Coverage (Priority 1)**
- Complete inventory management workflows
- Modal-based quantity modification (increment/decrement, save/cancel)
- LocalStorage persistence across browser sessions
- Responsive behavior on multiple screen sizes
- Error handling and recovery scenarios

### 📱 **Responsive Testing**
- Mobile device emulation (375×667, 414×896)
- Tablet testing (768×1024, 1024×768)
- Desktop viewports (1200×800, 1920×1080)
- Touch interaction validation (minimum 44px targets)

### 🧪 **Page Object Models**
- **ColorGridPage**: Handles color grid interactions and navigation
- **QuantityModalPage**: Manages modal-based quantity operations
- Reusable, maintainable test components

### 🛠️ **Test Utilities**
- Application state management (localStorage manipulation)
- Screenshot capture for visual verification
- Responsive design validation helpers
- Test data fixtures with Montana Hardcore colors

## Available Scripts

```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with interactive UI
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Show test report
npm run test:report
```

## Test Scenarios

### US-001: Inventory Management
- ✅ Display all 128 Montana Hardcore colors
- ✅ Verify color card structure (RV codes, names, quantities)
- ✅ Test inventory statistics and state management
- ✅ Validate responsive grid layout

### US-002: Quantity Modal
- ✅ Open/close modal interactions
- ✅ Increment/decrement quantity controls
- ✅ Input validation (min: 0, max: 999)
- ✅ Save/cancel functionality
- ✅ Keyboard navigation (Escape, Enter)

### US-006: Data Persistence  
- ✅ LocalStorage save/load operations
- ✅ Data recovery from corruption
- ✅ Cross-session persistence validation
- ✅ Large dataset handling

### US-007: Responsive Design
- ✅ Mobile viewport testing (375×667)
- ✅ Tablet viewport testing (768×1024) 
- ✅ Desktop viewport testing (1200×800+)
- ✅ Touch interaction validation
- ✅ Portrait/landscape orientation support

### US-008: Error Handling
- ✅ Corrupted localStorage recovery
- ✅ Storage unavailability graceful degradation
- ✅ Network connectivity issues
- ✅ Invalid input validation

## Configuration

The Playwright configuration (`playwright.config.ts`) includes:

- **Cross-browser support**: Chromium, Firefox, WebKit
- **Mobile emulation**: iPhone 14, Pixel 7, iPad Pro
- **Vite integration**: Automatic dev server management
- **Visual testing**: Screenshots and video recording on failure
- **Parallel execution**: Optimized test performance
- **TypeScript support**: Full type safety throughout

## Running Tests

### Prerequisites
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Development Testing
```bash
# Start the dev server
npm run dev

# Run tests (in another terminal)
npm test

# Run specific test file
npx playwright test inventory-management.spec.ts

# Run tests for specific browser
npx playwright test --project=chromium

# Run tests for mobile devices
npx playwright test --project="Mobile Chrome"
```

### CI/CD Integration
The configuration automatically handles browser installation and server management for continuous integration environments.

## Test Data

The test suite includes comprehensive fixtures:
- **Montana Hardcore color codes**: All 128 colors with RV codes
- **Inventory scenarios**: Empty, full, mixed stock levels
- **Viewport configurations**: Mobile, tablet, desktop sizes
- **Error simulation data**: Corrupted storage, network failures

## Visual Testing

- **Screenshots**: Automatically captured on test failures
- **Video recording**: Full session recording for debugging
- **Responsive verification**: Visual validation across screen sizes
- **Mobile interaction testing**: Touch-friendly UI validation

## Best Practices

- **Page Object Models**: Reusable, maintainable test components
- **Test isolation**: Each test starts with clean state
- **Cross-browser validation**: Consistent behavior verification
- **Error scenario coverage**: Comprehensive failure testing
- **Performance consideration**: Parallel execution optimization

## Troubleshooting

### Common Issues
1. **Browser installation failures**: Use `npx playwright install --force`
2. **Port conflicts**: Ensure port 3000 is available or update config
3. **Test timeouts**: Increase timeout values for slower environments
4. **Mobile testing**: Verify touch target sizes (minimum 44px)

### Debug Mode
```bash
# Run single test in debug mode
npx playwright test --debug inventory-management.spec.ts

# Run with headed browser
npx playwright test --headed

# Use the test generator
npx playwright codegen http://localhost:3000
```

## Future Enhancements

- **Visual regression testing**: Automated screenshot comparison
- **Performance testing**: Load time and interaction metrics
- **Accessibility testing**: Screen reader and keyboard navigation
- **API testing**: Backend integration validation
- **Component testing**: Isolated component behavior validation

## Integration with Application

The test suite is fully integrated with the existing:
- **TypeScript + Vite** build system
- **Lit-HTML** component architecture  
- **Montana Hardcore** color database
- **LocalStorage** persistence layer
- **Responsive CSS** framework

This testing framework ensures high-quality, reliable functionality across all supported platforms and devices for the Montana Hardcore Inventory application.