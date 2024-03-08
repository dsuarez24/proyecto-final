import { response, request } from "express";
import Product from "./product.model.js";
import Category from "../categories/category.model.js"

/////////////////////////////////////////////////////////////////////////
export const productPost = async (req, res) => {
    const {productName, description, price, stock, category} = req.body;
    const cate = await Category.findOne({categoryName: category});

    if(!cate){
        return res.status(404).json({ msg: 'Category doesnt exits in the database' });
    };
    if(!cate.state){
        return res.status(404).json({ msg: 'Category was removed.' });
    };

    const product = new Product({productName, description, price, stock, category: cate._id});
    await product.save();

    res.status(200).json({
        product
    });
}

export const productsGet = async (req =request, res = response) => {
    const query = {state: true};
    
    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .populate('category', ['categoryName', 'description'])
    ]);

    res.status(200).json({
        msg: 'Products available.',
        total,
        products
    });
}

export const productDelete = async (req, res) => {
    const {productName} = req.body;

    // Validaciones de producto
    const prod = await Product.findOne({productName: productName});
    if(!prod){
        return res.status(404).json({ msg: 'Product doesnt exits in the database' });
    };
    if(!prod.state){
        return res.status(404).json({ msg: 'Product was removed.' });
    };    

    const product = await Product.findByIdAndUpdate(prod._id, {state: false});

    res.status(200).json({
        msg: 'Product has been removed.',
        product
    });
};

export const productPut = async (req, res = response) => {
    const {productName} = req.body;
    const {_id, category, ...resto} = req.body;

    // Validaciones de producto
    const prod = await Product.findOne({productName: productName});
    if(!prod){
        return res.status(404).json({ msg: 'Product doesnt exits in the database' });
    };
    if(!prod.state){
        return res.status(404).json({ msg: 'Product was removed.' });
    };

    // validaciones de categoria
    const cate = await Category.findOne({categoryName: category});
    if(!cate){
        return res.status(404).json({ msg: 'Category doesnt exits in the database' });
    };
    if(!cate.state){
        return res.status(404).json({ msg: 'Category was removed.' });
    };

    const product = await Product.findByIdAndUpdate(prod._id, {...resto, category: cate._id});

    res.status(200).json({
        msg: 'Product actualized',
        product
    });
}
/////////////////////////////////////////////////////////////////////////

export const productSerch = async (req, res = response)  => {
    const {productName} = req.body;

    const product = await Product.findOne({productName});

    const category = await Category.findById(product.category);

    res.status(200).json({
        msg: 'Find product',
        product: {
            ...product.toObject(),
            category: {
                ...category.toObject(),
                categoryName: category.categoryName,
                description: category.description
            }
        }
    });
}   

export const productForCategory = async (req, res = response)  => {
    const {categoryName} = req.body;

    const cate = await Category.findOne({categoryName});

    if(!cate){
        return res.status(404).json({ msg: 'Category doesnt exits in the database' });
    };
    if(!cate.state){
        return res.status(404).json({ msg: 'Category was removed.' });
    };

    const query = {category: cate._id};

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query).populate('category', ['categoryName', 'description'])
    ]);

    res.status(200).json({
        category: `${cate.categoryName}`,
        total,
        products
    });
}
 
export const productSoldOut = async(req, res = response) => {
    const query = {stock: 0};

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .populate('category', ['categoryName', 'description', '-_id'])
    ]);
    
    console.log('BBBBBBBBBBBBBBBBBBB');

    res.status(200).json({
        msg: 'Products SOLD OUT',
        total,
        products
    });
};

export const productsBestSelling = async(req ,res = response) => {
    const query = {state: true}

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.aggregate([
            { $match: query },
            { $sort: { sales: -1 } }
        ])
    ]);
    
    console.log('AAAAAAAAAAAAAAAAAAA');

    res.status(200).json({
        msg: 'The best selling products',
        total,
        products
    });
}
