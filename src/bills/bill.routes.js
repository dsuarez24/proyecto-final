import { Router } from "express";
import { check } from "express-validator";

import {
    payPurchase,
    billsHistory,
    billsForUser
} from "./bill.controller.js"

import { validateJWT } from "../middlewares/validate-jwt.js";
import { isAdmin, isClient } from "../middlewares/validate-roles.js";

const router = Router();

router.post(
    "/",
    validateJWT,
    isClient,
    payPurchase
);

router.get(
    "/",

    validateJWT,
    billsHistory
)

router.get(
    "/forUser",
    [
        validateJWT,
        isClient,
    ],billsForUser
)


export default router;