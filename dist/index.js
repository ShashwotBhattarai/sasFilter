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
const filterProducts_service_1 = require("./services/filterProducts.service");
const request_query_validate_1 = require("./middlewares/validators/request-query.validate");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, db_connect_1.default)();
app.post("/filter", request_query_validate_1.validateRequestQuery, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield new filterProducts_service_1.FilterProductsService().filterProducts(req.body);
    res.send(result);
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
