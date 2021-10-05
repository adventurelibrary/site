import {Asset} from "~/modules/assets/asset-types";

type State = {
	assets: Asset[],
	shiftClickAnchorIndex: number // When you shift click something, this is your anchor
	lastShiftClickedIndex: number, // The most asset that had its selection change
}

type ActionParams = {
	state: State
	commit: any
	dispatch: any
	getters: any
}

export const state = () : State => {
	return {
		assets: [],
		shiftClickAnchorIndex: -1,
		lastShiftClickedIndex: -1
	}
}

export const mutations = {
	setAssets (state: State, assets: Asset[]) {
		// TODO: Maybe we need to check for ones that are already in here and are selected?
		state.assets = assets.map((a) => {
			return {
				...a,
				selected: false
			}
		})

		// This is just here for testing and development purposes
		// If you want to display a lot of assets somewhere, you can increase this
		// variable and it'll duplicate them
		// Doing things with the clones will break since their ids and slugs aren't real
		const fakeOnesToAdd = 0
		let toCloneIdx = 0;
		const maxIdx = assets.length - 1
		for (let i = 1; i <= fakeOnesToAdd; i++) {
			const toClone = assets[toCloneIdx]
			state.assets.push({
				...toClone,
				selected: false,
				id: toClone.id + i,
				slug: toClone.slug + i,
				name: toClone.name + ' (Clone #' + i + ')',
			})
			toCloneIdx++
			if (toCloneIdx > maxIdx) {
				toCloneIdx = 0
			}
		}
	},
	clearAssets (state: State) {
		state.assets = []
	},
	removeAssets (state: State, assetIds: string[]) {
		state.assets = state.assets.filter((a) => {
			return !assetIds.includes(a.id)
		})
	},
	clearSelectionMarkers (state: State) {
		state.lastShiftClickedIndex = -1
		state.shiftClickAnchorIndex = -1
	},
	lastShiftClickedIndex (state: State, idx: number) {
		state.lastShiftClickedIndex = idx
	},
	shiftClickAnchorIndex (state: State, idx: number) {
		state.shiftClickAnchorIndex = idx
	},
	toggleAsset (state: State, idx: number) {
		state.assets[idx].selected = !state.assets[idx].selected
	},
	selectAsset (state: State, idx: number) {
		state.assets[idx].selected = true
	},
	selectAssetByIdx (state: State, idx: number) {
		state.assets[idx].selected = true
	},
	setSelectAssetsByIds (state: State, {assetIds, selected} : {assetIds: string[], selected: boolean}) {
		state.assets = state.assets.map((a) => {
			if (assetIds.includes(a.id)) {
				a.selected = selected
			}
			return a
		})
	},
	setSelectedAssetsFromTo (state: State, {from, to, selected} : {from: number, to: number, selected: boolean}) {
		if (from < 0) {
			throw new Error(`from is < 0`)
		}
		if (to < 0) {
			throw new Error(`to is < 0`)
		}
		const min = Math.min(from, to)
		const max = Math.max(from, to)
		for (let i = min; i <= max; i++) {
			state.assets[i].selected = selected
		}
	},
}

export const actions = {
	// Toggle a single asset.
	toggleAsset ({commit, getters} : ActionParams, asset: Asset) {
		const idx = getters.assetIndex(asset)
		commit('toggleAsset', idx)
		commit('shiftClickAnchorIndex', idx)
	},
	async selectOnlyAssetIds ({dispatch} : ActionParams, assetIds: string[]) {
		await dispatch('resetSelects')
		await dispatch('selectAssetIds', assetIds)
	},
	selectAssetIds ({commit, getters}: ActionParams, assetIds: string[]) {
		commit('setSelectAssetsByIds', {
			assetIds,
			selected: true
		})
		// If at least one was selected, we will set the last selected one
		// as the anchor
		// This is so a user can click and drag over three items, then shift
		// click the 10th item and it will select all items from 4 to 9
		if (assetIds.length > 0) {
			const idx = getters.assetIdIndex(assetIds[assetIds.length-1])
			commit('shiftClickAnchorIndex', idx)
		}
	},
	deselectAssetIds ({commit}: ActionParams, assetIds: string[]) {
		commit('setSelectAssetsByIds', {
			assetIds,
			selected: false
		})
	},
	toggleAll ({commit, getters, state} : ActionParams) {
		const allSelected = getters.numSelectedAssets === state.assets.length
		const selected = !allSelected
		commit('setSelectedAssetsFromTo', {
			from: 0,
			to: state.assets.length-1,
			selected: selected
		})
	},
	resetSelects ({commit, state} : ActionParams) {
		commit('shiftClickAnchorIndex', -1)
		commit('lastShiftClickedIndex', -1)
		commit('setSelectedAssetsFromTo', {
			from: 0,
			to: state.assets.length - 1,
			selected: false
		})
	},
	openAddToBundle ({dispatch, getters, state} : ActionParams) {
		dispatch('openAddToBundleModal', {
			assets: getters.selectedAssets
		}, {root: true})
	},
	shiftClick ({commit, dispatch, state, getters} : ActionParams, asset: Asset) {
		// If the first thing you do is shift click something, we just treat that like a normal click
		if (state.shiftClickAnchorIndex === -1) {
			dispatch('toggleAsset', asset)
			return
		}
		const clickedIdx = getters.assetIndex(asset)
		const anchor = state.shiftClickAnchorIndex

		if (anchor === clickedIdx) {
			dispatch('toggleAsset', asset)
			return
		}

		const lastShift = state.lastShiftClickedIndex
		if (clickedIdx < anchor) {
			if (lastShift >= 0 && lastShift > anchor) {
				commit('setSelectedAssetsFromTo', {
					from: lastShift,
					to: anchor+1,
					selected: false
				})
			}
			if (lastShift >= 0 && lastShift < clickedIdx) {
				commit('setSelectedAssetsFromTo', {
					from: lastShift,
					to: clickedIdx,
					selected: false
				})
			}
			commit('setSelectedAssetsFromTo', {
				from: anchor-1,
				to: clickedIdx,
				selected: true
			})
		} else if (clickedIdx > anchor) {
			if (lastShift >= 0 && lastShift < anchor) {
				commit('setSelectedAssetsFromTo', {
					from: lastShift,
					to: anchor-1,
					selected: false
				})
			}
			if (lastShift >= 0 && lastShift > clickedIdx) {
				commit('setSelectedAssetsFromTo', {
					from: lastShift,
					to: clickedIdx,
					selected: false
				})
			}
			commit('setSelectedAssetsFromTo', {
				from: anchor+1,
				to: clickedIdx,
				selected: true
			})
		}
		commit('lastShiftClickedIndex', clickedIdx)
	},
	clearAssets({commit}: ActionParams) {
		commit('clearAssets')
	},
	removeAssets ({commit}: ActionParams, assetIds: string[]) {
		commit('removeAssets', assetIds)
	},
	setAssets({commit}: ActionParams, assets: Asset[]) {
		const copy = [...assets]
/*
		// This is just for testing so that there are more things to select
		assets.forEach((asset) => {
			copy.push({
				...asset,
				id: asset.id + '1',
				slug: asset.slug + '1',
				name: asset.name + ' (Clone)'
			})
		})*/
		commit('setAssets', copy)
		commit('clearSelectionMarkers')
	}
}

export const getters = {
	assetIndex (state: State) {
		return (asset: Asset): number => {
			return state.assets.findIndex(a => a.id === asset.id)
		}
	},
	assetIdIndex (state: State) {
		return (assetId: string): number => {
			return state.assets.findIndex(a => a.id === assetId)
		}
	},
	numSelectedAssets (state: State) : number {
		return state.assets.filter(x => x.selected).length
	},
	selectedAssets (state: State) : Asset[] {
		return state.assets.filter(x => x.selected)
	},
	selectedAssetIds (state: State) : string[] {
		return state.assets.filter(x => x.selected).map(x => x.id)
	},
	areAllAssetIdsSelected (state: State) {
		return (ids: string[], selected: boolean) : boolean => {
			for (let i = 0; i < state.assets.length; i++) {
				const asset = state.assets[i]
				if (ids.includes(asset.id) && asset.selected != selected) {
					return false
				}
			}

			return true
		}
	}
}
