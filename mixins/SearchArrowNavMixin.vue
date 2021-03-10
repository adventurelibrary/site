<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue"
import {AssetSearchFilter} from "adventurelibrary/dist/assets/search-filters";

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
		console.log('onPrev')
		if (!this.active) {
			return
		}
		let newIdx = this.activeItem - 1
		if (this.activeItem < 0) {
			newIdx = this.items.length - 1
		}
		this.setActiveItem(newIdx)
	}

	created () {
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
}
</script>
