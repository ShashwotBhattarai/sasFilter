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
exports.FilterProductsService = void 0;
const product_model_1 = require("../database/models/product.model");
const productVarients_model_1 = require("../database/models/productVarients.model");
class FilterProductsService {
    filterProducts(reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const logic = reqBody.logic;
            const { varientsQuery, productQuery } = this.seperateQueries(reqBody);
            const filteredProductResponse = yield this.searchAndReturnProducts(productQuery, varientsQuery, logic);
            return { status: filteredProductResponse === null || filteredProductResponse === void 0 ? void 0 : filteredProductResponse.status, message: filteredProductResponse === null || filteredProductResponse === void 0 ? void 0 : filteredProductResponse.message };
        });
    }
    seperateQueries(mainQuery) {
        let varientsQuery = [];
        let productQuery = [];
        mainQuery.queries.forEach((query) => {
            const condition = query.condition.toLowerCase();
            if (condition == "title" ||
                condition == "product_type" ||
                condition == "vendor" ||
                condition == "tags") {
                productQuery.push(query);
            }
            else if (condition == "price" ||
                condition == "compare_at_price" ||
                condition == "weight" ||
                condition == "inventory_stock" ||
                condition == "variants_title") {
                if (condition == "variants_title") {
                    query.condition = "title";
                }
                varientsQuery.push(query);
            }
        });
        return {
            varientsQuery: varientsQuery,
            productQuery: productQuery,
        };
    }
    searchAndReturnProducts(productQuery, varientsQuery, logic) {
        return __awaiter(this, void 0, void 0, function* () {
            if (productQuery.length > 0 && varientsQuery.length === 0) {
                let mongoQueryForProduct = this.mongoQueryGenerator(productQuery);
                let finalQuery = this.createFinalQuery(mongoQueryForProduct, logic);
                try {
                    const productsQueryResult = yield product_model_1.Products.find(finalQuery);
                    // console.log(productsQueryResult.length);
                    return { status: 200, message: productsQueryResult };
                }
                catch (err) {
                    return {
                        status: 500,
                        message: err,
                    };
                }
            }
            else if (productQuery.length === 0 && varientsQuery.length > 0) {
                let mongoQueryForVarient = this.mongoQueryGenerator(varientsQuery);
                let finalQuery = this.createFinalQuery(mongoQueryForVarient, logic);
                try {
                    const varientsQueryResult = yield productVarients_model_1.ProductVariants.find(finalQuery);
                    // console.log(varientsQueryResult.length);
                    const uniqueProductIds = Array.from(new Set(varientsQueryResult.map((variant) => variant.product_id)));
                    console.log(uniqueProductIds.length);
                    const productsQueryResult = yield product_model_1.Products.find({
                        _id: { $in: uniqueProductIds },
                    });
                    return { status: 200, message: productsQueryResult };
                }
                catch (err) {
                    return {
                        status: 500,
                        message: err,
                    };
                }
            }
            else if (productQuery.length > 0 && varientsQuery.length > 0) {
                let mongoQueryForVarient = this.mongoQueryGenerator(varientsQuery);
                let finalQueryForVarient = this.createFinalQuery(mongoQueryForVarient, logic);
                let mongoQueryForProduct = this.mongoQueryGenerator(productQuery);
                let finalQuery = {};
                try {
                    const varientsQueryResult = yield productVarients_model_1.ProductVariants.find(finalQueryForVarient);
                    // console.log(varientsQueryResult.length);
                    const uniqueSetOfProductIdsFromVarient = new Set(varientsQueryResult.map((variant) => variant.product_id));
                    const uniqueProductIdsFromVarient = Array.from(uniqueSetOfProductIdsFromVarient);
                    // console.log(uniqueProductIdsFromVarient);
                    if (logic == "and") {
                        const q1 = {
                            $and: mongoQueryForProduct,
                        };
                        const q2 = {
                            _id: { $in: uniqueProductIdsFromVarient },
                        };
                        finalQuery = {
                            $and: [q1, q2],
                        };
                        console.log(finalQuery);
                        const productsQueryResult = yield product_model_1.Products.find(finalQuery);
                        return { status: 200, message: productsQueryResult };
                    }
                    else if (logic == "or") {
                        const q1 = {
                            $or: mongoQueryForProduct,
                        };
                        const q2 = {
                            _id: { $in: uniqueProductIdsFromVarient },
                        };
                        finalQuery = {
                            $or: [q1, q2],
                        };
                        console.log(finalQuery);
                        const productsQueryResult = yield product_model_1.Products.find(finalQuery);
                        return { status: 200, message: productsQueryResult };
                    }
                }
                catch (err) {
                    console.log(err);
                    return {
                        status: 500,
                        message: err,
                    };
                }
            }
        });
    }
    mongoQueryGenerator(inputQuery) {
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
                default:
                    throw new Error(`Unsupported condition_2: ${operator}`);
            }
            mongoQuery.push(subQuery);
        }
        // console.log(mongoQuery);
        return mongoQuery;
    }
    createFinalQuery(mongoQuery, logic) {
        let finalQuery;
        if (logic === "and") {
            finalQuery = { $and: mongoQuery };
        }
        else if (logic === "or") {
            finalQuery = { $or: mongoQuery };
        }
        else {
            throw new Error(`Unsupported logic: ${logic}`);
        }
        console.log(JSON.stringify(finalQuery));
        return finalQuery;
    }
}
exports.FilterProductsService = FilterProductsService;
