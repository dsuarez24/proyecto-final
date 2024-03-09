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
        
        console.log({purchase})
        const newProduct = purchase.products.findIndex(product => {
            if(product.productName === productName){
                product.quantity = product.quantity + quantity;
                product.amount = product.amount + amount;
            }
            return product;
        })

        console.log({newProduct})
        if (newProduct === -1){
            purchase.products.push({
                product: product._id,
                productName: product.productName,
                quantity: quantity,
                amount
            });
        }


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

export const removeItemFromShoppingCart = async (req, res) => {
    const {id} = req.user;
    const {productName} = req.body;

    const user = await User
        .findOne({_id: id})
        .select("-password");

    const product = await Product.findOne({productName});

    if(!product){
        return res.status(404).json({ msg: 'Product doesnt exits in the database' });
    }

    const purchase = await Purchase.findOne({user: id, pending: true});

    if (!purchase){
        return res.status(404).json({ msg: 'Shopping cart doesnt exits' });
    }

    const indexFound = purchase.products.findIndex(product => product.productName === productName)

    if (indexFound === -1){
        return res.status(404).json({ msg: 'Product doesnt exits in the shopping cart' });
    }

    product.stock = product.stock + (purchase.products.find(product => product.productName === productName)?.quantity || 0);
    // delete product from the purchase
    const newProducts = purchase.products.filter(product => {
        if(product.productName !== productName){
            return product;
        }
    });


    purchase.products = newProducts;

    let totalAmonts = 0;
    purchase.products.forEach(product => {
        totalAmonts += product.amount;
    });

    purchase.subtotal = totalAmonts;
    await purchase.save();
    await product.save();

    res.status(200).json({
        msg: 'PRODUCT REMOVED FROM THE SHOPPING CART',
        purchase
    });
}

// export const buyCart = async (req, res) => {
//     const {id} = req.user;
//
//     const cart = await Purchase.findOneAndUpdate({user: id, pending: true}, {pending: false}, {new: true}).select("-__v -pending");
//
//     await User.findOneAndUpdate({_id: id}, {shopping: false}, {new: true});
//
//     res.status(200).json({
//         msg: 'COMPRA REALIZADA',
//         cart
//     })
// }

export const getShoppingCart = async (req, res) => {
    const {id} = req.user;

    const cart = await Purchase.findOne({user: id, pending: true}).select("-__v -pending");

    res.status(200).json({
        cart
    })
}

export const editShoppingCart = async (req, res) => {
    const {id} = req.user;
    const {productName, quantity} = req.body;

    const product = await Product.findOne({productName});

    if(!product){
        return res.status(404).json({ msg: 'Product doesnt exits in the database' });
    };

    if(!product.state){
        return res.status(404).json({ msg: 'Product was removed.' });
    };


    const purchase = await Purchase.findOne({user: id, pending: true});

    if (!purchase){
        return res.status(404).json({ msg: 'Shopping cart doesnt exits' });
    }

    const amount = quantity*product.price

    let stock =0
    const newProduct = purchase.products.find(product => {
        console.log("DEBUG")
        console.log({product})
        if(product.productName === productName){
            stock = product.quantity;
            product.quantity = quantity;
            console.log("DEBUGGGG", quantity, product.quantity)
            product.amount = amount;
            console.log("DEBUGGGG", product.amount, amount)
        }
        return product;
    })

    if (!newProduct){
        return res.status(404).json({ msg: 'Product doesnt exits in the shopping cart' });
    }

    if (product.stock + stock < quantity){
        return res.status(404).json({ msg: 'The quantity of this product available has been exceeded' });
    }

    product.stock = product.stock + stock - quantity;
    await product.save()

    let totalAmonts = 0;
    purchase.products.forEach(product => {
        totalAmonts += product.amount;
    });

    purchase.subtotal = totalAmonts;
    await purchase.save();

    res.status(200).json({
        msg: 'CARRITO ACTUALIZADO',
        purchase
    });
}
