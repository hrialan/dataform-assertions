/**
 * data_freshness_assertions.js
 * 
 * This file contains a function to create data freshness assertions for specific tables in a database.
 * The assertions are used to check if the data in each specified table is fresh, based on a specified delay condition and time unit.
 * 
 * The function `createDataFreshnessAssertion` takes in global parameters, a table name, a delay condition, a time unit, and a date column to create these assertions.
 */

/**
 * @param {Object} globalParams - See index.js for details.
 * @param {string} tableName - The name of the table to check for data freshness.
 * @param {number} delayCondition - The maximum allowed delay (in units specified by `timeUnit`) for the data to be considered fresh.
 * @param {string} timeUnit - The unit of time to use for the delay condition. This should be a string that is valid in a SQL `DATE_DIFF` function, such as 'DAY', 'HOUR', etc.
 * @param {string} dateColumn - The name of the date column to check for data freshness.
 */

const assertions = [];

const createDataFreshnessAssertion = (globalParams, tableName, delayCondition, timeUnit, dateColumn) => {
  const assertion = assert(`assert_freshness_${tableName}`)
    .database(globalParams.database)
    .schema(globalParams.schema)
    .description(`Assert that data in ${tableName} is fresh with a delay less than ${delayCondition} ${timeUnit}`)
    .tags("assert-data-freshness")
    .query(ctx => `
                WITH
                    freshness AS (
                        SELECT
                            DATE_DIFF(CURRENT_DATE(), MAX(${dateColumn}), ${timeUnit}) AS delay
                        FROM
                            ${ctx.ref(tableName)}
                    )
                SELECT
                    *
                FROM
                    freshness
                WHERE
                    delay > ${delayCondition}
            `);

  (globalParams.tags && globalParams.tags.forEach((tag) => assertion.tags(tag)));

  (globalParams.disabledInEnvs && globalParams.disabledInEnvs.includes(dataform.projectConfig.vars.env)) && assertion.disabled();

  assertions.push(assertion);
};

module.exports = (globalParams, freshnessConditions) => {

  // Loop through freshnessConditions to create assertions.
  for (let tableName in freshnessConditions) {
    const {
      delayCondition,
      timeUnit,
      dateColumn
    } = freshnessConditions[tableName];
    createDataFreshnessAssertion(globalParams, tableName, delayCondition, timeUnit, dateColumn);
  }

  return assertions;
};
