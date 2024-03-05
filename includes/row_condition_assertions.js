// Define row conditions for specific tables.
// Format: rowConditions = { tableName : { conditionName : conditionQuery } }

module.exports = (globalAssertionsParams, rowConditions) => {
  const assertions = [];

  const createRowConditionAssertion = (assertion_database, assertion_schema, assertion_tags, tableName, conditionName, conditionQuery) => {
    const assertion = assert(`assert_${conditionName}_${tableName}`)
      .database(assertion_database)
      .schema(assertion_schema)
      .description(`Assert that rows in ${tableName} meet ${conditionName}`)
      .tags("assertions")
      .query(ctx => `SELECT "Condition not met: ${conditionQuery}, Table: ${ctx.ref(tableName)}" AS assertion_description
                       FROM ${ctx.ref(tableName)}
                       WHERE NOT (${conditionQuery})`);

    //   if (dataform.projectConfig.vars.env !== "pd") {
    //     assertion.disabled();
    //   }

    for (let tag in assertion_tags) {
      assertion.tags(tag);
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
