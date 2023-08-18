import express from "express";
import { getUSDCTransactions } from "../services/ethereumService";
import { handleError } from "../utils/errorHandler";

const router = express.Router();

router.get("/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const transactions = await getUSDCTransactions(address, res);
    res.json({ transactions });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
