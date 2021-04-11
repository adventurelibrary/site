import {Context} from "@nuxt/types";

export default async function (ctx: Context) {
	const {store} = ctx
	//await store.dispatch('fetchSession')
	const user = store.state.user
	if (user === null && false) {
		console.log('no user, redirect to login')
		ctx.redirect({name: 'login'})
	}
}
