"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestQuery = void 0;
const joi_1 = __importDefault(require("joi"));
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
    price: ["is equal to", "is not equal to", "is greater than", "is less than"],
    compare_at_price: [
        "is equal to",
        "is not equal to",
        "is greater than",
        "is less than",
        "is not empty",
        "is empty",
    ],
    weight: ["is equal to", "is not equal to", "is greater than", "is less than"],
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
const conditionSchema = joi_1.default.string().valid(...conditions);
// Define the Joi schema for operators
const operatorSchema = joi_1.default.object().keys({
    title: joi_1.default.string().valid(...operators.title),
    product_type: joi_1.default.string().valid(...operators.product_type),
    product_category: joi_1.default.string().valid(...operators.product_category),
    vendor: joi_1.default.string().valid(...operators.vendor),
    tags: joi_1.default.string().valid(...operators.tags),
    price: joi_1.default.string().valid(...operators.price),
    compare_at_price: joi_1.default.string().valid(...operators.compare_at_price),
    weight: joi_1.default.string().valid(...operators.weight),
    inventory_stock: joi_1.default.string().valid(...operators.inventory_stock),
    variants_title: joi_1.default.string().valid(...operators.variants_title),
});
const validateRequestQuery = (req, res, next) => {
    const { logic, queries } = req.body;
    // Define the schema for the entire request body
    const schema = joi_1.default.object({
        logic: joi_1.default.string().required(),
        queries: joi_1.default.array().items(joi_1.default.object({
            condition: conditionSchema.required(),
            operator: joi_1.default.string().required(),
            value: joi_1.default.string().required(), // You may want to adjust this based on your actual operators
        })),
    });
    // Validate the entire request body against the schema
    const { error } = schema.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json({ error: error.details.map((detail) => detail.message) });
    }
    // Additional validation for conditions and operators
    for (const element of queries) {
        const { error: conditionError } = conditionSchema.validate(element.condition);
        const { error: operatorError } = operatorSchema.validate({
            [element.condition]: element.operator,
        });
        if (conditionError || operatorError) {
            return res.status(400).json({
                conditionErrorerror: conditionError === null || conditionError === void 0 ? void 0 : conditionError.details.map((detail) => detail.message),
                operatorError: operatorError === null || operatorError === void 0 ? void 0 : operatorError.details.map((detail) => detail.message),
            });
        }
    }
    next();
};
exports.validateRequestQuery = validateRequestQuery;
