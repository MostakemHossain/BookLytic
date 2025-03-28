import { Schema, model } from "mongoose";

const bookSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Book title is required"]
        },
        caption: {
            type: String,
            required: [true, "Caption is required"]
        },
        image: {
            type: String,
            required: [true, "Image is required"]
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating must be at most 5"]
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"]
        }
    },
    {
        timestamps: true 
    }
);

export const Book = model("Book", bookSchema);
