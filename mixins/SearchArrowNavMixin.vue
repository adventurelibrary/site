<script lang="ts">
import {Component, Prop} from "nuxt-property-decorator";
import Vue from "vue"
import {AssetSearchFilter} from "adventurelibrary/dist/assets/search-filters";

@Component
export default class SearchArrowNavMixin extends Vue {
	activeItem : number = -1

	@Prop() bus : Vue
	@Prop() active : boolean
	@Prop() query : string
	@Prop() filters : AssetSearchFilter

	created () {
		this.bus.$on('next', () => {
			if (!this.active) {
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
