
const errorMiddleware = (err,req,res,next)=>{

    try{

        let error = {...err};

        error.message = err.message;

        //Mongoose bad object ID error
        if(err.name === 'CastError'){

            const message = 'Resource Not Found';
            error = new Error(message);
            error.statusCode = 404
        }

        //Mongoose duplicate key error
        if(err.statusCode === 11000){

            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        //Mongoose validation error
        if(err.name === 'ValidationError'){

            const message = Object.values(err.errors).map(val=> val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400; 
        }

        res.status(error.statusCode || 500).json({
            sucess:'false',
            error:error.message || 'Server not found'
        });
        
    }
    catch(error){
       next(error);
    }
}

export default errorMiddleware;