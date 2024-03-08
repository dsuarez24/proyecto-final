import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema({
    productName: {
        type: String,
        required: [true, "The name is required"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    stock: {
        type: Number,
        require: [true, 'The stock is required']
    },
    sales:{
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, "Category is required"]
    },
    state: {
        type: Boolean,
        default: true,
    }
});

export default mongoose.model('Product', ProductSchema);