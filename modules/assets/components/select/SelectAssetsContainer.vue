<template>
  <div class="select-assets-container">
    <div>
			{{numSelected}} Selected
      <button @click="clickToggleAll">{{toggleAllLabel}}</button>
      <button @click="clickAddToBundle">Add to Bundle</button>
    </div>
    <div>
      <slot></slot>
    </div>
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
			console.log('no assets')
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
		console.log('sels', sels)
		this.ds = new DragSelect({
			selectables: sels,
			area: document.querySelector('.site-body')
		});
		this.ds.subscribe('callback', (evt) => {
			const {items} = evt
			console.log('evt', evt)
			console.log('items', items)
			const ids : string[] = []
			items.forEach((item) => {
				const id = item.dataset.selectableAssetId
				ids.push(id)
				console.log('id', id)
			})

			// Check if all those IDS are selected
			console.log('this.$store.getters', this.$store.getters)
			if (this.$store.getters['assets/areAllAssetIdsSelected'](ids, true)) {
				console.log('yah those are all selected')
				this.$store.dispatch('assets/deselectAssetIds', ids)
				return
			}

			this.$store.dispatch('assets/selectAssetIds', ids)
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
