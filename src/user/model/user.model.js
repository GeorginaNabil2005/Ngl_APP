import mongoose, { model, Schema } from "mongoose"

const UserSchema = new Schema   ({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20,

    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider === 'local';

        },
    },
    provider: {
        type: String,
        enum: ["local", "facebook", "google"],
        default: "local",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,

    },
    dob: Date,
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male",
    },
},
{
    timestamps:{
        createdAt:true,
        updatedAt:true
    }
}

)
export const User = model('User', UserSchema);