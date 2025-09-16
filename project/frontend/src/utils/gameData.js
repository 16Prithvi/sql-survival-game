// Complete task definitions for all zones
export const gameTasks = {
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
    },
    {
      level: 4,
      title: "Find the Doctor",
      description: "We need the doctor! Find the survivor whose profession is 'Doctor'.",
      hint: "Use WHERE clause to filter by profession.",
      expectedQuery: "SELECT * FROM survivors WHERE profession = 'Doctor';"
    },
    {
      level: 5,
      title: "Inventory Check",
      description: "Let's see our supplies. List all items from the crashed supplies.",
      hint: "Use SELECT * to get all items from crashed_supplies table.",
      expectedQuery: "SELECT * FROM crashed_supplies;"
    },
    {
      level: 6,
      title: "Find Food",
      description: "We need to find food quickly. Show all items in the 'Food' category.",
      hint: "Use WHERE clause to filter by category.",
      expectedQuery: "SELECT item_name, quantity FROM crashed_supplies WHERE category = 'Food';"
    },
    {
      level: 7,
      title: "Damaged Supplies",
      description: "Some supplies might be damaged. List all items that are NOT in 'Usable' condition.",
      hint: "Use WHERE with != operator or NOT equals.",
      expectedQuery: "SELECT * FROM crashed_supplies WHERE condition != 'Usable';"
    },
    {
      level: 8,
      title: "Age Order",
      description: "Organize the survivors list by age, from oldest to youngest.",
      hint: "Use ORDER BY with DESC for descending order.",
      expectedQuery: "SELECT name, age FROM survivors ORDER BY age DESC;"
    },
    {
      level: 9,
      title: "Food Rationing",
      description: "To ration properly, list our food supplies, starting with the items we have the most of.",
      hint: "Combine WHERE and ORDER BY clauses.",
      expectedQuery: "SELECT item_name, quantity FROM crashed_supplies WHERE category = 'Food' ORDER BY quantity DESC;"
    },
    {
      level: 10,
      title: "Medical Supplies",
      description: "We have limited medical supplies. Find our two most numerous medical items.",
      hint: "Use WHERE, ORDER BY, and LIMIT clauses together.",
      expectedQuery: "SELECT * FROM crashed_supplies WHERE category = 'Medical' ORDER BY quantity DESC LIMIT 2;"
    },
    {
      level: 11,
      title: "Essential Items",
      description: "Find all supplies that are either 'Medical' or 'Tool'.",
      hint: "Use WHERE with IN operator or OR condition.",
      expectedQuery: "SELECT * FROM crashed_supplies WHERE category IN ('Medical', 'Tool');"
    },
    {
      level: 12,
      title: "Captain's Log",
      description: "Read the most recent entry from the captain's logbook to understand what happened.",
      hint: "Use ORDER BY with date and LIMIT to get the most recent entry.",
      expectedQuery: "SELECT log_text FROM logbook_entries ORDER BY entry_date DESC LIMIT 1;"
    },
    {
      level: 13,
      title: "Other Injured",
      description: "We need to know who requires medical attention besides the Captain. Find injured survivors who are not the captain.",
      hint: "Use WHERE with AND to combine conditions.",
      expectedQuery: "SELECT * FROM survivors WHERE health_status = 'Injured' AND profession != 'Captain';"
    },
    {
      level: 14,
      title: "Log Authors",
      description: "Let's check the logbook. Who wrote the log entries? Show the author's ID and the log text.",
      hint: "Select specific columns from logbook_entries table.",
      expectedQuery: "SELECT author_id, log_text FROM logbook_entries;"
    },
    {
      level: 15,
      title: "Named Authors",
      description: "It would be more helpful to see the author's name instead of their ID. List the log text along with the author's name.",
      hint: "Use JOIN to connect survivors and logbook_entries tables.",
      expectedQuery: "SELECT s.name, l.log_text FROM survivors s JOIN logbook_entries l ON s.survivor_id = l.author_id;"
    }
  ],

  jungle: [
    {
      level: 1,
      title: "Habitat Survey",
      description: "What kind of ecosystems are in the jungle? List the unique habitat zones we've identified.",
      hint: "Use DISTINCT to get unique values from a column.",
      expectedQuery: "SELECT DISTINCT habitat_zone FROM island_fauna;",
      storyText: "You've stabilized the camp and now venture into the dense jungle. The canopy blocks most sunlight, and strange sounds echo through the trees."
    },
    {
      level: 2,
      title: "Danger Assessment",
      description: "Safety first. Count how many hostile creatures we've documented.",
      hint: "Use COUNT with WHERE to count rows meeting a condition.",
      expectedQuery: "SELECT COUNT(*) FROM island_fauna WHERE is_hostile = 1;"
    },
    {
      level: 3,
      title: "Edible Plants",
      description: "We need to know what we can eat. List all edible plants.",
      hint: "Filter plants where is_edible equals 1.",
      expectedQuery: "SELECT plant_name, plant_type FROM island_flora WHERE is_edible = 1;"
    },
    {
      level: 4,
      title: "Fruit Expeditions",
      description: "Find all expedition logs where the team found some kind of 'fruit'.",
      hint: "Use LIKE operator with wildcards to search within text.",
      expectedQuery: "SELECT * FROM expedition_logs WHERE resources_found LIKE '%fruit%';"
    },
    {
      level: 5,
      title: "Wildlife Categories",
      description: "Let's categorize the wildlife. Count the number of creatures in each diet type.",
      hint: "Use GROUP BY with COUNT to group and count.",
      expectedQuery: "SELECT diet_type, COUNT(*) as creature_count FROM island_fauna GROUP BY diet_type;"
    },
    {
      level: 6,
      title: "Expedition Duration",
      description: "What's the average duration of our expeditions?",
      hint: "Use AVG function to calculate average of a numeric column.",
      expectedQuery: "SELECT AVG(duration_hours) FROM expedition_logs;"
    },
    {
      level: 7,
      title: "Top Explorer",
      description: "Who is our most active explorer? Find the survivor who has discovered the most plants.",
      hint: "Use GROUP BY, COUNT, and ORDER BY with LIMIT.",
      expectedQuery: "SELECT discovered_by, COUNT(*) as num_plants_discovered FROM island_flora GROUP BY discovered_by ORDER BY num_plants_discovered DESC LIMIT 1;"
    },
    {
      level: 8,
      title: "Expedition Leaders",
      description: "Find the names of the survivors who have led expeditions. Each person should only be listed once.",
      hint: "Use DISTINCT with JOIN to get unique leader names.",
      expectedQuery: "SELECT DISTINCT s.name FROM survivors s JOIN expedition_logs e ON s.survivor_id = e.leader_id;"
    },
    {
      level: 9,
      title: "Lina's Discoveries",
      description: "List the names of all edible plants discovered by the botanist Lina.",
      hint: "Combine multiple JOINs and WHERE conditions.",
      expectedQuery: "SELECT f.plant_name FROM island_flora f JOIN survivors s ON f.discovered_by = s.survivor_id WHERE f.is_edible = 1 AND s.name = 'Lina';"
    },
    {
      level: 10,
      title: "Long Expeditions",
      description: "Which zones have we explored for more than 4 hours in a single expedition?",
      hint: "Use WHERE with greater than comparison.",
      expectedQuery: "SELECT zone_explored, duration_hours FROM expedition_logs WHERE duration_hours > 4;"
    },
    {
      level: 11,
      title: "Revisited Zones",
      description: "Identify zones where we've conducted more than one expedition.",
      hint: "Use GROUP BY with HAVING to filter groups.",
      expectedQuery: "SELECT zone_explored, COUNT(*) as expedition_count FROM expedition_logs GROUP BY zone_explored HAVING expedition_count > 1;"
    },
    {
      level: 12,
      title: "Safe Herbivores",
      description: "List all non-hostile herbivores. These could be a stable food source.",
      hint: "Use WHERE with AND to combine multiple conditions.",
      expectedQuery: "SELECT creature_name FROM island_fauna WHERE is_hostile = 0 AND diet_type = 'Herbivore';"
    },
    {
      level: 13,
      title: "Dr. Aris's Finds",
      description: "What kinds of plants has Dr. Aris discovered?",
      hint: "Use JOIN to connect flora and survivors tables.",
      expectedQuery: "SELECT f.plant_name, f.plant_type FROM island_flora f JOIN survivors s ON f.discovered_by = s.survivor_id WHERE s.name = 'Dr. Aris';"
    },
    {
      level: 14,
      title: "Expedition Report",
      description: "Get a full report of expeditions: show the leader's name and the zone they explored.",
      hint: "Use JOIN to connect survivors and expedition_logs tables.",
      expectedQuery: "SELECT s.name as leader_name, e.zone_explored FROM survivors s JOIN expedition_logs e ON s.survivor_id = e.leader_id;"
    },
    {
      level: 15,
      title: "Non-Floor Creatures",
      description: "Find all creatures that are NOT found on the 'Jungle Floor'.",
      hint: "Use WHERE with != or NOT equal operator.",
      expectedQuery: "SELECT creature_name, habitat_zone FROM island_fauna WHERE habitat_zone != 'Jungle Floor';"
    },
    {
      level: 16,
      title: "Fruit Types",
      description: "List the names of all discovered fruits.",
      hint: "Filter by plant_type equal to 'Fruit'.",
      expectedQuery: "SELECT plant_name FROM island_flora WHERE plant_type = 'Fruit';"
    },
    {
      level: 17,
      title: "Water Sources",
      description: "Which expeditions found a water source?",
      hint: "Use LIKE to search for 'water' in resources_found.",
      expectedQuery: "SELECT * FROM expedition_logs WHERE resources_found LIKE '%water%';"
    },
    {
      level: 18,
      title: "Plant Diversity",
      description: "How many distinct types of plants have been discovered?",
      hint: "Use COUNT with DISTINCT to count unique plant types.",
      expectedQuery: "SELECT COUNT(DISTINCT plant_type) FROM island_flora;"
    },
    {
      level: 19,
      title: "Friendly Carnivores",
      description: "Get the names of any carnivores that are NOT hostile.",
      hint: "Use WHERE with AND to combine diet_type and is_hostile conditions.",
      expectedQuery: "SELECT creature_name FROM island_fauna WHERE diet_type = 'Carnivore' AND is_hostile = 0;"
    },
    {
      level: 20,
      title: "Leadership Report",
      description: "Create a report showing each explorer's name and the number of expeditions they have led.",
      hint: "Use JOIN, GROUP BY, and COUNT to create the report.",
      expectedQuery: "SELECT s.name, COUNT(e.log_id) as expeditions_led FROM survivors s JOIN expedition_logs e ON s.survivor_id = e.leader_id GROUP BY s.name;"
    }
  ],

  ruins: [
    {
      level: 1,
      title: "Stone Relics",
      description: "Find the names of all relics made from 'Stone'.",
      hint: "Use WHERE to filter by material.",
      expectedQuery: "SELECT relic_name FROM ancient_relics WHERE material = 'Stone';",
      storyText: "Deep in the island's heart, you discover ancient ruins. Crumbling stone structures hint at a lost civilization. The air feels thick with mystery."
    },
    {
      level: 2,
      title: "Sun Glyph Relics",
      description: "A 'Sun' glyph has been found. Find all relics that have this glyph on them using a subquery.",
      hint: "Use IN with a subquery to find relics with Sun glyph.",
      expectedQuery: "SELECT relic_name FROM ancient_relics WHERE relic_id IN (SELECT found_on_relic_id FROM glyph_translations WHERE meaning = 'Sun');"
    },
    {
      level: 3,
      title: "Average Age",
      description: "Calculate the average age of all discovered relics.",
      hint: "Use AVG function on the age column.",
      expectedQuery: "SELECT AVG(estimated_age_years) as average_age FROM ancient_relics;"
    },
    {
      level: 4,
      title: "Oldest by Location",
      description: "Let's find the oldest relic in each ruin location.",
      hint: "Use GROUP BY with MIN to find minimum age per location.",
      expectedQuery: "SELECT ruin_location, MIN(estimated_age_years) as oldest_relic_age FROM ancient_relics GROUP BY ruin_location;"
    },
    {
      level: 5,
      title: "Observatory Relics CTE",
      description: "Use a Common Table Expression (CTE) to list all relics found in the 'Observatory'. Then, select everything from your CTE.",
      hint: "Use WITH clause to create a CTE, then SELECT from it.",
      expectedQuery: "WITH ObservatoryRelics AS (SELECT * FROM ancient_relics WHERE ruin_location = 'Observatory') SELECT * FROM ObservatoryRelics;"
    },
    {
      level: 6,
      title: "Above Average Age",
      description: "Find all relics older than the average age of all relics.",
      hint: "Use a subquery with AVG in WHERE clause.",
      expectedQuery: "SELECT relic_name, estimated_age_years FROM ancient_relics WHERE estimated_age_years > (SELECT AVG(estimated_age_years) FROM ancient_relics);"
    },
    {
      level: 7,
      title: "Danger Glyph Location",
      description: "The 'danger' glyph is important. Find the name and location of the relic it was found on.",
      hint: "Use JOIN to connect relics and glyph_translations tables.",
      expectedQuery: "SELECT r.relic_name, r.ruin_location FROM ancient_relics r JOIN glyph_translations g ON r.relic_id = g.found_on_relic_id WHERE g.meaning = 'Danger';"
    },
    {
      level: 8,
      title: "Ceremonial Hall Ranking",
      description: "We need to rank relics in the Ceremonial Hall by age, from newest to oldest. Display the rank, name, and age.",
      hint: "Use RANK() window function with ORDER BY.",
      expectedQuery: "SELECT relic_name, estimated_age_years, RANK() OVER(ORDER BY estimated_age_years ASC) as age_rank FROM ancient_relics WHERE ruin_location = 'Ceremonial Hall';"
    },
    {
      level: 9,
      title: "Location Age Average",
      description: "Show each relic's name, its age, and the average age of relics in its specific location.",
      hint: "Use window function with PARTITION BY to calculate location averages.",
      expectedQuery: "SELECT relic_name, estimated_age_years, ruin_location, AVG(estimated_age_years) OVER(PARTITION BY ruin_location) as avg_age_in_location FROM ancient_relics;"
    },
    {
      level: 10,
      title: "Relics Without Glyphs",
      description: "Find any relics that have no translated glyphs associated with them.",
      hint: "Use NOT IN with subquery to find relics not in glyph translations.",
      expectedQuery: "SELECT relic_name FROM ancient_relics WHERE relic_id NOT IN (SELECT DISTINCT found_on_relic_id FROM glyph_translations);"
    },
    {
      level: 11,
      title: "Danger Event Date",
      description: "The observation notes mention 'danger'. Find the date of the celestial event associated with this warning.",
      hint: "Use LIKE to search for 'danger' in observation notes.",
      expectedQuery: "SELECT event_date, event_name FROM celestial_events WHERE observation_notes LIKE '%danger%';"
    },
    {
      level: 12,
      title: "Water Relics CTE",
      description: "Using a CTE, first find all relics related to 'Water', then join it with the main relics table to get their full details.",
      hint: "Create CTE for water-related relics, then JOIN with main table.",
      expectedQuery: "WITH WaterRelics AS (SELECT found_on_relic_id FROM glyph_translations WHERE meaning = 'Water') SELECT r.* FROM ancient_relics r JOIN WaterRelics wr ON r.relic_id = wr.found_on_relic_id;"
    },
    {
      level: 13,
      title: "Ceremonial Age Range",
      description: "What is the age difference between the oldest and newest relic in the Ceremonial Hall?",
      hint: "Use MAX and MIN functions with subtraction.",
      expectedQuery: "SELECT MAX(estimated_age_years) - MIN(estimated_age_years) as age_difference FROM ancient_relics WHERE ruin_location = 'Ceremonial Hall';"
    },
    {
      level: 14,
      title: "Age Categories",
      description: "Let's categorize relics. If a relic is older than 2400 years, label it 'Ancient'. Otherwise, 'Old'.",
      hint: "Use CASE statement to create conditional labels.",
      expectedQuery: "SELECT relic_name, estimated_age_years, CASE WHEN estimated_age_years > 2400 THEN 'Ancient' ELSE 'Old' END as age_category FROM ancient_relics;"
    },
    {
      level: 15,
      title: "Glyph Count per Relic",
      description: "For each relic, show its name and a count of how many glyphs were found on it.",
      hint: "Use LEFT JOIN with GROUP BY and COUNT to include relics with zero glyphs.",
      expectedQuery: "SELECT r.relic_name, COUNT(g.glyph_id) as glyph_count FROM ancient_relics r LEFT JOIN glyph_translations g ON r.relic_id = g.found_on_relic_id GROUP BY r.relic_name;"
    }
  ]
};