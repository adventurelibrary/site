// Extends Error: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
// Uses http-status-codes npm: https://www.npmjs.com/package/http-status-codes

import {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} from 'http-status-codes';


export class ErrorForm extends Error {

    #statusCode: StatusCodes

    constructor(name: string, statusCode: StatusCodes, message: string) {        
        super();
        super.name = name        
        this.#statusCode = statusCode
        super.message = message
    }

    getStatusCode () {
        return this.#statusCode

    }

    toString() {
        return "Error: " + this.name + " | Code: " + this.#statusCode.toString + " |  Message: " + this.message;        
    }

    toStringUser() {
        return "Error Message: " + this.message + " | Code: " + this.#statusCode.toString;    
    }


    toStringExtended() {
        return "Error: " + this.name + " | Code: " + this.#statusCode.toString + " - " + getReasonPhrase(this.#statusCode).toString + " |  Message: " + this.message;        
    }

}

const ErrWrongEmailPassword = new ErrorForm("wrong_email_password", StatusCodes.UNAUTHORIZED, "Wrong email / password.")
const ErrEmailAlreadyRegistered = new ErrorForm("email_registered", StatusCodes.FORBIDDEN, "Email already registered.")





//// HTTP ERROR LIST
// Status codes: https://httpstatuses.com/
// Apached 2 status code list: https://ci.apache.org/projects/httpd/trunk/doxygen/group__HTTP__Status.html
// npm status codes: https://www.npmjs.com/package/http-status-codes


/*
    //1×× Informational
    100 Continue
    101 Switching Protocols
    102 Processing

    //2×× Success
    200 OK
    201 Created
    202 Accepted
    203 Non-authoritative Information
    204 No Content
    205 Reset Content
    206 Partial Content
    207 Multi-Status
    208 Already Reported
    226 IM Used

    //3×× Redirection
    300 Multiple Choices
    301 Moved Permanently
    302 Found
    303 See Other
    304 Not Modified
    305 Use Proxy
    307 Temporary Redirect
    308 Permanent Redirect

    //4×× Client Error
    400 Bad Request
    401 Unauthorized
    402 Payment Required
    403 Forbidden
    404 Not Found
    405 Method Not Allowed
    406 Not Acceptable
    407 Proxy Authentication Required
    408 Request Timeout
    409 Conflict
    410 Gone
    411 Length Required
    412 Precondition Failed
    413 Payload Too Large
    414 Request-URI Too Long
    415 Unsupported Media Type
    416 Requested Range Not Satisfiable
    417 Expectation Failed
    418 I'm a teapot
    421 Misdirected Request
    422 Unprocessable Entity
    423 Locked
    424 Failed Dependency
    426 Upgrade Required
    428 Precondition Required
    429 Too Many Requests
    431 Request Header Fields Too Large
    444 Connection Closed Without Response
    451 Unavailable For Legal Reasons
    499 Client Closed Request

    //5×× Server Error
    500 Internal Server Error
    501 Not Implemented
    502 Bad Gateway
    503 Service Unavailable
    504 Gateway Timeout
    505 HTTP Version Not Supported
    506 Variant Also Negotiates
    507 Insufficient Storage
    508 Loop Detected
    510 Not Extended
    511 Network Authentication Required
    599 Network Connect Timeout Error
*/
