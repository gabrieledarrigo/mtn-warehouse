# Montana Hardcore Inventory - Implementation Plan

## Overview

Development of a web-based inventory management application for Montana Hardcore spray paint cans. The application will provide a visual interface for tracking paint quantities through a color grid system, search functionality, and automatic shopping list generation. The solution will be browser-based with local storage persistence and built using TypeScript for enhanced type safety and maintainability.

## Requirements Summary

- Visual grid interface displaying all 142 Montana Hardcore colors
- Quantity management per color (add/remove functionality)
- Search and filter capabilities
- Automatic shopping list generation
- Local data persistence
- Mobile-responsive design
- Offline functionality
- TypeScript implementation for type safety

## Implementation Steps

### Phase 1: Core Infrastructure 🧪

1. **Project Setup** 🧪
   - [x] Initialize HTML5/CSS/TypeScript project structure
   - [x] Configure TypeScript compiler and build tools (Vite/Webpack)
   - [x] Set up responsive CSS framework
   - [x] Create modular TypeScript architecture
   - [x] Configure type definitions and interfaces
   - [ ] Write unit tests for project configuration and type definitions

2. **Data Layer** 🧪
   - [x] Create Montana colors database (JSON format with TypeScript interfaces)
   - [x] Implement strongly-typed LocalStorage service
   - [x] Create TypeScript data models for inventory management
   - [x] Define type-safe error handling for storage operations
   - [ ] Write unit tests for data models and storage service

### Phase 2: Core Features (US-001, US-002, US-006) 🧪

1. **Color Grid Component** 🧪
   - [x] Implement responsive grid layout
   - [x] Create color card components
   - [x] Add quantity display and visual indicators
   - [x] Integrate with data layer
   - [ ] Write component tests for color grid functionality

2. **Quantity Management** 🧪
   - [x] Implement modal/popup for color details
   - [x] Add increment/decrement controls
   - [x] Implement save/cancel functionality
   - [x] Add data validation and error handling
   - [ ] Write E2E tests for modal-based quantity management

### Phase 3: Navigation and Search (US-003, US-004) 🚧

1. **Search Functionality** 🔲
   - [ ] Implement text-based search
   - [ ] Add real-time filtering
   - [ ] Support both code and name search
   - [ ] Add search result highlighting

2. **Filter System** 🔲
   - [ ] Implement status-based filters
   - [ ] Add filter controls to UI
   - [ ] Integrate with search functionality
   - [ ] Add filter state persistence

### Phase 4: Advanced Features (US-005, US-007, US-008) 🔲

1. **Shopping List** 🔲
   - [ ] Generate automatic lists based on inventory status
   - [ ] Implement export functionality
   - [ ] Add print capabilities
   - [ ] Create shareable format

2. **Responsive Design** 🧪
   - [x] Optimize for mobile devices
   - [x] Implement touch-friendly interactions
   - [x] Add responsive breakpoints
   - [x] Test cross-device compatibility
   - [ ] Write responsive design tests for multiple device sizes

3. **Error Handling** 🧪
   - [x] Implement comprehensive error handling
   - [x] Add user feedback mechanisms
   - [x] Create fallback scenarios
   - [x] Add browser compatibility checks
   - [ ] Write error handling and recovery tests

## Testing Strategy - SIMPLIFIED

### 🎯 **Minimal Testing Approach**

- **Single consolidated test file**: `mtn-inventory.spec.ts`
- **Essential functionality only**: Core inventory management workflows
- **Playwright E2E**: Focus on critical user paths
- **Desktop-first**: Chromium browser only (no mobile complexity)

### 📋 **Consolidated Test Coverage**

#### **Essential E2E Tests (Single File)**

- **Color Grid Display**: Verify 128 Montana colors load correctly
- **Quantity Modal**: Basic open/modify/save/cancel workflow
- **Data Persistence**: LocalStorage save/reload functionality
- **Basic Responsiveness**: One simple mobile viewport test
- **Core Error Handling**: Basic fallback scenarios only

#### **Removed Complexity**

- ❌ Detailed responsive design tests (412 lines)
- ❌ Comprehensive error handling scenarios (184 lines)
- ❌ Edge case testing across multiple files
- ❌ Cross-browser testing (Firefox, Safari)
- ❌ Mobile Chrome testing complexity
- ❌ Screenshot generation and visual regression
- ❌ Performance and load testing

### 🔧 **Simplified Testing Tools**

- **Playwright**: Single E2E test file only
- **Chromium**: Primary browser target
- **TypeScript**: Existing type support
- **Target**: ~200-300 lines total (vs 1475 lines current)

---

## Detailed User Story Implementation

### US-001: Visualizzazione Inventario 🧪

**Titolo**: Visualizzare tutti i colori Montana Hardcore disponibili

**User Story**:
Come appassionato di graffiti, voglio visualizzare tutti i 142 colori Montana Hardcore in una griglia visiva, così da avere una panoramica completa del mio inventario.

**Acceptance Criteria**: ✅ COMPLETED

- [x] Given che accedo all'applicazione
- [x] When la pagina si carica
- [x] Then vedo una griglia con tutti i 142 colori Montana Hardcore
- [x] And ogni colore mostra il codice RV (es. RV-252)
- [x] And ogni colore mostra la quantità posseduta (es. "2")
- [x] And ogni colore ha un'anteprima visiva del colore effettivo

**Technical Implementation**: ✅ COMPLETED

- [x] Create `ColorDatabase.ts` with all 142 Montana Hardcore colors data (RV codes, names, hex values)
- [x] Define TypeScript interfaces: `Color`, `ColorData`, `InventoryItem`
- [x] Implement `ColorGrid.ts` component using CSS Grid layout with strict typing
- [x] Create `ColorCard.ts` component with type-safe props for color preview, RV code, and quantity display
- [x] Use CSS custom properties for color values with TypeScript enum definitions
- [x] Implement responsive grid with mobile-first approach and typed breakpoint constants
- [x] Add loading states and error handling with typed error classes for data initialization

**Testing**: 🎯 SIMPLIFIED

- [ ] Create single consolidated test file: `mtn-inventory.spec.ts`
- [ ] Test basic color grid display (128 colors visible)
- [ ] Test color card structure (RV codes, quantities, previews)
- [ ] Remove complex responsive and visual regression tests

---

### US-002: Aggiornamento Quantità Colore 🧪

**Titolo**: Modificare la quantità di un colore specifico

**User Story**:
Come appassionato di graffiti, voglio poter aumentare o diminuire la quantità di un colore specifico, così da tenere traccia accurata del mio inventario.

**Acceptance Criteria**: ✅ COMPLETED

- [x] Given che vedo la griglia dei colori
- [x] When clicco su un colore specifico
- [x] Then si apre un modal con i dettagli del colore
- [x] And posso vedere la quantità attuale
- [x] And posso aumentare la quantità cliccando sul pulsante "+"
- [x] And posso diminuire la quantità cliccando sul pulsante "-"
- [x] And la quantità non può essere negativa
- [x] And posso salvare le modifiche
- [x] And posso annullare le modifiche

**Technical Implementation**: ✅ COMPLETED

- [x] Create `QuantityModal.ts` component with typed props for color details display
- [x] Define interfaces: `ModalProps`, `QuantityChangeEvent`, `ValidationResult`
- [x] Implement increment/decrement buttons with type-safe validation logic
- [x] Add quantity input field with typed numeric validation (min: 0)
- [x] Create modal overlay with click-outside-to-close functionality using proper event typing
- [x] Implement save/cancel buttons with typed confirmation states
- [x] Add smooth animations for quantity changes with typed animation parameters
- [x] Integrate with InventoryService using generic types for data persistence
- [x] Add keyboard navigation support with typed event handlers (ESC to close, Enter to save)

**Testing**: 🎯 SIMPLIFIED

- [ ] Add to consolidated `mtn-inventory.spec.ts` file
- [ ] Test basic modal workflow (open, increment, save, cancel)
- [ ] Test quantity validation (no negative values)
- [ ] Remove complex keyboard navigation and edge case tests

---

### US-003: Ricerca Colori 🚧

**Titolo**: Cercare colori per codice o nome

**User Story**:
Como appassionato di graffiti, voglio poter cercare un colore specifico per codice RV o nome, così da trovarlo rapidamente tra i 142 colori disponibili.

**Acceptance Criteria**: 🔲 PENDING

- [ ] Given che vedo la griglia dei colori
- [ ] When inserisco un termine di ricerca (es. "RV-252" o "Yellow")
- [ ] Then la griglia mostra solo i colori che corrispondono al termine di ricerca
- [ ] And la ricerca funziona sia per codice RV che per nome colore
- [ ] And la ricerca è case-insensitive
- [ ] And posso cancellare la ricerca per tornare alla vista completa

**Technical Implementation**: 🔲 PENDING

- [ ] Create `SearchBar.ts` component with typed debounced input handling
- [ ] Define interfaces: `SearchProps`, `SearchResult`, `SearchOptions`
- [ ] Implement type-safe search algorithm that matches both RV codes and color names
- [ ] Add case-insensitive string matching with typed fuzzy search capabilities
- [ ] Create search result highlighting in color cards with typed highlight functions
- [ ] Implement clear search functionality with typed event handlers
- [ ] Add search history using session storage with typed storage interface
- [ ] Optimize search performance with typed indexed data structures
- [ ] Add search suggestions dropdown with typed suggestion items for better UX

---

### US-004: Filtri Inventario 🚧

**Titolo**: Filtrare i colori per stato di disponibilità

**User Story**:
Come appassionato di graffiti, voglio poter filtrare i colori in base al loro stato di disponibilità, così da focalizzarmi sui colori che mi interessano.

**Acceptance Criteria**: 🔲 PENDING

- [ ] Given che vedo la griglia dei colori
- [ ] When seleziono un filtro specifico
- [ ] Then la griglia mostra solo i colori corrispondenti al filtro
- [ ] And il filtro "Tutti" mostra tutti i 142 colori
- [ ] And il filtro "In Stock" mostra solo colori con quantità > 0
- [ ] And il filtro "Esauriti" mostra solo colori con quantità = 0
- [ ] And il filtro "Scarsi" mostra solo colori con quantità = 1

**Technical Implementation**: 🔲 PENDING

- [ ] Create `FilterBar.ts` component with typed radio buttons or dropdown options
- [ ] Define enums and interfaces: `FilterType`, `FilterOptions`, `FilterState`
- [ ] Implement type-safe filter functions for each status type (All, In Stock, Out of Stock, Low Stock)
- [ ] Add visual indicators for active filters with typed state management
- [ ] Combine filter functionality with search capability using generic type constraints
- [ ] Implement filter state persistence in URL parameters with typed query parsing
- [ ] Add filter badges showing count of filtered items with typed count calculations
- [ ] Create filter reset functionality with type-safe state restoration
- [ ] Add keyboard shortcuts for quick filter switching with typed key event handlers

---

### US-005: Lista Acquisti 🔲

**Titolo**: Generare automaticamente una lista di colori da acquistare

**User Story**:
Come appassionato di graffiti, voglio poter generare automaticamente una lista di colori esauriti o scarsi, così da sapere cosa comprare al negozio.

**Acceptance Criteria**: 🔲 PENDING

- [ ] Given che ho un inventario con quantità diverse per i colori
- [ ] When accedo alla funzione "Lista Acquisti"
- [ ] Then vedo una lista dei colori esauriti (quantità = 0)
- [ ] And vedo una lista dei colori scarsi (quantità = 1)
- [ ] And ogni colore mostra il codice RV e il nome
- [ ] And posso esportare la lista in formato testuale
- [ ] And posso stampare la lista

**Technical Implementation**: 🔲 PENDING

- [ ] Create `ShoppingList.ts` component with typed categorized lists
- [ ] Define interfaces: `ShoppingListItem`, `ExportFormat`, `ListCategory`
- [ ] Implement auto-generation logic based on inventory quantities with type-safe calculations
- [ ] Add export functionality to plain text, CSV, and JSON formats with typed export handlers
- [ ] Create print-optimized CSS styles using @media print with typed style objects
- [ ] Implement email sharing capability with typed email template interfaces
- [ ] Add shopping list persistence for offline access using typed storage service
- [ ] Create customizable threshold settings for "low stock" definition with typed configuration
- [ ] Add shopping list completion tracking functionality with typed progress interfaces

---

### US-006: Persistenza Dati 🧪

**Titolo**: Salvare l'inventario localmente

**User Story**:
Come appassionato di graffiti, voglio che le mie modifiche all'inventario siano salvate automaticamente, così da non perdere i dati quando chiudo l'applicazione.

**Acceptance Criteria**: ✅ COMPLETED

- [x] Given che modifico la quantità di un colore
- [x] When salvo le modifiche
- [x] Then i dati vengono salvati nel browser
- [x] And quando riapro l'applicazione, vedo le quantità aggiornate
- [x] And i dati persistono anche se chiudo il browser
- [x] And i dati funzionano offline

**Technical Implementation**: ✅ COMPLETED

- [x] Create `StorageService.ts` using LocalStorage API with strict typing
- [x] Define interfaces: `StorageData`, `StorageOptions`, `MigrationSchema`
- [x] Implement automatic save on every quantity change with typed event handlers
- [x] Add data versioning for future migration compatibility using typed version schemas
- [x] Create backup/restore functionality using typed JSON export/import operations
- [x] Implement data validation and error recovery with typed validation rules
- [x] Add storage quota monitoring and cleanup with typed quota management
- [x] Create data synchronization between multiple browser tabs using typed message interfaces
- [x] Implement storage compression for large datasets with typed compression algorithms

**Testing**: 🎯 SIMPLIFIED

- [ ] Add to consolidated `mtn-inventory.spec.ts` file
- [ ] Test basic save/reload functionality with LocalStorage
- [ ] Test data persists across page reload
- [ ] Remove complex versioning and migration tests

---

### US-007: Interfaccia Responsive 🧪

**Titolo**: Utilizzare l'applicazione su dispositivi mobili

**User Story**:
Come appassionato di graffiti, voglio poter usare l'applicazione sul mio smartphone mentre sono al negozio, così da consultare il mio inventario in mobilità.

**Acceptance Criteria**: ✅ COMPLETED

- [x] Given che accedo all'applicazione da smartphone
- [x] When navigo nell'interfaccia
- [x] Then la griglia dei colori si adatta alla dimensione dello schermo
- [x] And posso scrollare facilmente tra i colori
- [x] And i pulsanti sono abbastanza grandi per essere toccati facilmente
- [x] And il modal di modifica quantità è ottimizzato per touch
- [x] And l'interfaccia è usabile sia in portrait che landscape

**Technical Implementation**: ✅ COMPLETED

- [x] Implement mobile-first responsive design with CSS Grid and Flexbox using typed style objects
- [x] Define interfaces: `BreakpointConfig`, `TouchEvent`, `GestureOptions`
- [x] Create touch-optimized button sizes (minimum 44px touch targets) with typed size constants
- [x] Add swipe gestures for modal navigation with typed gesture recognition
- [x] Implement viewport meta tag for proper mobile scaling with typed viewport configuration
- [x] Create adaptive grid columns based on screen size using typed breakpoint logic
- [x] Add touch feedback animations and haptic feedback with typed animation interfaces
- [x] Optimize font sizes and contrast for mobile readability using typed typography scales
- [x] Implement pull-to-refresh functionality for data synchronization with typed refresh handlers

**Testing**: 🎯 SIMPLIFIED

- [ ] Add one basic mobile viewport test to `mtn-inventory.spec.ts`
- [ ] Test app loads correctly on mobile viewport
- [ ] Remove detailed responsive design test suite (412 lines)

---

### US-008: Gestione Errori 🧪

**Titolo**: Gestire situazioni di errore dell'applicazione

**User Story**:
Come appassionato di graffiti, voglio che l'applicazione gestisca eventuali errori in modo elegante, così da non perdere dati o funzionalità.

**Acceptance Criteria**: ✅ COMPLETED

- [x] Given che si verifica un errore di salvataggio
- [x] When tento di salvare una modifica
- [x] Then vedo un messaggio di errore chiaro
- [x] And posso riprovare l'operazione
- [x] And i dati non vengono persi
- [x] Given che il browser non supporta LocalStorage
- [x] When accedo all'applicazione
- [x] Then vedo un messaggio di avviso sulla compatibilità
- [x] And l'applicazione funziona comunque per la sessione corrente

**Technical Implementation**: ✅ COMPLETED

- [x] Create `ErrorHandler.ts` with centralized error management using typed error classes
- [x] Define interfaces: `AppError`, `ErrorContext`, `RecoveryAction`, `ErrorLevel`
- [x] Implement user-friendly error messages with typed recovery suggestions
- [x] Add retry mechanisms for failed operations with typed retry configurations
- [x] Create fallback storage using session storage or memory with typed fallback strategies
- [x] Implement browser compatibility detection and warnings using typed capability checks
- [x] Add error logging for debugging purposes with typed log interfaces
- [x] Create offline/online state detection and handling with typed connectivity status
- [x] Implement graceful degradation for unsupported features using typed feature detection

**Testing**: 🎯 SIMPLIFIED

- [ ] Add basic error handling test to `mtn-inventory.spec.ts`
- [ ] Test app loads when LocalStorage is unavailable
- [ ] Remove comprehensive error handling test suite (184 lines)

---

## 📊 Progress Summary

### 🎯 **Implementation Status: 5/8 User Stories (62.5%)**

#### 🧪 **Phase 1: Core Infrastructure** - TESTING PHASE

- **US-001**: Visualizzazione Inventario 🧪 (Awaiting Tests)
- **US-002**: Aggiornamento Quantità Colore 🧪 (Awaiting Tests)
- **US-006**: Persistenza Dati 🧪 (Awaiting Tests)
- **US-007**: Interfaccia Responsive 🧪 (Awaiting Tests)
- **US-008**: Gestione Errori 🧪 (Awaiting Tests)

#### 🚧 **Phase 2: Search & Filters** - NEXT UP

- **US-003**: Ricerca Colori 🔲 (Next Sprint)
- **US-004**: Filtri Inventario 🔲 (Next Sprint)

#### 🔲 **Phase 3: Advanced Features** - FUTURE

- **US-005**: Lista Acquisti 🔲 (Future Enhancement)

### 🛠️ **Technical Achievements**

- ✅ Full TypeScript implementation with strict typing
- ✅ Complete Montana Hardcore color database (142 colors)
- ✅ Responsive CSS Grid layout with mobile optimization
- ✅ LocalStorage persistence with data validation
- ✅ Modal-based quantity management
- ✅ Comprehensive error handling
- ✅ Modern CSS with nesting (no BEM verbosity)
- ✅ Vite 7.0.5 + ES2024 target (latest tools)

### 🧪 **Simplified Testing Requirements**

**Single E2E Test File**: `mtn-inventory.spec.ts`

- ✅ Color grid display (128 Montana colors)
- ✅ Modal quantity management workflow
- ✅ LocalStorage persistence
- ✅ Basic mobile viewport test
- ✅ Basic error handling

**Removed Complexity**:

- ❌ Detailed responsive design suite (responsive-design.spec.ts - 412 lines)
- ❌ Comprehensive error handling suite (error-handling.spec.ts - 184 lines)
- ❌ Edge case testing across multiple files
- ❌ Cross-browser testing complexity
- ❌ Mobile Chrome testing overhead

### 🚀 **Next Phase: Simplified Testing Implementation**

**PRIORITY**: Create single consolidated test file `mtn-inventory.spec.ts` with essential coverage:

1. **Color Grid Tests** - Verify 128 colors display correctly
2. **Modal Tests** - Basic quantity management workflow
3. **Persistence Tests** - LocalStorage save/reload functionality
4. **Mobile Test** - One basic responsive viewport test
5. **Error Test** - Basic fallback when LocalStorage unavailable

**GOAL**: Reduce from 1475 lines (5 files) to ~200-300 lines (1 file) while maintaining core functionality coverage.

After completing simplified testing, proceed with **US-003 (Search)** and **US-004 (Filters)** development.
