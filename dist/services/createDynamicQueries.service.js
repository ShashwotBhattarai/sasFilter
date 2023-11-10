"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMongoDBQuery = void 0;
const product_model_1 = require("../database/models/product.model");
const { MongoClient } = require('mongodb');
function generateMongoDBQuery(reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
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
        }
        else if (reqBody.logic === 'or') {
            finalQuery = { $or: mongoQuery };
        }
        else {
            throw new Error(`Unsupported logic: ${reqBody.logic}`);
        }
        console.log(finalQuery);
        try {
            const result = yield product_model_1.Products.find(finalQuery);
            return result;
        }
        catch (err) {
            return err;
        }
    });
}
exports.generateMongoDBQuery = generateMongoDBQuery;
