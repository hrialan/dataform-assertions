// Define unique key conditions for specific tables.
// Format: uniqueKeyConditions = { tableName : [column1, column2, ...] }

module.exports = (globalAssertionsParams, uniqueKeyConditions) => {
  const assertions = [];

  const createUniqueKeyAssertion = (assertion_database, assertion_schema, assertion_tags, tableName, columns) => {
    const uniqueColumns = columns.join(', ');

    const assertion = assert(`assert_unique_key_${tableName}`)
      .database(assertion_database)
      .schema(assertion_schema)
      .description(`Check that values in columns (${uniqueColumns}) in ${tableName} form a unique key`)
      .query(ctx => `SELECT ${uniqueColumns}
                       FROM ${ctx.ref(tableName)}
                       GROUP BY ${uniqueColumns}
                       HAVING COUNT(*) > 1`);

    for (let tag in assertion_tags) {
      assertion.tags(tag);
    }

    assertions.push(assertion);
  };

  // Loop through uniqueKeyConditions to create unique key check assertions.
  for (let tableName in uniqueKeyConditions) {
    const columns = uniqueKeyConditions[tableName];
    createUniqueKeyAssertion(globalAssertionsParams.database, globalAssertionsParams.schema, globalAssertionsParams.tags, tableName, columns);
  }

  return assertions;
}
