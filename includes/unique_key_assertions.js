/**
 * unique_key_assertions.js
 * 
 * This file contains a function to create unique key assertions for specific tables in a database.
 * The assertions are used to check if the combination of values in specified columns forms a unique key for each row in the table.
 * The conditions for unique key checks are defined in an object format: 
 * { tableName: [column1, column2, ...], ... }
 * 
 * The function `createUniqueKeyAssertion` takes in global parameters, a table name, and an array of column names to create these assertions.
 */

/**
 * @param {Object} globalParams - See index.js for details.
 * @param {string} tableName - The name of the table to check for unique keys.
 * @param {Array} columns - An array of column names that should form a unique key.
 */

const assertions = [];

const createUniqueKeyAssertion = (globalParams, tableName, columns) => {
  const uniqueColumns = columns.join(', ');

  const assertion = assert(`assert_unique_key_${tableName}`)
    .database(globalParams.database)
    .schema(globalParams.schema)
    .description(`Check that values in columns (${uniqueColumns}) in ${tableName} form a unique key`)
    .tags("assert-unique-key")
    .query(ctx => `SELECT ${uniqueColumns}
                       FROM ${ctx.ref(tableName)}
                       GROUP BY ${uniqueColumns}
                       HAVING COUNT(*) > 1`);

  (globalParams.tags && globalParams.tags.forEach((tag) => assertion.tags(tag)));

  (globalParams.disabledInEnvs && globalParams.disabledInEnvs.includes(dataform.projectConfig.vars.env)) && assertion.disabled();

  assertions.push(assertion);
};

module.exports = (globalParams, uniqueKeyConditions) => {

  // Loop through uniqueKeyConditions to create unique key check assertions.
  for (let tableName in uniqueKeyConditions) {
    const columns = uniqueKeyConditions[tableName];
    createUniqueKeyAssertion(globalParams, tableName, columns);
  }

  return assertions;
}
