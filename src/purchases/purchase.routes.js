import { Router } from "express";


import {
    editShoppingCart,
    getShoppingCart, removeItemFromShoppingCart,
    shoppingCart
} from "./purchase.controller.js"

import { validateJWT } from "../middlewares/validate-jwt.js";
import { isClient } from "../middlewares/validate-roles.js";

const router = Router();

router.post(
    "/",
        validateJWT,
        isClient,
    shoppingCart
);

router.get("/", validateJWT, isClient, getShoppingCart);

router.put("/", validateJWT, isClient, editShoppingCart);

router.delete("/", validateJWT, isClient, removeItemFromShoppingCart);

// router.post("/buy", validateJWT, isClient, buyCart);

export default router;