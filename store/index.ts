import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

type State = {
	toasts: Toast[],
	breadcrumbs: any[],
}

type ToastType = 'success' | 'danger' | 'info'

export type Toast = {
	id: number
	msg: string
	type: ToastType
}

type ActionParams = {
	state: State
	commit: any
	dispatch: any
}

export const state = () : State => {
	return {
		breadcrumbs: [],
		toasts: [],
	}
}

export const mutations = {
	breadcrumbs (state: State, crumbs: any[]) {
		crumbs.unshift({
			to: 'Dashboard',
			text: 'Dashboard'
		})

		crumbs = crumbs.map((crumb) => {
			if (typeof crumb == 'string') {
				return {
					to: {
						name: crumb
					},
					text: crumb
				}
			}
			// If you do {to: "Home"} that should be the Home
			if (typeof crumb.to == 'string') {
				crumb.to = {
					name: crumb.to,
				}
			}

			if (!crumb.text) {
				crumb.text = crumb.to.name
			}

			return crumb
		})

/*		crumbs = crumbs.map((route) => {
			const resolved = router.resolve(route.to)
			route.to = resolved.href
			return route
		})*/

		state.breadcrumbs = crumbs
	},
	clearBreadcrumbs (state: State) {
		state.breadcrumbs = []
	},
	addToast (state: State, toast: Toast) {
		state.toasts.push(toast)
	},
	removeToast (state: State, id: number) {
		state.toasts = state.toasts.filter((t => {
			return t.id != id
		}))
	}
}

let toastCount = 0
function newToastId () : number {
	return new Date().getTime() + ++toastCount
}

export const actions = {
	notify({commit}: ActionParams, {msg, type, duration = 2500} : {msg: string, type: ToastType, duration?: number}) {
		const id = newToastId()
		commit('addToast', {
			msg,
			id: id,
			type: type
		})
		setTimeout(() => {
			commit('removeToast', id)
		}, duration)
	},
	notifySuccess ({dispatch}: ActionParams, msg: string) {
		dispatch('notify', {
			msg: msg,
			type: 'success'
		})
	},
	notifyError ({dispatch} : ActionParams, msg: string) {
		dispatch('notify', {
			msg: msg,
			type: 'danger'
		})
	},
	closeModal ({commit}: ActionParams) {
		commit('closeModal')
	},
}
