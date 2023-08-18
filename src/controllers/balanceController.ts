import express from "express";
import { getUSDCBalance } from "../services/ethereumService";
import { handleError } from "../utils/errorHandler";

const router = express.Router();

router.get("/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const balance = await getUSDCBalance(address, res);
    res.json({ balance });
  } catch (error)  {}
});

export default router;
