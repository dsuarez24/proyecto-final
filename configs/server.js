'use strict'

import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import express from 'express'
import bcryptjs from 'bcryptjs';
import { dbConnection } from './mongo.js'
import userRoutes from '../src/users/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import categoryRoutes from '../src/categories/category.routes.js'
import productRoutes from '../src/products/product.routes.js'
import purchaseRoutes from '../src/purchases/purchase.routes.js'
import billRoutes from '../src/bills/bill.routes.js';
import User from '../src/users/user.model.js'
import Category from '../src/categories/category.model.js'

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.authPath = '/onlineShop/v1/auth';
        this.userPath = '/onlineShop/v1/users';
        this.categoryPath = '/onlineShop/v1/categories';
        this.productPath = '/onlineShop/v1/products';
        this.purchasePath = '/onlineShop/v1/shoppingCart';
        // this.billPath = '/onlineShop/v1/shoppingCart';
        this.billPath = '/onlineShop/v1/bills';
        this.middlewares();
        this.connectDB();
        this.routes();
    }
    async connectDB(){
        await dbConnection();
        const existingUser = await User.findOne({ email: 'admindefault@gmail.com' });
        if(!existingUser){
            const encryPassword = bcryptjs.hashSync('123456', 10);

            User.create({
                name: 'Admin',
                address: 'undefined',
                phone: '00000000',
                email: 'admindefault@gmail.com',
                password: encryPassword,
                role: 'ADMIN'
            })
            console.log('-> Default user is created.');    
        }
        const existingCategory = await Category.findOne({ categoryName: 'Products' });
        if(!existingCategory){
            Category.create({
                categoryName: 'Products',
                description: 'This product doesnt have a category yet'
            })
            console.log('-> Default category is created.');    
        }
    }
    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }
    routes(){
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.categoryPath, categoryRoutes);
        this.app.use(this.productPath, productRoutes);
        this.app.use(this.purchasePath, purchaseRoutes);
        this.app.use(this.billPath, billRoutes)
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;