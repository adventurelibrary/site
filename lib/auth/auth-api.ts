import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import {User} from "~/lib/users/user-types";
import {CognitoUser, CognitoUserSession} from "amazon-cognito-identity-js";

const region = <string>process.env.COGNITO_REGION

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

export async function getSession () : Promise<CognitoUser | null> {
	return new Promise((res, rej) => {
		const cognitoUser = userPool.getCurrentUser();
		if (cognitoUser == null) {
			res(null)
			return
		}
		cognitoUser.getSession(function(err: Error | null, session: CognitoUserSession|null) {
			if (err) {
				rej(err.message || JSON.stringify(err))
				return;
			}
			if (session == null) {
				rej('session is null')
				return
			}
			console.log('session validity: ' + session.isValid());

			// NOTE: getSession must be called to authenticate user before calling getUserAttributes
			cognitoUser.getUserAttributes(function(err, attributes) {
				if (err) {
					// Handle error
				} else {
					// Do something with attributes
					console.log('attributes?', attributes)
					res(cognitoUser)
				}
			});
		});

	})
}

// Login as a user and get the user's jwt
export async function signIn (identifier: string, password: string) : Promise<CognitoUser> {
	return new Promise((res, rej) => {
		const authenticationData = {
			Username: identifier,
			Password: password,
		};
		const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
			authenticationData
		);
		const userData = {
			Username: identifier,
			Pool: userPool,
		};
		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function(result) {
				const jwt = result.getAccessToken().getJwtToken();
				window.localStorage.setItem('jwt', jwt)
				res(cognitoUser)
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

		userPool.signUp(fields.username, fields.password, attributeList, [], function (
			err,
			result
		) {
			console.log('err', err)
			console.log('result', result)
			if (err) {
				console.log('reject cause error')
				rej(err.message || err.toString())
				return;
			}
			if (!result?.user) {
				rej('Result had no user')
				return
			}
			res(cognitoUserToUser(result.user))
		});
	})
}

function cognitoUserToUser(cuser : AmazonCognitoIdentity.CognitoUser) : User {
	return {
		id: '???',
		username: cuser.getUsername()
	}
}
