module.exports = (globalAssertionsParams, freshnessConditions) => {
    const assertions = [];

    const createDataFreshnessAssertion = (tableName, delayCondition, timeUnit) => {
        const assertion = assert(`assert_freshness_${tableName}`)
            .database(globalAssertionsParams.database)
            .schema(globalAssertionsParams.schema)
            .description(`Assert that data in ${tableName} is fresh with a delay less than ${delayCondition} ${timeUnit}`)
            .query(ctx => `
                WITH
                    freshness AS (
                        SELECT
                            DATE_DIFF(CURRENT_DATE(), MAX(dummy_ingestion_date), ${timeUnit}) AS delay
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

    // Loop through freshnessConditions to create assertions.
    for (let tableName in freshnessConditions) {
            const { delayCondition, timeUnit } = freshnessConditions[tableName];
            createDataFreshnessAssertion(tableName, delayCondition, timeUnit);
    }

    return assertions;
};
