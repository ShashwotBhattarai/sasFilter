Certainly! Here's the information you provided formatted in Markdown (.md) syntax:

---

## Project Objective:

The goal of this project is to:

- Connect to the sasSYNC database.
- Execute query filters on products and collections within a single store.

## HTTP Request Payload Format:

The client sends a request with the following structure:

### Request Body:

```json
{
  "queries": [
    {
      "condition_1": "product title",
      "condition_2": "contains",
      "value": "ram"
    },
    {
      "condition_1": "product vendor",
      "condition_2": "contains",
      "value": "Acme"
    }
  ],
  "logic": "and" or "or"
}
```

- **`req.body`**: This constitutes a section of the HTTP request body in a server-side application, conveying the payload or data from the client to the server.

- **`queries` (Array)**: Contains objects, with each object representing a query condition for filtering operations.

  - **`condition_1`**: Specifies the attribute or property against which the query will be applied, such as "product title" or "product vendor".

  - **`condition_2`**: Defines the type of comparison or operation to perform on the field; for instance, "contains" implies that the field's value must contain the provided value.

  - **`value`**: Indicates the specific value to be used in the comparison; for example, "ram" for "product title" and "Acme" for "product vendor".

- **`logic`**: Represents the logical operator used to combine multiple queries, determining how conditions are related. It can be either "and" or "or," indicating whether all conditions must be true (and) or at least one condition must be true (or).



---