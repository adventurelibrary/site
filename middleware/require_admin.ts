import {Context} from "@nuxt/types";

export default async function (ctx: Context) {
	const {store} = ctx
	const user = store.state.user

	if (user === null || !user.is_admin) {
		const query : any = {}
		query.redirect = ctx.route.fullPath
		ctx.redirect({name: 'login', query: query})
	}
}
