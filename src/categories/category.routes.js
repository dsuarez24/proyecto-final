import { Router } from "express";
import { check } from "express-validator";
import {
    categoriesGet,
    categoryPost,
    categoryPut,
    categoryDelete
    } from "./category.controller.js"
import { isAdmin } from "../middlewares/validate-roles.js";
import { categoryExists } from "../helpers/db-validators.js";
import { validateCampos } from "../middlewares/validate-campos.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

    const router = Router();

    router.get("/", categoriesGet);
    
    router.post(
        "/", [
            validateJWT,
            isAdmin,
            check("categoryName", "The username is required").not().isEmpty(),
            check("categoryName").custom(categoryExists),
            check("description", "The username is required").not().isEmpty(),
            validateCampos
        ],categoryPost
    );

    router.put(
        "/:id",
        [
            validateJWT,
            isAdmin,
            check("categoryName", "The username is required").not().isEmpty(),
            check("categoryName").custom(categoryExists),
            check("description", "The username is required").not().isEmpty(),
        ],categoryPut
    );


    router.delete(
        "/",
        [   
            validateJWT,
            isAdmin,
            check("categoryName", "Category to remove is required").not().isEmpty()
        ], categoryDelete
    )
export default router;