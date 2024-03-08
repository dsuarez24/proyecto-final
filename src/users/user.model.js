import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "The name is required"]
    },
    address: {
        type: String,
        required: [true, "User address is required"]
    },
    phone: {
        type: String,
        required: [true, "Password is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN", "CLIENT"],
    },
    state: {
        type: Boolean,
        default: true,
    },
    shopping: {
        type: Boolean,
        default: false,
    }, 
    google: {
        type: Boolean,
        default: true,
    },
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

export default mongoose.model('User', UserSchema);