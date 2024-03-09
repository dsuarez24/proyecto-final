import { response, request } from "express";

import Bill from "./bill.model.js";
import User from "../users/user.model.js";
import Purchase from "../purchases/purchase.model.js";

export const payPurchase = async (req =request, res = response) => {
    const {id} = req.user;
    const user = await User.findOne({_id: id});

    const query = {pending: true, user: user._id}
    const purchase = await Purchase.findOne(query);

    if(!purchase){
        return res.status(404).json({ msg: 'The user dont have a shoppingcart pending' });
    }

    const bill = new Bill({
        user: user._id,
        purchase: purchase._id
    })

    const total = bill.shippingTax + purchase.subtotal;

    bill.total = total;

    const formattedDateTime = `${bill.dateTime.getFullYear()}-${('0' + (bill.dateTime.getMonth() + 1)).slice(-2)}-${('0' + bill.dateTime.getDate()).slice(-2)}   ${('0' + bill.dateTime.getHours()).slice(-2)}:${('0' + bill.dateTime.getMinutes()).slice(-2)}:${('0' + bill.dateTime.getSeconds()).slice(-2)}`;

    await bill.save();

    user.shopping = false;
    await user.save();
    purchase.pending = false;
    await purchase.save();

    res.status(200).json({
        msg: 'BILL GENERATED',
        bill: {
            ...bill.toObject(),
            user: user.email,
            purchase: purchase,
            dateTime: formattedDateTime
        }
    });
};

export const billsHistory = async (req = request, res = response) => {
    const [total, bills] = await Promise.all([
        Bill.countDocuments(),
        Bill.find().populate({path: 'purchase', select: '-_id'}).populate({path: 'user', select: 'email'})
    ]);
    
    res.status(200).json({
        total,
        bills: bills.map(bill => ({
            

            ...bill.toObject(),
            purchase: bill.purchase,
            dateTime:  `${bill.dateTime.getFullYear()}-${('0' + (bill.dateTime.getMonth() + 1)).slice(-2)}-${('0' + bill.dateTime.getDate()).slice(-2)}   ${('0' + bill.dateTime.getHours()).slice(-2)}:${('0' + bill.dateTime.getMinutes()).slice(-2)}:${('0' + bill.dateTime.getSeconds()).slice(-2)}`
        }))
    });
};

export const billsForUser = async (req = request, res = response) => {
    const {id} = req.user;
    const user = await User.findOne({_id: id});

    if(!user){
        return res.status(404).json({ msg: 'User doesnt exist in the databse' });
    }
    if(!user.state){
        return res.status(404).json({ msg: 'User was desactivated'});
    }

    const query = {user: user._id};

    const [total, bills] = await Promise.all([
        Bill.countDocuments(query),
        Bill.find(query).populate({path: 'purchase', select: '-_id -user'})
    ]);
    
    res.status(200).json({
        msg: `Bills for user: ${user.name}`,
        total,
        bills: bills.map(bill => ({
            

            ...bill.toObject(),
            user: user.email,
            purchase: bill.purchase,
            dateTime:  `${bill.dateTime.getFullYear()}-${('0' + (bill.dateTime.getMonth() + 1)).slice(-2)}-${('0' + bill.dateTime.getDate()).slice(-2)}   ${('0' + bill.dateTime.getHours()).slice(-2)}:${('0' + bill.dateTime.getMinutes()).slice(-2)}:${('0' + bill.dateTime.getSeconds()).slice(-2)}`
        }))
    });
};
