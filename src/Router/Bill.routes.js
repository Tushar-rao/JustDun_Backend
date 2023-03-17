import { Router } from "express";
import * as billing from "../Controller/BillingController.js";
import { verifyToken } from "../Middleware/ValidateToken.js";

const router = Router();

// router.post("/billingdetails", verifyToken, billing.billing_controller);
router.post("/billingdetails", billing.billing_controller);
router.post("/create-new-ledger", billing.create_new_ledger);
router.post("/refer-earn-page", billing.referearn_page);

export default router;
