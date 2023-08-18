import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import balanceController from "./controllers/balanceController";
import transactionsController from "./controllers/transactionsController";
import Moralis from "moralis";

require("dotenv").config();

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Express Typescript on Vercel')
})

app.use("/api/balance", balanceController);
app.use("/api/transactions", transactionsController);

// Add this a startServer function that initialises Moralis
const startServer = async () => {
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Call startServer()
startServer();
