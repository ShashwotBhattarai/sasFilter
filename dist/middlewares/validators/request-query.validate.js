"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestQuery = void 0;
const validateRequestQuery = (req, res, next) => {
    const conditions = [
        "title",
        "product_type",
        "product_category",
        "vendor",
        "tags",
        "price",
        "compare-at-price",
        "weight",
        "inventory_stock",
        "variants_title",
    ];
    const operators = {
        title: [
            "is equal to",
            "is not equal to",
            "starts with",
            "ends with",
            "contains",
            "does not contain",
        ],
        product_type: [
            "is equal to",
            "is not equal to",
            "starts with",
            "ends with",
            "contains",
            "does not contain",
        ],
        product_category: ["is equal to"],
        vendor: [
            "is equal to",
            "is not equal to",
            "starts with",
            "ends with",
            "contains",
            "does not contain",
        ],
        tags: ["is equal to"],
        price: [
            "is equal to",
            "is not equal to",
            "is greater than",
            "is less than",
        ],
        compare_at_price: [
            "is equal to",
            "is not equal to",
            "is greater than",
            "is less than",
            "is not empty",
            "is empty",
        ],
        weight: [
            "is equal to",
            "is not equal to",
            "is greater than",
            "is less than",
        ],
        inventory_stock: ["is equal to", "is greater than", "is less than"],
        variants_title: [
            "is equal to",
            "is not equal to",
            "starts with",
            "ends with",
            "contains",
            "does not contain",
        ],
    };
    /*
    conditions array must be refactored to match the keys in database, since the same "condition"s are used to make the query
    after refactoring the conditions array we must refactor the operations object too,
    we must carefully refactor the keys of operatior object to match the conditons in conditions array,
    additionally, logic for validating value must be revisited for automatic selection between number and string,
    for now it accepts both string and number
  */
    const { logic, queries } = req.body;
    for (const element of queries) {
        const req_condition = element.condition;
        const req_operator = element.operator;
        console.log(req_condition);
        console.log(req_operator);
        const req_condition_exists = conditions.includes(req_condition);
        const req_operator_exists = operators[req_condition].includes(req_operator);
        console.log(req_condition_exists);
        console.log(req_operator_exists);
        if (!(req_condition_exists && req_operator_exists)) {
            return res.status(400).json({ message: { "Bad Request": element } });
        }
    }
    next();
};
exports.validateRequestQuery = validateRequestQuery;
