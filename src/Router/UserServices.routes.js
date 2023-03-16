import { Router } from "express";
import * as userservices from "../Controller/UserservicesController.js";

const router = Router();

router.get("/getmainservices", userservices.mainservicescontroller);
router.post("/service-vendors", userservices.servicesvendorcontroller);
router.post("/vendorallservices", userservices.vendor_services);
router.post("/service-cart", userservices.service_cart);
router.post("/available-vendorseates", userservices.available_seates);
router.get("/mainservicepage", userservices.mainservicepage);
router.post(
  "/servicedetails-categories",
  userservices.servicedetail_categories
);

export default router;
