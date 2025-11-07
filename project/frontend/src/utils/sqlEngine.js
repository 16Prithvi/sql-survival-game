import initSqlJs from 'sql.js';

let SQL = null;

// Initialize SQL.js
export const initializeSQL = async () => {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
  }
  return SQL;
};

// Create and populate database for a specific zone
export const createZoneDatabase = async (zone) => {
  const sql = await initializeSQL();
  const db = new sql.Database();

  // Execute zone-specific database setup
  switch (zone) {
    case 'beach':
      await setupBeachDatabase(db);
      break;
    case 'jungle':
      await setupJungleDatabase(db);
      break;
    case 'ruins':
      await setupRuinsDatabase(db);
      break;
    case 'lessons':
      await setupLessonsDatabase(db);
      break;
    default:
      throw new Error(`Unknown zone: ${zone}`);
  }

  return db;
};

// Beach zone database setup
const setupBeachDatabase = (db) => {
  // Create tables
  db.exec(`
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
  `);

  // Insert sample data
  db.exec(`
    INSERT INTO survivors (survivor_id, name, age, profession, health_status) VALUES
    (1, 'Captain Eva', 45, 'Captain', 'Injured'),
    (2, 'Ben Carter', 32, 'Engineer', 'Good'),
    (3, 'Dr. Aris', 51, 'Doctor', 'Good'),
    (4, 'Lina', 28, 'Botanist', 'Good'),
    (5, 'Marcus', 38, 'Cook', 'Injured');

    INSERT INTO crashed_supplies (item_id, item_name, category, quantity, condition) VALUES
    (101, 'Canned Beans', 'Food', 20, 'Usable'),
    (102, 'Bandages', 'Medical', 15, 'Usable'),
    (103, 'Hammer', 'Tool', 1, 'Usable'),
    (104, 'Tarp', 'Material', 2, 'Damaged'),
    (105, 'Fresh Water Cask', 'Food', 5, 'Usable'),
    (106, 'Painkillers', 'Medical', 30, 'Usable'),
    (107, 'Rope', 'Material', 50, 'Usable');

    INSERT INTO logbook_entries (entry_id, author_id, log_text, entry_date) VALUES
    (201, 1, 'The storm came out of nowhere. The ship is lost.', '2025-09-15'),
    (202, 2, 'Managed to salvage some engine parts. Might be useful.', '2025-09-15'),
    (203, 1, 'We seem to be on a deserted island. I need to check on the crew.', '2025-09-16');
  `);
};

// Jungle zone database setup
const setupJungleDatabase = (db) => {
  // First create survivors table (referenced by other tables)
  db.exec(`
    CREATE TABLE survivors (
      survivor_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER,
      profession TEXT,
      health_status TEXT
    );

    INSERT INTO survivors (survivor_id, name, age, profession, health_status) VALUES
    (1, 'Captain Eva', 45, 'Captain', 'Injured'),
    (2, 'Ben Carter', 32, 'Engineer', 'Good'),
    (3, 'Dr. Aris', 51, 'Doctor', 'Good'),
    (4, 'Lina', 28, 'Botanist', 'Good'),
    (5, 'Marcus', 38, 'Cook', 'Injured');
  `);

  // Create jungle-specific tables
  db.exec(`
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
  `);

  // Insert sample data
  db.exec(`
    INSERT INTO island_fauna (fauna_id, creature_name, diet_type, is_hostile, habitat_zone) VALUES
    (301, 'Island Macaw', 'Herbivore', 0, 'Canopy'),
    (302, 'Ridgeback Boar', 'Omnivore', 1, 'Jungle Floor'),
    (303, 'Glimmerfrog', 'Carnivore', 0, 'River'),
    (304, 'Shadow Panther', 'Carnivore', 1, 'Jungle Floor'),
    (305, 'River Turtle', 'Herbivore', 0, 'River');

    INSERT INTO island_flora (flora_id, plant_name, is_edible, plant_type, discovered_by) VALUES
    (401, 'Sunfruit', 1, 'Fruit', 4),
    (402, 'Glow Mushroom', 0, 'Fungus', 3),
    (403, 'River Root', 1, 'Tuber', 2),
    (404, 'Razorvine', 0, 'Flower', 4),
    (405, 'Jungle Berry', 1, 'Fruit', 4);

    INSERT INTO expedition_logs (log_id, leader_id, zone_explored, duration_hours, resources_found) VALUES
    (501, 4, 'Northern Jungle', 5, 'Found a patch of strange fruit.'),
    (502, 2, 'Western Riverbank', 3, 'Clean water source located.'),
    (503, 4, 'Northern Jungle', 6, 'Spotted a large boar, very aggressive.'),
    (504, 3, 'Southern Swamp', 4, 'Found some glowing mushrooms.');
  `);
};

// Ruins zone database setup
const setupRuinsDatabase = (db) => {
  // Create tables
  db.exec(`
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
  `);

  // Insert sample data
  db.exec(`
    INSERT INTO ancient_relics (relic_id, relic_name, material, estimated_age_years, ruin_location) VALUES
    (601, 'Sun Dial', 'Stone', 2500, 'Observatory'),
    (602, 'Harvest Totem', 'Obsidian', 2200, 'Ceremonial Hall'),
    (603, 'Golden Goblet', 'Gold', 1800, 'Ceremonial Hall'),
    (604, 'Aqua Conduit', 'Stone', 2600, 'Aqueduct'),
    (605, 'Star Chart', 'Stone', 2550, 'Observatory');

    INSERT INTO glyph_translations (glyph_id, glyph_symbol, meaning, found_on_relic_id) VALUES
    (701, '☉', 'Sun', 601),
    (702, '♒', 'Water', 604),
    (703, '🌾', 'Harvest', 602),
    (704, '☉', 'Sun', 605),
    (705, '💀', 'Danger', 602);

    INSERT INTO celestial_events (event_id, event_name, event_date, observation_notes) VALUES
    (801, 'Great Comet', '0525-03-15', 'A star with a long tail crossed the sky. The harvest was plentiful.'),
    (802, 'Sun Eater', '0528-07-22', 'The sun vanished during the day. A sign of danger.'),
    (803, 'Twin Moons', '0530-01-10', 'Two moons in the sky. The rivers flowed strong.');
  `);
};

// Execute a user query against the database
export const executeUserQuery = (query, database) => {
  try {
    // Clean the query
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return {
        success: false,
        result: null,
        error: 'Query cannot be empty'
      };
    }

    // Execute the query
    const results = database.exec(cleanQuery);
    
    if (results.length === 0) {
      return {
        success: true,
        result: [],
        error: null
      };
    }

    // Convert results to array of objects
    const stmt = results[0];
    const rows = stmt.values.map(row => {
      const obj = {};
      stmt.columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });

    return {
      success: true,
      result: rows,
      error: null
    };

  } catch (error) {
    return {
      success: false,
      result: null,
      error: error.message
    };
  }
};

// Get database schema information
export const getDatabaseSchema = (database) => {
  try {
    const tablesQuery = "SELECT name FROM sqlite_master WHERE type='table';";
    const tablesResult = database.exec(tablesQuery);
    
    if (tablesResult.length === 0) {
      return {};
    }

    const schema = {};
    const tableNames = tablesResult[0].values.map(row => row[0]);

    tableNames.forEach(tableName => {
      try {
        const columnsQuery = `PRAGMA table_info(${tableName});`;
        const columnsResult = database.exec(columnsQuery);
        
        if (columnsResult.length > 0) {
          schema[tableName] = columnsResult[0].values.map(row => row[1]); // row[1] is column name
        }
      } catch (error) {
        console.warn(`Could not get schema for table ${tableName}:`, error);
      }
    });

    return schema;
  } catch (error) {
    console.error('Error getting database schema:', error);
    return {};
  }
};

// Lessons database setup - Generic educational tables
const setupLessonsDatabase = (db) => {
  // Create tables for lessons (generic business/educational context)
  // Create base tables first (no foreign keys)
  db.exec(`
    CREATE TABLE employees (
      employee_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER,
      department TEXT,
      salary INTEGER
    );

    CREATE TABLE customers (
      customer_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      city TEXT,
      country TEXT
    );

    CREATE TABLE products (
      product_id INTEGER PRIMARY KEY,
      product_name TEXT NOT NULL,
      category TEXT,
      price DECIMAL(10, 2),
      stock_quantity INTEGER
    );

    CREATE TABLE categories (
      category_id INTEGER PRIMARY KEY,
      category_name TEXT,
      description TEXT,
      parent_category_id INTEGER
    );
  `);

  // Create tables with foreign keys
  db.exec(`
    CREATE TABLE orders (
      order_id INTEGER PRIMARY KEY,
      customer_id INTEGER,
      order_date DATE,
      total_amount DECIMAL(10, 2),
      status TEXT,
      FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
    );

    CREATE TABLE order_items (
      item_id INTEGER PRIMARY KEY,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      price DECIMAL(10, 2),
      FOREIGN KEY (order_id) REFERENCES orders (order_id),
      FOREIGN KEY (product_id) REFERENCES products (product_id)
    );

    CREATE TABLE inventory (
      inventory_id INTEGER PRIMARY KEY,
      product_id INTEGER,
      warehouse_location TEXT,
      quantity INTEGER,
      last_updated DATE,
      FOREIGN KEY (product_id) REFERENCES products (product_id)
    );
  `);

  // Insert sample data (order matters for foreign keys)
  // First insert base tables
  db.exec(`
    INSERT INTO employees (employee_id, name, age, department, salary) VALUES
    (1, 'John Smith', 32, 'Engineering', 75000),
    (2, 'Sarah Johnson', 28, 'Marketing', 65000),
    (3, 'Michael Brown', 45, 'Sales', 80000),
    (4, 'Emily Davis', 35, 'Engineering', 78000),
    (5, 'David Wilson', 29, 'HR', 60000);

    INSERT INTO customers (customer_id, name, email, city, country) VALUES
    (1, 'Alice Cooper', 'alice@email.com', 'New York', 'USA'),
    (2, 'Bob Miller', 'bob@email.com', 'London', 'UK'),
    (3, 'Carol White', 'carol@email.com', 'Toronto', 'Canada'),
    (4, 'Daniel Green', 'daniel@email.com', 'Sydney', 'Australia'),
    (5, 'Eva Black', 'eva@email.com', 'Berlin', 'Germany');

    INSERT INTO products (product_id, product_name, category, price, stock_quantity) VALUES
    (1, 'Laptop', 'Electronics', 999.99, 50),
    (2, 'Mouse', 'Electronics', 29.99, 200),
    (3, 'Desk Chair', 'Furniture', 199.99, 30),
    (4, 'Monitor', 'Electronics', 299.99, 75),
    (5, 'Keyboard', 'Electronics', 79.99, 150),
    (6, 'Office Desk', 'Furniture', 399.99, 20),
    (7, 'Webcam', 'Electronics', 89.99, 100);

    INSERT INTO categories (category_id, category_name, description, parent_category_id) VALUES
    (1, 'Electronics', 'Electronic devices and accessories', NULL),
    (2, 'Furniture', 'Office and home furniture', NULL),
    (3, 'Computers', 'Desktop and laptop computers', 1),
    (4, 'Accessories', 'Computer and tech accessories', 1);
  `);

  // Then insert tables with foreign keys
  db.exec(`
    INSERT INTO orders (order_id, customer_id, order_date, total_amount, status) VALUES
    (1, 1, '2025-01-15', 999.99, 'Completed'),
    (2, 2, '2025-01-16', 329.98, 'Pending'),
    (3, 1, '2025-01-17', 199.99, 'Completed'),
    (4, 3, '2025-01-18', 599.98, 'Shipped'),
    (5, 4, '2025-01-19', 89.99, 'Pending');

    INSERT INTO order_items (item_id, order_id, product_id, quantity, price) VALUES
    (1, 1, 1, 1, 999.99),
    (2, 2, 2, 2, 29.99),
    (3, 2, 4, 1, 299.99),
    (4, 3, 3, 1, 199.99),
    (5, 4, 4, 2, 299.99),
    (6, 5, 7, 1, 89.99);

    INSERT INTO inventory (inventory_id, product_id, warehouse_location, quantity, last_updated) VALUES
    (1, 1, 'Warehouse A', 30, '2025-01-10'),
    (2, 1, 'Warehouse B', 20, '2025-01-12'),
    (3, 2, 'Warehouse A', 150, '2025-01-11'),
    (4, 3, 'Warehouse C', 30, '2025-01-09'),
    (5, 4, 'Warehouse A', 50, '2025-01-13');
  `);
};

// Compare query results for validation
export const compareResults = (userResult, expectedResult) => {
  if (!userResult || !expectedResult) {
    return false;
  }

  // Handle empty results
  if (userResult.length === 0 && expectedResult.length === 0) {
    return true;
  }

  if (userResult.length !== expectedResult.length) {
    return false;
  }

  // For each row, check if all key-value pairs match
  for (let i = 0; i < userResult.length; i++) {
    const userRow = userResult[i];
    const expectedRow = expectedResult[i];

    // Check if all keys match
    const userKeys = Object.keys(userRow).sort();
    const expectedKeys = Object.keys(expectedRow).sort();

    if (userKeys.length !== expectedKeys.length) {
      return false;
    }

    for (let j = 0; j < userKeys.length; j++) {
      if (userKeys[j] !== expectedKeys[j]) {
        return false;
      }

      // Compare values (convert to string for comparison to handle type differences)
      if (String(userRow[userKeys[j]]) !== String(expectedRow[expectedKeys[j]])) {
        return false;
      }
    }
  }

  return true;
};