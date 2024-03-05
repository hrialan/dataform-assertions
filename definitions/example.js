const dataform_assertions = require("../index");

const assertions = dataform_assertions({
    "row_condition_assertions_params": {
        "table1": {
          "pk_not_null": "id IS NOT NULL",
          "id_strict_positive": "id > 0"
        }
    }
});


