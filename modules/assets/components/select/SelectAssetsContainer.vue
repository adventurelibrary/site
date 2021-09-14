<template>
	<div class="select-assets-container">
		<div class="select-assets-actions body-width">
			<button @click="clickToggleAll">{{toggleAllLabel}}</button>
			<button @click="clickAddToBundle" :disabled="numSelected === 0">Add to Bundle</button>
			<slot name="actions"></slot>
			{{numSelected}} Selected
		</div>
		<slot></slot>
	</div>
</template>
<script lang="ts">
import {Component, Getter, State, Watch} from "nuxt-property-decorator";
import Vue from "vue";
import DragSelect from "dragselect";
import {Asset} from "~/modules/assets/asset-types";

@Component
export default class SelectAssetsContainer extends Vue {
	ds : any

	@Getter('assets/numSelectedAssets') numSelected : number
	@State('assets', {
		namespace: 'assets'
	}) assets : Asset[]

	@Watch('assets.length', {
		immediate: true,
	})
	watchAssetsLength () {
		if (!this.assets) {
			return
		}
		if (this.assets.length) {
			// Do next tick so Vue will have the list rendered
			this.$nextTick(() => {
				this.startDragSelectd()
			})
		}
	}

	mounted () {
		setTimeout(() => {
			this.startDragSelectd()
		}, 100)
	}

	startDragSelectd () {
		if (process.server) {
			return
		}
		if (this.ds) {
			this.ds.stop()
		}
		const sels = document.querySelectorAll('[data-selectable-asset-id]')
		const body = document.querySelector('.site-body')
		if (!body) {
			return
		}
		//@ts-ignore
		this.ds = new DragSelect({
			//@ts-ignore
			selectables: sels,
			//@ts-ignore
			area: body,
			customStyles: true
		});
		// This callback is fired by DragSelect
		this.ds.subscribe('callback', (evt:any) => {
			const {items} = evt
			const ids : string[] = []
			items.forEach((item : HTMLElement) => {
				const id = item.dataset.selectableAssetId
				if (id) {
					ids.push(id)
				}
			})

			// Check if all those IDS are selected. They are then we actually
			// DEselect them
			// Otherwise we'll add everything highlighted that is new to the list
			if (this.$store.getters['assets/areAllAssetIdsSelected'](ids, true)) {
				this.$store.dispatch('assets/deselectAssetIds', ids)
				return
			}

			this.$store.dispatch('assets/selectOnlyAssetIds', ids)
		})
	}

	destroyed (){
		if (this.ds) {
			this.ds.stop()
		}
	}

	clickToggleAll () {
		this.$store.dispatch('assets/toggleAll')
	}

	clickAddToBundle () {
		this.$store.dispatch('assets/openAddToBundle')
	}

	get toggleAllLabel () : string {
		if (!this.assets) {
			return ''
		}
		return this.numSelected === this.assets.length ? 'Unselect All' : 'Select All'
	}
}
</script>
