import { Router } from "express";

import * as product from "../Controller/ProductController.js";
import { upLoadsProducts } from "../Lib/Multer.js";
import { verifyToken } from "../Middleware/ValidateToken.js";

const router = Router();

router.post("/add-new-products", product.getproducthomescreen);

//main banner
router.post("/product_screen_banner", product.product_screen_banner);

//main categories at top bar
router.post("/getmainproduct-category", product.getproduct_main_categories);

//dropdowns
router.post("/select-product-main-category", product.select_product_main);
router.post("/select-product-sub-category", product.select_product_sub);
router.get("/select-product-brand", product.select_product_brand);

//get all products by main category
router.post("/products-bycategory", product.get_main_all_products);
router.post(
  "/category_condition_productslist",
  product.category_condition_productslist
);
router.post("/all_products_bybrand", product.all_products_bybrand);

//product deatils
router.post("/product_details", product.product_details);

// ADD TO CART
router.post("/add_product_tocart", product.add_product_tocart);

router.post("/removeuserproduct", product.removeuserproduct);

router.post("/get_product_booked_history", product.get_product_booked_history);
router.post("/get_product_booked_details", product.get_product_booked_details);

router.post("/getmainproduct-page", product.get_main_productpage);
router.get("/main_screen_shopbybrand", product.main_screen_shopbybrand);
router.post("/getproduct_cart", product.getproduct_cart);

export default router;
