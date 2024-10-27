// src/middlewares/errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    });
  };
  
  export default errorMiddleware;
  