import { Router } from "express";
import * as payment from "../Controller/PaymentsController";
import { upLoadsProfile } from "../Lib/Multer";
const router = Router();

router.post("/send-money-amount", payment.sendmoney);

export default router;
