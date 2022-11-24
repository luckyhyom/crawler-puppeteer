import { NextFunction, Request, Response } from "express";

export default (request: Request, response: Response, next: NextFunction) => {
    try {
        console.log('?!!');
        const oldJSON = response.json;
        console.log('aaaaaa');
        console.log(response);

        response.json = (data) => {
            console.log(data);

            // For Async call, handle the promise and then set the data to `oldJson`
            if (data && data.then != undefined) {
                console.log('cucu@@');
                // Resetting json to original to avoid cyclic call.
                return data.then((responseData: any) => {
                    // Custom logic/code. -----> Write your logic to add success wrapper around the response
                    response.json = oldJSON;
                    return oldJSON.call(response, responseData);
                }).catch((error: Error) => {
                    next(error);
                });
            } else {
                // For non-async interceptor functions
                // Resetting json to original to avoid cyclic call.
                // Custom logic/code.
                console.log('cucu');

                response.json = oldJSON;
                return oldJSON.call(response, data);
            }
        }
        console.log('vvvvvvvvv');
    } catch (error) {
        console.log(error);
        next(error);
    }
}