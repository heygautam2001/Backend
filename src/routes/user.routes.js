import  {Router}  from "express"
import { registerUser} from "../controllers/user.controller.js";

const router = Router();

// router.route("/register").post((req,res)=>{
//   res.status(200).json({
//     message: "ok" 
//   })
// });

 router.route("/register").post(registerUser);


export default router;