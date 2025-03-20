import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async(req, res)=>{

  //1.get user detail from user
  //2.validation of correct data- not empty
  //3.check if user already exist : username & email
  //4.check for images
  //5.check for avatar
  //6.upload them to cloudinary --- you get an url , avatar
  //7.create an user object - create entry in db
  //8.remove password and refresh token feild from  reponse
  //9.check for user cretion 
  //10.return response


  //1.get user details from frontend

  const {fullName , email , username , password} = req.body
  // console.log("email : " , email);
  // console.log("password " , password );

  if(fullName === ""){
    throw new ApiError(400,"fullname is required")

  }

  if(
    [fullName , email , username , password].some((field) =>{
      field?.trim() === ""
    })
  ){
    throw new ApiError(400 , "All fields are required")
  }

 const existedUser = User.findOne({
  $or:[{username} , {email}]
 })

 if(existedUser){
  throw new ApiError(409,"User with email or username already exist")
 }

 const avatarLocalPath = req.files?.avatar[0]?.path;
 const coverImageLocalPath = req.files?.coverImage[0]?.path;

 if(!avatarLocalPath){
  throw new ApiError(409,"Avatar file is required")
 }

 const avatar = await uploadOnCloudinary(avatarLocalPath)
 const coverImage = await uploadOnCloudinary(coverImageLocalPath)

 if(!avatar){
  throw ApiError(400 , "Avatar file is required") 
}

  const user = await User.create({
  fullName,
  avatar: avatar.url,
  coverImage: coverImage?.url || "",
  email,
  password,
  username: username.toLowerCase()
})

 const createdUser = await User.findById(user._id)
 .select(
  "-password -refreshToken" //jo jo nhi lena - not selected field... 
)

if(!createdUser){
  throw new ApiError(500 , "something went wrong")
}

return res.status(201).json(
  new ApiResponse(200 , createdUser , "User Registered Succesfully")
)

})

export{
  registerUser,
};


// const registerUser = asyncHandler(async(req,res)=>{
//   return res.status(200).json({
//     message: "ok"
//   })
// }
// )
// export  {
//   registerUser,
// };
























// const registerUser = async function (req, res) {
//   try {
//     return res.status(200).json({
//       message: "ok",
//     });
//   } catch (error) {
//     console.log("something went wrong! " + error);
//   }
// };

// export { registerUser };
