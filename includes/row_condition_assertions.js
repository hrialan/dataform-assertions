// Define row conditions for specific tables.
// Format: rowConditions = { tableName : { conditionName : conditionQuery } }

module.exports = (globalAssertionsParams, rowConditions) => {
    const assertions = [];

    const createRowConditionAssertion = (tableName, conditionName, conditionQuery) => {
        const assertion = assert(`assert_${conditionName}_${tableName}`)
            .database(globalAssertionsParams.database)
            .schema(globalAssertionsParams.schema)
            .description(`Assert that rows in ${tableName} meet ${conditionName}`)
            .query(ctx => `SELECT "Condition not met: ${conditionQuery}, Table: ${ctx.ref(tableName)}" AS assertion_description
                       FROM ${ctx.ref(tableName)}
                       WHERE NOT (${conditionQuery})`);


        if (globalAssertionsParams.tags) {
            globalAssertionsParams.tags.forEach((tag) => {
                assertion.tags(tag);
            });
        }

        if (globalAssertionsParams.disabledInEnvs && globalAssertionsParams.disabledInEnvs.includes(dataform.projectConfig.vars.env)) {
            assertion.disabled();
        }

        assertions.push(assertion);
    };

    // Loop through rowConditions to create assertions.
    for (let tableName in rowConditions) {
        for (let conditionName in rowConditions[tableName]) {
            const conditionQuery = rowConditions[tableName][conditionName];
            createRowConditionAssertion(tableName, conditionName, conditionQuery);
        }
    }

    return assertions;
}
