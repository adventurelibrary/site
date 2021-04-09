import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import {User} from "~/lib/users/user-types";
import {CognitoUser} from "amazon-cognito-identity-js";
import {getCookie, setCookie} from "~/lib/helpers";

const userPoolId = <string>process.env.COGNITO_USER_POOL_ID
const clientId = <string>process.env.COGNITO_CLIENT_ID

if (userPoolId === '') {
	throw new Error('COGNITO_USER_POOL_ID missing from .env file')
}

if (clientId === '') {
	throw new Error('COGNITO_CLIENT_ID missing from .env file')
}

const poolData = {
	UserPoolId: userPoolId,
	ClientId: clientId,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export type SignUpFields = {
	email: string
	username: string,
	password: string
	passwordConfirm: string
}

function getCognitoUser(username: string) : CognitoUser {
	const userData = {
		Username: username,
		Pool: userPool,
	};
	return new AmazonCognitoIdentity.CognitoUser(userData);
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
			const user : User = {
				id: '84935058243',
				username: 'GuitarSun',
				email: 'user@guitars.com',
				admin: false
			}
			res(user)
		}, 250)
	})
}

// Login as a user and get the user's jwt
export async function signIn (identifier: string, password: string) {
	return new Promise((res, rej) => {
		const authenticationData = {
			Username: identifier,
			Password: password,
		};
		const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
			authenticationData
		);
		const cognitoUser = getCognitoUser(identifier)
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function(result) {
				const jwt = result.getAccessToken().getJwtToken();
				setCookie('jwt', jwt, 31)
				res(null)
				return
			},

			onFailure: function(err) {
				rej(err.message || JSON.stringify(err));
			},
		});
	})
}

export async function signUp (fields : SignUpFields) : Promise<User> {
	return new Promise((res, rej) => {
		const attributeList = [];

		const dataEmail = {
			Name: 'email',
			Value: fields.email,
		};

		const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
		attributeList.push(attributeEmail);

		userPool.signUp(fields.username, fields.password, attributeList, [], async function (
			err,
			result
		) {
			if (err) {
				rej(err.message || err.toString())
				return;
			}
			if (!result?.user) {
				rej('Result had no user')
				return
			}

			await signIn(fields.username, fields.password)

			const user = await getSessionFromClient()
			if (user === null) {
				rej('User from session is blank')
				return
			}
			res(user)
		});
	})
}

export async function logout () {
	setCookie('jwt', '')
}
