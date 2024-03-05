const assertions = [];

const createDataFreshnessAssertion = (globalParams, tableName, delayCondition, timeUnit, dateColumn) => {
    const assertion = assert(`assert_freshness_${tableName}`)
        .database(globalParams.database)
        .schema(globalParams.schema)
        .description(`Assert that data in ${tableName} is fresh with a delay less than ${delayCondition} ${timeUnit}`)
        .query(ctx => `
                WITH
                    freshness AS (
                        SELECT
                            DATE_DIFF(CURRENT_DATE(), MAX(${dateColumn}), ${timeUnit}) AS delay
                        FROM
                            ${ctx.ref(tableName)}
                    )
                SELECT
                    *
                FROM
                    freshness
                WHERE
                    delay > ${delayCondition}
            `);

    (globalParams.tags && globalParams.tags.forEach((tag) => assertion.tags(tag)));

    (globalParams.disabledInEnvs && globalParams.disabledInEnvs.includes(dataform.projectConfig.vars.env)) && assertion.disabled();

    assertions.push(assertion);
};


module.exports = (globalParams, freshnessConditions) => {

    // Loop through freshnessConditions to create assertions.
    for (let tableName in freshnessConditions) {
        const {
            delayCondition,
            timeUnit,
            dateColumn
        } = freshnessConditions[tableName];
        createDataFreshnessAssertion(globalParams, tableName, delayCondition, timeUnit, dateColumn);
    }

    return assertions;
};
