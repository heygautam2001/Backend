const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      return next(err);
    });
  };
};
/*
  async handler ek function hai , jo ek function ko as a parameter accept krta hai , aur usi function ko(requestHandler) ek aur function k andar execute krwata hai , aur jis function k andar (requesthandler) execute hua usko return kr deta hai , error handlind k baad..

 */
export { asyncHandler };

// const asyncHandler = () => {};
// const asyncHandler = (func) => {() => {} };

// const asyncHandler = (func) => {return async()=>{
//    try{
// await func(req , res , next)}catch(error){
//     clog(error);
//}
//}}
// const asyncHandler = (fn) => async () => {};

// const asyncHandler = (requestHandler) => async (req, res, next) => {
//   try {
//     await requestHandler(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
