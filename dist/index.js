"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_connect_1 = __importDefault(require("./database/db.connect"));
const product_model_1 = require("./database/models/product.model");
const app = (0, express_1.default)();
const port = 3000;
(0, db_connect_1.default)();
app.get("/filter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   req.body = {
    //     queries: [
    //       { condition_1: "product title", condition_2: "contains", value: "ram" },
    //       { condition_1: "product vendor", condition_2: "contains", value: "Acme" },
    //     ],
    //     logic: "and" || "or",
    //   };
    const productVendor = req.query.productVendor;
    const productTag = req.query.productTag;
    const filteredData_and_operation = yield product_model_1.Products.find({
        vendor: productVendor,
        tags: productTag,
    });
    const filteredData_or_operation = yield product_model_1.Products.find({
        $or: [{ vendor: productVendor }, { tags: productTag }],
    });
    res.send({ and: filteredData_and_operation, or: filteredData_or_operation });
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
