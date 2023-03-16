import { Router } from "express";
import * as payment from "../Controller/PaymentsController.js";
import { upLoadsProfile } from "../Lib/Multer.js";
const router = Router();

router.post("/send-money-amount", payment.sendmoney);

export default router;
