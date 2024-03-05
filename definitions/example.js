const dataform_assertions = require("../index");

const assertions = dataform_assertions({
  "globalAssertionsParams": {
    "database": "dbt",
    "schema": "assertions",
    "location": "EU",
    "tags": ["assertions"],
    "disabledInEnvs": ["pd"]
  },
  "rowConditions": {
    "table1": {
      "pk_not_null": "id IS NOT NULL",
      "id_strict_positive": "id > 0"
    }
  }
});
