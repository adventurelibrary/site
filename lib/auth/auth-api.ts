import {User} from "~/modules/users/user-types";
import {getCookie, setCookie} from "~/lib/helpers";
import {Auth} from 'aws-amplify'
import {CognitoUser} from "amazon-cognito-identity-js";
import api, {getJWT, setJWT} from "~/lib/api";
import Cookies from "js-cookie";

const userPoolId = <string>process.env.COGNITO_USER_POOL_ID
const clientId = <string>process.env.COGNITO_CLIENT_ID

if (!userPoolId) {
	throw new Error('COGNITO_USER_POOL_ID missing from .env file')
}

if (!clientId) {
	throw new Error('COGNITO_CLIENT_ID missing from .env file')
}

Auth.configure({
	Auth: {
		userPoolId: userPoolId,
		userPoolWebClientId: clientId,
		//authenticationFlowType: 'USER_PASSWORD_AUTH'
	}
})

export type SignUpFields = {
	email: string
	username: string,
	password: string
	passwordConfirm: string
}

function convertErr(err : any) : string {
	return err.message || err.toString()
}

export async function getSessionFromClient() : Promise<User | null> {
	const jwt = getCookie('jwt')
	if (jwt === null) {
		return null
	}
	return getSession()
}

export async function getSession () : Promise<User | null> {
	let res
	try {
		res = await api.get('/users')
	} catch (ex) {
		return null
	}

	return res.data
}

// Login as a user and get the user's jwt
export async function signIn (identifier: string, password: string) {
	try {
		await Auth.signIn(identifier, password)
	} catch (ex) {
		throw new Error(convertErr(ex))
	}
	const sess = await Auth.currentSession()
	const jwt = sess.getIdToken().getJwtToken()
	setJWT(jwt) // Update it in memory so our Axios interceptors use it
	setCookie('jwt', jwt, 31) // Save it for future sessions
}


export async function signUp (fields : SignUpFields) : Promise<CognitoUser> {
	try {
		const { user } = await Auth.signUp({
			username: fields.username,
			password: fields.password,
			attributes: {
				email: fields.email
			}
		});
		return user
	} catch (error) {
		throw new Error(convertErr(error))
	}
}

/* returns true if the email is already registered in the db for an active user */
export async function checkEmailInUse (email: string) : Promise<boolean> {
	let emailInUse = false

	const url = '/users/emailexists/' + email
	const res = await api.get(url)

	// convert string return to boolean value (res.data returned is string, either 'true' | 'false'
	if (res.data === 'true')
		emailInUse = true
	if (res.data === 'false')
		emailInUse = false

	return emailInUse
}

/* returns true if the username is already registered in the db for an active user */
export async function checkUsernameInUse (username: string) : Promise<boolean> {
	let usernameInUse = false

	const url = '/users/usernameexists/' + username
	const res = await api.get(url)
	usernameInUse = res.data

	// convert string return to boolean value (res.data returned is string, either 'true' | 'false'
	if (res.data === 'true')
		usernameInUse = true
	if (res.data === 'false')
		usernameInUse = false

	return usernameInUse
}


/* returns stringified JSON object, with {emailCount, usernameCount}, of instances of those already registered in the db for an active user */
// expected results between 0 and 1, ex {1,0}
export async function checkRegisterValidate (email: string, username: string) : Promise<string> {
	const url = '/users/registervalidate/' + email + '/' + username
	const res = await api.get(url)
	const resCount = res.data

	return resCount
}

export async function logout () {
	try {
		await Auth.signOut()
		setJWT('')
		Cookies.remove('jwt')
	} catch (ex) {
		throw new Error(convertErr(ex))
	}
}

export async function changePassword (username: string, oldPassword: string, newPassword: string) {
    try {
        const user = await Auth.currentAuthenticatedUser()
        await Auth.changePassword(user, oldPassword, newPassword)
    } catch (ex) {
        throw new Error(convertErr(ex))
    }
}

export async function forgotPassword (username: string) {
	try {
		await Auth.forgotPassword(username)
	} catch (ex) {
		throw new Error(convertErr(ex))
	}
}

export async function forgotPasswordSubmit (username: string, code: string, newPassword: string) {
	try {
		const res = await Auth.forgotPasswordSubmit(username, code, newPassword)
		return res
	} catch (ex) {
		throw new Error(convertErr(ex))
	}
}
