import mongoose, { Schema, model, Model, InferSchemaType } from "mongoose";

const productVariantsSchema = new Schema(
	{
		_id: Number,
		shop_id: { type: Number, index: true, required: true },
		product_id: Number,
		title: String,
		price: Number,
		sku: { type: String, index: true },
		automated_sku: String,
		position: Number,
		inventory_policy: String,
		compare_at_price: Number,
		fulfillment_service: String,
		inventory_management: String,
		option1: String,
		option2: String,
		option3: String,
		created_at: Date,
		updated_at: Date,
		taxable: Boolean,
		barcode: String,
		grams: Number,
		image_id: String,
		weight: Number,
		weight_unit: String,
		inventory_item_id: Number,
		inventory_quantity: Number,
		old_inventory_quantity: Number,
		parent: {
			type: Number,
			ref: "Products",
		},
	},
	{ timestamps: true, usePushEach: true }
);

export type VariantsSchemaType = InferSchemaType<typeof productVariantsSchema>;

const ProductVariants: Model<VariantsSchemaType> =
	mongoose.models.ProductVariants || model<VariantsSchemaType>("ProductVariants", productVariantsSchema);

export { ProductVariants };
