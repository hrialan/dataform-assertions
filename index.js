const row_condition_assertions = require("./includes/row_condition_assertions");
const unique_key_assertions = require("./includes/unique_key_assertions");


module.exports = ({
    globalAssertionsParams = {
        database: dataform.projectConfig.defaultDatabase,
        schema:  dataform.projectConfig.assertionSchema,
        location: dataform.projectConfig.defaultLocation,
        tags: ["assertions"],
        disabledInEnvs: []
    },
    rowConditions = {},
    uniqueKeyConditions = {}
}) => {

    const rowConditionAssertionsResult = row_condition_assertions(globalAssertionsParams, rowConditions);
    const uniqueKeyAssertionsResult = unique_key_assertions(globalAssertionsParams, uniqueKeyConditions);

    return {
      rowConditionAssertions: rowConditionAssertionsResult,
      uniqueKeyAssertions: uniqueKeyAssertionsResult
  };
}
