// Query Analyzer - Parses SQL queries and generates explanations

/**
 * Parse SQL query and identify its components
 */
export const parseQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return null;
  }

  const cleanQuery = query.trim().replace(/;+$/, '').trim();
  const upperQuery = cleanQuery.toUpperCase();

  // Basic structure
  const structure = {
    hasSelect: upperQuery.includes('SELECT'),
    hasFrom: upperQuery.includes('FROM'),
    hasWhere: upperQuery.includes('WHERE'),
    hasJoin: /JOIN/i.test(cleanQuery),
    hasGroupBy: upperQuery.includes('GROUP BY'),
    hasHaving: upperQuery.includes('HAVING'),
    hasOrderBy: upperQuery.includes('ORDER BY'),
    hasLimit: upperQuery.includes('LIMIT'),
    hasDistinct: upperQuery.includes('DISTINCT'),
    hasAggregate: /(COUNT|SUM|AVG|MAX|MIN|GROUP_CONCAT)\(/i.test(cleanQuery),
    hasSubquery: /\([\s\S]*SELECT[\s\S]*\)/i.test(cleanQuery),
    hasCTE: /WITH\s+\w+\s+AS/i.test(cleanQuery),
    hasWindowFunction: /(ROW_NUMBER|RANK|DENSE_RANK|LAG|LEAD|SUM|AVG|COUNT)\s*\([^)]*\)\s*OVER/i.test(cleanQuery)
  };

  // Extract components
  const components = {
    select: extractSelect(cleanQuery),
    from: extractFrom(cleanQuery),
    where: extractWhere(cleanQuery),
    joins: extractJoins(cleanQuery),
    groupBy: extractGroupBy(cleanQuery),
    having: extractHaving(cleanQuery),
    orderBy: extractOrderBy(cleanQuery),
    limit: extractLimit(cleanQuery)
  };

  return {
    structure,
    components,
    originalQuery: cleanQuery
  };
};

/**
 * Generate human-readable explanation
 */
export const explainQuery = (query) => {
  const parsed = parseQuery(query);
  if (!parsed) {
    return {
      overview: 'Unable to parse query',
      executionSteps: [],
      complexity: 'unknown'
    };
  }

  const { structure, components } = parsed;
  const parts = [];

  // Overview explanation
  if (structure.hasSelect) {
    if (components.select.includes('*')) {
      parts.push('selects all columns');
    } else {
      parts.push(`selects ${components.select.length} column(s)`);
    }
  }

  if (structure.hasFrom && components.from.length > 0) {
    parts.push(`from the ${components.from[0]} table`);
    if (components.from.length > 1) {
      parts.push(`and ${components.from.length - 1} other table(s)`);
    }
  }

  if (structure.hasJoin) {
    parts.push('using joins');
  }

  if (structure.hasWhere) {
    parts.push('filtered by conditions');
  }

  if (structure.hasGroupBy) {
    parts.push('grouped by specific columns');
  }

  if (structure.hasHaving) {
    parts.push('filtered groups');
  }

  if (structure.hasOrderBy) {
    parts.push('sorted by specified columns');
  }

  if (structure.hasLimit) {
    parts.push('limited to specific number of rows');
  }

  const overview = `This query ${parts.join(', ')}.`;

  // Execution steps
  const executionSteps = getExecutionSteps(parsed);

  // Determine complexity
  let complexity = 'basic';
  if (structure.hasJoin || structure.hasSubquery || structure.hasCTE) {
    complexity = 'intermediate';
  }
  if (structure.hasWindowFunction || (structure.hasSubquery && structure.hasJoin)) {
    complexity = 'advanced';
  }

  return {
    overview,
    executionSteps,
    complexity,
    parsed
  };
};

/**
 * Get execution steps in order
 */
export const getExecutionSteps = (parsed) => {
  if (!parsed) return [];

  const { structure, components } = parsed;
  const steps = [];

  // Step 1: FROM and JOINs
  if (structure.hasFrom) {
    let step1 = 'Access the ';
    if (components.from.length === 1) {
      step1 += `"${components.from[0]}" table`;
    } else {
      step1 += `tables: ${components.from.join(', ')}`;
    }

    if (structure.hasJoin) {
      step1 += ` and perform ${components.joins.length} join(s)`;
      components.joins.forEach((join, idx) => {
        step1 += ` (${join.type || 'INNER'} JOIN ${join.table || ''})`;
      });
    }

    steps.push({
      step: 1,
      action: 'FROM/JOIN',
      description: step1,
      sql: structure.hasJoin ? `FROM ${components.from[0]} ${components.joins.map(j => `${j.type} JOIN ${j.table}`).join(' ')}` : `FROM ${components.from[0]}`
    });
  }

  // Step 2: WHERE clause
  if (structure.hasWhere && components.where) {
    steps.push({
      step: 2,
      action: 'WHERE',
      description: `Filter rows where: ${components.where}`,
      sql: `WHERE ${components.where}`
    });
  }

  // Step 3: GROUP BY
  if (structure.hasGroupBy && components.groupBy.length > 0) {
    steps.push({
      step: 3,
      action: 'GROUP BY',
      description: `Group rows by: ${components.groupBy.join(', ')}`,
      sql: `GROUP BY ${components.groupBy.join(', ')}`
    });
  }

  // Step 4: HAVING
  if (structure.hasHaving && components.having) {
    steps.push({
      step: 4,
      action: 'HAVING',
      description: `Filter groups where: ${components.having}`,
      sql: `HAVING ${components.having}`
    });
  }

  // Step 5: SELECT
  if (structure.hasSelect) {
    let selectDesc = 'Select and project ';
    if (components.select.includes('*')) {
      selectDesc += 'all columns';
    } else {
      selectDesc += `columns: ${components.select.join(', ')}`;
    }

    if (structure.hasDistinct) {
      selectDesc += ' (removing duplicates)';
    }

    if (structure.hasAggregate) {
      selectDesc += ' with aggregate functions';
    }

    steps.push({
      step: 5,
      action: 'SELECT',
      description: selectDesc,
      sql: `SELECT ${components.select.join(', ')}`
    });
  }

  // Step 6: ORDER BY
  if (structure.hasOrderBy && components.orderBy.length > 0) {
    steps.push({
      step: 6,
      action: 'ORDER BY',
      description: `Sort results by: ${components.orderBy.join(', ')}`,
      sql: `ORDER BY ${components.orderBy.join(', ')}`
    });
  }

  // Step 7: LIMIT
  if (structure.hasLimit && components.limit) {
    steps.push({
      step: 7,
      action: 'LIMIT',
      description: `Limit results to ${components.limit} row(s)`,
      sql: `LIMIT ${components.limit}`
    });
  }

  return steps;
};

// Helper functions to extract query parts
function extractSelect(query) {
  const match = query.match(/SELECT\s+(.*?)\s+FROM/i);
  if (!match) return ['*'];
  
  const selectPart = match[1].trim();
  if (selectPart === '*' || selectPart.includes('*')) {
    return ['*'];
  }
  
  return selectPart
    .split(',')
    .map(col => col.trim().replace(/\s+AS\s+\w+/i, '').replace(/^["`]|["`]$/g, ''))
    .filter(col => col);
}

function extractFrom(query) {
  const matches = query.match(/FROM\s+([^\s(]+)/i);
  if (!matches) return [];
  
  const fromPart = matches[1].trim();
  return [fromPart.replace(/["`]/g, '')];
}

function extractWhere(query) {
  const match = query.match(/WHERE\s+(.*?)(?:\s+GROUP\s+BY|\s+ORDER\s+BY|\s+HAVING|\s+LIMIT|$)/i);
  if (!match) return null;
  
  return match[1].trim();
}

function extractJoins(query) {
  const joins = [];
  const joinRegex = /(INNER|LEFT|RIGHT|FULL)\s+JOIN\s+([^\s]+)/gi;
  let match;
  
  while ((match = joinRegex.exec(query)) !== null) {
    joins.push({
      type: match[1].toUpperCase(),
      table: match[2].replace(/["`]/g, '')
    });
  }
  
  return joins;
}

function extractGroupBy(query) {
  const match = query.match(/GROUP\s+BY\s+(.*?)(?:\s+HAVING|\s+ORDER\s+BY|\s+LIMIT|$)/i);
  if (!match) return [];
  
  return match[1]
    .split(',')
    .map(col => col.trim().replace(/["`]/g, ''))
    .filter(col => col);
}

function extractHaving(query) {
  const match = query.match(/HAVING\s+(.*?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
  if (!match) return null;
  
  return match[1].trim();
}

function extractOrderBy(query) {
  const match = query.match(/ORDER\s+BY\s+(.*?)(?:\s+LIMIT|$)/i);
  if (!match) return [];
  
  return match[1]
    .split(',')
    .map(col => col.trim().replace(/\s+(ASC|DESC)/i, '').replace(/["`]/g, ''))
    .filter(col => col);
}

function extractLimit(query) {
  const match = query.match(/LIMIT\s+(\d+)/i);
  if (!match) return null;
  
  return parseInt(match[1], 10);
}

