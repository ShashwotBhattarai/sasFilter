import mongoose, { Schema, model, Model, InferSchemaType } from "mongoose";

const productsSchema = new Schema(
  {
    _id: Number,
    shop_id: { type: Number, index: true, required: true },
    title: {
      type: String,
      required: [true, "can't be blank"],
    },
    handle: { type: String, index: true },
    body_html: String,
    vendor: String,
    product_type: String,
    created_at: Date,
    updated_at: Date,
    published_at: Date,
    template_suffix: String,
    published_scope: String,
    tags: String,
    variants: [
      {
        type: Number,
        ref: "ProductVariants",
      },
    ],
    options: [
      {
        _id: String,
        product_id: String,
        name: String,
        position: Number,
        values: [String],
      },
    ],
    images: [
      {
        _id: String,
        product_id: String,
        position: Number,
        created_at: Date,
        updated_at: Date,
        alt: String,
        width: Number,
        height: Number,
        src: String,
        variant_ids: [String],
      },
    ],
    image: {
      _id: String,
      product_id: String,
      position: Number,
      created_at: Date,
      updated_at: Date,
      alt: String,
      width: Number,
      height: Number,
      src: String,
      variant_ids: [String],
    },
    metafields: [
      {
        namespace: String,
        key: String,
        value: String,
      },
    ],
  },
  { timestamps: true, usePushEach: true }
);

export type ProductSchemaType = InferSchemaType<typeof productsSchema>;

let Products: Model<ProductSchemaType> =
  mongoose.models.Products ||
  model<ProductSchemaType>("Products", productsSchema);

export { Products };
