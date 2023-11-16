
# Project Overview

## Objective

This project aims to connect to the sasSYNC database, allowing clients to run query filters on products and collections of a specific store. The filtering is based on conditions provided by the client, using a logical operator to combine multiple queries.

## HTTP Request Payload

The server-side application expects an HTTP request with a JSON payload in the body. The payload should include:

### Request Body Example

```json
{
  "queries": [
    {
      "condition": "vendor",
      "operator": "contains",
      "value": "Acme"
    },
    {
      "condition": "tags",
      "operator": "contains",
      "value": "hat"
    },
    {
      "condition": "title",
      "operator": "ends with",
      "value": "s"
    }
  ],
  "logic": "or"
}
```

- **queries (Array):** An array of objects representing individual filtering conditions. Each object contains:
  - **condition:** The field or property against which the query will be applied (e.g., "vendor," "tags," "title").
  - **operator:** The type of comparison or operation to perform on the field (e.g., "contains," "ends with").
  - **value:** The specific value to be used in the comparison.

- **logic:** A logical operator determining how multiple conditions are combined. It can be either "and" or "or," specifying whether all conditions must be true (and) or at least one condition must be true (or).


