"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    console.error('Error occurred:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        body: req.body,
        timestamp: new Date().toISOString()
    });
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error: ' + error.message;
    }
    if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }
    if (error.code === '23505') {
        statusCode = 409;
        message = 'Duplicate entry - this record already exists';
    }
    if (error.code === '23503') {
        statusCode = 400;
        message = 'Referenced record does not exist';
    }
    if (error.code === '23502') {
        statusCode = 400;
        message = 'Required field is missing';
    }
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = 'Internal Server Error';
    }
    res.status(statusCode).json({
        error: true,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
            details: error
        })
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=error-handler.js.map