import {Creator} from "../creators/creator-types";

export type User = {
	id: string
	is_admin: boolean
	is_creator: boolean
	email: string
	username: string
	join_date: Date
	num_coins: number
	creators?: Creator[]
}
