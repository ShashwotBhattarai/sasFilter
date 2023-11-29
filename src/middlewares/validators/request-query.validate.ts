import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { conditions, operators } from "../../constants/conditionsAndOperators.constants";

// defining validation schema for conditions
const conditionSchema = Joi.string().valid(...conditions);

// defining validation schema for conditions
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
//this is the middleware
export const validateRequestQuery = (req: Request, res: Response, next: NextFunction) => {
	const { logic, queries } = req.body;

	const schema = Joi.object({
		logic: Joi.string().required(),
		queries: Joi.array().items(
			Joi.object({
				condition: conditionSchema.required(),
				operator: Joi.string().required(),
				value: [Joi.number(), Joi.string()],
			}).required()
		),
	});

	const { error } = schema.validate(req.body);

	if (error) {
		return res.status(400).json({ error: error.details.map((detail) => detail.message) });
	}

	for (const element of queries) {
		const { error: conditionError } = conditionSchema.validate(element.condition);
		const { error: operatorError } = operatorSchema.validate({
			[element.condition]: element.operator,
		});

		if (conditionError || operatorError) {
			return res.status(400).json({
				conditionErrorerror: conditionError?.details.map((detail) => detail.message),
				operatorError: operatorError?.details.map((detail) => detail.message),
			});
		}
	}

	next();
};
