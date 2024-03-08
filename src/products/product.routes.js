import { Router } from "express";
import { check } from "express-validator";

import {
    productPost,
    productsGet,
    productPut,
    productDelete,
    productSerch,
    productForCategory,
    productSoldOut,
    productsBestSelling
} from "./product.controller.js"
import { validateCampos } from "../middlewares/validate-campos.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { isAdmin } from "../middlewares/validate-roles.js";
import { productExists } from "../helpers/db-validators.js";

const router = Router();

router.get("/", productsGet);

router.post(
    "/",
    [
        validateJWT,
        isAdmin,
        check("productName", "Product name is required").not().isEmpty(),
        check("productName").custom(productExists),
        check("description", "Description is required").not().isEmpty(),
        check("stock", "Stock is required").not().isEmpty(),
        check("category", "Category is required").not().isEmpty(), 
        validateCampos
    ],productPost
);

router.put(
    "/",
    [   
        validateJWT,
        isAdmin,
        check("productoName", "Product to edit is required").not().isEmpty(),
        check("productName").custom(productExists),
        check("description", "Description is required").not().isEmpty(),
        check("stock", "Stock is required").not().isEmpty(),
        check("category", "Category is required").not().isEmpty(), 
    ],productPut
);

router.delete(
    "/",
    [
        validateJWT,
        isAdmin,
        check("productName", "Product to remove is required").not().isEmpty()
    ],productDelete
)

router.get(
    "/serch",
    [
        check("productName", "Product to serch is required").not().isEmpty()
    ],productSerch
)

router.get(
    "/category",
    [
        check("categoryName", "Category to serch is required").not().isEmpty()
    ],productForCategory
)

router.get(
    "/soldOut",
    validateJWT,
    isAdmin,
    productSoldOut
)

router.get(
    "/bestSelling",
    productsBestSelling
)
export default router;