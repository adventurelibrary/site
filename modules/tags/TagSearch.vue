<template>
	<div class="tag-search">
		<div v-if="shownResults.length == 0">
			Type to search for tags
		</div>
		<div class="items">
			<div v-for="(tag, idx) in shownResults"
				:key="tag.key"
				class="btn"
				:class="{'btn-primary': activeItem === idx}"
				@click="() => clickTag(tag)">
				{{tag.label}}
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import {Component, Watch} from "nuxt-property-decorator";
import Vue from "vue"
import {AssetTag} from "adventurelibrary/dist/assets/asset-types";
import SearchArrowNavMixin from "~/mixins/SearchArrowNavMixin.vue";

const tags : AssetTag[] = `Winter,Summer,Fall,Spring,Fantasy,Orc,Archer,Priest,Barbarian,Town,Village,Castle`
	.split(',')
	.map((label: string) => {
		return {
			label: label,
			key: label.toLocaleLowerCase(),
		}
	})

@Component({
	mixins: [SearchArrowNavMixin]
})
export default class TagSearch extends Vue {
	error : string = '';
	items : AssetTag[] = [];

	@Watch('query')
	queryWatch () {
		if (!this.active) {
			return
		}
		this.searchTags()
	}

	async searchTags () {
		if (this.query == '') {
			this.activeItem = -1
			this.items = []
			return
		}
		this.items = tags.filter((tag: AssetTag) : boolean => {
			return tag.label.toLowerCase().indexOf(this.query.toLowerCase()) >= 0
		})

		this.activeItem = 0
	}

	clickTag(tag: AssetTag) {
		this.$emit('clickTag', tag)
	}

	selectItem (idx: number) {
		this.clickTag(this.items[idx])
	}

	get shownResults () : AssetTag[] {
		const filtered = this.items.filter((tag: AssetTag) => {
			for(let i = 0;i < this.filters.length; i++) {
				const f = this.filters[i]
				if (f.type === 'tag' && f.value === tag.key) {
					return false
				}
			}
			return true
		})
		return filtered
	}
}
</script>
