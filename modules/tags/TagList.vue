<template>
	<div class="search-filters">
		<a class="filter-value"><span class="search-filter tag-item" v-on:click="addTagToSearch(tag)" v-for="tag in tagObjs" :key="tag.key">{{tag.label}}</span></a>
	</div>
</template>
<script lang="ts">
import {Component, Vue, Prop} from "nuxt-property-decorator";
import {AssetTag} from "~/modules/assets/asset-types";
import {getTagById} from "~/modules/tags/tags-api";
import {AssetSearch} from "~/modules/assets/components/search/AssetSearch.vue";

// This component displays a nice readable list of tag names, given a list of tags which might not be as readable
// So something like `["science_fiction", "fantasy"]` would look like "Science Fiction, Fantasy"
@Component
export default class TagList extends Vue {
	@Prop() tags : string[]
	@Prop() assetSearch : AssetSearch

	get tagObjs () : AssetTag[] {
		const atags : AssetTag[] = []
		if (!this.tags) {
			return []
		}
		this.tags.forEach((id: string) => {
			const tag = getTagById(id)	
			if (tag) {
				atags.push(tag)
			}
		})
		return atags
	}

	addTagToSearch(tag: AssetTag) {	
		alert('Implement, add tag to search bar on top on click. Tag passed: '+ tag.label)	
		// this.assetSearch.tagClicked (tag)				
	}
}
</script>
<style>
.tag-list .tag:before {
	content: ", "
}
.tag-list .tag:nth-child(1):before {
	content: ""
}
</style>
