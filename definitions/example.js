const commonAssertions = require("../index");

const commonAssertionsResult = commonAssertions({
  globalAssertionsParams: {
    "database": "sandbox-hrialan",
    "schema": "assertions_" + dataform.projectConfig.vars.env,
    "location": "EU",
    "tags": ["assertions"],
    // "disabledInEnvs": ["dv", "qa"]
  },
  rowConditions: {
    "first_table": {
      "id_not_null": "id IS NOT NULL",
      "id_strict_positive": "id > 0"
    },
    "second_table": {
      "id_not_null": "id IS NOT NULL"
    }
  },
  uniqueKeyConditions: {
    "first_table": ["id"],
    "second_table": ["id"]
  },
  dataFreshnessConditions: {
    "first_table": {
      "dateColumn": "updated_date",
      "timeUnit": "DAY",
      "delayCondition": 1,
    },
    "second_table": {
      "dateColumn": "updated_date",
      "timeUnit": "MONTH",
      "delayCondition": 3,
    }
  },
  dataCompletenessConditions: {
    "first_table": {
      // "column": allowedPercentageNull
      "updated_date": 10,
      "id": 20
    },
    "second_table": {
      "id": 30
    }
  }
});

// AUDIT 

let selectClauses = [];

for (const key in commonAssertionsResult) {
    if (commonAssertionsResult.hasOwnProperty(key)) {
        const commonAssertionsResultForKey = commonAssertionsResult[key];
        if (commonAssertionsResultForKey.length > 0) {
            const selectClause = commonAssertionsResultForKey.map(assertion => {
                return `SELECT "${assertion.proto.target.name}" AS assertion_name, '${key}' AS key_name`;
            }).join("\n UNION ALL \n");

            selectClauses.push(selectClause);
        }
    }
}

const sqlQuery = selectClauses.join("\n UNION ALL \n");

publish("audit_assertions", {
    type: "table"
}).query(
    (ctx) => sqlQuery
);
