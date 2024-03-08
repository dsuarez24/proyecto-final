import { response, request } from "express";
import Purchase from "./purchase.model.js";
import Product from "../products/product.model.js";
import User from "../users/user.model.js";

export const shoppingCart = async (req =request, res = response) => {
    const {id} = req.user;
    const {productName,  quantity} = req.body;

    const user = await User.findOne({_id: id});
    const product = await Product.findOne({productName});

    if(!product){
        return res.status(404).json({ msg: 'Product doesnt exits in the database' });
    };
    if(!product.state){
        return res.status(404).json({ msg: 'Product was removed.' });
    }; 

    if(quantity>product.stock){
        return res.status(404).json({ msg: 'The quantity of this product available has been exceeded' });
    }

    if(!user.shopping){
        const amount  = quantity*product.price;
        const subtotal = amount;

        const purchase = new Purchase({
            products: [{
                product: product._id,
                productName: product.productName,
                quantity: quantity,
                amount
            }],
            subtotal,
            user: user._id
        })

        product.stock = product.stock - quantity;
        product.sales = product.sales + quantity;
        await product.save();

        user.shopping = true;
        await user.save();
        
        await purchase.save();

        res.status(200).json({ 
            msg: 'CARRITO CREADO',
            purchase
        });   
        
    }else{
        const query = {pending: true, user: user._id}
        const purchase = await Purchase.findOne(query);

        const amount  = quantity*product.price;
        
        purchase.products.push({
            product: product._id,
            productName: product.productName,
            quantity: quantity,
            amount: amount
        });
        
        let totalAmonts = 0;

        purchase.products.forEach(product => {
            totalAmonts += product.amount;
        });

        product.stock = product.stock - quantity;
        product.sales = product.sales + quantity;
        await product.save();

        purchase.subtotal = totalAmonts;
        await purchase.save();

        res.status(200).json({ 
            msg: 'AGREGADO AL CARRITO',
            purchase
        });
    }

    
}