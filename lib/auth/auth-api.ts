import {User} from "~/lib/users/user-types";
import {getCookie, setCookie} from "~/lib/helpers";
import jwtdecode from 'jwt-decode'
import {Auth} from 'aws-amplify'
import {CognitoUser} from "amazon-cognito-identity-js";

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
	return getSession(jwt)
}

export async function getSession (jwt: string) : Promise<User | null> {
	return new Promise((res) => {
		if (jwt == '') {
			res(null)
			return
		}
		setTimeout(() => {
			const decode : any = jwtdecode(jwt)
			const user : User = {
				id: decode.sub,
				username: decode.username,
				email: decode.username + '_fake@gmail.com',
				admin: false
			}
			res(user)
		}, 250)
	})
}

// Login as a user and get the user's jwt
export async function signIn (identifier: string, password: string) {
	try {
		await Auth.signIn(identifier, password)
	} catch (ex) {
		throw new Error(convertErr(ex))
	}
	const sess = await Auth.currentSession()
	setCookie('jwt', sess.getAccessToken().getJwtToken(), 31)
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
	} catch (ex) {
		throw new Error(convertErr(ex))
	}
	setCookie('jwt', '')
}

export async function changePassword (username: string, oldPassword: string, newPassword: string) {
	try {
		const user = Auth.currentAuthenticatedUser()
		return Auth.changePassword(user, oldPassword, newPassword)
	} catch (ex) {
		throw new Error(convertErr(ex))
	}
}

export async function forgotPassword (username: string) {
	try {
		return Auth.forgotPassword(username)
	} catch (ex) {
		throw new Error(convertErr(ex))
	}
}

export async function forgotPasswordSubmit (username: string, code: string, newPassword: string) {
	try {
		return Auth.forgotPasswordSubmit(username, code, newPassword)
	} catch (ex) {
		throw new Error(convertErr(ex))
	}
}