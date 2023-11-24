import { any } from "joi";
import { Products } from "../database/models/product.model";
import { ProductVariants } from "../database/models/productVarients.model";

const { MongoClient } = require("mongodb");

export async function generateMongoDBQuery(reqBody: any) {
  //   {
  //     "queries": [
  //       { "condition": "vendor", "operator": "contains", "value": "Acme" },
  //       { "condition": "tags", "operator": "is equal to","value": "hat" },
  //       { "condition": "title", "operator": "ends with", "value": "s" }
  //    ],
  //    "logic": "or"
  // }

  /*
product={
ProductTitle
ProductType
productVendor
productTag
}

varients={
Price
compareAtPrice
weight
inventoryStock
varientsTitle
}
*/

  let varientsQuery: any = [];
  let productQuery: any = [];

  reqBody.queries.forEach((query: any) => {
    const condition = query.condition.toLowerCase();

    if (
      condition.includes("title") ||
      condition.includes("product_type") ||
      condition.includes("vendor") ||
      condition.includes("tags")
    ) {
      productQuery.push(query);
    } else if (
      condition.includes("price") ||
      condition.includes("compare_at_price") ||
      condition.includes("weight") ||
      condition.includes("inventory_stock") ||
      condition.includes("variants_title")
    ) {
      // If the condition is "variantstitle", change it to "title"
      if (condition.includes("variants_title")) {
        query.condition = "title";
      }
      varientsQuery.push(query);
    }
  });

  let mongoQueryForProduct = mongoQueryGenerator(productQuery, reqBody.logic);
  let mongoQueryForVarient = mongoQueryGenerator(varientsQuery, reqBody.logic);

  // console.log(JSON.stringify(mongoQueryForProduct));
  // console.log(JSON.stringify(mongoQueryForVarient));

  if (productQuery.length > 0 && varientsQuery.length === 0) {
    const productQueryResult = await Products.find(mongoQueryForProduct);
    return productQueryResult;
  } else if (productQuery.length === 0 && varientsQuery.length > 0) {
    const varientsQueryResult = await ProductVariants.find(
      mongoQueryForVarient
    );
    const uniqueProductIds = Array.from(
      new Set(varientsQueryResult.map((variant) => variant.product_id))
    );
    const sortedUniqueProductIds = uniqueProductIds.sort();
    const productsQueryResult = await Products.find({
      _id: { $in: sortedUniqueProductIds },
    });

    return productsQueryResult;
  } else if (productQuery.length > 0 && varientsQuery.length > 0) {
    // Case 3: Both productQueries and varientsQueries
  } else {
    console.log("No valid queries found");
  }

  // // console.log(JSON.stringify(finalQuery));
  // try {
  //   const result = await Products.find(finalQuery);
  //   return result;
  // } catch (err) {
  //   return err;
  // }

  function mongoQueryGenerator(inputQuery: any, logic: any) {
    let finalQuery;
    let mongoQuery = [];
    for (const query of inputQuery) {
      const { condition, operator, value } = query;
      let subQuery;

      switch (operator) {
        case "is equal to":
          subQuery = { [condition]: value };
          break;
        case "is not equal to":
          subQuery = { [condition]: { $ne: value } };
          break;
        case "starts with":
          subQuery = { [condition]: { $regex: `^${value}`, $options: "i" } };
          break;
        case "ends with":
          subQuery = { [condition]: { $regex: `${value}$`, $options: "i" } };
          break;
        case "contains":
          subQuery = { [condition]: { $regex: value, $options: "i" } };
          break;
        case "does not contain":
          subQuery = {
            [condition]: { $not: { $regex: value, $options: "i" } },
          };
          break;
        case "is greater than":
          subQuery = { [condition]: { $gt: value } };
          break;
        case "is less than":
          subQuery = { [condition]: { $lt: value } };
          break;
        case "is not empty":
          subQuery = { [condition]: { $exists: true, $ne: "" } };
          break;
        case "is empty":
          subQuery = { [condition]: { $exists: true, $eq: "" } };
          break;
        // Add more cases as needed
        default:
          throw new Error(`Unsupported condition_2: ${operator}`);
      }

      mongoQuery.push(subQuery);
    }

    // console.log(mongoQuery);

    if (logic === "and") {
      finalQuery = { $and: mongoQuery };
    } else if (logic === "or") {
      finalQuery = { $or: mongoQuery };
    } else {
      throw new Error(`Unsupported logic: ${logic}`);
    }
    console.log(finalQuery);
    return finalQuery;
  }
}
