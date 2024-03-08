import { response } from "express";

export const isAdmin = (req, res, next) => {
    if(!req.user){
        return res.status(500).json({
            msg: "Login required."
        });
    };
    const {role, name} = req.user;
    if(role !== "ADMIN"){
        return res.status(401).json({
            msg: `${name} is not an admin.`
        });
    };
    next();
}

export const isClient = (req, res, next) => {
    if(!req.user){
        return res.status(500).json({
            msg: "Login required."
        });
    };
    const {role, name} = req.user;
    if(role !== "CLIENT"){
        return res.status(401).json({
            msg: `${name} is not an client.`
        });
    };
    next();
}

