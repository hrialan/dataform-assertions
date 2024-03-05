// Define unique key conditions for specific tables.
// Format: uniqueKeyConditions = { tableName : [column1, column2, ...] }

const assertions = [];

const createUniqueKeyAssertion = (globalParams, tableName, columns) => {
    const uniqueColumns = columns.join(', ');

    const assertion = assert(`assert_unique_key_${tableName}`)
        .database(globalParams.database)
        .schema(globalParams.schema)
        .description(`Check that values in columns (${uniqueColumns}) in ${tableName} form a unique key`)
        .query(ctx => `SELECT ${uniqueColumns}
                       FROM ${ctx.ref(tableName)}
                       GROUP BY ${uniqueColumns}
                       HAVING COUNT(*) > 1`);

    (globalParams.tags && globalParams.tags.forEach((tag) => assertion.tags(tag)));

    (globalParams.disabledInEnvs && globalParams.disabledInEnvs.includes(dataform.projectConfig.vars.env)) && assertion.disabled();


    assertions.push(assertion);
};

module.exports = (globalParams, uniqueKeyConditions) => {

    // Loop through uniqueKeyConditions to create unique key check assertions.
    for (let tableName in uniqueKeyConditions) {
        const columns = uniqueKeyConditions[tableName];
        createUniqueKeyAssertion(globalParams, tableName, columns);
    }

    return assertions;
}
