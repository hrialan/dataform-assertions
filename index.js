const row_condition_assertions = require("./includes/row_condition_assertions");
const unique_key_assertions = require("./includes/unique_key_assertions");


module.exports = ({
    row_condition_assertions_params = {},
    unique_key_assertions_params = {}
    
}) => {

    row_condition_assertions(row_condition_assertions_params);
    unique_key_assertions(unique_key_assertions_params);

}
