# Filter Products Service

## Overview

This service provides functionality to filter products based on specified conditions and logic. It uses MongoDB queries to filter products from the `Products` and `ProductVariants` collections.

## Algorithm

### 1. Input

- The service expects a request body (`reqBody`) containing filtering logic (`logic`) and an array of queries (`queries`) for filtering products.
## Example

- Below is an example of how to use the `FilterProductsService` in a Node.js application:

```typescript

const reqBody = {
  queries: [
    { condition: 'title', operator: 'contains', value: 's' },
    { condition: 'variants_title', operator: 'contains', value: 'a' },
    { condition: 'product_type', operator: 'contains', value: 'b' },
    { condition: 'price', operator: 'is greater than', value: '50' }
  ],
  logic: 'or'
};

```


### 2. Separation of Queries

- The `separateQueries` function processes the queries from the input, categorizing them into two arrays: `varientsQuery` and `productQuery`, based on the conditions provided.

### 3. Filtering Products

- The `searchAndReturnProducts` function processes the separated queries and performs filtering based on the logic provided.

#### 3.1. If Only Product Queries Exist

- If there are product queries and no variant queries, it generates a MongoDB query for products using `mongoQueryGenerator`.
- It then creates the final query using `createFinalQuery`.
- The service performs a MongoDB query on the `Products` collection and returns the result.

#### 3.2. If Only Variant Queries Exist

- If there are variant queries and no product queries, it generates a MongoDB query for variants using `mongoQueryGenerator`.
- It creates the final query using `createFinalQuery`.
- The service performs a MongoDB query on the `ProductVariants` collection and extracts unique product IDs.
- It then queries the `Products` collection using the unique product IDs and returns the result.

#### 3.3. If Both Product and Variant Queries Exist

- If there are both product and variant queries, it generates MongoDB queries for both using `mongoQueryGenerator`.
- It creates the final query for variants using `createFinalQuery`.
- It queries the `ProductVariants` collection to get unique product IDs.
- Depending on the logic (AND or OR), it combines the product and variant queries and performs a MongoDB query on the `Products` collection.
- The result is returned.

### 4. MongoDB Query Generation

- The `mongoQueryGenerator` function takes an array of queries and converts them into an array of MongoDB queries.

### 5. Final Query Creation

- The `createFinalQuery` function takes an array of MongoDB queries and creates the final query using the provided logic (AND or OR).

