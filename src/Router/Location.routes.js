import { Router } from "express";
import * as location from "../Controller/LocationController";
import { upLoadsProducts } from "../Lib/Multer";
const router = Router();

router.get("/get-states", location.statecontroller);
router.post("/get-cities", location.citycontroller);
router.post("/get-areas", location.areacontroller);

//chatapi
router.post("/get-chat", location.getchats);
router.post("/get-detailed-chat", location.getspecific_chats);
router.post("/get-detailed-contacts", location.getspecific_contacts);
router.post("/get-appcontacts", location.getappcontacts);
router.post(
  "/sendmsg",
  upLoadsProducts.array("attachment"),
  location.sendmessage
);

export default router;
