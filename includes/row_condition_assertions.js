module.exports = (rowConditions) => {
    const assertions = [];

    // Do not modify this function unless you have specific requirements.
    const createRowConditionAssertion = (tableName, conditionName, conditionQuery) => {
        const assertion = assert(`assert_${conditionName}_${tableName}`)
           // .database(dataform.projectConfig.vars.project + dataform.projectConfig.vars.env)
          //  .schema(`d_${dataform.projectConfig.vars.use_case}_assertions_eu_${dataform.projectConfig.vars.env}`)
            .description(`Assert that rows in ${tableName} meet ${conditionName}`)
            .tags("assertions")
            .query(ctx => `SELECT "Condition not met: ${conditionQuery}, Table: ${ctx.ref(tableName)}" AS assertion_description
                       FROM ${ctx.ref(tableName)}
                       WHERE NOT (${conditionQuery})`);

        //   if (dataform.projectConfig.vars.env !== "pd") {
        //     assertion.disabled();
        //   }

        assertions.push(assertion);

    };

    // Loop through rowConditions to create assertions.
    // Do not modify this loop unless you have specific requirements.
    for (let tableName in rowConditions) {
        for (let conditionName in rowConditions[tableName]) {
            const conditionQuery = rowConditions[tableName][conditionName];
            createRowConditionAssertion(tableName, conditionName, conditionQuery);
        }
    }
    // Do not modify this loop unless you have specific requirements.
}
