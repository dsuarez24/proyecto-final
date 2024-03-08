import User from '../users/user.model.js'
import Category from '../categories/category.model.js';
import Product from '../products/product.model.js';

export const emailExists = async (email = '') => {
    const emailE = await User.findOne({email});
    if (emailE){
        throw new Error(`The email ${email} is alredy register`);
    }
}

export const categoryExists = async (categoryName = '') => {
    const cateE = await Category.findOne({categoryName});
    if(cateE){
        throw new Error(`The category ${categoryName} is alredy register`);
    }
}

export const productExists = async (productName = '' ) => {
    const prodE = await Product.findOne({productName});
    if(prodE){
        throw new Error(`The product ${productName} is alredy register`);
    }
}
