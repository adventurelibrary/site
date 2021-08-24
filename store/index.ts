import Vue from 'vue'
import Vuex from 'vuex'
import {User} from "~/modules/users/user-types";
import {UserTracking} from "~/modules/users/user-tracking";
import {getSession, logout} from "~/lib/auth/auth-api";
import {Asset} from "~/modules/assets/asset-types";
import {Bundle} from "~/modules/bundles/bundle-types";
import {unlockAsset} from "~/modules/assets/asset-api";
Vue.use(Vuex)

type State = {
	archiveAsset: Asset | null,
	reportAsset: Asset | null,
	editAsset: Asset | null
	addToBundleAsset: Asset | null,
	breadcrumbs: any[],
	createBundleAsset: Asset | null
	editBundle: Bundle | null,
	userCoins: number,
	login: {
		working: boolean,
		error: string
	}
	// Keys here need to be also added to the ModalKeys type
	modals: {
		addToBundle: boolean, // When you click "add to bundle" from a single asset in search
		createBundle: boolean,
		editBundle: boolean,
		bundleAddAssets: boolean,
		login: boolean,
		register: boolean,
		archiveAsset: boolean
		reportAsset: boolean
		editAsset: boolean
	}
	bundleAddAssetsBundle: Bundle | null, // The bundle they were on when they clicked "Add Assets"
	toasts: Toast[],
	user: User | null,
	userTracking: UserTracking
}

type ToastType = 'success' | 'danger' | 'info'

// Each key here needs to be added to the `modals` prop of the state
type ModalKeys = 'login' | 'register' | 'addToBundle' | 'createBundle' | 'editBundle' | 'bundleAddAssets' | 'archiveAsset' | 'reportAsset' | 'editAsset'

export type Toast = {
	id: number
	msg: string
	type: ToastType
}

type ActionParams = {
	state: State
	commit: any
	dispatch: any
	getters: any
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
		archiveAsset: null,
		addToBundleAsset: null,
		breadcrumbs: [],
		bundleAddAssetsBundle: null,
		createBundleAsset: null,
		editBundle: null,
		reportAsset: null,
		editAsset: null,
		toasts: [],
		user: null,
		userCoins: 0,
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
			archiveAsset: false,
			addToBundle: false,
			bundleAddAssets: false,
			createBundle: false,
			editBundle: false,
			login: false,
			register: false,
			reportAsset: false,
			editAsset: false
		},
	}
}

export const mutations = {
	userTracking (state: State, userTracking: UserTracking) {
		state.userTracking = userTracking
	},
	userTrackingPath (state: State, path: string) {
		state.userTracking.activePath = path
	},
	userCoins (state: State, numCoins: number) {
		console.log('numCoins to set to', numCoins)
		state.userCoins = numCoins
	},
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
	},
	archiveAsset (state: State, asset: Asset | null) {
		state.archiveAsset = asset
	},
	reportAsset (state: State, asset: Asset | null) {
		state.reportAsset = asset
	},
	addToBundleAsset (state: State, asset: Asset | null) {
		state.addToBundleAsset = asset
		// update asset visible to hidden
		// v1/assets/{assetID}/update  POST
		// API: lib/assets.ts updateAsset, updates.visibility
		// visibility=HIDDEN
		// v=HIDDEN
		// v1/assets/{assetID}/update?v=HIDDEN    ?

	},
	bundleAddAssetsBundle (state: State, bundle: Bundle | null) {
		state.bundleAddAssetsBundle = bundle
	},
	editBundle (state: State, bundle: Bundle | null) {
		state.editBundle = bundle
	},
	editAsset (state: State, asset: Asset | null) {
		state.editAsset = asset
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
	userTrackingPath ({commit} : ActionParams, path : string) {
		commit('userTrackingPath', path)
	},
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
	openAddToBundleModal ({commit, dispatch, getters} : ActionParams, {asset} : {asset: Asset}) {
		if (!getters.isLoggedIn) {
			dispatch('notifyError', 'You must be logged in')
			return
		}
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
	openEditAssetModal ({commit} : ActionParams, {asset} : {asset: Asset}) {
		commit('modal', {
			key: 'editAsset',
			value: true
		})
		commit('editAsset', asset)
	},
	closeLoginModal ({commit} : ActionParams) {
		commit('modal', {
			key: 'login',
			value: false
		})
	},
	openAssetArchiveModal ({commit} : ActionParams, {asset} : {asset: Asset}) {
		commit('modal', {
			key: 'archiveAsset',
			value: true
		})
		commit('archiveAsset', asset)
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
	openAssetReportModal ({commit} : ActionParams, {asset} : {asset: Asset}) {
		commit('modal', {
			key: 'reportAsset',
			value: true
		})
		commit('reportAsset', asset)
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
	async fetchSession ({commit} : ActionParams) {
		const user = await getSession()
		commit('user', user)
		if (user) {
			commit('user', user)
			commit('userCoins', user.num_coins)
		} else {
			commit('user', null)
			commit('userCoins', 0)
		}
	},
	async unlockAsset ({commit, getters, dispatch} : ActionParams, {asset} : {asset: Asset}) : Promise<'unlocked' | 'login' | 'needscoins'> {
		if (!getters.isLoggedIn) {
			dispatch('openLoginModal')
			return 'login'
		}

		if (getters.getUserCoins < asset.unlock_price && asset.unlock_price != 0) {
			return 'needscoins'
		}
		else {
			const result = await unlockAsset(asset.id)
			commit('userCoins', result.numCoins)
			return 'unlocked'
		}

	}
}

export const getters = {
	isLoggedIn (state: State) : boolean {
		return !!state.user
	},
	isCreator (state: State) : boolean {
		if (!state.user) {
			return false
		}

		return state.user.is_creator
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
	},
	getUserCoins (state: State) : number {
		if (!!state.user == true) {
			return state.userCoins
		}
		else return 0
	}
}
