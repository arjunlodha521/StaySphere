class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode= statusCode;
        this.massage= message;
    }
}

module.exports= ExpressError;