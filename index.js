/**
 * index.js
 * 
 * This file is the entry point for creating various types of assertions in Dataform.
 * It imports and uses functions from other modules to create different types of assertions.
 * The conditions for each type of assertion are passed in as parameters in an object format.
 */

/**
 * @param {Object} params - An object containing the following properties:
 *   @property {Object} globalAssertionsParams - An object containing global parameters for the assertions. This can include the following properties:
 *     @property {string} database - The name of the database to check.
 *     @property {string} schema - The name of the schema to check.
 *     @property {Array} tags - An array of tags to add to the assertion.
 *     @property {Array} disabledInEnvs - An array of environments in which the assertion should be disabled.
 *   @property {Object} rowConditions - An object mapping table names to row conditions. Format: { tableName: { conditionName: conditionQuery, ... }, ... }
 *   @property {Object} uniqueKeyConditions - An object mapping table names to unique key conditions. Format: { tableName: [column1, column2, ...], ... }
 *   @property {Object} dataFreshnessConditions - An object mapping table names to data freshness conditions. Format: { tableName: { delayCondition, timeUnit, dateColumn }, ... }
 *   @property {Object} dataCompletenessConditions - An object mapping table names to data completeness conditions. Format: { tableName: { columnName: allowedPercentageNull, ... }, ... }
 */

const row_condition_assertions = require("./includes/row_condition_assertions");
const unique_key_assertions = require("./includes/unique_key_assertions");
const data_freshness_assertions = require("./includes/data_freshness_assertions");
const data_completeness_assertions = require("./includes/data_completeness_assertions");

module.exports = ({
    globalAssertionsParams = {
        database: dataform.projectConfig.defaultDatabase,
        schema: dataform.projectConfig.assertionSchema,
        location: dataform.projectConfig.defaultLocation,
        tags: [],
        disabledInEnvs: []
    },
    rowConditions = {},
    uniqueKeyConditions = {},
    dataFreshnessConditions = {},
    dataCompletenessConditions = {}
}) => {
    const rowConditionAssertionsResult = row_condition_assertions(globalAssertionsParams, rowConditions);
    const uniqueKeyAssertionsResult = unique_key_assertions(globalAssertionsParams, uniqueKeyConditions);
    const dataFreshnessAssertionsResult = data_freshness_assertions(globalAssertionsParams, dataFreshnessConditions);
    const dataCompletenessAssertionsResult = data_completeness_assertions(globalAssertionsParams, dataCompletenessConditions);

    return {
        rowConditionAssertions: rowConditionAssertionsResult,
        uniqueKeyAssertions: uniqueKeyAssertionsResult,
        dataFreshnessAssertions: dataFreshnessAssertionsResult,
        dataCompletenessAssertions: dataCompletenessAssertionsResult
    };
}
