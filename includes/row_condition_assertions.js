// Define row conditions for specific tables.
// Format: rowConditions = { tableName : { conditionName : conditionQuery } }

const assertions = [];

const createRowConditionAssertion = (globalParams, tableName, conditionName, conditionQuery) => {
    const assertion = assert(`assert_${conditionName}_${tableName}`)
        .database(globalParams.database)
        .schema(globalParams.schema)
        .description(`Assert that rows in ${tableName} meet ${conditionName}`)
        .query(ctx => `SELECT "Condition not met: ${conditionQuery}, Table: ${ctx.ref(tableName)}" AS assertion_description
                       FROM ${ctx.ref(tableName)}
                       WHERE NOT (${conditionQuery})`);

    (globalParams.tags && globalParams.tags.forEach((tag) => assertion.tags(tag)));

    (globalParams.disabledInEnvs && globalParams.disabledInEnvs.includes(dataform.projectConfig.vars.env)) && assertion.disabled();

    assertions.push(assertion);
};

module.exports = (globalParams, rowConditions) => {

    // Loop through rowConditions to create assertions.
    for (let tableName in rowConditions) {
        for (let conditionName in rowConditions[tableName]) {
            const conditionQuery = rowConditions[tableName][conditionName];
            createRowConditionAssertion(globalParams, tableName, conditionName, conditionQuery);
        }
    }

    return assertions;
}
