import { Router } from "express";
import * as story from "../Controller/StoriesController.js";
import { upLoadsProfile } from "../Lib/Multer.js";
const router = Router();

router.post("/user-stories", story.getuserconnectedstories);
router.post("/my-story", story.getmystory);
router.post(
  "/contacts-stories",
  upLoadsProfile.single("attachments"),
  story.putstory
);
// router.post(
//   "/sendmsg",
//   upLoadsProducts.array("attachment"),
//   location.sendmessage
// );

export default router;
