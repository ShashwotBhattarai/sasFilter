import express from "express";
import connectDB from "./database/db.connect";
import { generateMongoDBQuery } from "./services/createDynamicQueries.service";
import { validateRequestQuery } from "./middlewares/validators/request-query.validate";


const app = express();
const port = 3000;
app.use(express.json());

connectDB();

app.get("/filter",validateRequestQuery, async (req, res) => {
  /*

  This is the structure of req we expect from the frontend.
  
   req.body = {
     "queries": [
       { "condition": "vendor", "operator": "is equal to", "value": "Acme" },
       { "condition": "tags", "operator": "contains", "value": "hat" },
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
