export type User = {
	id: string
	username: string
	is_admin: boolean
	last_seen: Date
}

export type UsersResponse = {
	users: User[]
	total: number
}
