// Mock data for SQL Survival game
export const mockData = {
  // Zone data with tables and sample results
  zones: {
    beach: {
      name: "The Beach",
      description: "Learn basic SQL commands while organizing survivors and supplies",
      tables: {
        survivors: [
          { survivor_id: 1, name: 'Captain Eva', age: 45, profession: 'Captain', health_status: 'Injured' },
          { survivor_id: 2, name: 'Ben Carter', age: 32, profession: 'Engineer', health_status: 'Good' },
          { survivor_id: 3, name: 'Dr. Aris', age: 51, profession: 'Doctor', health_status: 'Good' },
          { survivor_id: 4, name: 'Lina', age: 28, profession: 'Botanist', health_status: 'Good' },
          { survivor_id: 5, name: 'Marcus', age: 38, profession: 'Cook', health_status: 'Injured' }
        ],
        crashed_supplies: [
          { item_id: 101, item_name: 'Canned Beans', category: 'Food', quantity: 20, condition: 'Usable' },
          { item_id: 102, item_name: 'Bandages', category: 'Medical', quantity: 15, condition: 'Usable' },
          { item_id: 103, item_name: 'Hammer', category: 'Tool', quantity: 1, condition: 'Usable' },
          { item_id: 104, item_name: 'Tarp', category: 'Material', quantity: 2, condition: 'Damaged' },
          { item_id: 105, item_name: 'Fresh Water Cask', category: 'Food', quantity: 5, condition: 'Usable' },
          { item_id: 106, item_name: 'Painkillers', category: 'Medical', quantity: 30, condition: 'Usable' },
          { item_id: 107, item_name: 'Rope', category: 'Material', quantity: 50, condition: 'Usable' }
        ],
        logbook_entries: [
          { entry_id: 201, author_id: 1, log_text: 'The storm came out of nowhere. The ship is lost.', entry_date: '2025-09-15' },
          { entry_id: 202, author_id: 2, log_text: 'Managed to salvage some engine parts. Might be useful.', entry_date: '2025-09-15' },
          { entry_id: 203, author_id: 1, log_text: 'We seem to be on a deserted island. I need to check on the crew.', entry_date: '2025-09-16' }
        ]
      }
    },
    jungle: {
      name: "The Jungle",
      description: "Master intermediate SQL while exploring wildlife and expeditions",
      tables: {
        island_fauna: [
          { fauna_id: 301, creature_name: 'Island Macaw', diet_type: 'Herbivore', is_hostile: 0, habitat_zone: 'Canopy' },
          { fauna_id: 302, creature_name: 'Ridgeback Boar', diet_type: 'Omnivore', is_hostile: 1, habitat_zone: 'Jungle Floor' },
          { fauna_id: 303, creature_name: 'Glimmerfrog', diet_type: 'Carnivore', is_hostile: 0, habitat_zone: 'River' }
        ],
        island_flora: [
          { flora_id: 401, plant_name: 'Sunfruit', is_edible: 1, plant_type: 'Fruit', discovered_by: 4 },
          { flora_id: 402, plant_name: 'Glow Mushroom', is_edible: 0, plant_type: 'Fungus', discovered_by: 3 }
        ],
        expedition_logs: [
          { log_id: 501, leader_id: 4, zone_explored: 'Northern Jungle', duration_hours: 5, resources_found: 'Found a patch of strange fruit.' }
        ]
      }
    },
    ruins: {
      name: "The Ruins",
      description: "Advanced SQL techniques to decode ancient mysteries",
      tables: {
        ancient_relics: [
          { relic_id: 601, relic_name: 'Sun Dial', material: 'Stone', estimated_age_years: 2500, ruin_location: 'Observatory' },
          { relic_id: 602, relic_name: 'Harvest Totem', material: 'Obsidian', estimated_age_years: 2200, ruin_location: 'Ceremonial Hall' }
        ],
        glyph_translations: [
          { glyph_id: 701, glyph_symbol: '☉', meaning: 'Sun', found_on_relic_id: 601 }
        ],
        celestial_events: [
          { event_id: 801, event_name: 'Great Comet', event_date: '0525-03-15', observation_notes: 'A star with a long tail crossed the sky. The harvest was plentiful.' }
        ]
      }
    }
  },

  // Mock tasks for each zone
  tasks: {
    beach: [
      {
        level: 1,
        title: "Check Survivors",
        description: "First things first, get a list of all survivors.",
        hint: "Use SELECT * to get all columns from the survivors table.",
        expectedQuery: "SELECT * FROM survivors;",
        storyText: "You wake up on a sandy beach, disoriented. The ship is nowhere to be seen. You need to check who else survived the crash."
      },
      {
        level: 2,
        title: "Survivor Roles",
        description: "We need to know who is who. List just the name and profession of each survivor.",
        hint: "Use SELECT with specific column names separated by commas.",
        expectedQuery: "SELECT name, profession FROM survivors;"
      },
      {
        level: 3,
        title: "Triage the Wounded",
        description: "Find all survivors who are injured.",
        hint: "Use WHERE clause to filter by health_status.",
        expectedQuery: "SELECT * FROM survivors WHERE health_status = 'Injured';"
      }
      // More tasks would continue...
    ]
  },

  // Mock query execution
  executeQuery: (query, zone) => {
    // Simplified mock execution - return sample data based on query patterns
    const zoneData = mockData.zones[zone];
    if (!zoneData) return [];

    const lowerQuery = query.toLowerCase().trim();
    
    if (lowerQuery.includes('select * from survivors')) {
      return zoneData.tables.survivors || [];
    } else if (lowerQuery.includes('select name, profession from survivors')) {
      return (zoneData.tables.survivors || []).map(s => ({ name: s.name, profession: s.profession }));
    } else if (lowerQuery.includes("where health_status = 'injured'")) {
      return (zoneData.tables.survivors || []).filter(s => s.health_status === 'Injured');
    } else if (lowerQuery.includes('select * from crashed_supplies')) {
      return zoneData.tables.crashed_supplies || [];
    }
    
    // Default return first table data
    const firstTable = Object.values(zoneData.tables)[0] || [];
    return firstTable.slice(0, 3); // Limit results for demo
  },

  // Get expected result for validation
  getExpectedResult: (zone, level) => {
    const task = mockData.tasks[zone]?.[level - 1];
    if (!task) return [];
    
    return mockData.executeQuery(task.expectedQuery, zone);
  },

  // Get database schema for a zone
  getSchema: (zone) => {
    const zoneData = mockData.zones[zone];
    if (!zoneData) return {};
    
    return Object.keys(zoneData.tables).reduce((schema, tableName) => {
      const table = zoneData.tables[tableName];
      if (table.length > 0) {
        schema[tableName] = Object.keys(table[0]);
      }
      return schema;
    }, {});
  }
};