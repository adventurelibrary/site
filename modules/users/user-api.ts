import {UsersResponse} from "~/modules/users/user-types";
import api from "~/lib/api";

export async function getUsers() : Promise<UsersResponse> {
	const res = await api.get('/users')
	return res.data
}
