import Vue from 'vue'
import Vuex from 'vuex'
import {User} from "~/modules/users/user-types";
import {UserTracking} from "~/modules/users/user-tracking";
import {getSession, logout, signIn, signUp, SignUpFields} from "~/lib/auth/auth-api";
import {Asset} from "~/modules/assets/asset-types";
import {Bundle} from "~/modules/bundles/bundle-types";
import {unlockAsset} from "~/modules/assets/asset-api";
import {ConfirmPaymentIntentResponse, confirmStripeIntent} from "../lib/stripe";

Vue.use(Vuex)

export type PostSignOnAction = {action: string, payload: any} | null

type State = {
	archiveAsset: Asset | null,
	reportAsset: Asset | null,
	editAsset: Asset | null,
	buyUnlockAsset: Asset | null,
	addToBundleAssets: Asset[],
	breadcrumbs: any[],
	createBundleAssets: Asset[]
	editBundle: Bundle | null,
	userCoins: number,
	login: {
		working: boolean,
		error: string
	},

	// This is a Vuex action that we store for when a user tries to do something
	// while they aren't logged in
	// This data can be passed directly to Vuex's dispatch function after the user
	// has finished signin in
	// Sign On = Login or Register
	postSignOnAction: PostSignOnAction
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
		buyCoins: boolean
	}
	bundleAddAssetsBundle: Bundle | null, // The bundle they were on when they clicked "Add Assets"
	toasts: Toast[],
	user: User | null,
	userTracking: UserTracking,
}


type ToastType = 'success' | 'danger' | 'info'

// Each key here needs to be added to the `modals` prop of the state
type ModalKeys = 'login' | 'register' | 'addToBundle' | 'createBundle' | 'editBundle' | 'bundleAddAssets' | 'archiveAsset' | 'reportAsset' | 'editAsset' | 'buyCoins'

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
		addToBundleAssets:[],
		breadcrumbs: [],
		bundleAddAssetsBundle: null,
		buyUnlockAsset: null,
		createBundleAssets: [],
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
		postSignOnAction: null,
		modals: {
			archiveAsset: false,
			addToBundle: false,
			bundleAddAssets: false,
			createBundle: false,
			editBundle: false,
			login: false,
			register: false,
			reportAsset: false,
			editAsset: false,
			buyCoins: false
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
	buyUnlockAsset (state: State, asset: Asset | null) {
		state.buyUnlockAsset = asset
	},
	addToBundleAssets (state: State, assets: Asset[]) {
		state.addToBundleAssets = assets
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
	createBundleAssets (state: State, assets: Asset[]) {
		state.createBundleAssets = assets
	},
	closeAllModals(state: State) {
		const keys = Object.keys(state.modals)
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i]
			state.modals[<ModalKeys>key] = false
		}
	},
	postSignOnAction (state: State, postSignOn: PostSignOnAction) {
		state.postSignOnAction = postSignOn
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
		await logout() // Send logout request to AWS
		commit('user', null)
	},
	async openLoginWithPostAction ({dispatch, commit}, post: PostSignOnAction)  {
		commit('postSignOnAction', post)
		await dispatch('openLoginModal')
	},
	openLoginModal ({commit} : ActionParams) {
		commit('modal', {
			key: 'login',
			value: true
		})
	},
	openAddToBundleModal ({commit, dispatch, getters} : ActionParams, {assets} : {assets: Asset[]}) {
		if (!getters.isLoggedIn) {
			dispatch('notifyError', 'You must be logged in')
			return
		}
		commit('modal', {
			key: 'addToBundle',
			value: true
		})
		commit('addToBundleAssets', assets)
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
	openBuyCoinsModal ({commit} : ActionParams, args? : {asset?: Asset | null}) {
		args = args || {}
		const {asset} = args
		commit('modal', {
			key: 'buyCoins',
			value: true
		})
		commit('buyUnlockAsset', asset)
	},
	closeAllModals ({commit} : ActionParams) {
		commit('closeAllModals')
	},
	async confirmStripePayment ({dispatch, commit} : ActionParams, paymentIntentId: string) : Promise<ConfirmPaymentIntentResponse> {
		const res = await confirmStripeIntent(paymentIntentId)
		commit('userCoins', res.coins)
		return res
	},
	async openCreateBundle ({dispatch, commit}: ActionParams) {
		await dispatch('closeAllModals')
		commit('modal', {
			key: 'createBundle',
			value: true
		})
		commit('createBundleAssets', [])
	},
	async openCreateBundleWithAssets ({dispatch, commit} : ActionParams, {assets} : {assets: Asset[]}) {
		await dispatch('closeAllModals')
		commit('modal', {
			key: 'createBundle',
			value: true
		})
		commit('createBundleAssets', assets)
	},
	async signIn (
		{dispatch, state} : ActionParams,
		{
			identifier,
			password
		} : {
			identifier: string,
			password: string
		}
	) {
		console.log('state', JSON.stringify(state))
		await signIn(identifier.trim(), password)
		await dispatch('fetchSession')
		if (state.postSignOnAction) {
			console.log('dispatch the post sign on', state.postSignOnAction)
			await dispatch(state.postSignOnAction.action, state.postSignOnAction.payload)
		}
	},
	async signUp ({commit}, data : SignUpFields) {
		await signUp(data)
		commit('postSignOnAction', null)
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
	async unlockAsset ({commit, getters, dispatch} : ActionParams, pl : {asset: Asset}) : Promise<'unlocked' | 'needscoins' | 'signon'> {
		const {asset} = pl
		if (!getters.isLoggedIn) {
			dispatch('openLoginWithPostAction', {
				action: 'unlockAsset',
				payload: pl
			})
			return 'signon'
		}

		if (getters.getUserCoins < asset.unlock_price && asset.unlock_price != 0) {
			return 'needscoins'
		}
		else {
			const result = await unlockAsset(asset.id)
			commit('userCoins', result.numCoins)
			commit('assets/unlockAsset', asset.id)
			dispatch('notifySuccess', `Unlocked ${asset.name} for ${asset.unlock_price} coin${asset.unlock_price === 1 ? '' : 's'}`)
			return 'unlocked'
		}
	},
}

export const getters = {
	isLoggedIn (state: State) : boolean {
		const isLoggedIn = !!state.user
		return isLoggedIn
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
	},
}
