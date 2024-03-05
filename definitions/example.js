const dataform_assertions = require("../index");

const assertions = dataform_assertions({
    globalAssertionsParams: {
        "database": "sandbox-hrialan",
        "schema": "assertions-" + dataform.projectConfig.vars.env,
        "location": "EU",
        "tags": ["assertions"],
        // "disabledInEnvs": ["dv", "qa"]
    },
    rowConditions: {
        "table": {
            "id_not_null": "id IS NOT NULL",
            "id_strict_positive": "id > 0"
        },
    },
    uniqueKeyConditions: {
        "table": ["id"]
    },
    dataFreshnessConditions: {
        "table": {
            "delayCondition": 7,
            "timeUnit": "DAY"
        }
    }
});
