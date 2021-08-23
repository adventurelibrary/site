<template>
	<ul class="tag-list">
		<li class="tag" v-for="tag in tagObjs" :key="tag.key">
			<a class="filter-value" v-on:click="addTagToSearch(tag)">
				{{tag.label}}
			</a>
		</li>
	</ul>
</template>
<script lang="ts">
import {Component, Vue, Prop} from "nuxt-property-decorator";
import {AssetTag} from "~/modules/assets/asset-types";
import {getTagById} from "~/modules/tags/tags-api";
import SearchUpdateMixin from "~/mixins/SearchUpdateMixin.vue"

// This component displays a nice readable list of tag names, given a list of tags which might not be as readable
// So something like `["science_fiction", "fantasy"]` would look like "Science Fiction, Fantasy"
@Component ({
	mixins: [SearchUpdateMixin]
})

export default class TagList extends Vue {
	@Prop() tags : string[]
	//@Prop() mixin: SearchUpdateMixin

	mounted (){
		//this.mixin = new SearchUpdateMixin()
	}

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
		console.log('addTagToSearch, AssetTag: '+ JSON.stringify(tag))

		let mixin : SearchUpdateMixin
		mixin = new SearchUpdateMixin()
		mixin.addTagToSearch(tag)

		// <TagSearch> emits .clickTag on mouse click, as child
		// AssetSearch grabs the emitted function into its own .tagClicked, function as parent

		// TagSearch.tagClicked (tag)
		/*
		TagSearch.clickTag(tag: AssetTag) {
			this.$emit('clickTag', tag)
		}
		*/

		// AssetSearch.tagClicked (tag)
		/*
		AssetSearch.tagClicked (tag: AssetTag) {
			const filter = tagToFilter(tag)
			this.toggleFilter(filter)
		}
		*/
	}
}
</script>
