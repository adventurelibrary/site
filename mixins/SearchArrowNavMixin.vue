<script lang="ts">
import {Component, Prop, Watch} from "nuxt-property-decorator";
import Vue from "vue"
import {AssetSearchFilter} from "~/modules/assets/search-filters";

@Component
export default class SearchArrowNavMixin extends Vue{
	activeItem : number = -1
	items : any[] = []

	@Prop() bus : Vue
	@Prop() active : boolean
	@Prop() query : string
	@Prop() filters : AssetSearchFilter[]

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	selectItem (idx: number) {
		throw new Error('This method needs to be extended by the child class')
	}

	setActiveItem (idx: number) {
		this.activeItem = idx
		this.bus.$emit('setActiveItem', idx)
	}

	clearItem () {
		this.setActiveItem(-1)
	}

	onTab (e: any) {
		if (!this.active) {
			return
		}
		if (this.activeItem <= -1) {
			return
		}
		if (e) {
			e.preventDefault()
			this.selectItem(this.activeItem)
		}
	}

	onNext () {
		if (!this.active) {
			return
		}
		let newIdx = this.activeItem + 1
		if (newIdx > this.items.length - 1) {
			newIdx = 0
		}
		this.setActiveItem(newIdx)
	}


	onPrev () {
		if (!this.active) {
			return
		}
		let newIdx = this.activeItem - 1
		if (newIdx < 0) {
			newIdx = this.shownItems.length - 1
		}
		this.setActiveItem(newIdx)
	}

	created () {
		this.bus.$on('clearSelection', () => {
			this.clearItem()
		})
		this.bus.$on('tab', this.onTab)
		this.bus.$on('next', this.onNext)
		this.bus.$on('prev', this.onPrev)
		this.bus.$on('enter', () => {
			if (!this.active) {
				return
			}
			if (this.activeItem == -1) {
				this.bus.$emit('submit')
			} else {
				this.selectItem(this.activeItem)
			}
		})
	}

	// This can be overriden by child components that do filtering
	// So the items[] might be all of the tags, but shown items are just
	// the ones that fit, and maybe only a subset of those
	get shownItems () : any[] {
		return this.items
	}
}
</script>
