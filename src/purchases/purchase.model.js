import mongoose from 'mongoose';

const purchaseSchema = mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        productName:{
            type: String,
        },
        quantity: {
            type: Number
        },
        amount: {
            type: Number
        }
    }],
    subtotal: {
        type: Number,
        default: 0
    },
    pending: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }   
});

export default mongoose.model('Purchase', purchaseSchema);