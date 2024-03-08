import mongoose from 'mongoose';

const billSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    purchase:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase'
    },
    dateTime: {
        type: Date,
        default: Date.now
    },
    shippingTax: {
        type: Number,
        default: 12.75
    },
    total: {
        type: Number,
        default: 0
    },

});

export default mongoose.model('Bill', billSchema);