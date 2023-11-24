import express from "express";
import connectDB from "./database/db.connect";
import { FilterProductsService } from "./services/filterProducts.service";
import { validateRequestQuery } from "./middlewares/validators/request-query.validate";

const app = express();
const port = 3000;
app.use(express.json());

connectDB();

app.get("/filter", validateRequestQuery, async (req, res) => {
	/*

  This is the structure of req we expect from the frontend.
  
   req.body = {
          "queries": [
            { "condition": "vendor", "operator": "contains", "value": "Acme" },
            { "condition": "tags", "operator": "contains","value": "hat" },
            { "condition": "title", "operator": "ends with", "value": "s" },
            { "condition": "price", "operator": "is greater than", "value": 50 },
            { "condition": "weight", "operator": "is less than","value": 5 },
            { "condition": "variants_title", "operator": "contains", "value": "s" }
        ],
        "logic": "or"
  }

  */

	const result = await new FilterProductsService().filterProducts(req.body);

	res.send(result);
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
