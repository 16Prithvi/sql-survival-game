# SQL Survival - Backend Integration Contracts

## Overview
Convert mock SQL execution to real SQLite database using sql.js for browser-based SQL execution.

## API Contracts & Data Flow

### 1. Database Setup & Initialization
**Current Mock**: `mockData.js` with hardcoded table data
**Target**: Real SQLite database with sql.js

**Implementation**:
- Install `sql.js` library for browser-based SQLite
- Create database initialization functions for each zone
- Load zone-specific databases on game page mount

### 2. Query Execution System
**Current Mock**: `executeQuery()` in GameContext with pattern matching
**Target**: Real SQL execution with result validation

**Backend Functions Needed**:
```javascript
// utils/sqlEngine.js
- initializeZoneDatabase(zone) -> SQLite Database
- executeUserQuery(query, database) -> { success, result, error }
- validateQueryResult(userResult, expectedResult) -> boolean
```

### 3. Database Schema Per Zone

#### Beach Zone Tables:
```sql
CREATE TABLE survivors (
    survivor_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    profession TEXT,
    health_status TEXT
);

CREATE TABLE crashed_supplies (
    item_id INTEGER PRIMARY KEY,
    item_name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER,
    condition TEXT
);

CREATE TABLE logbook_entries (
    entry_id INTEGER PRIMARY KEY,
    author_id INTEGER,
    log_text TEXT,
    entry_date DATE,
    FOREIGN KEY (author_id) REFERENCES survivors (survivor_id)
);
```

#### Jungle Zone Tables:
```sql
CREATE TABLE island_fauna (
    fauna_id INTEGER PRIMARY KEY,
    creature_name TEXT,
    diet_type TEXT,
    is_hostile INTEGER,
    habitat_zone TEXT
);

CREATE TABLE island_flora (
    flora_id INTEGER PRIMARY KEY,
    plant_name TEXT,
    is_edible INTEGER,
    plant_type TEXT,
    discovered_by INTEGER,
    FOREIGN KEY (discovered_by) REFERENCES survivors (survivor_id)
);

CREATE TABLE expedition_logs (
    log_id INTEGER PRIMARY KEY,
    leader_id INTEGER,
    zone_explored TEXT,
    duration_hours INTEGER,
    resources_found TEXT,
    FOREIGN KEY (leader_id) REFERENCES survivors (survivor_id)
);
```

#### Ruins Zone Tables:
```sql
CREATE TABLE ancient_relics (
    relic_id INTEGER PRIMARY KEY,
    relic_name TEXT,
    material TEXT,
    estimated_age_years INTEGER,
    ruin_location TEXT
);

CREATE TABLE glyph_translations (
    glyph_id INTEGER PRIMARY KEY,
    glyph_symbol TEXT,
    meaning TEXT,
    found_on_relic_id INTEGER,
    FOREIGN KEY (found_on_relic_id) REFERENCES ancient_relics(relic_id)
);

CREATE TABLE celestial_events (
    event_id INTEGER PRIMARY KEY,
    event_name TEXT,
    event_date DATE,
    observation_notes TEXT
);
```

### 4. Task System Integration
**Current Mock**: `mockData.tasks` object with predefined queries
**Target**: Dynamic task loading with real expected results

**Task Structure**:
```javascript
{
  level: 1,
  title: "Check Survivors",
  description: "First things first, get a list of all survivors.",
  hint: "Use SELECT * to get all columns from the survivors table.",
  expectedQuery: "SELECT * FROM survivors;",
  storyText: "You wake up on a sandy beach...",
  expectedResult: [] // Generated from executing expectedQuery
}
```

### 5. Frontend Integration Points

#### GameContext Updates:
- Replace `mockData.executeQuery()` with real SQL execution
- Update `mockData.getSchema()` to query actual database schema
- Replace hardcoded task data with dynamic loading

#### GamePage Component Updates:
- Initialize zone database on component mount
- Update query execution to use real SQL engine
- Enhanced error handling for SQL syntax errors
- Real-time result validation

### 6. Query Validation Logic
**Current**: Simple JSON string comparison
**Target**: Sophisticated result comparison

**Validation Features**:
- Compare result sets (order-independent for SELECT *)
- Handle different column orders
- Support partial matches for specific columns
- Provide detailed feedback on incorrect results

### 7. Progress Tracking Enhancement
**Current**: localStorage with mock completion
**Target**: Enhanced progress with query statistics

**Enhanced Progress Data**:
```javascript
{
  unlockedZones: ['beach', 'jungle'],
  progress: {
    beach: [
      {
        level: 1,
        status: 'completed',
        attempts: 1,
        bestQuery: 'SELECT * FROM survivors;',
        completionTime: 45000, // milliseconds
        hints_used: 0
      }
    ]
  }
}
```

### 8. Error Handling & User Experience
**Improvements Needed**:
- Detailed SQL error messages with helpful suggestions
- Query syntax highlighting and auto-completion
- Performance metrics (query execution time)
- Advanced hint system based on common mistakes

## Implementation Plan

### Phase 1: SQL Engine Setup
1. Install sql.js library
2. Create database initialization utilities
3. Set up all zone databases with sample data

### Phase 2: Core Integration
1. Replace mock executeQuery with real SQL execution
2. Update GameContext to use SQL engine
3. Implement result validation logic

### Phase 3: Enhanced Features
1. Improve error handling and user feedback
2. Add query performance metrics
3. Implement advanced hint system

### Phase 4: Testing & Polish
1. Test all 50 tasks across 3 zones
2. Validate query results accuracy
3. Performance optimization

## Dependencies to Install
```bash
yarn add sql.js
```

## Files to Modify
- `src/utils/sqlEngine.js` (new)
- `src/utils/databaseSetup.js` (new)
- `src/context/GameContext.js` (update)
- `src/utils/mockData.js` (replace with real tasks)
- `src/pages/GamePage.js` (minor updates)

## Success Criteria
- All SQL queries execute against real SQLite databases
- Query validation provides accurate feedback
- Database schema browsing shows real table structures
- Performance remains smooth (< 100ms query execution)
- All 50 tasks work correctly across 3 zones