<template>
	<ul class="tag-list">
		<li class="tag" v-for="tag in tagObjs" :key="tag.key">{{tag.label}}</li>
	</ul>
</template>
<script lang="ts">
import {Component, Vue, Prop} from "nuxt-property-decorator";
import {AssetTag} from "~/modules/assets/asset-types";
import {getTagById} from "~/modules/tags/tags-api";

// This component displays a nice readable list of tag names, given a list of tags which might not be as readable
// So something like `["science_fiction", "fantasy"]` would look like "Science Fiction, Fantasy"
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
