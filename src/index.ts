import express from "express";
import connectDB from "./database/db.connect";
import { Products } from "./database/models/product.model";

const app = express();
const port = 3000;

connectDB();

app.get("/filter", async (req, res) => {
  /*

  This is the structure of req we expect from the frontend.
  
   req.body = {
     queries: [
       { condition_1: "product title", condition_2: "contains", value: "ram" },
       { condition_1: "product vendor", condition_2: "contains", value: "Acme" },
    ],
    logic: "and" || "or",
  };

  */

  const productVendor = req.query.productVendor;
  const productTag = req.query.productTag;

  const filteredData_and_operation = await Products.find({
    vendor: productVendor,
    tags: productTag,
  });
  const filteredData_or_operation = await Products.find({
    $or: [{ vendor: productVendor }, { tags: productTag }],
  });

  res.send({ and: filteredData_and_operation, or: filteredData_or_operation });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
