"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequestQuery = void 0;
const joi_1 = __importDefault(require("joi"));
const conditionsAndOperators_constants_1 = require("../../constants/conditionsAndOperators.constants");
// defining validation schema for conditions
const conditionSchema = joi_1.default.string().valid(...conditionsAndOperators_constants_1.conditions);
// defining validation schema for conditions
const operatorSchema = joi_1.default.object().keys({
    title: joi_1.default.string().valid(...conditionsAndOperators_constants_1.operators.title),
    product_type: joi_1.default.string().valid(...conditionsAndOperators_constants_1.operators.product_type),
    product_category: joi_1.default.string().valid(...conditionsAndOperators_constants_1.operators.product_category),
    vendor: joi_1.default.string().valid(...conditionsAndOperators_constants_1.operators.vendor),
    tags: joi_1.default.string().valid(...conditionsAndOperators_constants_1.operators.tags),
    price: joi_1.default.string().valid(...conditionsAndOperators_constants_1.operators.price),
    compare_at_price: joi_1.default.string().valid(...conditionsAndOperators_constants_1.operators.compare_at_price),
    weight: joi_1.default.string().valid(...conditionsAndOperators_constants_1.operators.weight),
    inventory_stock: joi_1.default.string().valid(...conditionsAndOperators_constants_1.operators.inventory_stock),
    variants_title: joi_1.default.string().valid(...conditionsAndOperators_constants_1.operators.variants_title),
});
//this is the middleware
const validateRequestQuery = (req, res, next) => {
    const { logic, queries } = req.body;
    const schema = joi_1.default.object({
        logic: joi_1.default.string().required(),
        queries: joi_1.default.array().items(joi_1.default.object({
            condition: conditionSchema.required(),
            operator: joi_1.default.string().required(),
            value: joi_1.default.string().required(),
        })),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res
            .status(400)
            .json({ error: error.details.map((detail) => detail.message) });
    }
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
