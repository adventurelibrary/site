// Extends Error: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
// Uses http-status-codes npm: https://www.npmjs.com/package/http-status-codes

import { bool } from 'aws-sdk/clients/signer';
import {
	StatusCodes,
} from 'http-status-codes';

import {ErrorCustom} from "lib/errors/ErrorCustom"

export class ErrorForm extends ErrorCustom {

	constructor(name: string, statusCode: StatusCodes, message: string) {
		super(name, statusCode, message);
	}

	// public super function to check email for new account registration
	checkEmailForRegistration(email: string) {
		this.validateEmail(email)
		this.validateEmailAlreadyRegistered(email)
	}

	// validates correctly formed email
	// returns console log if successfull, otherwise also adds ErrForm to stack
	private validateEmail(email: string) {
		// RFC2822 Email Validation: https://regexr.com/2rhq7
		let regExprEmailFormat = "a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"

		if (email.match(regExprEmailFormat)) {
			console.log("validateEmail: Valid email.")
		}
		else {
			console.log("validateEmail: Invalid email.")
			this.addError(ErrInvalidEmail)
		}
	}


	// verifies if email has already been registered in the DB for a user
	// returns console log if successfull, otherwise also adds ErrForm to stack
	private validateEmailAlreadyRegistered(email: string) {
		let registered: bool = false

		// API function missing to check if email already registered
		registered = true

		if (registered) {
			console.log("validateEmailAlreadyRegistered: Email not already registered.")
		}
		else {
			console.log("validateEmailAlreadyRegistered: Email already registered.")
			this.addError(ErrEmailAlreadyRegistered)
		}
	}

	// verifies if email + password combination is valid
	// returns console log if successfull, otherwise also adds ErrForm to stack
	validateWrongEmailPassword(email: string, password: string) {
		let validLogin: bool = false

		// run parts of the login code to check this?

		if (validLogin) {
			console.log("validateWrongEmailPassword: Valid login.")
		}
		else {
			console.log("validateWrongEmailPassword: Invalid login.")
			this.addError(ErrWrongEmailPassword)
		}
	}

}

const ErrInvalidEmail = new ErrorForm("invalid_email", StatusCodes.NOT_ACCEPTABLE, "Invalid email address.")
const ErrEmailAlreadyRegistered = new ErrorForm("email_registered", StatusCodes.FORBIDDEN, "Email already registered.")

const ErrWrongEmailPassword = new ErrorForm("wrong_email_password", StatusCodes.UNAUTHORIZED, "Wrong email / password.")






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
