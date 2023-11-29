import express from "express";
import connectDB from "./database/db.connect";
import { FilterProductsService } from "./services/filterProducts.service";
import { validateRequestQuery } from "./middlewares/validators/request-query.validate";
import cors from "cors";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

connectDB();

app.post("/filter", validateRequestQuery, async (req, res) => {
	const result = await new FilterProductsService().filterProducts(req.body);

	res.send(result);
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
