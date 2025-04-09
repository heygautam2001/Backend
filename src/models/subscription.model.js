import mongoose , {Schema} from "mongoose";
import { type } from "os";

const subscriptionSchema = new Schema({
  subscriber:{
    type: Schema.Types.ObjectId, //One who is subscribing
    ref: "User"

  },

  channel: {
    type: Schema.Types.ObjectId,
    ref : "User" // One to whom 'subscriber ' is subscibing
  }

} ,{timestamps: true})

export const Subscription = mongoose.model("Subscription" , subscriptionSchema);
