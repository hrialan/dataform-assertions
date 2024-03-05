// Define data completeness conditions for specific tables and columns.
// Format: dataCompletenessConditions = { tableName: { columnName: allowedPercentageNull, ... }, ... }

const assertions = [];

const createDataCompletenessAssertion = (globalParams, tableName, columnConditions) => {
    const assertionsForTable = [];

    for (let columnName in columnConditions) {
        const allowedPercentageNull = columnConditions[columnName];

        const assertion = assert(`assert_data_completeness_${tableName}_${columnName}`)
            .database(globalParams.database)
            .schema(globalParams.schema)
            .description(`Check data completeness for ${tableName}.${columnName}, allowed percentage of null values: ${allowedPercentageNull}`)
            .query(ctx => `SELECT COUNT(*) AS total_rows,
                                  SUM(CASE WHEN ${ctx.ref(columnName)} IS NULL THEN 1 ELSE 0 END) AS null_count
                           FROM ${ctx.ref(tableName)}`);

        // Add condition for allowed percentage of null values
        assertion.query(ctx => `HAVING (null_count / total_rows) <= ${allowedPercentageNull / 100}`);

        (globalParams.tags && globalParams.tags.forEach((tag) => assertion.tags(tag)));

        (globalParams.disabledInEnvs && globalParams.disabledInEnvs.includes(dataform.projectConfig.vars.env)) && assertion.disabled();

        assertionsForTable.push(assertion);
    }

    return assertionsForTable;
};

module.exports = (globalParams, dataCompletenessConditions) => {
    // Loop through dataCompletenessConditions to create data completeness check assertions.
    for (let tableName in dataCompletenessConditions) {
        const columnConditions = dataCompletenessConditions[tableName];
        const tableAssertions = createDataCompletenessAssertion(globalParams, tableName, columnConditions);
        assertions.push(...tableAssertions);
    }

    return assertions;
};
