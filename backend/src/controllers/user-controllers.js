import { UserServices } from "../services/user-services.js";
import catchAsync from "../shared/catch-async.js";
import sendResponse from "../shared/send-response.js";


const createUser= catchAsync(async(req,res)=>{
    const result= await UserServices.createUser(req.body);
    sendResponse(res,{
        statusCode: 201,
        success: true,
        message: "User created successfully",
        data: result,
    })
});

export const UserController ={
    createUser,
}