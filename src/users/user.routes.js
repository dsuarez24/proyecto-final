import { Router } from "express";
import { check } from "express-validator";
import {
    userPost, 
    usersGet, 
    userPut,
    userDelete,
    userPutLog,
    userDeleteLog,
    register
    } from "./user.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { validateCampos } from "../middlewares/validate-campos.js";
import { emailExists} from "../helpers/db-validators.js";
import { isAdmin } from "../middlewares/validate-roles.js";

const router = Router();

router.get("/", usersGet);

router.post(
    "/", [
        validateJWT,
        isAdmin,
        check("name", "The name is required").not().isEmpty(),
        check("password", "Password must be greater than 6 characters").isLength({min: 6,}),
        check("email", "The email entered is not valid ").isEmail(),
        check("email").custom(emailExists),
        check("role", "The role is required.").not().isEmpty(),
        validateCampos
    ],userPost
);

router.post(
    "/register",
    [
        check("name", "The name is required").not().isEmpty(),
        check("password", "Password must be greater than 6 characters").isLength({min: 6,}),
        check("email", "The email entered is not valid ").isEmail(),
        check("email").custom(emailExists),
        validateCampos  
    ],register
)

router.put(
    "/my",
    [
        validateJWT,
        check("name", "The name is required").not().isEmpty()
    ],userPutLog
);

router.put(
    "/",
    [
        validateJWT,
        isAdmin,
        check("email", "The email entered is not valid ").isEmail(),
    ],userPut
);

router.delete(
    "/my",
    [
        validateJWT,
        check("password", "Password id required").not().isEmpty(),
    ],userDeleteLog
);

router.delete(
    "/",
    [
        validateJWT,
        isAdmin,
        check("email", "The email entered is not valid ").isEmail(),
    ],userDelete
);

export default router;
