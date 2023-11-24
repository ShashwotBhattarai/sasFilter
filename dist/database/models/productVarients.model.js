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
exports.ProductVariants = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productVariantsSchema = new mongoose_1.Schema({
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
}, { timestamps: true, usePushEach: true });
const ProductVariants = mongoose_1.default.models.ProductVariants ||
    (0, mongoose_1.model)("ProductVariants", productVariantsSchema);
exports.ProductVariants = ProductVariants;
