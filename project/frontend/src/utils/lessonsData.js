// SQL Lessons Data - 8 comprehensive lessons with generic business tables
export const lessons = [
  {
    id: 1,
    title: "Introduction to SQL & SELECT",
    description: "Learn the fundamentals of SQL and how to retrieve data from database tables",
    theory: `## Introduction

SQL (Structured Query Language) is a programming language for managing data in relational databases.

It's the standard language used by developers, data analysts, and database administrators worldwide.

---

## Understanding Databases

### What is a Database?

A database is an organized collection of data stored and accessed electronically.

Think of it as a digital filing cabinet where information is stored in a structured format.

### What is a Table?

A table is a collection of related data organized in rows and columns.

Each table has a name and represents a specific entity (like employees, products, or customers).

Tables are similar to spreadsheets, but with strict rules about data types and relationships.

### What is a Row?

A row (also called a record or tuple) represents a single entry in a table.

Each row contains data for all columns defined in the table.

🧩 Example: One row in an employees table might contain: employee_id=1, name='John Smith', age=32, department='Engineering'.

### What is a Column?

A column (also called a field or attribute) represents a specific piece of information in a table.

All rows share the same columns.

🧩 Example: A 'salary' column contains salary values for all employees.

---

## The SELECT Statement

The SELECT statement is the foundation of SQL and is used to retrieve data from tables.

It's the most commonly used SQL command and allows you to query and view data.

### Retrieving All Columns

To retrieve all columns from a table, use \`SELECT * FROM table_name;\`.

The asterisk (*) is a wildcard that means 'all columns'.

💡 Tip: This is useful when exploring a table, but be cautious with large tables as it returns all data.

### Retrieving Specific Columns

To retrieve specific columns, list them separated by commas: \`SELECT column1, column2, column3 FROM table_name;\`.

This is more efficient than SELECT * because it only fetches the data you need.

Benefits include:
- Reduced network traffic
- Improved performance
- Clearer intent in your query

### Column Aliases with AS

You can rename columns in the result set using the AS keyword.

🧩 Example: \`SELECT name AS employee_name, salary AS monthly_salary FROM employees;\`

This doesn't change the column name in the table, only in the query results.

Aliases make results more readable and can be used in ORDER BY clauses.

---

## SQL Syntax Rules

Every SQL statement should end with a semicolon (;) to indicate the end of the command.

SQL keywords are case-insensitive (SELECT, select, Select all work).

💡 Tip: It's conventional to write keywords in UPPERCASE for readability.

⚠️ Note: Table and column names can be case-sensitive depending on the database system.

---

## Best Practices

Always specify the columns you need instead of using SELECT *.

Use meaningful aliases for better readability.

Keep queries readable with proper formatting and indentation.

---

## ✅ Quick Recap

- SELECT retrieves data from database tables
- Use SELECT * to get all columns (use with caution)
- Specify column names for better performance
- Use AS to create column aliases
- SQL keywords are case-insensitive (but use UPPERCASE by convention)
- Always end statements with a semicolon`,
    example: `-- Get all columns from employees table
SELECT * FROM employees;

-- Get specific columns
SELECT name, department, salary FROM employees;

-- Rename columns using AS (aliases)
SELECT name AS employee_name, 
       department AS dept, 
       salary AS monthly_salary 
FROM employees;

-- Combine columns in SELECT
SELECT name, 
       department, 
       salary,
       age 
FROM employees;`,
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
      },
      {
        id: 4,
        description: "Get employee names and salaries, but rename the salary column to 'monthly_salary' using AS",
        hint: "Use SELECT name, salary AS monthly_salary FROM employees;",
        expectedQuery: "SELECT name, salary AS monthly_salary FROM employees;"
      }
    ]
  },
  {
    id: 2,
    title: "Filtering with WHERE",
    description: "Learn how to filter data using the WHERE clause and various operators",
    theory: `## Introduction

The WHERE clause filters rows based on specific conditions.

It appears after the FROM clause and before ORDER BY or GROUP BY.

It helps limit results to only those that meet your criteria.

---

## Comparison Operators

SQL provides several comparison operators to compare values.

⚖️ Available operators:
- \`=\` (equals)
- \`!=\` or \`<>\` (not equals)
- \`<\` (less than)
- \`<=\` (less than or equal)
- \`>\` (greater than)
- \`>=\` (greater than or equal)

These operators work with numbers, dates, and text strings.

---

## Filtering by Text

When filtering text columns, use single quotes around the value.

🧩 Example: \`WHERE department = 'Engineering'\`

⚠️ Note: Text comparisons are case-sensitive in most databases.

'Engineering' is not the same as 'engineering'.

---

## Filtering by Numbers

Number comparisons don't require quotes.

🧩 Example: \`WHERE salary > 70000\`

You can use any comparison operator with numeric values.

---

## Combining Conditions

### The AND Operator

Use \`AND\` to combine multiple conditions where ALL conditions must be true.

🧩 Example: \`WHERE department = 'Engineering' AND salary > 70000\`

Both conditions must be satisfied for a row to be included.

### The OR Operator

Use \`OR\` to combine conditions where AT LEAST ONE condition must be true.

🧩 Example: \`WHERE department = 'Engineering' OR department = 'Sales'\`

If either condition is true, the row is included.

⚠️ Note: Be careful with AND/OR combinations - use parentheses to clarify logic.

🧩 Example: \`WHERE (department = 'Engineering' OR department = 'Sales') AND salary > 70000\`

### The NOT Operator

Use \`NOT\` to negate a condition.

🧩 Example: \`WHERE NOT department = 'HR'\` is equivalent to \`WHERE department != 'HR'\`

NOT can be combined with AND and OR for complex logic.

---

## Advanced Operators

### The IN Operator

Use \`IN\` to check if a value exists in a list of values.

🧩 Example: \`WHERE department IN ('Engineering', 'Sales', 'Marketing')\`

This is more readable than multiple OR conditions.

💡 Tip: Equivalent to \`WHERE department = 'Engineering' OR department = 'Sales' OR department = 'Marketing'\`

### The NOT IN Operator

Use \`NOT IN\` to exclude values that are in a list.

🧩 Example: \`WHERE department NOT IN ('HR', 'Finance')\`

Returns all rows where the department is NOT in the specified list.

### The BETWEEN Operator

Use \`BETWEEN\` to check if a value is within a range (inclusive on both ends).

🧩 Example: \`WHERE salary BETWEEN 50000 AND 80000\`

Equivalent to \`WHERE salary >= 50000 AND salary <= 80000\`

💡 Tip: BETWEEN works with numbers, dates, and text (alphabetical order).

### The LIKE Operator

Use \`LIKE\` for pattern matching with text.

🧩 Example: \`WHERE name LIKE 'John%'\` finds names starting with 'John'.

Wildcards:
- \`%\` matches any sequence of characters
- \`_\` matches a single character

More examples:
- \`LIKE '%Smith'\` finds names ending with 'Smith'
- \`LIKE '_ohn%'\` finds names with 'ohn' as the 2nd-4th characters

---

## NULL Values

Use \`IS NULL\` to check for NULL values.

🧩 Example: \`WHERE department IS NULL\`

Use \`IS NOT NULL\` to exclude NULL values.

🧩 Example: \`WHERE salary IS NOT NULL\`

⚠️ Note: \`WHERE column = NULL\` doesn't work - always use \`IS NULL\` or \`IS NOT NULL\`.

---

## Operator Precedence

SQL evaluates conditions in this order:
1. Parentheses
2. NOT
3. AND
4. OR

💡 Tip: Always use parentheses to make your logic clear when combining multiple operators.

---

## ✅ Quick Recap

- WHERE filters rows based on a condition
- Use = != < > <= >= for comparisons
- Combine filters using AND and OR
- Use parentheses for complex conditions
- IN checks if a value is in a list
- BETWEEN checks if a value is in a range
- LIKE matches patterns with wildcards
- Use IS NULL to check for NULL values`,
    example: `-- Find employees in Engineering department
SELECT * FROM employees 
WHERE department = 'Engineering';

-- Find employees with salary greater than 70000
SELECT name, salary FROM employees 
WHERE salary > 70000;

-- Multiple conditions with AND (both must be true)
SELECT * FROM employees 
WHERE department = 'Engineering' AND salary > 70000;

-- Multiple conditions with OR (at least one must be true)
SELECT * FROM employees 
WHERE department = 'Engineering' OR department = 'Sales';

-- Using IN operator (equivalent to multiple OR conditions)
SELECT * FROM employees 
WHERE department IN ('Engineering', 'Sales', 'Marketing');

-- Using NOT IN to exclude departments
SELECT * FROM employees 
WHERE department NOT IN ('HR', 'Finance');

-- Using BETWEEN for ranges (inclusive)
SELECT * FROM employees 
WHERE salary BETWEEN 60000 AND 80000;

-- Using NOT to negate a condition
SELECT * FROM employees 
WHERE NOT department = 'HR';

-- Combining AND and OR with parentheses
SELECT * FROM employees 
WHERE (department = 'Engineering' OR department = 'Sales') 
  AND salary > 70000;`,
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
      },
      {
        id: 5,
        description: "Find employees whose salary is between 60000 and 80000 (inclusive)",
        hint: "Use BETWEEN 60000 AND 80000",
        expectedQuery: "SELECT name, salary FROM employees WHERE salary BETWEEN 60000 AND 80000;"
      },
      {
        id: 6,
        description: "Find employees in either Engineering or Sales department using IN",
        hint: "Use WHERE department IN ('Engineering', 'Sales')",
        expectedQuery: "SELECT * FROM employees WHERE department IN ('Engineering', 'Sales');"
      }
    ]
  },
  {
    id: 3,
    title: "Sorting and Limiting Results",
    description: "Learn how to organize and limit your query results",
    theory: `## Introduction

The ORDER BY clause sorts the result set by one or more columns.

Without ORDER BY, SQL doesn't guarantee any specific order of rows.

ORDER BY allows you to control exactly how your data is presented.

---

## Sorting Order

### Ascending Order (ASC)

Use \`ORDER BY column ASC\` for ascending order.

Numbers go from lowest to highest (1, 2, 3...).

Dates go from earliest to latest.

Text goes alphabetically from A to Z.

💡 Tip: ASC is the default, so \`ORDER BY column\` is the same as \`ORDER BY column ASC\`.

### Descending Order (DESC)

Use \`ORDER BY column DESC\` for descending order.

Numbers go from highest to lowest (100, 50, 10...).

Dates go from latest to earliest.

Text goes reverse alphabetically from Z to A.

---

## Advanced Sorting

### Sorting by Multiple Columns

You can sort by multiple columns to create more complex sorting logic.

🧩 Example: \`ORDER BY column1 DESC, column2 ASC\`

SQL first sorts by column1 in descending order.

Then, for rows with the same value in column1, it sorts by column2 in ascending order.

💡 Tip: Useful for sorting employees by department, then by salary within each department.

### Sorting NULL Values

NULL values are typically sorted to the end in ascending order.

In descending order, NULLs typically go to the beginning.

⚠️ Note: This behavior can vary between database systems.

Some databases support \`NULLS FIRST\` or \`NULLS LAST\` for explicit control.

### ORDER BY with Column Positions

Instead of column names, you can use column positions.

🧩 Example: \`ORDER BY 2 DESC\` sorts by the second column in the SELECT list.

💡 Tip: Using column names is more readable and maintainable.

### ORDER BY with Expressions

You can sort by calculated expressions.

🧩 Example: \`ORDER BY salary * 12 DESC\` sorts by annual salary.

You can also use functions in ORDER BY.

🧩 Example: \`ORDER BY UPPER(name)\` for case-insensitive alphabetical sorting.

---

## The LIMIT Clause

The LIMIT clause restricts the number of rows returned by a query.

Use \`LIMIT n\` to get only the first n rows.

This is extremely useful for getting top N records.

### LIMIT with ORDER BY

The most common pattern is combining LIMIT with ORDER BY.

🧩 Example: \`ORDER BY salary DESC LIMIT 5\` gets the 5 highest salaries.

⚠️ Note: Without ORDER BY, LIMIT returns an arbitrary set of rows.

Always use ORDER BY before LIMIT when you need specific top/bottom records.

### OFFSET with LIMIT

You can skip rows using OFFSET.

🧩 Example: \`LIMIT 10 OFFSET 20\` skips the first 20 rows and returns the next 10.

This is useful for pagination.

💡 Tip: Some databases use \`LIMIT 20, 10\` (skip 20, take 10) as an alternative syntax.

---

## Performance Considerations

ORDER BY can be slow on large tables, especially without indexes.

LIMIT helps reduce the amount of data processed.

💡 Tip: Always use ORDER BY before LIMIT when you need specific top/bottom records.

---

## ✅ Quick Recap

- ORDER BY sorts results by one or more columns
- ASC is ascending (default), DESC is descending
- Sort by multiple columns for complex ordering
- LIMIT restricts the number of rows returned
- Always combine LIMIT with ORDER BY for top/bottom records
- OFFSET skips rows (useful for pagination)`,
    example: `-- Sort by salary, highest first (descending)
SELECT name, salary FROM employees 
ORDER BY salary DESC;

-- Sort by name alphabetically (ascending - ASC is optional)
SELECT name, department FROM employees 
ORDER BY name ASC;

-- Combine WHERE and ORDER BY
SELECT name, salary FROM employees 
WHERE department = 'Engineering' 
ORDER BY salary ASC;

-- Sort by multiple columns
SELECT name, department, salary FROM employees 
ORDER BY department ASC, salary DESC;

-- Get top 3 highest paid employees
SELECT name, salary FROM employees 
ORDER BY salary DESC 
LIMIT 3;

-- Get first 2 employees (no specific order)
SELECT * FROM employees 
LIMIT 2;`,
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
      },
      {
        id: 4,
        description: "Get employees sorted by department (A-Z), then by salary (highest first) within each department",
        hint: "Use ORDER BY department ASC, salary DESC",
        expectedQuery: "SELECT name, department, salary FROM employees ORDER BY department ASC, salary DESC;"
      }
    ]
  },
  {
    id: 4,
    title: "Aggregation (COUNT, SUM, AVG, MIN, MAX)",
    description: "Learn how to calculate statistics and aggregate data",
    theory: `## Introduction

Aggregate functions perform calculations on a set of rows and return a single summary value.

They are essential for data analysis and reporting.

They allow you to compute statistics, totals, averages, and more from your data.

---

## Aggregate Functions

### COUNT() Function

The COUNT() function counts the number of rows.

\`COUNT(*)\` counts all rows, including those with NULL values.

\`COUNT(column_name)\` counts only non-NULL values in that column.

\`COUNT(DISTINCT column_name)\` counts the number of unique, non-NULL values.

### SUM() Function

The SUM() function calculates the sum (total) of all values in a numeric column.

It ignores NULL values.

🧩 Example: \`SELECT SUM(salary) FROM employees;\`

Use it for calculating totals like total sales, total salary, etc.

### AVG() Function

The AVG() function calculates the average (mean) of all values in a numeric column.

It ignores NULL values.

The result is the sum divided by the count of non-NULL values.

🧩 Example: \`SELECT AVG(salary) FROM employees;\`

### MIN() Function

The MIN() function returns the minimum (smallest) value in a column.

It works with numbers, dates, and text (alphabetical order).

For text, it returns the value that comes first alphabetically.

🧩 Example: \`SELECT MIN(salary) FROM employees;\`

### MAX() Function

The MAX() function returns the maximum (largest) value in a column.

It works with numbers, dates, and text (alphabetical order).

For text, it returns the value that comes last alphabetically.

🧩 Example: \`SELECT MAX(salary) FROM employees;\`

---

## Working with NULL Values

All aggregate functions except COUNT(*) ignore NULL values.

This means if you have 10 employees but 2 have NULL salaries, \`AVG(salary)\` calculates the average from the 8 non-NULL values, not 10.

⚠️ Note: COUNT(*) counts all rows, while COUNT(column) counts only non-NULL values.

---

## Advanced Usage

### Counting Unique Values

Use \`COUNT(DISTINCT column)\` to count unique values.

🧩 Example: \`SELECT COUNT(DISTINCT department) FROM employees;\`

This returns the number of different departments.

💡 Tip: Useful for finding how many unique categories exist.

### Combining Aggregate Functions

You can use multiple aggregate functions in a single query.

🧩 Example: \`SELECT COUNT(*), AVG(salary), MIN(salary), MAX(salary) FROM employees;\`

This gives you comprehensive statistics in one query.

### Aggregate Functions with WHERE

You can combine aggregate functions with WHERE to calculate statistics on filtered data.

🧩 Example: \`SELECT AVG(salary) FROM employees WHERE department = 'Engineering';\`

This calculates the average salary only for Engineering employees.

---

## Important Rules

When using aggregate functions, you cannot mix aggregated columns with non-aggregated columns in the SELECT clause unless you use GROUP BY.

⚠️ Note: \`SELECT name, AVG(salary) FROM employees;\` is invalid because 'name' is not aggregated.

You'll learn about GROUP BY in the next lesson.

---

## Performance Considerations

Aggregate functions can be slow on large tables, especially COUNT(*) on very large tables.

💡 Tip: Using COUNT(column) instead of COUNT(*) can sometimes be faster if the column is indexed.

---

## ✅ Quick Recap

- COUNT() counts rows or non-NULL values
- SUM() calculates the total of numeric values
- AVG() calculates the average of numeric values
- MIN() and MAX() find the smallest and largest values
- All aggregate functions (except COUNT(*)) ignore NULL values
- Use COUNT(DISTINCT column) to count unique values
- You cannot mix aggregated and non-aggregated columns without GROUP BY`,
    example: `-- Count total number of employees
SELECT COUNT(*) FROM employees;

-- Count non-NULL values in a column
SELECT COUNT(salary) FROM employees;

-- Count unique departments
SELECT COUNT(DISTINCT department) FROM employees;

-- Calculate total salary
SELECT SUM(salary) FROM employees;

-- Calculate average salary
SELECT AVG(salary) FROM employees;

-- Find minimum salary
SELECT MIN(salary) FROM employees;

-- Find maximum salary
SELECT MAX(salary) FROM employees;

-- Combine multiple aggregate functions
SELECT COUNT(*) AS total_employees,
       AVG(salary) AS avg_salary,
       MIN(salary) AS min_salary,
       MAX(salary) AS max_salary
FROM employees;

-- Aggregate with WHERE clause
SELECT AVG(salary) FROM employees 
WHERE department = 'Engineering';`,
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
        description: "Find the highest salary",
        hint: "Use SELECT MAX(salary) FROM employees",
        expectedQuery: "SELECT MAX(salary) FROM employees;"
      },
      {
        id: 4,
        description: "Find the lowest salary",
        hint: "Use SELECT MIN(salary) FROM employees",
        expectedQuery: "SELECT MIN(salary) FROM employees;"
      },
      {
        id: 5,
        description: "Count how many unique departments there are",
        hint: "Use SELECT COUNT(DISTINCT department) FROM employees",
        expectedQuery: "SELECT COUNT(DISTINCT department) FROM employees;"
      }
    ]
  },
  {
    id: 5,
    title: "GROUP BY and HAVING",
    description: "Learn how to group data and filter groups",
    theory: `## Introduction

The GROUP BY clause groups rows that have the same values in specified columns.

It's used with aggregate functions to perform calculations on each group separately.

🧩 Example: You can calculate the average salary for each department, or count employees in each department.

---

## How GROUP BY Works

When you use GROUP BY, SQL divides the result set into groups based on the specified columns.

Then, aggregate functions are applied to each group independently.

🧩 Example: \`SELECT department, COUNT(*) FROM employees GROUP BY department;\`

This creates one group for each unique department and counts rows in each group.

---

## SELECT Clause Rules

When using GROUP BY, every column in the SELECT clause must either be:
1. Part of the GROUP BY clause, or
2. An aggregate function

You cannot select individual rows' columns that aren't grouped.

⚠️ Note: \`SELECT name, department, COUNT(*) FROM employees GROUP BY department;\` is invalid because 'name' is not grouped or aggregated.

---

## Grouping by Multiple Columns

You can group by multiple columns.

🧩 Example: \`GROUP BY department, age\`

This creates groups for each unique combination of department and age.

💡 Tip: Useful for more granular analysis like 'count employees by department and age range'.

---

## Aggregate Functions with GROUP BY

All aggregate functions (COUNT, SUM, AVG, MIN, MAX) work with GROUP BY.

Each group gets its own aggregate calculation.

🧩 Example: \`SELECT department, AVG(salary) FROM employees GROUP BY department;\`

This calculates the average salary separately for each department.

---

## The HAVING Clause

HAVING is used to filter groups after they've been created by GROUP BY.

It's similar to WHERE, but WHERE filters individual rows before grouping.

HAVING filters groups after aggregation.

🧩 Example: \`SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 1;\`

This shows only departments with more than 1 employee.

---

## WHERE vs HAVING

### Using WHERE

Use WHERE to filter rows before grouping.

🧩 Example: \`SELECT department, AVG(salary) FROM employees WHERE age > 30 GROUP BY department;\`

This filters employees over 30, then groups them.

### Using HAVING

Use HAVING to filter groups after aggregation.

🧩 Example: \`SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 70000;\`

This shows only departments with average salary over 70000.

### Using Both WHERE and HAVING

You can use both WHERE and HAVING in the same query.

🧩 Example: \`SELECT department, AVG(salary) FROM employees WHERE age > 25 GROUP BY department HAVING AVG(salary) > 70000;\`

Execution order:
1. WHERE filters rows (employees over 25)
2. GROUP BY groups them
3. HAVING filters groups (departments with avg salary > 70000)

---

## Advanced HAVING

### HAVING with Aggregate Functions

In HAVING, you can use aggregate functions that weren't in SELECT.

🧩 Example: \`SELECT department FROM employees GROUP BY department HAVING COUNT(*) > 2 AND AVG(salary) > 75000;\`

This is useful for complex filtering conditions.

### ORDER BY with GROUP BY

You can combine ORDER BY with GROUP BY to sort the grouped results.

🧩 Example: \`SELECT department, COUNT(*) FROM employees GROUP BY department ORDER BY COUNT(*) DESC;\`

This shows departments ordered by employee count.

---

## Common GROUP BY Patterns

Common patterns include:
- Counting by category: \`GROUP BY category\`
- Calculating averages by group: \`GROUP BY department\` with \`AVG()\`
- Finding min/max per group: \`GROUP BY category\` with \`MIN()/MAX()\`
- Summing values by group: \`GROUP BY product\` with \`SUM()\`

---

## Performance Considerations

GROUP BY can be slow on large tables.

💡 Tip: Ensure the columns you're grouping by are indexed if possible.

Using HAVING to filter groups is more efficient than filtering after the query returns all groups.

---

## ✅ Quick Recap

- GROUP BY groups rows with the same values in specified columns
- All SELECT columns must be in GROUP BY or be aggregate functions
- HAVING filters groups after aggregation
- WHERE filters rows before grouping
- You can use both WHERE and HAVING in the same query
- ORDER BY can be combined with GROUP BY to sort grouped results`,
    example: `-- Group by department and count employees
SELECT department, COUNT(*) AS employee_count 
FROM employees 
GROUP BY department;

-- Group by department and calculate average salary
SELECT department, AVG(salary) AS avg_salary 
FROM employees 
GROUP BY department;

-- Group by department and find min/max salary
SELECT department, 
       MIN(salary) AS min_salary,
       MAX(salary) AS max_salary 
FROM employees 
GROUP BY department;

-- Use HAVING to filter groups
SELECT department, COUNT(*) AS employee_count 
FROM employees 
GROUP BY department 
HAVING COUNT(*) > 1;

-- Use HAVING with aggregate function condition
SELECT department, AVG(salary) AS avg_salary 
FROM employees 
GROUP BY department 
HAVING AVG(salary) > 70000;

-- Combine WHERE and HAVING
SELECT department, AVG(salary) AS avg_salary 
FROM employees 
WHERE age > 30 
GROUP BY department 
HAVING AVG(salary) > 70000;

-- Group by multiple columns
SELECT department, age, COUNT(*) 
FROM employees 
GROUP BY department, age;`,
    practiceData: {
      tableName: "employees",
      columns: ["employee_id", "name", "age", "department", "salary"],
      sampleData: [
        { employee_id: 1, name: "John Smith", age: 32, department: "Engineering", salary: 75000 },
        { employee_id: 2, name: "Sarah Johnson", age: 28, department: "Marketing", salary: 65000 },
        { employee_id: 3, name: "Michael Brown", age: 45, department: "Sales", salary: 80000 },
        { employee_id: 4, name: "Emily Davis", age: 35, department: "Engineering", salary: 78000 },
        { employee_id: 5, name: "David Wilson", age: 29, department: "HR", salary: 60000 },
        { employee_id: 6, name: "Lisa Anderson", age: 31, department: "Engineering", salary: 72000 }
      ]
    },
    tasks: [
      {
        id: 1,
        description: "Group employees by department and count each group",
        hint: "Use GROUP BY department with COUNT(*)",
        expectedQuery: "SELECT department, COUNT(*) FROM employees GROUP BY department;"
      },
      {
        id: 2,
        description: "Group by department and calculate the average salary for each department",
        hint: "Use GROUP BY department with AVG(salary)",
        expectedQuery: "SELECT department, AVG(salary) FROM employees GROUP BY department;"
      },
      {
        id: 3,
        description: "Find departments that have more than 1 employee using HAVING",
        hint: "Use GROUP BY department HAVING COUNT(*) > 1",
        expectedQuery: "SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 1;"
      },
      {
        id: 4,
        description: "Find departments with average salary greater than 70000 using HAVING",
        hint: "Use GROUP BY department HAVING AVG(salary) > 70000",
        expectedQuery: "SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 70000;"
      }
    ]
  },
  {
    id: 6,
    title: "INNER JOINS",
    description: "Learn how to combine data from multiple tables using INNER JOIN",
    theory: `## Introduction

JOINs allow you to combine rows from two or more tables based on a related column between them.

This is one of the most powerful features of SQL.

They allow you to work with related data stored in separate tables.

JOINs are essential for working with normalized databases.

---

## Why Use JOINs?

In a well-designed database, data is normalized.

This means it's organized into separate tables to avoid redundancy.

🧩 Example: Employee information might be in an 'employees' table, and their orders in an 'orders' table.

JOINs let you combine this related data when you need it.

---

## Understanding Relationships

Tables are related through keys.

A primary key uniquely identifies each row in a table (like employee_id).

A foreign key is a column in one table that references the primary key of another table.

🧩 Example: customer_id in orders table references customer_id in customers table.

---

## INNER JOIN Basics

INNER JOIN (or just JOIN) returns only rows that have matching values in both tables.

If a row in the left table has no match in the right table (or vice versa), it's excluded from the results.

INNER JOIN is the most common type of JOIN.

---

## INNER JOIN Syntax

The basic syntax is: \`SELECT columns FROM table1 INNER JOIN table2 ON table1.column = table2.column;\`

The ON clause specifies how the tables are related - which columns should match.

💡 Tip: You can also write just \`JOIN\` instead of \`INNER JOIN\` - they're the same.

---

## Table Aliases

Use table aliases to make queries shorter and more readable.

🧩 Example: \`SELECT c.name, o.order_date FROM customers c JOIN orders o ON c.customer_id = o.customer_id;\`

The alias 'c' stands for customers and 'o' stands for orders.

You can use the AS keyword (\`customers AS c\`) or just a space (\`customers c\`).

---

## Qualifying Column Names

When joining tables, if columns have the same name in both tables (like 'name' in both customers and employees), you must qualify them.

Use the table name or alias: \`customers.name\` or \`c.name\`.

This tells SQL which table's column you're referring to.

---

## JOIN with WHERE Clause

You can combine JOIN with WHERE to filter the joined results.

🧩 Example: \`SELECT c.name, o.total_amount FROM customers c JOIN orders o ON c.customer_id = o.customer_id WHERE o.total_amount > 500;\`

The WHERE clause filters after the join is performed.

---

## Joining Multiple Tables

You can join more than two tables by chaining JOINs.

🧩 Example: \`SELECT c.name, o.order_date, p.product_name FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_items oi ON o.order_id = oi.order_id JOIN products p ON oi.product_id = p.product_id;\`

Each JOIN connects another table.

---

## JOIN Conditions

The ON clause can have multiple conditions.

🧩 Example: \`SELECT * FROM employees e JOIN departments d ON e.department_id = d.department_id AND d.location = 'New York';\`

You can use AND/OR in the ON clause.

💡 Tip: Complex conditions are often better in WHERE.

---

## Performance Considerations

JOINs can be slow on large tables.

💡 Tip: Ensure the columns used in JOIN conditions (especially foreign keys) are indexed.

The order of JOINs can sometimes affect performance, but modern databases usually optimize this automatically.

---

## Common JOIN Patterns

Common patterns include:
- Joining customers with orders
- Joining products with categories
- Joining employees with departments
- Joining orders with order items and products

These patterns appear frequently in real-world applications.

---

## ✅ Quick Recap

- JOINs combine rows from multiple tables based on related columns
- INNER JOIN returns only matching rows from both tables
- Use table aliases to make queries more readable
- Qualify column names when they exist in multiple tables
- You can join multiple tables by chaining JOINs
- WHERE filters results after the join is performed
- Ensure join columns are indexed for better performance`,
    example: `-- Basic INNER JOIN
SELECT c.name, o.order_date, o.total_amount 
FROM customers c 
INNER JOIN orders o ON c.customer_id = o.customer_id;

-- JOIN (same as INNER JOIN)
SELECT c.name, o.order_date 
FROM customers c 
JOIN orders o ON c.customer_id = o.customer_id;

-- JOIN with WHERE clause
SELECT c.name, o.order_date, o.total_amount 
FROM customers c 
JOIN orders o ON c.customer_id = o.customer_id 
WHERE o.status = 'Completed';

-- JOIN with table aliases
SELECT c.name AS customer_name, 
       o.order_date, 
       o.total_amount 
FROM customers c 
JOIN orders o ON c.customer_id = o.customer_id;

-- Joining multiple tables
SELECT c.name, o.order_date, p.product_name 
FROM customers c 
JOIN orders o ON c.customer_id = o.customer_id 
JOIN order_items oi ON o.order_id = oi.order_id 
JOIN products p ON oi.product_id = p.product_id;`,
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
          { order_id: 3, customer_id: 1, order_date: "2025-01-17", total_amount: 199.99, status: "Completed" },
          { order_id: 4, customer_id: 3, order_date: "2025-01-18", total_amount: 549.99, status: "Completed" }
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
      },
      {
        id: 3,
        description: "Join customers and orders, showing customer name, order date, and total amount, ordered by total amount descending",
        hint: "Use JOIN and ORDER BY o.total_amount DESC",
        expectedQuery: "SELECT c.name, o.order_date, o.total_amount FROM customers c JOIN orders o ON c.customer_id = o.customer_id ORDER BY o.total_amount DESC;"
      }
    ]
  },
  {
    id: 7,
    title: "OUTER JOINS (LEFT, RIGHT, FULL)",
    description: "Learn about OUTER JOINs and how they handle NULL values",
    theory: `## Introduction

INNER JOIN returns only matching rows from both tables.

OUTER JOINs return all rows from one or both tables, even when there's no match.

When there's no match, NULL values are filled in for columns from the table without a matching row.

---

## LEFT JOIN (LEFT OUTER JOIN)

LEFT JOIN returns all rows from the left table (first table) and matched rows from the right table (second table).

If there's no match in the right table, NULL values are returned for right table columns.

LEFT JOIN is very common and useful for finding 'all X, and their Y if they have one' scenarios.

### LEFT JOIN Syntax

The syntax is: \`SELECT columns FROM table1 LEFT JOIN table2 ON table1.column = table2.column;\`

All rows from table1 are included, even if they have no match in table2.

💡 Tip: You can write \`LEFT OUTER JOIN\` or just \`LEFT JOIN\` - they're the same.

---

## RIGHT JOIN (RIGHT OUTER JOIN)

RIGHT JOIN returns all rows from the right table and matched rows from the left table.

If there's no match in the left table, NULL values are returned.

⚠️ Note: RIGHT JOIN is less commonly used - you can usually achieve the same result by switching the table order and using LEFT JOIN.

---

## FULL JOIN (FULL OUTER JOIN)

FULL JOIN returns all rows from both tables.

If there's a match, the rows are combined.

If there's no match in either table, NULL values are filled in.

FULL JOIN is useful when you want to see all data from both tables, matched or not.

⚠️ Note: SQLite doesn't support FULL JOIN, but our system may support it.

---

## Handling NULL Values

When OUTER JOINs return NULL values, you need to be careful with your conditions.

Use \`IS NULL\` to find rows with no match.

🧩 Example: \`SELECT c.name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;\`

This finds customers with no orders.

---

## LEFT JOIN for Finding Missing Relationships

LEFT JOIN is commonly used to find rows in one table that don't have a match in another.

🧩 Example: \`SELECT c.name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;\`

This shows customers who have never placed an order.

---

## Multiple LEFT JOINs

You can chain multiple LEFT JOINs.

🧩 Example: \`SELECT c.name, o.order_date, p.product_name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id LEFT JOIN order_items oi ON o.order_id = oi.order_id LEFT JOIN products p ON oi.product_id = p.product_id;\`

Each LEFT JOIN preserves all rows from the left side.

---

## LEFT JOIN vs INNER JOIN

Use INNER JOIN when you only want rows that have matches in both tables.

Use LEFT JOIN when you want all rows from the left table, regardless of whether they have matches.

🧩 Example: 'all customers and their orders' uses LEFT JOIN, while 'customers who have orders' uses INNER JOIN.

---

## COALESCE with OUTER JOINs

Use COALESCE to handle NULL values.

🧩 Example: \`SELECT c.name, COALESCE(o.total_amount, 0) AS total FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id;\`

COALESCE returns the first non-NULL value, so it replaces NULL with 0.

---

## Performance Considerations

OUTER JOINs can be slower than INNER JOINs because they return more rows.

💡 Tip: Ensure join columns are indexed.

LEFT JOIN is usually faster than RIGHT JOIN or FULL JOIN because of how databases optimize queries.

---

## When to Use Each JOIN Type

Use INNER JOIN for: finding related data that exists in both tables.

Use LEFT JOIN for: showing all records from the main table with optional related data.

Use RIGHT JOIN for: showing all records from the secondary table (rare).

Use FULL JOIN for: showing all records from both tables (rare).

---

## ✅ Quick Recap

- LEFT JOIN returns all rows from the left table and matched rows from the right
- RIGHT JOIN returns all rows from the right table and matched rows from the left
- FULL JOIN returns all rows from both tables
- Use IS NULL to find rows with no matches
- LEFT JOIN is commonly used to find missing relationships
- OUTER JOINs can be slower than INNER JOINs
- Use COALESCE to handle NULL values`,
    example: `-- LEFT JOIN: All customers and their orders (if any)
SELECT c.name, o.order_date, o.total_amount 
FROM customers c 
LEFT JOIN orders o ON c.customer_id = o.customer_id;

-- LEFT JOIN to find customers with no orders
SELECT c.name 
FROM customers c 
LEFT JOIN orders o ON c.customer_id = o.customer_id 
WHERE o.order_id IS NULL;

-- RIGHT JOIN: All orders and their customers
SELECT c.name, o.order_date 
FROM customers c 
RIGHT JOIN orders o ON c.customer_id = o.customer_id;

-- LEFT JOIN with multiple conditions
SELECT c.name, o.order_date, o.status 
FROM customers c 
LEFT JOIN orders o ON c.customer_id = o.customer_id 
  AND o.status = 'Completed';

-- LEFT JOIN with WHERE (filters after join)
SELECT c.name, o.order_date 
FROM customers c 
LEFT JOIN orders o ON c.customer_id = o.customer_id 
WHERE o.status = 'Completed' OR o.status IS NULL;`,
    practiceData: {
      tableName: "customers",
      columns: ["customer_id", "name", "email", "city", "country"],
      sampleData: [
        { customer_id: 1, name: "Alice Cooper", email: "alice@email.com", city: "New York", country: "USA" },
        { customer_id: 2, name: "Bob Miller", email: "bob@email.com", city: "London", country: "UK" },
        { customer_id: 3, name: "Carol White", email: "carol@email.com", city: "Toronto", country: "Canada" },
        { customer_id: 4, name: "David Lee", email: "david@email.com", city: "Sydney", country: "Australia" }
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
        description: "Use LEFT JOIN to show all customers and their order dates (include customers with no orders)",
        hint: "Use LEFT JOIN customers c LEFT JOIN orders o ON c.customer_id = o.customer_id",
        expectedQuery: "SELECT c.name, o.order_date FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id;"
      },
      {
        id: 2,
        description: "Find customers who have never placed an order using LEFT JOIN",
        hint: "Use LEFT JOIN and WHERE o.order_id IS NULL",
        expectedQuery: "SELECT c.name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;"
      },
      {
        id: 3,
        description: "Show all customers with their order counts (including customers with 0 orders)",
        hint: "Use LEFT JOIN with COUNT, and GROUP BY customer",
        expectedQuery: "SELECT c.name, COUNT(o.order_id) AS order_count FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.name;"
      }
    ]
  },
  {
    id: 8,
    title: "Subqueries and Derived Tables",
    description: "Learn how to write queries within queries for complex data retrieval",
    theory: `## Introduction

A subquery (also called a nested query or inner query) is a SQL query nested inside another SQL query.

The outer query uses the results of the inner query.

Subqueries are powerful tools for solving complex problems that would be difficult or impossible to solve with a single query.

---

## Subquery Execution Order

Subqueries are executed first, and their results are used by the outer query.

The database engine processes the innermost subquery first, then works its way outward.

Understanding this execution order helps you write efficient and correct subqueries.

---

## Subqueries in WHERE Clause

The most common use of subqueries is in the WHERE clause.

You can use subqueries with comparison operators (\`=\`, \`>\`, \`<\`, etc.) when the subquery returns a single value.

🧩 Example: \`SELECT * FROM products WHERE price > (SELECT AVG(price) FROM products);\`

⚠️ Note: The subquery must return exactly one row and one column for comparison operators.

---

## Subqueries with IN Operator

Use subqueries with \`IN\` when the subquery can return multiple values.

🧩 Example: \`SELECT * FROM products WHERE product_id IN (SELECT product_id FROM order_items WHERE quantity > 1);\`

This finds all products that have been ordered in quantities greater than 1.

The subquery can return multiple rows and one column.

---

## Subqueries with NOT IN

Use \`NOT IN\` with subqueries to exclude values.

🧩 Example: \`SELECT * FROM products WHERE product_id NOT IN (SELECT DISTINCT product_id FROM order_items);\`

This finds products that have never been ordered.

⚠️ Note: Be careful with NULL values in NOT IN - if the subquery returns NULL, the entire condition becomes NULL (which is treated as false).

---

## Subqueries in FROM Clause (Derived Tables)

You can use a subquery in the FROM clause, creating a 'derived table' or 'inline view'.

🧩 Example: \`SELECT * FROM (SELECT department, AVG(salary) AS avg_sal FROM employees GROUP BY department) AS dept_avg WHERE avg_sal > 70000;\`

The subquery creates a temporary table that the outer query uses.

⚠️ Note: You must give derived tables an alias.

---

## Correlated Subqueries

A correlated subquery references columns from the outer query.

🧩 Example: \`SELECT * FROM employees e1 WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.department = e1.department);\`

This finds employees who earn more than their department's average.

⚠️ Note: Correlated subqueries execute once for each row in the outer query, so they can be slower.

---

## Subqueries in SELECT Clause

You can use subqueries in the SELECT clause to add calculated columns.

🧩 Example: \`SELECT name, salary, (SELECT AVG(salary) FROM employees) AS company_avg FROM employees;\`

This adds the company average salary to each row.

⚠️ Note: Subqueries in SELECT must return a single value for each row.

---

## Subqueries vs JOINs

Many subquery problems can also be solved with JOINs, and vice versa.

JOINs are usually faster, but subqueries can be more readable for certain problems.

🧩 Example: Finding 'employees who earn more than average' can use a subquery or a JOIN with a derived table - both work.

---

## EXISTS and NOT EXISTS

Use \`EXISTS\` with subqueries to check if any rows exist.

🧩 Example: \`SELECT * FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);\`

EXISTS returns true if the subquery returns any rows, false otherwise.

💡 Tip: EXISTS is often faster than IN for large datasets.

NOT EXISTS finds rows with no matches.

---

## Multiple Levels of Nesting

You can nest subqueries multiple levels deep.

🧩 Example: \`SELECT * FROM table1 WHERE col1 IN (SELECT col2 FROM table2 WHERE col3 IN (SELECT col4 FROM table3));\`

⚠️ Note: Deep nesting can be hard to read and maintain - consider using JOINs or CTEs (Common Table Expressions) for complex cases.

---

## Performance Considerations

Subqueries can be slow, especially correlated subqueries that execute once per row.

💡 Tip: Ensure columns used in subquery conditions are indexed.

Consider rewriting as JOINs if performance is an issue.

Using EXISTS instead of IN can sometimes improve performance.

---

## ✅ Quick Recap

- Subqueries are queries nested inside other queries
- Subqueries are executed first, then the outer query uses their results
- Use subqueries in WHERE, FROM, and SELECT clauses
- Correlated subqueries reference columns from the outer query
- EXISTS is often faster than IN for large datasets
- Consider using JOINs or CTEs for complex cases
- Ensure subquery columns are indexed for better performance`,
    example: `-- Subquery in WHERE with comparison operator
SELECT product_name, price 
FROM products 
WHERE price > (
  SELECT AVG(price) 
  FROM products
);

-- Subquery with IN operator
SELECT product_name 
FROM products 
WHERE product_id IN (
  SELECT product_id 
  FROM order_items 
  WHERE quantity > 1
);

-- Subquery with NOT IN
SELECT product_name 
FROM products 
WHERE product_id NOT IN (
  SELECT DISTINCT product_id 
  FROM order_items
  WHERE product_id IS NOT NULL
);

-- Derived table (subquery in FROM clause)
SELECT dept, avg_salary 
FROM (
  SELECT department AS dept, AVG(salary) AS avg_salary 
  FROM employees 
  GROUP BY department
) AS dept_avg 
WHERE avg_salary > 70000;

-- Correlated subquery
SELECT name, salary, department 
FROM employees e1 
WHERE salary > (
  SELECT AVG(salary) 
  FROM employees e2 
  WHERE e2.department = e1.department
);

-- Subquery in SELECT clause
SELECT name, salary, 
  (SELECT AVG(salary) FROM employees) AS company_avg 
FROM employees;

-- EXISTS subquery
SELECT name 
FROM customers c 
WHERE EXISTS (
  SELECT 1 
  FROM orders o 
  WHERE o.customer_id = c.customer_id
);`,
    practiceData: {
      tableName: "products",
      columns: ["product_id", "product_name", "category", "price", "stock_quantity"],
      sampleData: [
        { product_id: 1, product_name: "Laptop", category: "Electronics", price: 999.99, stock_quantity: 50 },
        { product_id: 2, product_name: "Mouse", category: "Electronics", price: 29.99, stock_quantity: 200 },
        { product_id: 3, product_name: "Desk Chair", category: "Furniture", price: 199.99, stock_quantity: 30 },
        { product_id: 4, product_name: "Monitor", category: "Electronics", price: 299.99, stock_quantity: 75 },
        { product_id: 5, product_name: "Keyboard", category: "Electronics", price: 79.99, stock_quantity: 150 }
      ],
      relatedTable: {
        name: "order_items",
        columns: ["item_id", "order_id", "product_id", "quantity", "price"],
        sampleData: [
          { item_id: 1, order_id: 1, product_id: 1, quantity: 1, price: 999.99 },
          { item_id: 2, order_id: 2, product_id: 2, quantity: 2, price: 29.99 },
          { item_id: 3, order_id: 2, product_id: 4, quantity: 1, price: 299.99 },
          { item_id: 4, order_id: 3, product_id: 1, quantity: 1, price: 999.99 }
        ]
      }
    },
    tasks: [
      {
        id: 1,
        description: "Find products that have been ordered using a subquery with IN",
        hint: "Use WHERE product_id IN (SELECT product_id FROM order_items)",
        expectedQuery: "SELECT product_name FROM products WHERE product_id IN (SELECT product_id FROM order_items);"
      },
      {
        id: 2,
        description: "Find products with price higher than the average price using a subquery",
        hint: "Use WHERE price > (SELECT AVG(price) FROM products)",
        expectedQuery: "SELECT product_name, price FROM products WHERE price > (SELECT AVG(price) FROM products);"
      },
      {
        id: 3,
        description: "Find products that have never been ordered using NOT IN subquery",
        hint: "Use WHERE product_id NOT IN (SELECT DISTINCT product_id FROM order_items WHERE product_id IS NOT NULL)",
        expectedQuery: "SELECT product_name FROM products WHERE product_id NOT IN (SELECT DISTINCT product_id FROM order_items WHERE product_id IS NOT NULL);"
      },
      {
        id: 4,
        description: "Create a derived table to show departments with average salary, then filter for averages above 70000",
        hint: "Use a subquery in FROM: SELECT * FROM (SELECT department, AVG(salary) AS avg_sal FROM employees GROUP BY department) AS dept_avg WHERE avg_sal > 70000",
        expectedQuery: "SELECT * FROM (SELECT department, AVG(salary) AS avg_sal FROM employees GROUP BY department) AS dept_avg WHERE avg_sal > 70000;"
      }
    ]
  }
];
