import express from "express";
import connectDB from "./database/db.connect";
import { generateMongoDBQuery } from "./services/createDynamicQueries.service";
import { validateRequestQuery } from "./middlewares/validators/request-query.validate";
import cors from "cors";
const app = express();
app.use(cors());
const port = 3000;
app.use(express.json());

connectDB();

app.post("/filter", validateRequestQuery, async (req, res) => {
  /*

  This is the structure of req we expect from the frontend.
  
   req.body = {
     "queries": [
       { "condition": "vendor", "operator": "contains", "value": "Acme" },
       { "condition": "tags", "operator": "contains","value": "hat" },
       { "condition": "title", "operator": "ends with", "value": "s" }
    ],
    "logic": "or"
}

  */

  const result = await generateMongoDBQuery(req.body);

  res.send(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
