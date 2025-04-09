//require("dotenv").config({path: "./env"});
import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({ path: "./env" });
import app from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running at PORT:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    {
      console.log("MongoDB Connection failed !! : ", error);
    }
  });










/* Basic Approach 
import express from "express";
import DB_NAME from "./constants.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();

dotenv.config({path: "./env"});

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
})()
    
//IIFE

*/