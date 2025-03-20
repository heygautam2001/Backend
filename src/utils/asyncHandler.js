
const asyncHandler = (requestHandler) => {
 return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      return next(err);
    });
  };
};

export { asyncHandler };

// const asyncHandler = () => {};
// const asyncHandler = (func) => {() => {} };
// const asyncHandler = (fn) => async () => {};
   
// const asyncHandler = (fn) => async (req, req, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
