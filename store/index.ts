import Vue from 'vue'
import Vuex from 'vuex'
import {User} from "~/lib/users/user-types";
import {UserTracking} from "~/lib/users/user-tracking";
import {getSession, logout} from "~/lib/auth/auth-api";
import {Asset} from "~/lib/assets/asset-types";
import {Bundle} from "~/lib/bundles/bundle-types";
Vue.use(Vuex)

type State = {
	addToBundleAsset: Asset | null,
	breadcrumbs: any[],
	createBundleAsset: Asset | null
	editBundle: Bundle | null,
	jwt: string,
	login: {
		working: boolean,
		error: string
	}
	// Keys here need to be also added to the ModalKeys type
	modals: {
		addToBundle: boolean, // When you click "add to bundle" from a single asset in search
		createBundle: boolean
		editBundle: boolean,
		bundleAddAssets: boolean,
		login: boolean,
		register: boolean,
	}
	bundleAddAssetsBundle: Bundle | null, // The bundle they were on when they clicked "Add Assets"
	toasts: Toast[],
	user: User | null,
	userTracking: UserTracking
}

type ToastType = 'success' | 'danger' | 'info'

// Each key here needs to be added to the `modals` prop of the state
type ModalKeys = 'login' | 'register' | 'addToBundle' | 'createBundle' | 'editBundle' | 'bundleAddAssets'

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
		addToBundleAsset: null,
		breadcrumbs: [],
		bundleAddAssetsBundle: null,
		createBundleAsset: null,
		editBundle: null,
		jwt: '',
		toasts: [],
		user: null,
		userTracking: {
			id: "",
			sessionId: "",
			activePath: ""
		},
		login: {
			working: false,
			error: ''
		},
		modals: {
			addToBundle: false,
			bundleAddAssets: false,
			createBundle: false,
			editBundle: false,
			login: false,
			register: false,
		},
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
	jwt (state: State, jwt: string) {
		state.jwt = jwt
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
	},
	addToBundleAsset (state: State, asset: Asset | null) {
		state.addToBundleAsset = asset
	},
	bundleAddAssetsBundle (state: State, bundle: Bundle | null) {
		state.bundleAddAssetsBundle = bundle
	},
	editBundle (state: State, bundle: Bundle | null) {
		state.editBundle = bundle
	},
	createBundleAsset (state: State, asset: Asset | null) {
		state.createBundleAsset = asset
	},
	closeAllModals(state: State) {
		const keys = Object.keys(state.modals)
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i]
			state.modals[<ModalKeys>key] = false
		}
	}
}

export const actions = {
	notify({commit}: ActionParams, {msg, type, duration = 5000} : {msg: string, type: ToastType, duration?: number}) {
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
	openLoginModal ({commit} : ActionParams) {
		commit('modal', {
			key: 'login',
			value: true
		})
	},
	openAddToBundleModal ({commit} : ActionParams, {asset} : {asset: Asset}) {
		commit('modal', {
			key: 'addToBundle',
			value: true
		})
		commit('addToBundleAsset', asset)
	},
	openBundleAddAssetsModal({commit} : ActionParams, {bundle} : {bundle: Bundle}) {
		commit('modal', {
			key: 'bundleAddAssets',
			value: true
		})
		commit('bundleAddAssetsBundle', bundle)
	},
	openEditBundleModal ({commit} : ActionParams, {bundle} : {bundle: Bundle}) {
		commit('modal', {
			key: 'editBundle',
			value: true
		})
		commit('editBundle', bundle)
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
	closeAllModals ({commit} : ActionParams) {
		commit('closeAllModals')
	},
	async openCreateBundleWithAsset ({dispatch, commit} : ActionParams, {asset} : {asset: Asset | null}) {
		await dispatch('closeAllModals')
		commit('modal', {
			key: 'createBundle',
			value: true
		})
		commit('createBundleAsset', asset)
	},
	async fetchSession ({commit, state} : ActionParams) {
		const user = await getSession(state.jwt)
		commit('user', user)
	}
}

export const getters = {
	isLoggedIn (state: State) : boolean {
		return state.user !== null
	},
	showingModal (state: State) : boolean {
		const keys = Object.keys(state.modals)
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i]
			if (state.modals[<ModalKeys>key]) {
				return true
			}
		}
		return false
	}
}
