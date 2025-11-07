// Query Optimizer - Provides optimization suggestions

/**
 * Analyze query and provide optimization suggestions
 */
export const analyzeQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return [];
  }

  const suggestions = [];
  const upperQuery = query.toUpperCase();
  const cleanQuery = query.trim();

  // Check for SELECT *
  if (upperQuery.includes('SELECT *')) {
    suggestions.push({
      type: 'select-all',
      severity: 'info',
      title: 'Consider selecting specific columns',
      message: 'Using SELECT * retrieves all columns. For better performance, specify only the columns you need.',
      example: cleanQuery.replace(/SELECT\s+\*/i, 'SELECT column1, column2')
    });
  }

  // Check for missing LIMIT on potentially large result sets
  if (!upperQuery.includes('LIMIT') && !upperQuery.includes('WHERE') && upperQuery.includes('SELECT')) {
    suggestions.push({
      type: 'missing-limit',
      severity: 'warning',
      title: 'Consider adding LIMIT clause',
      message: 'Without LIMIT, this query may return many rows. Add LIMIT to restrict the result set if you only need a few rows.',
      example: cleanQuery + (cleanQuery.endsWith(';') ? ' LIMIT 10;' : ' LIMIT 10')
    });
  }

  // Check for inefficient WHERE conditions
  if (upperQuery.includes('WHERE') && /WHERE\s+[^=<>!]+\s*=\s*[^=<>!]+/i.test(cleanQuery)) {
    const whereMatch = cleanQuery.match(/WHERE\s+(.*?)(?:\s+GROUP|\s+ORDER|\s+HAVING|\s+LIMIT|$)/i);
    if (whereMatch && whereMatch[1].includes('LIKE') && whereMatch[1].includes('%')) {
      suggestions.push({
        type: 'like-pattern',
        severity: 'info',
        title: 'LIKE pattern optimization',
        message: 'LIKE patterns starting with % cannot use indexes efficiently. If possible, use patterns like "value%" instead of "%value%".',
        example: null
      });
    }
  }

  // Check for subquery that could be a JOIN
  if (/\([\s\S]*SELECT[\s\S]*\)/.test(cleanQuery) && upperQuery.includes('WHERE') && upperQuery.includes('IN')) {
    suggestions.push({
      type: 'subquery-join',
      severity: 'info',
      title: 'Consider using JOIN instead of subquery',
      message: 'Some subqueries can be rewritten as JOINs, which may be more efficient. This depends on your specific use case.',
      example: null
    });
  }

  // Check for multiple OR conditions that could use IN
  if (upperQuery.includes('WHERE') && /OR\s+\w+\s*=\s*\w+/gi.test(cleanQuery)) {
    const orCount = (cleanQuery.match(/\s+OR\s+/gi) || []).length;
    if (orCount >= 3) {
      suggestions.push({
        type: 'or-to-in',
        severity: 'info',
        title: 'Consider using IN instead of multiple OR conditions',
        message: `Multiple OR conditions (${orCount + 1} conditions) can sometimes be simplified using IN clause for better readability and potential performance.`,
        example: null
      });
    }
  }

  // Check for missing indexes hints (informational)
  if (upperQuery.includes('WHERE') && upperQuery.includes('ORDER BY')) {
    const whereCol = extractColumnFromWhere(cleanQuery);
    const orderCol = extractColumnFromOrderBy(cleanQuery);
    
    if (whereCol && orderCol && whereCol !== orderCol) {
      suggestions.push({
        type: 'index-hint',
        severity: 'info',
        title: 'Index consideration',
        message: `This query filters by "${whereCol}" and orders by "${orderCol}". Consider indexing these columns for better performance on large tables.`,
        example: null
      });
    }
  }

  // Check for aggregate without GROUP BY when needed
  if ((upperQuery.includes('COUNT') || upperQuery.includes('SUM') || upperQuery.includes('AVG')) && 
      !upperQuery.includes('GROUP BY') && upperQuery.includes('SELECT') && !upperQuery.includes('*')) {
    const selectMatch = cleanQuery.match(/SELECT\s+(.*?)\s+FROM/i);
    if (selectMatch) {
      const selectCols = selectMatch[1].split(',');
      const hasNonAggregate = selectCols.some(col => 
        !/(COUNT|SUM|AVG|MAX|MIN)\(/i.test(col.trim())
      );
      
      if (hasNonAggregate) {
        suggestions.push({
          type: 'missing-groupby',
          severity: 'warning',
          title: 'May need GROUP BY clause',
          message: 'You\'re using aggregate functions with non-aggregated columns. If you want results per group, add a GROUP BY clause.',
          example: null
        });
      }
    }
  }

  return suggestions;
};

// Helper functions
function extractColumnFromWhere(query) {
  const match = query.match(/WHERE\s+([^\s=<>!]+)/i);
  return match ? match[1].trim().replace(/["`]/g, '') : null;
}

function extractColumnFromOrderBy(query) {
  const match = query.match(/ORDER\s+BY\s+([^\s,]+)/i);
  return match ? match[1].trim().replace(/["`]/g, '').replace(/\s+(ASC|DESC)/i, '') : null;
}

