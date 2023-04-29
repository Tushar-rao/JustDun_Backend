import { Router } from "express";
import { verifyToken } from "../Middleware/ValidateToken.js";
import * as login from "../Controller/LoginController.js";

const router = Router();

router.post("/login-email-id", login.loginController);
router.post("/login-user-otp", login.loginuserwithotp);
router.post("/delete-user", login.delete_user);
router.post("/get-userbyid", login.getUserbyid);
router.post("/getuser_address", login.getuser_address);
router.post("/getuser_default_address", login.getuser_default_address);
router.post("/create_new_address", login.create_new_address);
router.post("/update_my_address", login.update_my_address);
router.post("/delete_user_address", login.delete_user_address);
router.post("/update_userprofile", login.update_profile);
router.post("/getmypass", login.getuser_old_pass);
router.post("/create_new_enquiry", login.create_new_enquiry);
router.post("/getUserNotification", login.getUserNotification);
router.post("/getvendorscanner", login.getvendorscanner);
router.post("/update_userpass", login.update_password);
router.post("/login-product-vendor", login.product_vendor_loginController);
router.get("/loginpagemediacontroller", login.loginpagemediacontroller);
router.get("/renew-token-login", verifyToken, login.renewTokenLogin);

export default router;
