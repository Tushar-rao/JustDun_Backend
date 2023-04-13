import { Router } from "express";
import * as userservices from "../Controller/UserservicesController.js";

const router = Router();

router.get("/service_page_slider", userservices.servicepageslider);
router.get("/getmainservices", userservices.mainservicescontroller);
router.post("/service-vendors", userservices.servicesvendorcontroller);
router.post("/vendorallservices", userservices.vendor_services);
router.post("/getalltimings", userservices.getalltimings);
router.post("/service-cart", userservices.service_cart);
router.post("/available-vendorseates", userservices.available_seates);
router.get("/mainservicepage", userservices.mainservicepage);
router.post("/getallservicesbookings", userservices.get_all_service_bookings);
router.post(
  "/get_service_bookings_detail",
  userservices.get_service_bookings_detail
);
router.post(
  "/servicedetails-categories",
  userservices.servicedetail_categories
);
router.post("/deleteUserService", userservices.deleteUserService);

export default router;
