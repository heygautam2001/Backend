
// require("dotenv").config({path: "./env"});
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express"
import connectDB from "./db/index.js";
dotenv.config({path: "./env"})

const app = express();


connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000 , ()=>{
    console.log(`Server is running at PORT:${process.env.PORT}`);
  })
})
.catch((error)=>{{
  console.log("MongoDB Connection failed: " , error);
}})












// function connectDB(){}
// connectDB();

     //OR

/* Basic Approach 

(async()=>{
    try{

     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

     app.on("error" , (error)=>{
      console.log("Error: " , error);
      throw error

     })

     app.listen(process.env.PORT , ()=>{
      console.log(`App is listening on port ${process.env.PORT}`);
     })

    }catch(error){
      console.log("Error: " , error);
      throw err
    }
})()     //IIFE

*/