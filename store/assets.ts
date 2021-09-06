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
	},
	clearAssets (state: State) {
		state.assets = []
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
	selectAssetIds ({commit}: ActionParams, assetIds: string[]) {
		commit('setSelectAssetsByIds', {
			assetIds,
			selected: true
		})
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
		console.log('all selectable assets', state.assets)
		console.log('selected ones', getters.selectedAssets)
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
	setAssets({commit}: ActionParams, assets: Asset[]) {
		const copy = [...assets]
		assets.forEach((asset) => {
			copy.push({
				...asset,
				id: asset.id + '1',
				name: asset.name + ' (Clone)'
			})
		})
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
	numSelectedAssets (state: State) : number {
		return state.assets.filter(x => x.selected).length
	},
	selectedAssets (state: State) : Asset[] {
		return state.assets.filter(x => x.selected)
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
