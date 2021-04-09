import Vue from 'vue'
import Vuex from 'vuex'
import {User} from "~/lib/users/user-types";
import {getSessionFromClient, logout} from "~/lib/auth/auth-api";
Vue.use(Vuex)

type State = {
	toasts: Toast[],
	breadcrumbs: any[],
	user: User | null
	login: {
		working: boolean,
		error: string
	}
	modals: {
		login: boolean,
		register: boolean
	}
}

type ToastType = 'success' | 'danger' | 'info'

type ModalKeys = 'login' | 'register'

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

export type LoginParams = {
	username: string,
	password: string
}


let toastCount = 0
function newToastId () : number {
	return new Date().getTime() + ++toastCount
}

export const state = () : State => {
	return {
		breadcrumbs: [],
		toasts: [],
		user: null,
		login: {
			working: false,
			error: ''
		},
		modals: {
			login: false,
			register: false
		}
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
	},
	user (state: State, pl: User | null) {
		state.user = pl
	},
	'login.working' (state: State, working: boolean) {
		state.login.working = working
	},
	'login.error' (state: State, error: string) {
		state.login.error = error
	},
	modal (state: State, update: {
		key: ModalKeys,
		value: boolean
	}) {
		state.modals[update.key] = update.value
	}
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
	async logout ({commit}: ActionParams) {
		await logout()
		commit('user', null)
	},
	login ({commit} : ActionParams, {username, password} : LoginParams) {
		commit('login.working', true)
		setTimeout(() => {
			commit('user', {
				id: new Date().getTime().toString(),
				username: 'Mrs Username',
			})
			commit('login.working', false)
		}, 500)
	},
	openLoginModal ({commit} : ActionParams) {
		commit('modal', {
			key: 'login',
			value: true
		})
	},
	closeLoginModal ({commit} : ActionParams) {
		commit('modal', {
			key: 'login',
			value: false
		})
	},
	openRegisterModal ({commit} : ActionParams) {
		commit('modal', {
			key: 'register',
			value: true
		})
	},
	closeRegisterModal ({commit} : ActionParams) {
		commit('modal', {
			key: 'register',
			value: false
		})
	},
	closeAllModals ({dispatch} : ActionParams) {
		dispatch('closeLoginModal')
		dispatch('closeRegisterModal')
	},
	async fetchSession ({commit} : ActionParams) {
		const user = await getSessionFromClient()
		commit('user', user)
	}
}

export const getters = {
	isLoggedIn (state: State) : boolean {
		return state.user !== null
	},
	// TODO: Add || for more modals
	showingModal (state: State) : boolean {
		return state.modals.login|| state.modals.register
	}
}
