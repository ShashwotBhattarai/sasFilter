import { Products } from "../database/models/product.model";
import { ProductVariants } from "../database/models/productVarients.model";

const { MongoClient } = require("mongodb");

export async function generateMongoDBQuery(reqBody: any) {
  let varientsQuery: any = [];
  let productQuery: any = [];

  reqBody.queries.forEach((query: any) => {
    const condition = query.condition.toLowerCase();

    if (
      condition == "title" ||
      condition == "product_type" ||
      condition == "vendor" ||
      condition == "tags"
    ) {
      productQuery.push(query);
    } else if (
      condition == "price" ||
      condition == "compare_at_price" ||
      condition == "weight" ||
      condition == "inventory_stock" ||
      condition == "variants_title"
    ) {
      if (condition == "variants_title") {
        query.condition = "title";
      }
      varientsQuery.push(query);
    }
  });

  // console.log(JSON.stringify(varientsQuery));
  // console.log(JSON.stringify(productQuery));

  if (productQuery.length > 0 && varientsQuery.length === 0) {
    let mongoQueryForProduct = mongoQueryGenerator(productQuery, reqBody.logic);
    const productQueryResult = await Products.find(mongoQueryForProduct);
    return productQueryResult;
  } else if (productQuery.length === 0 && varientsQuery.length > 0) {
    let mongoQueryForVarient = mongoQueryGenerator(
      varientsQuery,
      reqBody.logic
    );
    const varientsQueryResult = await ProductVariants.find(
      mongoQueryForVarient
    );

    console.log(varientsQueryResult.length);
    const uniqueProductIds = Array.from(
      new Set(varientsQueryResult.map((variant) => variant.product_id))
    );
    console.log(uniqueProductIds.length);

    const productsQueryResult = await Products.find({
      _id: { $in: uniqueProductIds },
    });

    return productsQueryResult;
  } else if (productQuery.length > 0 && varientsQuery.length > 0) {
  } else {
    console.log("No valid queries found");
  }

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
    console.log(JSON.stringify(finalQuery));
    return finalQuery;
  }
}
