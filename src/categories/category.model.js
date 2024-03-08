import mongoose from 'mongoose';

const CategorySchema = mongoose.Schema({
    categoryName:{
        type: String,
        required: [true, 'Category is obligatory'],
        unique: true
    },
    description:{
        type: String,
        required: [true, 'Desscripcion is obligatory']
    },
    state:{
        "type": Boolean,
        default: true
    }
});

export default mongoose.model('Category', CategorySchema);