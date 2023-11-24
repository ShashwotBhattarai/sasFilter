"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productsSchema = new mongoose_1.Schema({
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
}, { timestamps: true, usePushEach: true });
let Products = mongoose_1.default.models.Products ||
    (0, mongoose_1.model)("Products", productsSchema);
exports.Products = Products;
