import { Router } from "express";
import { verifyToken } from "../Middleware/ValidateToken.js";
import * as register from "../Controller/RegisterController.js";
import * as user from "../Controller/UserController.js";
import { upLoadsProfile } from "../Lib/Multer.js";

const router = Router();

router.post("/register-user", register.registerUser);
router.post(
  "/register-delivery",
  [verifyToken, upLoadsProfile.single("image")],
  register.registerDelivery
);

router.get("/get-user-by-id", verifyToken, user.getUserById);
router.put("/edit-profile", verifyToken, user.editProfile);
router.get("/get-user-updated", verifyToken, user.getUserUpdated);
router.put("/change-password", verifyToken, user.changePassword);
router.put(
  "/change-image-profile",
  [verifyToken, upLoadsProfile.single("image")],
  user.changeImageProfile
);
router.get("/get-addresses", verifyToken, user.getAddressesUser);
router.delete(
  "/delete-street-address/:idAddress",
  verifyToken,
  user.deleteStreetAddress
);
router.post("/add-new-address", verifyToken, user.addStreetAddress);
router.get("/get-address", verifyToken, user.getAddressOne);
router.put(
  "/update-notification-token",
  verifyToken,
  user.updateNotificationToken
);
router.get(
  "/get-admins-notification-token",
  verifyToken,
  user.getAdminNotificationToken
);
router.put(
  "/update-delivery-to-client/:idPerson",
  verifyToken,
  user.updateDeliveryToClient
);

export default router;
