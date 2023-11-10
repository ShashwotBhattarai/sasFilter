import express from "express";
import connectDB from "./database/db.connect";
import { generateMongoDBQuery } from "./services/createDynamicQueries.service";

const app = express();
const port = 3000;
app.use(express.json());

connectDB();

app.get("/filter", async (req, res) => {

  /*

  This is the structure of req we expect from the frontend.
  
   req.body = {
     queries: [
       { condition_1: "product title", condition_2: "contains", value: "ram" },
       { condition_1: "product vendor", condition_2: "is equals to", value: "Acme" },
       { condition_1: "product quantity", condition_2: "is less than", value: 20 },
       { condition_1: "product title", condition_2: "ends with", value: "ram" },
    ],
    logic: "and" || "or",
  };

  */

  const result = await  generateMongoDBQuery(req.body);

 res.send(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
