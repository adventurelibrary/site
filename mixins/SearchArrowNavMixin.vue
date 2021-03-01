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

	selectItem (idx: number) {
		console.log('idx', idx)
		throw new Error('This method needs to be extended by the child class')
	}

	created () {
		console.log('created for search arrow')
		this.bus.$on('next', () => {
			console.log('next in search arrow')
			if (!this.active) {
				console.log('not active')
				return
			}
			this.activeItem++
			if (this.activeItem > this.items.length - 1) {
				this.activeItem = 0
			}
		})
		this.bus.$on('prev', () => {
			if (!this.active) {
				return
			}
			this.activeItem--
			if (this.activeItem < 0) {
				this.activeItem = this.items.length - 1
			}
		})
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
