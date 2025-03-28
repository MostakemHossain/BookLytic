import cloudinary from "../lib/cloudinary.js";
import { Book } from "../models/book-schema.js";


const createBook= async (payload,userId)=>{
    
    // upload image to cloudinary server
    const {secure_url: imageUrl}= await cloudinary.uploader.upload(payload.image);

    // create new book 
    const book= await Book.create({...payload,image: imageUrl,user: userId});

    return book;  

};

export const BookServices={
    createBook,
}