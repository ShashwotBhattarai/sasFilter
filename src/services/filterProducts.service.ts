import { Products } from "../database/models/product.model";
import { ProductVariants } from "../database/models/productVarients.model";

export class FilterProductsService {
	async filterProducts(reqBody: any) {
		const logic = reqBody.logic;
		const { varientsQuery, productQuery } = this.seperateQueries(reqBody);

		const filteredProductResponse = await this.searchAndReturnProducts(productQuery, varientsQuery, logic);

		return { status: filteredProductResponse?.status, message: filteredProductResponse?.message };
	}

	seperateQueries(mainQuery: any) {
		let varientsQuery: any = [];
		let productQuery: any = [];

		mainQuery.queries.forEach((query: any) => {
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

		return {
			varientsQuery: varientsQuery,
			productQuery: productQuery,
		};
	}

	async searchAndReturnProducts(productQuery: any, varientsQuery: any, logic: any) {
		if (productQuery.length > 0 && varientsQuery.length === 0) {
			let mongoQueryForProduct = this.mongoQueryGenerator(productQuery, logic);
			try {
				const productsQueryResult = await Products.find(mongoQueryForProduct);
				console.log(productsQueryResult.length);
				return { status: 200, message: productsQueryResult };
			} catch (err) {
				return {
					status: 500,
					message: err,
				};
			}
		} else if (productQuery.length === 0 && varientsQuery.length > 0) {
			let mongoQueryForVarient = this.mongoQueryGenerator(varientsQuery, logic);

			try {
				const varientsQueryResult = await ProductVariants.find(mongoQueryForVarient);

				console.log(varientsQueryResult.length);
				const uniqueProductIds = Array.from(
					new Set(varientsQueryResult.map((variant) => variant.product_id))
				);
				console.log(uniqueProductIds.length);

				const productsQueryResult = await Products.find({
					_id: { $in: uniqueProductIds },
				});

				return { status: 200, message: productsQueryResult };
			} catch (err) {
				return {
					status: 500,
					message: err,
				};
			}
		} else if (productQuery.length > 0 && varientsQuery.length > 0) {
			let mongoQueryForVarient = this.mongoQueryGenerator(varientsQuery, logic);
			let mongoQueryForProduct = this.mongoQueryGenerator(productQuery, logic);

			try {
				const varientsQueryResult = await ProductVariants.find(mongoQueryForVarient);
				console.log(varientsQueryResult.length);
				const uniqueProductIdsFromVarient = new Set(
					varientsQueryResult.map((variant) => variant.product_id)
				);
				console.log(uniqueProductIdsFromVarient);

				const productQueryResult = await Products.find(mongoQueryForProduct);
				console.log(productQueryResult.length);
				const uniqueProductIdsFromProduct = new Set(productQueryResult.map((product) => product._id));
				console.log(uniqueProductIdsFromProduct);

				if (logic == "and") {
					const finalSetOfIds = new Set(
						[...uniqueProductIdsFromProduct].filter((value) =>
							uniqueProductIdsFromVarient.has(value)
						)
					);
					const finalArrayOfIds = Array.from(finalSetOfIds);
					const productsQueryResult = await Products.find({
						_id: { $in: finalArrayOfIds },
					});
					return { status: 200, message: productsQueryResult };
				} else if (logic == "or") {
					console.log("iam inside or block");
					const finalSetOfIds = new Set([
						...uniqueProductIdsFromProduct,
						...uniqueProductIdsFromVarient,
					]);

					console.log(finalSetOfIds);
					const finalArrayOfIds = Array.from(finalSetOfIds);
					console.log(finalArrayOfIds);
					const productsQueryResult = await Products.find({
						_id: { $in: finalArrayOfIds },
					});
					console.log(productsQueryResult.length);
					return { status: 200, message: productsQueryResult };
				}
			} catch (err) {
				return {
					status: 500,
					message: err,
				};
			}
		}
	}

	mongoQueryGenerator(inputQuery: any, logic: any) {
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
