import {Context} from "@nuxt/types";

export default async function (ctx: Context) {
	const {store} = ctx
	//await store.dispatch('fetchSession')
	const user = store.state.user
	if (user === null) {
		const query : any = {}
		query.redirect = ctx.route.fullPath
		ctx.redirect({name: 'login', query: query})
	}
}
