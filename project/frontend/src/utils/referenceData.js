// Reference Data for SQL Syntax, Examples, and Common Patterns

export const syntaxReference = [
  {
    category: 'SELECT',
    items: [
      {
        name: 'Basic SELECT',
        syntax: 'SELECT column1, column2 FROM table_name;',
        description: 'Retrieves specified columns from a table',
        examples: ['SELECT name, age FROM survivors;']
      },
      {
        name: 'SELECT All Columns',
        syntax: 'SELECT * FROM table_name;',
        description: 'Retrieves all columns from a table',
        examples: ['SELECT * FROM survivors;']
      },
      {
        name: 'SELECT DISTINCT',
        syntax: 'SELECT DISTINCT column FROM table_name;',
        description: 'Returns unique values, removing duplicates',
        examples: ['SELECT DISTINCT department FROM employees;']
      }
    ]
  },
  {
    category: 'WHERE',
    items: [
      {
        name: 'Basic WHERE',
        syntax: 'SELECT * FROM table_name WHERE condition;',
        description: 'Filters rows based on a condition',
        examples: ['SELECT * FROM survivors WHERE age > 30;']
      },
      {
        name: 'WHERE with AND',
        syntax: 'SELECT * FROM table_name WHERE condition1 AND condition2;',
        description: 'Both conditions must be true',
        examples: ['SELECT * FROM employees WHERE department = \'Engineering\' AND salary > 70000;']
      },
      {
        name: 'WHERE with OR',
        syntax: 'SELECT * FROM table_name WHERE condition1 OR condition2;',
        description: 'At least one condition must be true',
        examples: ['SELECT * FROM survivors WHERE health_status = \'Healthy\' OR health_status = \'Injured\';']
      },
      {
        name: 'WHERE with IN',
        syntax: 'SELECT * FROM table_name WHERE column IN (value1, value2, value3);',
        description: 'Checks if value is in a list',
        examples: ['SELECT * FROM employees WHERE department IN (\'Engineering\', \'Sales\');']
      },
      {
        name: 'WHERE with LIKE',
        syntax: 'SELECT * FROM table_name WHERE column LIKE pattern;',
        description: 'Pattern matching with wildcards (% and _)',
        examples: ['SELECT * FROM survivors WHERE name LIKE \'J%\';']
      },
      {
        name: 'WHERE with BETWEEN',
        syntax: 'SELECT * FROM table_name WHERE column BETWEEN value1 AND value2;',
        description: 'Checks if value is within a range (inclusive)',
        examples: ['SELECT * FROM survivors WHERE age BETWEEN 25 AND 40;']
      }
    ]
  },
  {
    category: 'JOIN',
    items: [
      {
        name: 'INNER JOIN',
        syntax: 'SELECT * FROM table1 INNER JOIN table2 ON table1.id = table2.id;',
        description: 'Returns rows when there is a match in both tables',
        examples: ['SELECT * FROM orders INNER JOIN customers ON orders.customer_id = customers.customer_id;']
      },
      {
        name: 'LEFT JOIN',
        syntax: 'SELECT * FROM table1 LEFT JOIN table2 ON table1.id = table2.id;',
        description: 'Returns all rows from left table, matched rows from right',
        examples: ['SELECT * FROM customers LEFT JOIN orders ON customers.customer_id = orders.customer_id;']
      },
      {
        name: 'RIGHT JOIN',
        syntax: 'SELECT * FROM table1 RIGHT JOIN table2 ON table1.id = table2.id;',
        description: 'Returns all rows from right table, matched rows from left',
        examples: ['SELECT * FROM orders RIGHT JOIN customers ON orders.customer_id = customers.customer_id;']
      },
      {
        name: 'Multiple JOINs',
        syntax: 'SELECT * FROM table1 JOIN table2 ON condition1 JOIN table3 ON condition2;',
        description: 'Join multiple tables together',
        examples: ['SELECT * FROM orders JOIN customers ON orders.customer_id = customers.id JOIN products ON orders.product_id = products.id;']
      }
    ]
  },
  {
    category: 'Aggregation',
    items: [
      {
        name: 'COUNT',
        syntax: 'SELECT COUNT(column) FROM table_name;',
        description: 'Counts the number of rows',
        examples: ['SELECT COUNT(*) FROM survivors;']
      },
      {
        name: 'SUM',
        syntax: 'SELECT SUM(column) FROM table_name;',
        description: 'Calculates the sum of values',
        examples: ['SELECT SUM(salary) FROM employees;']
      },
      {
        name: 'AVG',
        syntax: 'SELECT AVG(column) FROM table_name;',
        description: 'Calculates the average of values',
        examples: ['SELECT AVG(age) FROM survivors;']
      },
      {
        name: 'MAX',
        syntax: 'SELECT MAX(column) FROM table_name;',
        description: 'Finds the maximum value',
        examples: ['SELECT MAX(salary) FROM employees;']
      },
      {
        name: 'MIN',
        syntax: 'SELECT MIN(column) FROM table_name;',
        description: 'Finds the minimum value',
        examples: ['SELECT MIN(age) FROM survivors;']
      },
      {
        name: 'GROUP BY',
        syntax: 'SELECT column, COUNT(*) FROM table_name GROUP BY column;',
        description: 'Groups rows by column values',
        examples: ['SELECT department, COUNT(*) FROM employees GROUP BY department;']
      },
      {
        name: 'HAVING',
        syntax: 'SELECT column, COUNT(*) FROM table_name GROUP BY column HAVING COUNT(*) > 5;',
        description: 'Filters groups (used with GROUP BY)',
        examples: ['SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 3;']
      }
    ]
  },
  {
    category: 'Sorting & Limiting',
    items: [
      {
        name: 'ORDER BY',
        syntax: 'SELECT * FROM table_name ORDER BY column ASC;',
        description: 'Sorts results by column (ASC = ascending, DESC = descending)',
        examples: ['SELECT * FROM survivors ORDER BY age DESC;']
      },
      {
        name: 'ORDER BY Multiple',
        syntax: 'SELECT * FROM table_name ORDER BY column1, column2;',
        description: 'Sorts by multiple columns',
        examples: ['SELECT * FROM employees ORDER BY department, salary DESC;']
      },
      {
        name: 'LIMIT',
        syntax: 'SELECT * FROM table_name LIMIT number;',
        description: 'Limits the number of rows returned',
        examples: ['SELECT * FROM survivors LIMIT 10;']
      },
      {
        name: 'OFFSET',
        syntax: 'SELECT * FROM table_name LIMIT number OFFSET number;',
        description: 'Skips a number of rows before returning results',
        examples: ['SELECT * FROM survivors LIMIT 10 OFFSET 5;']
      }
    ]
  },
  {
    category: 'Subqueries',
    items: [
      {
        name: 'Subquery in WHERE',
        syntax: 'SELECT * FROM table1 WHERE column IN (SELECT column FROM table2);',
        description: 'Uses result of inner query in outer query',
        examples: ['SELECT * FROM orders WHERE customer_id IN (SELECT customer_id FROM customers WHERE city = \'New York\');']
      },
      {
        name: 'Subquery in SELECT',
        syntax: 'SELECT column1, (SELECT COUNT(*) FROM table2) FROM table1;',
        description: 'Uses subquery as a column',
        examples: ['SELECT name, (SELECT COUNT(*) FROM orders WHERE orders.customer_id = customers.id) FROM customers;']
      },
      {
        name: 'EXISTS',
        syntax: 'SELECT * FROM table1 WHERE EXISTS (SELECT 1 FROM table2 WHERE condition);',
        description: 'Checks if subquery returns any rows',
        examples: ['SELECT * FROM customers WHERE EXISTS (SELECT 1 FROM orders WHERE orders.customer_id = customers.id);']
      }
    ]
  },
  {
    category: 'CTEs',
    items: [
      {
        name: 'Basic CTE',
        syntax: 'WITH cte_name AS (SELECT ...) SELECT * FROM cte_name;',
        description: 'Common Table Expression - temporary named result set',
        examples: ['WITH high_salary AS (SELECT * FROM employees WHERE salary > 80000) SELECT * FROM high_salary;']
      },
      {
        name: 'Multiple CTEs',
        syntax: 'WITH cte1 AS (...), cte2 AS (...) SELECT * FROM cte1 JOIN cte2;',
        description: 'Define multiple CTEs in one query',
        examples: ['WITH sales AS (SELECT * FROM orders WHERE status = \'Completed\'), totals AS (SELECT SUM(amount) FROM sales) SELECT * FROM totals;']
      }
    ]
  },
  {
    category: 'Window Functions',
    items: [
      {
        name: 'ROW_NUMBER',
        syntax: 'SELECT *, ROW_NUMBER() OVER (PARTITION BY column ORDER BY column) FROM table;',
        description: 'Assigns sequential numbers to rows',
        examples: ['SELECT *, ROW_NUMBER() OVER (ORDER BY salary DESC) as rank FROM employees;']
      },
      {
        name: 'RANK',
        syntax: 'SELECT *, RANK() OVER (PARTITION BY column ORDER BY column) FROM table;',
        description: 'Assigns rank with gaps for ties',
        examples: ['SELECT *, RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank FROM employees;']
      },
      {
        name: 'SUM OVER',
        syntax: 'SELECT *, SUM(column) OVER (PARTITION BY column) FROM table;',
        description: 'Calculates running sum',
        examples: ['SELECT *, SUM(salary) OVER (PARTITION BY department) as dept_total FROM employees;']
      }
    ]
  }
];

export const examplesLibrary = [
  {
    id: 'ex1',
    title: 'Find all survivors',
    query: 'SELECT * FROM survivors;',
    result: 'Returns all columns and rows from the survivors table',
    explanation: 'The asterisk (*) selects all columns. No WHERE clause means all rows are returned.',
    difficulty: 'beginner',
    tags: ['SELECT', 'basics'],
    zone: 'beach'
  },
  {
    id: 'ex2',
    title: 'Filter by condition',
    query: 'SELECT name, age FROM survivors WHERE age > 30;',
    result: 'Returns name and age for survivors older than 30',
    explanation: 'WHERE clause filters rows. Only rows where age is greater than 30 are returned.',
    difficulty: 'beginner',
    tags: ['SELECT', 'WHERE'],
    zone: 'beach'
  },
  {
    id: 'ex3',
    title: 'Sort results',
    query: 'SELECT * FROM survivors ORDER BY age DESC;',
    result: 'Returns all survivors sorted by age in descending order',
    explanation: 'ORDER BY sorts results. DESC means descending (highest to lowest).',
    difficulty: 'beginner',
    tags: ['ORDER BY', 'sorting'],
    zone: 'beach'
  },
  {
    id: 'ex4',
    title: 'Count grouped data',
    query: 'SELECT department, COUNT(*) FROM employees GROUP BY department;',
    result: 'Returns count of employees in each department',
    explanation: 'GROUP BY groups rows by department. COUNT(*) counts rows in each group.',
    difficulty: 'intermediate',
    tags: ['GROUP BY', 'COUNT', 'aggregation'],
    zone: 'jungle'
  },
  {
    id: 'ex5',
    title: 'Join two tables',
    query: 'SELECT orders.order_id, customers.name FROM orders INNER JOIN customers ON orders.customer_id = customers.customer_id;',
    result: 'Returns order IDs with customer names',
    explanation: 'INNER JOIN combines rows from both tables where the condition matches.',
    difficulty: 'intermediate',
    tags: ['JOIN', 'INNER JOIN'],
    zone: 'jungle'
  },
  {
    id: 'ex6',
    title: 'Filter groups',
    query: 'SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 3;',
    result: 'Returns departments with more than 3 employees',
    explanation: 'HAVING filters groups after GROUP BY. Unlike WHERE, it works on aggregated data.',
    difficulty: 'intermediate',
    tags: ['GROUP BY', 'HAVING'],
    zone: 'jungle'
  },
  {
    id: 'ex7',
    title: 'Subquery example',
    query: 'SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);',
    result: 'Returns employees with above-average salary',
    explanation: 'The subquery calculates the average salary first, then outer query uses it to filter.',
    difficulty: 'advanced',
    tags: ['subquery', 'WHERE'],
    zone: 'ruins'
  },
  {
    id: 'ex8',
    title: 'Window function',
    query: 'SELECT name, salary, RANK() OVER (ORDER BY salary DESC) as rank FROM employees;',
    result: 'Returns employees with salary rankings',
    explanation: 'RANK() OVER assigns ranks. ORDER BY salary DESC means highest salary gets rank 1.',
    difficulty: 'advanced',
    tags: ['window functions', 'RANK'],
    zone: 'ruins'
  },
  {
    id: 'ex9',
    title: 'CTE example',
    query: 'WITH high_earners AS (SELECT * FROM employees WHERE salary > 80000) SELECT * FROM high_earners ORDER BY salary DESC;',
    result: 'Returns high-earning employees sorted by salary',
    explanation: 'CTE creates a temporary result set. High_earners contains employees with salary > 80000, then we select from it.',
    difficulty: 'advanced',
    tags: ['CTE', 'WITH'],
    zone: 'ruins'
  },
  {
    id: 'ex10',
    title: 'Multiple conditions',
    query: 'SELECT * FROM survivors WHERE age BETWEEN 25 AND 40 AND health_status = \'Healthy\';',
    result: 'Returns healthy survivors aged 25-40',
    explanation: 'BETWEEN checks for range (inclusive). AND requires both conditions to be true.',
    difficulty: 'beginner',
    tags: ['WHERE', 'BETWEEN', 'AND'],
    zone: 'beach'
  }
];

export const commonPatterns = [
  {
    name: 'Find Duplicates',
    useCase: 'Find rows with duplicate values in a column',
    template: 'SELECT column, COUNT(*) as count FROM table_name GROUP BY column HAVING COUNT(*) > 1;',
    example: 'SELECT name, COUNT(*) as count FROM survivors GROUP BY name HAVING COUNT(*) > 1;',
    category: 'aggregation',
    difficulty: 'intermediate'
  },
  {
    name: 'Top N per Group',
    useCase: 'Find top N items in each category',
    template: 'SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY category_column ORDER BY value_column DESC) as rn FROM table_name) WHERE rn <= N;',
    example: 'SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rn FROM employees) WHERE rn <= 3;',
    category: 'window-functions',
    difficulty: 'advanced'
  },
  {
    name: 'Running Total',
    useCase: 'Calculate cumulative sum',
    template: 'SELECT *, SUM(column) OVER (ORDER BY order_column) as running_total FROM table_name;',
    example: 'SELECT order_id, amount, SUM(amount) OVER (ORDER BY order_date) as running_total FROM orders;',
    category: 'window-functions',
    difficulty: 'advanced'
  },
  {
    name: 'Date Range Query',
    useCase: 'Filter records within a date range',
    template: 'SELECT * FROM table_name WHERE date_column BETWEEN \'start_date\' AND \'end_date\';',
    example: 'SELECT * FROM orders WHERE order_date BETWEEN \'2025-01-01\' AND \'2025-01-31\';',
    category: 'filtering',
    difficulty: 'beginner'
  },
  {
    name: 'Self Join',
    useCase: 'Join a table with itself',
    template: 'SELECT a.*, b.* FROM table_name a JOIN table_name b ON a.column = b.column WHERE condition;',
    example: 'SELECT e1.name as employee, e2.name as manager FROM employees e1 JOIN employees e2 ON e1.manager_id = e2.employee_id;',
    category: 'joins',
    difficulty: 'intermediate'
  },
  {
    name: 'Correlated Subquery',
    useCase: 'Subquery that references outer query',
    template: 'SELECT * FROM table1 a WHERE column > (SELECT AVG(column) FROM table1 b WHERE b.group_column = a.group_column);',
    example: 'SELECT * FROM employees e1 WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.department = e1.department);',
    category: 'subqueries',
    difficulty: 'advanced'
  },
  {
    name: 'Find Missing Records',
    useCase: 'Find records in one table not in another',
    template: 'SELECT * FROM table1 WHERE id NOT IN (SELECT id FROM table2);',
    example: 'SELECT * FROM customers WHERE customer_id NOT IN (SELECT customer_id FROM orders);',
    category: 'subqueries',
    difficulty: 'intermediate'
  },
  {
    name: 'Pivot-like Aggregation',
    useCase: 'Count occurrences of different values',
    template: 'SELECT COUNT(CASE WHEN column = \'value1\' THEN 1 END) as count1, COUNT(CASE WHEN column = \'value2\' THEN 1 END) as count2 FROM table_name;',
    example: 'SELECT COUNT(CASE WHEN status = \'Completed\' THEN 1 END) as completed, COUNT(CASE WHEN status = \'Pending\' THEN 1 END) as pending FROM orders;',
    category: 'aggregation',
    difficulty: 'intermediate'
  }
];

