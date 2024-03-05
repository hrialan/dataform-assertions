// Define unique key conditions for specific tables.
// Format: uniqueKeyConditions = { tableName : [column1, column2, ...] }

module.exports = (globalAssertionsParams, uniqueKeyConditions) => {
    const assertions = [];

    const createUniqueKeyAssertion = (tableName, columns) => {
        const uniqueColumns = columns.join(', ');

        const assertion = assert(`assert_unique_key_${tableName}`)
            .database(globalAssertionsParams.database)
            .schema(globalAssertionsParams.schema)
            .description(`Check that values in columns (${uniqueColumns}) in ${tableName} form a unique key`)
            .query(ctx => `SELECT ${uniqueColumns}
                       FROM ${ctx.ref(tableName)}
                       GROUP BY ${uniqueColumns}
                       HAVING COUNT(*) > 1`);

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

    // Loop through uniqueKeyConditions to create unique key check assertions.
    for (let tableName in uniqueKeyConditions) {
        const columns = uniqueKeyConditions[tableName];
        createUniqueKeyAssertion(tableName, columns);
    }

    return assertions;
}
