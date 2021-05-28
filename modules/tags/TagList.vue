<template>
	<span class="tag-list">
		<span class="tag" v-for="tag in tagObjs" :key="tag.key">{{tag.label}}</span>
	</span>
</template>
<script lang="ts">
import {Component, Vue, Prop} from "nuxt-property-decorator";
import {AssetTag} from "~/lib/assets/asset-types";
import {getTagById} from "~/lib/tags/tags-api";

@Component
export default class TagList extends Vue {
	@Prop() tags : string[]

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
