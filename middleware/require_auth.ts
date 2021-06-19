import {Context} from "@nuxt/types";

// This middleware will redirect you to the login page if you aren't logged in
// the `redirect` query param is passed along so that the login page can redirect
// the user back to the page they initially landed one once they have successfully
// logged in
export default async function (ctx: Context) {
	const {store} = ctx
	//await store.dispatch('fetchSession')
	const user = store.state.user
	if (!user) {
		const query : any = {}
		query.redirect = ctx.route.fullPath
		ctx.redirect({name: 'login', query: query})
	}
}
