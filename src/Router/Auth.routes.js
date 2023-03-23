import { Router } from "express";
import { verifyToken } from "../Middleware/ValidateToken.js";
import * as login from "../Controller/LoginController.js";

const router = Router();

router.post("/login-email-id", login.loginController);
router.post("/delete-user", login.delete_user);
router.post("/get-userbyid", login.getUserbyid);
router.post("/update_userprofile", login.update_profile);
router.post("/getmypass", login.getuser_old_pass);
router.post("/getvendorscanner", login.getvendorscanner);
router.post("/update_userpass", login.update_password);
router.post("/login-product-vendor", login.product_vendor_loginController);
router.get("/renew-token-login", verifyToken, login.renewTokenLogin);

export default router;
