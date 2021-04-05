import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import {User} from "~/lib/users/user-types";

const poolData = {
	UserPoolId: <string>process.env.COGNITO_USER_POOL_ID,
	ClientId: <string>process.env.COGNITO_CLIENT_ID,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

export type SignUpFields = {
	email: string
	username: string,
	password: string
	passwordConfirm: string
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
