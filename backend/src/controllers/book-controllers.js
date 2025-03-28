import { BookServices } from "../services/book-services.js";
import catchAsync from "../shared/catch-async.js";
import sendResponse from "../shared/send-response.js";

const createBook = catchAsync(async(req,res)=>{
    const result= await BookServices.createBook(req?.body,req?.user?.id);
    sendResponse(res,{
        statusCode: 201,
        success: true,
        message: "Book Created successfully",
        data: result,
    })
});
const getBook = catchAsync(async(req,res)=>{
    const result= await BookServices.getBook(req);
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Book fetched successfully",
        data: result,
    })
});
const deleteBook = catchAsync(async(req,res)=>{
    const result= await BookServices.deleteBook(req);
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Book deleted successfully",
        data: result,
    })
})

export const BookController ={
    createBook,
    getBook,
    deleteBook,
}
