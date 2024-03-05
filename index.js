const row_condition_assertions = require("./includes/row_condition_assertions");
const unique_key_assertions = require("./includes/unique_key_assertions");
const data_freshness_assertions = require("./includes/data_freshness_assertions");

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
    dataFreshnessConditions = {}
}) => {

    const rowConditionAssertionsResult = row_condition_assertions(globalAssertionsParams, rowConditions);
    const uniqueKeyAssertionsResult = unique_key_assertions(globalAssertionsParams, uniqueKeyConditions);
    const dataFreshnessAssertionsResult = data_freshness_assertions(globalAssertionsParams, dataFreshnessConditions);

    return {
        rowConditionAssertions: rowConditionAssertionsResult,
        uniqueKeyAssertions: uniqueKeyAssertionsResult,
        dataFreshnessAssertions: dataFreshnessAssertionsResult
    };
}
