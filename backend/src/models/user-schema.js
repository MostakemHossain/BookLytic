import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
    },
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    profileImage: {
        type: String,
        default: "",
    },
});

export const User = mongoose.model("User", userSchema);
