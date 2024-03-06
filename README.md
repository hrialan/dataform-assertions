# Dataform Assertions

This open-source Dataform package provides a set of assertions for testing the data in your warehouse. It includes assertions for data freshness, unique keys, row conditions, and data completeness.

Contributions are welcome! If you have an idea for a new assertion, please open an issue or submit a pull request.

## Installation

Follow the instructions in the [Dataform documentation](https://cloud.google.com/dataform/docs/install-package) to install this package.

1. In the `package.json`file dependencies, add the following line:
```json
"dataform-assertions": "https://github.com/hrialan/dataform-assertions/archive/refs/tags/[RELEASE_VERSION].tar.gz"
```
2. Click on 'Install packages' in the Dataform web UI or use the 'dataform install' CLI command in the terminal.
3. You are ready to go!

## Usage

Create a js file in the `/definitions` folder of your Dataform project and add the following line:

```javascript
const commonAssertions = require("dataform-assertions");

const commonAssertionsResult = commonAssertions({
  globalAssertionsParams: {
    "database": "your-database",
    "schema": "your-schema",
    "location": "your-location",
    "tags": ["your-tags"],
    "disabledInEnvs": ["your-disabled-environments"]
  },
  rowConditions: {
    "your-table": {
      "your-condition": "your-SQL-condition"
    }
  },
  uniqueKeyConditions: {
    "your-table": ["your-unique-key-columns"]
  },
  dataFreshnessConditions: {
    "your-table": {
      "dateColumn": "your-date-column",
      "timeUnit": "your-time-unit",
      "delayCondition": your-delay-condition
    }
  },
  dataCompletenessConditions: {
    "your-table": {
      "your-column": your-allowed-percentage-null
    }
  }
});
```

You can find another usage example in /definitions/example.js.


## Available assertions

This package includes the following types of assertions:

- **Row conditions**: Check if the rows in a table satisfy a given condition.
- **Unique key conditions**: Check if a given primary key (can be a set of columns) is unique.
- **Data freshness conditions**: Check if the data in a table is fresh enough.
- **Data completeness conditions**: Check if the data in a column have less than a given percentage of null values.


# License

This project is licensed under the MIT License. See the LICENSE file for details.
