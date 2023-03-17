import { Router } from "express";
import * as orders from "../Controller/OrdersController.js";
import { verifyToken } from "../Middleware/ValidateToken.js";

const router = Router();

// router.post('/add-new-servicecart', verifyToken, orders.addNewOrders );
router.post("/add-new-servicecart", orders.addNewOrders);
router.post("/book-new-services", orders.book_Services);
router.get(
  "/get-orders-by-status/:statusOrder",
  verifyToken,
  orders.getOrdersByStatus
);
router.get(
  "/get-details-order-by-id/:idOrderDetails",
  verifyToken,
  orders.getDetailsOrderById
);
router.put(
  "/update-status-order-dispatched",
  verifyToken,
  orders.updateStatusToDispatched
);
router.get(
  "/get-all-orders-by-delivery/:statusOrder",
  verifyToken,
  orders.getOrdersByDelivery
);
router.put(
  "/update-status-order-on-way/:idOrder",
  verifyToken,
  orders.updateStatusToOntheWay
);
router.put(
  "/update-status-order-delivered/:idOrder",
  verifyToken,
  orders.updateStatusToDelivered
);

export default router;
