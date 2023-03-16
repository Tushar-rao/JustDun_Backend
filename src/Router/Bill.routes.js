import { Router } from "express";
import * as billing from "../Controller/BillingController";
import { verifyToken } from "../Middleware/ValidateToken";

const router = Router();

// router.post("/billingdetails", verifyToken, billing.billing_controller);
router.post("/billingdetails", billing.billing_controller);
router.post("/create-new-ledger", billing.create_new_ledger);

export default router;
