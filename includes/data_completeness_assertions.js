// Define data completeness conditions for specific tables and columns.
// Format: dataCompletenessConditions = { tableName: { columnName: allowedPercentageNull, ... }, ... }

const assertions = [];

const createDataCompletenessAssertion = (globalParams, tableName, columnConditions) => {

  for (let columnName in columnConditions) {
    const allowedPercentageNull = columnConditions[columnName];

    const assertion = assert(`assert_data_completeness_${tableName}_${columnName}`)
      .database(globalParams.database)
      .schema(globalParams.schema)
      .description(`Check data completeness for ${tableName}.${columnName}, allowed percentage of null values: ${allowedPercentageNull}`)
      .tags("assert-data-completeness")
      .query(ctx => `SELECT COUNT(*) AS total_rows,
                        SUM(CASE WHEN ${ctx.ref(columnName)} IS NULL THEN 1 ELSE 0 END) AS null_count
                        FROM ${ctx.ref(tableName)}
                        HAVING SAFE_DIVIDE(null_count, total_rows) > ${allowedPercentageNull / 100} AND null_count > 0 AND total_rows > 0`);

    (globalParams.tags && globalParams.tags.forEach((tag) => assertion.tags(tag)));

    (globalParams.disabledInEnvs && globalParams.disabledInEnvs.includes(dataform.projectConfig.vars.env)) && assertion.disabled();

    assertions.push(assertion);
  }

};

module.exports = (globalParams, dataCompletenessConditions) => {
  // Loop through dataCompletenessConditions to create data completeness check assertions.
  for (let tableName in dataCompletenessConditions) {
    const columnConditions = dataCompletenessConditions[tableName];
    createDataCompletenessAssertion(globalParams, tableName, columnConditions);
  }

  return assertions;
};
