import { Router } from "express";


import {
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

export default router;