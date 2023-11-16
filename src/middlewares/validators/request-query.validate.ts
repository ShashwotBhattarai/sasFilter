import { Request, Response, NextFunction } from "express";
import Joi from "joi";

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

const operators: Record<string, string[]> = {
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

const conditionSchema = Joi.string().valid(...conditions);

const operatorSchema = Joi.object().keys({
  title: Joi.string().valid(...operators.title),
  product_type: Joi.string().valid(...operators.product_type),
  product_category: Joi.string().valid(...operators.product_category),
  vendor: Joi.string().valid(...operators.vendor),
  tags: Joi.string().valid(...operators.tags),
  price: Joi.string().valid(...operators.price),
  compare_at_price: Joi.string().valid(...operators.compare_at_price),
  weight: Joi.string().valid(...operators.weight),
  inventory_stock: Joi.string().valid(...operators.inventory_stock),
  variants_title: Joi.string().valid(...operators.variants_title),
});
export const validateRequestQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { logic, queries } = req.body;

  const schema = Joi.object({
    logic: Joi.string().required(),
    queries: Joi.array().items(
      Joi.object({
        condition: conditionSchema.required(),
        operator: Joi.string().required(),
        value: Joi.string().required(),
      })
    ),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ error: error.details.map((detail) => detail.message) });
  }

  for (const element of queries) {
    const { error: conditionError } = conditionSchema.validate(
      element.condition
    );
    const { error: operatorError } = operatorSchema.validate({
      [element.condition]: element.operator,
    });

    if (conditionError || operatorError) {
      return res.status(400).json({
        conditionErrorerror: conditionError?.details.map(
          (detail) => detail.message
        ),
        operatorError: operatorError?.details.map((detail) => detail.message),
      });
    }
  }

  next();
};
