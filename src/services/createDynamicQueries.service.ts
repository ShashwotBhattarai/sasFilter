import { Products } from "../database/models/product.model";

const { MongoClient } = require('mongodb');

export async function generateMongoDBQuery(reqBody:any) {
//     {
//         "queries": [
//           { "condition_1": "product vendor", "condition_2": "is equal to", "value": "Acme" },
//           { "condition_1": "product quantity", "condition_2": "is less than", "value": "20" },
//           { "condition_1": "product title", "condition_2": "ends with", "value": "g" }
//        ],
//        "logic": "or"
//    }

    let mongoQuery = [];
    for (const query of reqBody.queries) {
      const { condition_1, condition_2, value } = query;
      let subQuery;

      switch (condition_2) {
        case 'is equal to':
          subQuery = { [condition_1]: value };
          break;
        case 'is not equal to':
          subQuery = { [condition_1]: { $ne: value } };
          break;
        case 'starts with':
          subQuery = { [condition_1]: { $regex: `^${value}`, $options: 'i' } };
          break;
        case 'ends with':
          subQuery = { [condition_1]: { $regex: `${value}$`, $options: 'i' } };
          break;
        case 'contains':
          subQuery = { [condition_1]: { $regex: value, $options: 'i' } };
          break;
        case 'does not contain':
          subQuery = { [condition_1]: { $not: { $regex: value, $options: 'i' } } };
          break;
        case 'is greater than':
          subQuery = { [condition_1]: { $gt: value } };
          break;
        case 'is less than':
          subQuery = { [condition_1]: { $lt: value } };
          break;
        case 'is not empty':
          subQuery = { [condition_1]: { $exists: true, $ne: '' } };
          break;
        case 'is empty':
          subQuery = { [condition_1]: { $exists: true, $eq: '' } };
          break;
        // Add more cases as needed

        default:
          throw new Error(`Unsupported condition_2: ${condition_2}`);
      }

      mongoQuery.push(subQuery);
    }

    let finalQuery;

    if (reqBody.logic === 'and') {
      finalQuery = { $and: mongoQuery };
    } else if (reqBody.logic === 'or') {
      finalQuery = { $or: mongoQuery };
    } else {
      throw new Error(`Unsupported logic: ${reqBody.logic}`);
    }

    console.log(finalQuery);
    try{
        const result = await Products.find(finalQuery);
    return result
    }catch(err){
        return err;
    }
    
}

