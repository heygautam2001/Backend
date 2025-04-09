import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { access } from "fs";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    //Add or save refresh token in database...
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong !! while generating accesss and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  /**  1.get user detail from user
  2.validation of correct data- not empty
  3.check if user already exist : username & email
  4.check for images
  5.check for avatar
  6.upload them to cloudinary --- you get an url , avatar
  7.create an user object - create entry in db
  8.remove password and refresh token feild from  reponse
  9.check for user cretion
  10.return response
*/
  //1.get user details from frontend
  const { fullName, email, username, password } = req.body;
  // console.log("email : " , email);
  // console.log("password " , password );

  if (fullName === "") {
    throw new ApiError(400, "fullname is required");
  }

  if (
    [fullName, email, username, password].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  //check if user is already exist...
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(409, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //jo jo nhi lena - not selected field...
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Succesfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  /* 
  req body - get your data
  username or email
  find the user
  password check
  access and refresh token generation
  send cookie
  send reaponse user loggedIn
*/
  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "username or password required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user not exist !! please register youself ");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out seccessfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

 try {
  const decodedToken = jwt.verify(
     incomingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET
   )
 
   const user = await User.findById(decodedToken?._id)
 
   if(!user)
     {
       throw new ApiError(401 , "invalid refresh token")
     }
 
     if(incomingRefreshToken !== user?.refreshToken)
       {
         throw  new ApiError(410 , "Refresh token is invalid or used")
 
     }
 
     const options = {
       httpOnly : true,
       secure : true
     }
 
   const {accessToken , newrefreshToken} =  await generateAccessAndRefreshTokens(user._id)
 
    return res
    .status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , newrefreshToken , options )
    .json(
     new ApiResponse(
       200 , 
       {accessToken , refreshToken : newrefreshToken},
       "Access token refreshed"
 
     )
    )
 } catch (error) {

  throw new ApiError(401 , error?.message || "Invalid refresh token")
  
 }


});

export { registerUser, loginUser, logoutUser , refreshAccessToken };

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
