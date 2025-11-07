// SQL Lessons Data - 8 comprehensive lessons with generic business tables
export const lessons = [
  {
    id: 1,
    title: "SELECT Queries 101",
    description: "Learn the basics of retrieving data from database tables",
    theory: [
      "The **SELECT** statement is the foundation of SQL. It allows you to retrieve data from one or more tables in a database.",
      "To retrieve all columns from a table, use `SELECT * FROM table_name;`",
      "To retrieve specific columns, list them separated by commas: `SELECT column1, column2 FROM table_name;`",
      "Every SQL statement should end with a semicolon (;) to indicate the end of the command.",
      "SQL keywords are case-insensitive, but it's conventional to write them in uppercase for readability."
    ],
    example: `-- Get all columns from employees table
SELECT * FROM employees;

-- Get specific columns
SELECT name, department, salary FROM employees;`,
    practiceData: {
      tableName: "employees",
      columns: ["employee_id", "name", "age", "department", "salary"],
      sampleData: [
        { employee_id: 1, name: "John Smith", age: 32, department: "Engineering", salary: 75000 },
        { employee_id: 2, name: "Sarah Johnson", age: 28, department: "Marketing", salary: 65000 },
        { employee_id: 3, name: "Michael Brown", age: 45, department: "Sales", salary: 80000 },
        { employee_id: 4, name: "Emily Davis", age: 35, department: "Engineering", salary: 78000 },
        { employee_id: 5, name: "David Wilson", age: 29, department: "HR", salary: 60000 }
      ]
    },
    tasks: [
      {
        id: 1,
        description: "Get all columns from the employees table",
        hint: "Use SELECT * FROM employees;",
        expectedQuery: "SELECT * FROM employees;"
      },
      {
        id: 2,
        description: "Get only the name and department columns",
        hint: "Use SELECT name, department FROM employees;",
        expectedQuery: "SELECT name, department FROM employees;"
      },
      {
        id: 3,
        description: "Get the name, age, and salary of all employees",
        hint: "List the columns: SELECT name, age, salary FROM employees;",
        expectedQuery: "SELECT name, age, salary FROM employees;"
      }
    ]
  },
  {
    id: 2,
    title: "Queries with Constraints (WHERE Clause)",
    description: "Filter data using WHERE clause and various operators",
    theory: [
      "The **WHERE** clause is used to filter rows based on specific conditions. It comes after the FROM clause.",
      "You can use comparison operators: `=`, `!=`, `<`, `<=`, `>`, `>=`",
      "Use `AND` to combine multiple conditions (both must be true).",
      "Use `OR` to combine conditions where at least one must be true.",
      "Use `IN (...)` to check if a value is in a list of values.",
      "Use `NOT IN (...)` to check if a value is not in a list.",
      "Use `BETWEEN ... AND ...` to check if a value is within a range (inclusive)."
    ],
    example: `-- Find employees in Engineering department
SELECT * FROM employees 
WHERE department = 'Engineering';

-- Find employees with salary greater than 70000
SELECT name, salary FROM employees 
WHERE salary > 70000;

-- Multiple conditions with AND
SELECT * FROM employees 
WHERE department = 'Engineering' AND age < 40;

-- Using IN operator
SELECT * FROM employees 
WHERE department IN ('Engineering', 'Sales');`,
    practiceData: {
      tableName: "employees",
      columns: ["employee_id", "name", "age", "department", "salary"],
      sampleData: [
        { employee_id: 1, name: "John Smith", age: 32, department: "Engineering", salary: 75000 },
        { employee_id: 2, name: "Sarah Johnson", age: 28, department: "Marketing", salary: 65000 },
        { employee_id: 3, name: "Michael Brown", age: 45, department: "Sales", salary: 80000 },
        { employee_id: 4, name: "Emily Davis", age: 35, department: "Engineering", salary: 78000 },
        { employee_id: 5, name: "David Wilson", age: 29, department: "HR", salary: 60000 }
      ]
    },
    tasks: [
      {
        id: 1,
        description: "Find all employees in the Engineering department",
        hint: "Use WHERE department = 'Engineering'",
        expectedQuery: "SELECT * FROM employees WHERE department = 'Engineering';"
      },
      {
        id: 2,
        description: "Find employees who earn more than 70000",
        hint: "Use WHERE salary > 70000",
        expectedQuery: "SELECT name, salary FROM employees WHERE salary > 70000;"
      },
      {
        id: 3,
        description: "Find employees who are NOT in the HR department",
        hint: "Use WHERE department != 'HR'",
        expectedQuery: "SELECT * FROM employees WHERE department != 'HR';"
      },
      {
        id: 4,
        description: "Find employees in Engineering department AND salary greater than 70000",
        hint: "Combine conditions with AND",
        expectedQuery: "SELECT * FROM employees WHERE department = 'Engineering' AND salary > 70000;"
      }
    ]
  },
  {
    id: 3,
    title: "Sorting Results (ORDER BY)",
    description: "Organize your query results using ORDER BY",
    theory: [
      "The **ORDER BY** clause is used to sort the result set by one or more columns.",
      "Use `ORDER BY column ASC` for ascending order (lowest to highest, A to Z).",
      "Use `ORDER BY column DESC` for descending order (highest to lowest, Z to A).",
      "If you don't specify ASC or DESC, the default is ASC (ascending).",
      "You can sort by multiple columns: `ORDER BY column1 DESC, column2 ASC`",
      "ORDER BY comes after WHERE clause (if present) and before LIMIT."
    ],
    example: `-- Sort by salary, highest first
SELECT name, salary FROM employees 
ORDER BY salary DESC;

-- Sort by name alphabetically
SELECT name, department FROM employees 
ORDER BY name ASC;

-- Combine WHERE and ORDER BY
SELECT name, salary FROM employees 
WHERE department = 'Engineering' 
ORDER BY salary ASC;`,
    practiceData: {
      tableName: "employees",
      columns: ["employee_id", "name", "age", "department", "salary"],
      sampleData: [
        { employee_id: 1, name: "John Smith", age: 32, department: "Engineering", salary: 75000 },
        { employee_id: 2, name: "Sarah Johnson", age: 28, department: "Marketing", salary: 65000 },
        { employee_id: 3, name: "Michael Brown", age: 45, department: "Sales", salary: 80000 },
        { employee_id: 4, name: "Emily Davis", age: 35, department: "Engineering", salary: 78000 },
        { employee_id: 5, name: "David Wilson", age: 29, department: "HR", salary: 60000 }
      ]
    },
    tasks: [
      {
        id: 1,
        description: "Get all employees sorted by salary, from highest to lowest",
        hint: "Use ORDER BY salary DESC",
        expectedQuery: "SELECT name, salary FROM employees ORDER BY salary DESC;"
      },
      {
        id: 2,
        description: "Get employees sorted alphabetically by name",
        hint: "Use ORDER BY name ASC",
        expectedQuery: "SELECT name FROM employees ORDER BY name ASC;"
      },
      {
        id: 3,
        description: "Get Engineering employees sorted by salary (lowest first)",
        hint: "Combine WHERE and ORDER BY",
        expectedQuery: "SELECT name, salary FROM employees WHERE department = 'Engineering' ORDER BY salary ASC;"
      }
    ]
  },
  {
    id: 4,
    title: "Limiting Results & DISTINCT",
    description: "Control the number of results and get unique values",
    theory: [
      "The **LIMIT** clause restricts the number of rows returned by a query.",
      "Use `LIMIT n` to get only the first n rows.",
      "LIMIT is useful for getting the top N records, especially when combined with ORDER BY.",
      "**DISTINCT** eliminates duplicate rows from the result set.",
      "Use `SELECT DISTINCT column` to get unique values from a column.",
      "You can use DISTINCT with multiple columns: `SELECT DISTINCT col1, col2`"
    ],
    example: `-- Get only the first 3 employees
SELECT * FROM employees 
LIMIT 3;

-- Get the 2 highest paid employees
SELECT name, salary FROM employees 
ORDER BY salary DESC 
LIMIT 2;

-- Get unique department values
SELECT DISTINCT department FROM employees;

-- Get unique cities from customers
SELECT DISTINCT city FROM customers;`,
    practiceData: {
      tableName: "employees",
      columns: ["employee_id", "name", "age", "department", "salary"],
      sampleData: [
        { employee_id: 1, name: "John Smith", age: 32, department: "Engineering", salary: 75000 },
        { employee_id: 2, name: "Sarah Johnson", age: 28, department: "Marketing", salary: 65000 },
        { employee_id: 3, name: "Michael Brown", age: 45, department: "Sales", salary: 80000 },
        { employee_id: 4, name: "Emily Davis", age: 35, department: "Engineering", salary: 78000 },
        { employee_id: 5, name: "David Wilson", age: 29, department: "HR", salary: 60000 }
      ],
      relatedTable: {
        name: "customers",
        columns: ["customer_id", "name", "email", "city", "country"],
        sampleData: [
          { customer_id: 1, name: "Alice Cooper", email: "alice@email.com", city: "New York", country: "USA" },
          { customer_id: 2, name: "Bob Miller", email: "bob@email.com", city: "London", country: "UK" },
          { customer_id: 3, name: "Carol White", email: "carol@email.com", city: "Toronto", country: "Canada" }
        ]
      }
    },
    tasks: [
      {
        id: 1,
        description: "Get only the first 2 rows from employees",
        hint: "Use LIMIT 2",
        expectedQuery: "SELECT * FROM employees LIMIT 2;"
      },
      {
        id: 2,
        description: "Get the 3 highest paid employees",
        hint: "Combine ORDER BY salary DESC with LIMIT 3",
        expectedQuery: "SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3;"
      },
      {
        id: 3,
        description: "Get all unique department values",
        hint: "Use SELECT DISTINCT department",
        expectedQuery: "SELECT DISTINCT department FROM employees;"
      }
    ]
  },
  {
    id: 5,
    title: "JOINs: Combining Tables",
    description: "Learn how to join multiple tables together",
    theory: [
      "**JOIN** allows you to combine rows from two or more tables based on a related column.",
      "**INNER JOIN** returns only rows that have matching values in both tables.",
      "**LEFT JOIN** returns all rows from the left table and matched rows from the right table. Unmatched rows will have NULL values.",
      "The basic syntax is: `FROM table1 JOIN table2 ON table1.column = table2.column`",
      "Use table aliases (AS or just space) to make queries shorter: `FROM employees e JOIN orders o`",
      "You can join multiple tables by chaining JOINs together."
    ],
    example: `-- Basic INNER JOIN
SELECT c.name, o.order_date, o.total_amount 
FROM customers c 
JOIN orders o ON c.customer_id = o.customer_id;

-- JOIN with WHERE clause
SELECT c.name, o.order_date, o.total_amount 
FROM customers c 
JOIN orders o ON c.customer_id = o.customer_id 
WHERE o.status = 'Completed';

-- LEFT JOIN to include all customers
SELECT c.name, o.order_date 
FROM customers c 
LEFT JOIN orders o ON c.customer_id = o.customer_id;`,
    practiceData: {
      tableName: "customers",
      columns: ["customer_id", "name", "email", "city", "country"],
      sampleData: [
        { customer_id: 1, name: "Alice Cooper", email: "alice@email.com", city: "New York", country: "USA" },
        { customer_id: 2, name: "Bob Miller", email: "bob@email.com", city: "London", country: "UK" },
        { customer_id: 3, name: "Carol White", email: "carol@email.com", city: "Toronto", country: "Canada" }
      ],
      relatedTable: {
        name: "orders",
        columns: ["order_id", "customer_id", "order_date", "total_amount", "status"],
        sampleData: [
          { order_id: 1, customer_id: 1, order_date: "2025-01-15", total_amount: 999.99, status: "Completed" },
          { order_id: 2, customer_id: 2, order_date: "2025-01-16", total_amount: 329.98, status: "Pending" },
          { order_id: 3, customer_id: 1, order_date: "2025-01-17", total_amount: 199.99, status: "Completed" }
        ]
      }
    },
    tasks: [
      {
        id: 1,
        description: "Join customers and orders to show customer names and order dates",
        hint: "Use JOIN ON customers.customer_id = orders.customer_id",
        expectedQuery: "SELECT c.name, o.order_date FROM customers c JOIN orders o ON c.customer_id = o.customer_id;"
      },
      {
        id: 2,
        description: "Get orders with status 'Completed' and show customer names",
        hint: "Add WHERE status = 'Completed' to your JOIN",
        expectedQuery: "SELECT c.name, o.order_date, o.total_amount FROM customers c JOIN orders o ON c.customer_id = o.customer_id WHERE o.status = 'Completed';"
      }
    ]
  },
  {
    id: 6,
    title: "Aggregate Functions & GROUP BY",
    description: "Calculate statistics and group data",
    theory: [
      "**Aggregate functions** perform calculations on a set of rows and return a single value.",
      "Common aggregate functions: `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`",
      "`COUNT(*)` counts all rows, `COUNT(column)` counts non-NULL values.",
      "**GROUP BY** groups rows that have the same values in specified columns.",
      "When using GROUP BY, you can only SELECT grouped columns or aggregate functions.",
      "**HAVING** is like WHERE, but it filters groups instead of individual rows. Use it after GROUP BY."
    ],
    example: `-- Count total employees
SELECT COUNT(*) FROM employees;

-- Average salary of employees
SELECT AVG(salary) FROM employees;

-- Group by department and count
SELECT department, COUNT(*) as count 
FROM employees 
GROUP BY department;

-- Group with HAVING to filter groups
SELECT department, COUNT(*) as count 
FROM employees 
GROUP BY department 
HAVING COUNT(*) > 1;`,
    practiceData: {
      tableName: "employees",
      columns: ["employee_id", "name", "age", "department", "salary"],
      sampleData: [
        { employee_id: 1, name: "John Smith", age: 32, department: "Engineering", salary: 75000 },
        { employee_id: 2, name: "Sarah Johnson", age: 28, department: "Marketing", salary: 65000 },
        { employee_id: 3, name: "Michael Brown", age: 45, department: "Sales", salary: 80000 },
        { employee_id: 4, name: "Emily Davis", age: 35, department: "Engineering", salary: 78000 },
        { employee_id: 5, name: "David Wilson", age: 29, department: "HR", salary: 60000 }
      ]
    },
    tasks: [
      {
        id: 1,
        description: "Count the total number of employees",
        hint: "Use SELECT COUNT(*) FROM employees",
        expectedQuery: "SELECT COUNT(*) FROM employees;"
      },
      {
        id: 2,
        description: "Find the average salary of all employees",
        hint: "Use SELECT AVG(salary) FROM employees",
        expectedQuery: "SELECT AVG(salary) FROM employees;"
      },
      {
        id: 3,
        description: "Group employees by department and count each group",
        hint: "Use GROUP BY department with COUNT(*)",
        expectedQuery: "SELECT department, COUNT(*) FROM employees GROUP BY department;"
      },
      {
        id: 4,
        description: "Find the highest salary",
        hint: "Use SELECT MAX(salary) FROM employees",
        expectedQuery: "SELECT MAX(salary) FROM employees;"
      }
    ]
  },
  {
    id: 7,
    title: "Subqueries",
    description: "Write queries within queries for complex data retrieval",
    theory: [
      "A **subquery** (or nested query) is a SQL query nested inside another query.",
      "Subqueries can be used in SELECT, FROM, WHERE, and HAVING clauses.",
      "Use subqueries with `IN` to check if a value exists in a subquery result.",
      "Use subqueries with comparison operators (=, >, <, etc.) when the subquery returns a single value.",
      "Subqueries are executed first, and their results are used by the outer query.",
      "You can use `NOT IN` with subqueries to exclude values that exist in the subquery result."
    ],
    example: `-- Subquery in WHERE with IN
SELECT product_name 
FROM products 
WHERE product_id IN (
  SELECT product_id 
  FROM order_items 
  WHERE quantity > 1
);

-- Subquery with comparison operator
SELECT product_name, price 
FROM products 
WHERE price > (
  SELECT AVG(price) 
  FROM products
);

-- Subquery to find products without orders
SELECT product_name 
FROM products 
WHERE product_id NOT IN (
  SELECT DISTINCT product_id 
  FROM order_items
);`,
    practiceData: {
      tableName: "products",
      columns: ["product_id", "product_name", "category", "price", "stock_quantity"],
      sampleData: [
        { product_id: 1, product_name: "Laptop", category: "Electronics", price: 999.99, stock_quantity: 50 },
        { product_id: 2, product_name: "Mouse", category: "Electronics", price: 29.99, stock_quantity: 200 },
        { product_id: 3, product_name: "Desk Chair", category: "Furniture", price: 199.99, stock_quantity: 30 },
        { product_id: 4, product_name: "Monitor", category: "Electronics", price: 299.99, stock_quantity: 75 }
      ],
      relatedTable: {
        name: "order_items",
        columns: ["item_id", "order_id", "product_id", "quantity", "price"],
        sampleData: [
          { item_id: 1, order_id: 1, product_id: 1, quantity: 1, price: 999.99 },
          { item_id: 2, order_id: 2, product_id: 2, quantity: 2, price: 29.99 },
          { item_id: 3, order_id: 2, product_id: 4, quantity: 1, price: 299.99 }
        ]
      }
    },
    tasks: [
      {
        id: 1,
        description: "Find products that have been ordered using a subquery",
        hint: "Use WHERE product_id IN (SELECT product_id FROM order_items)",
        expectedQuery: "SELECT product_name FROM products WHERE product_id IN (SELECT product_id FROM order_items);"
      },
      {
        id: 2,
        description: "Find products with price higher than the average price",
        hint: "Use WHERE price > (SELECT AVG(price) FROM products)",
        expectedQuery: "SELECT product_name, price FROM products WHERE price > (SELECT AVG(price) FROM products);"
      }
    ]
  },
  {
    id: 8,
    title: "CTEs & Window Functions",
    description: "Advanced SQL techniques with Common Table Expressions and Window Functions",
    theory: [
      "**CTE (Common Table Expression)** is a temporary named result set defined within a query using the `WITH` clause.",
      "CTEs make complex queries more readable and can be referenced multiple times.",
      "Syntax: `WITH cte_name AS (SELECT ...) SELECT ... FROM cte_name`",
      "**Window Functions** perform calculations across a set of rows related to the current row.",
      "Window functions use `OVER()` clause and can include `PARTITION BY` and `ORDER BY`.",
      "Common window functions: `RANK()`, `ROW_NUMBER()`, `AVG() OVER()`, `SUM() OVER()`",
      "`PARTITION BY` divides the result set into partitions for the window function.",
      "Window functions don't collapse rows like GROUP BY - they add computed values to each row."
    ],
    example: `-- Simple CTE
WITH ElectronicsProducts AS (
  SELECT * FROM products 
  WHERE category = 'Electronics'
)
SELECT * FROM ElectronicsProducts;

-- CTE with JOIN
WITH HighValueOrders AS (
  SELECT order_id 
  FROM orders 
  WHERE total_amount > 500
)
SELECT o.* 
FROM orders o 
JOIN HighValueOrders hvo ON o.order_id = hvo.order_id;

-- Window Function with RANK
SELECT product_name, price,
  RANK() OVER(ORDER BY price DESC) as price_rank
FROM products;

-- Window Function with PARTITION BY
SELECT product_name, price, category,
  AVG(price) OVER(PARTITION BY category) as avg_category_price
FROM products;`,
    practiceData: {
      tableName: "products",
      columns: ["product_id", "product_name", "category", "price", "stock_quantity"],
      sampleData: [
        { product_id: 1, product_name: "Laptop", category: "Electronics", price: 999.99, stock_quantity: 50 },
        { product_id: 2, product_name: "Mouse", category: "Electronics", price: 29.99, stock_quantity: 200 },
        { product_id: 3, product_name: "Desk Chair", category: "Furniture", price: 199.99, stock_quantity: 30 },
        { product_id: 4, product_name: "Monitor", category: "Electronics", price: 299.99, stock_quantity: 75 },
        { product_id: 5, product_name: "Keyboard", category: "Electronics", price: 79.99, stock_quantity: 150 }
      ]
    },
    tasks: [
      {
        id: 1,
        description: "Create a CTE for Electronics products and select from it",
        hint: "Use WITH ElectronicsProducts AS (SELECT * FROM products WHERE category = 'Electronics') SELECT * FROM ElectronicsProducts",
        expectedQuery: "WITH ElectronicsProducts AS (SELECT * FROM products WHERE category = 'Electronics') SELECT * FROM ElectronicsProducts;"
      },
      {
        id: 2,
        description: "Rank products by price using RANK() window function",
        hint: "Use RANK() OVER(ORDER BY price DESC)",
        expectedQuery: "SELECT product_name, price, RANK() OVER(ORDER BY price DESC) as price_rank FROM products;"
      },
      {
        id: 3,
        description: "Show each product's price and the average price in its category using window function",
        hint: "Use AVG(price) OVER(PARTITION BY category)",
        expectedQuery: "SELECT product_name, price, category, AVG(price) OVER(PARTITION BY category) as avg_category_price FROM products;"
      }
    ]
  }
];
