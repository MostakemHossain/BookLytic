import AppError from "../error/AppError.js";
import cloudinary from "../lib/cloudinary.js";
import { Book } from "../models/book-schema.js";
import httpStatus from 'http-status';


const createBook= async (payload,userId)=>{
    
    // upload image to cloudinary server
    const {secure_url: imageUrl}= await cloudinary.uploader.upload(payload.image);

    // create new book 
    const book= await Book.create({...payload,image: imageUrl,user: userId});

    return book;  

};

const getBook =async(req)=>{
    const page= req.query.page || 1;
    const limit= parseInt(req.query.limit) || 5;
    const skip= (page-1)*limit;
    const books= await Book.find({}).sort({
        createdAt: -1,
    }).skip(skip).limit(limit).populate('user','username profileImage');

    const total=  await Book.countDocuments()

    return {
        books,
        totalBooks:total,
        currentPage: page,
        totalPages: Math.ceil(total/limit),
    };
    
}

const deleteBook=async(req)=>{
    const {id}= req.params;
    const isBookExists= await Book.findById(id);
    if(!isBookExists){
        throw new AppError(httpStatus.NOT_FOUND,'Book not found');
    }
    // check if the book own user
    if(isBookExists.user.toString()!== req.user.id){
        throw new AppError(httpStatus.FORBIDDEN,'You are not authorized to delete this book');
    }
    
    await cloudinary.uploader.destroy(isBookExists.image);
  

    const result= await Book.findByIdAndDelete(id);
    return result;
}

export const BookServices={
    createBook,
    getBook,
    deleteBook,
}