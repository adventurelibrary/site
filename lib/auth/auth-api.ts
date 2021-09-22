import {User} from "~/modules/users/user-types";
import {setCookie} from "~/lib/helpers";
import {Auth} from 'aws-amplify'
import {CognitoUser} from "amazon-cognito-identity-js";
import api, {setJWT} from "~/lib/api";
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

export async function getSession () : Promise<User | null> {
	let res
	try {
		await refreshSession()
		await Auth.currentSession()
		res = await api.get('/users')
	} catch (ex) {
		return null
	}

	return res.data
}

// This will call AWS Amplify's refresh code so that the token is refreshed
// This is to prevent the session ending after a short period of time
// This will also update our jwt cookies
export async function refreshSession () {
	const sess = await Auth.currentSession()
	const jwt = sess.getIdToken().getJwtToken()
	setJWT(jwt) // Update it in memory so our Axios interceptors use it
	setCookie('jwt', jwt, 31) // Save it for future sessions
}

// Login as a user and get the user's jwt
export async function signIn (identifier: string, password: string) {
	try {
		await Auth.signIn(identifier, password)
		await refreshSession()
	} catch (ex) {
		throw new Error(convertErr(ex))
	}
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
