import { response, request } from "express";

import Category from './category.model.js';
import Product from "../products/product.model.js";


export const categoryPost = async (req, res) => {
    const {categoryName, description} = req.body;
    const category = new Category({categoryName, description});

    await category.save();

    res.status(200).json({
        category
    });
}

export const categoriesGet = async (req = request, res = response) => {
    const query = {state: true};

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
    ]);
    res.status(200).json({
        total,
        categories
    });    
}

export const categoryPut = async (req, res = response) => {
    const{id} = req.params;
    const {categoryName, ...resto } = req.body;

    const cateDefault = await Category.findOne({categoryName: 'Products'});
    if(id === cateDefault._id.toString()){
        return res.status(401).json({ msg: 'Category default cannot be edited.' });
    }

    const category = await Category.findByIdAndUpdate(id, resto);

    res.status(200).json({
        msg: 'Category actualized',
        category
    });
}

export const categoryDelete = async (req, res) => {
    const{categoryName} = req.body; 

    const cate = await Category.findOne({categoryName: categoryName});
    const cateDefault = await Category.findOne({categoryName: 'Products'});
    
    if(categoryName === 'Products'){
        return res.status(400).json({ msg: 'Category default cannot be deleted.' });
    };
    if(!cate){
        return res.status(404).json({ msg: 'Category not found' }); 
    };
    if(!cate.state){
        return res.status(404).json({ msg: 'Category was removed.' });
    };

    const category = await Category.findByIdAndUpdate(cate._id, {state: false});

    await Product.updateMany({ category: cate._id }, { category: cateDefault._id });

    res.status(200).json({
        msg: 'Category eliminated',
        category
    });
}