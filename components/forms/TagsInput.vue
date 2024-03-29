<template>
	<div class="tags-input" :class="{'show-search': showSearch}">
		<ul class="search-filters">
			<SearchFilter
				v-for="(tag, idx) in tagsLocal" :key="tag.key"
				:filter="{type: 'tag', label: tag.label}"
				@remove="() => removeTag(idx)"
			/>
		</ul>
		<section class="search-box">
			<input class="form-control"
				v-model="query"
				@keypress.enter="enter"
				@keydown.up="keyUpLeftArrow"
				@keydown.left="keyUpLeftArrow"
				@keydown.right="keyDownRightArrow"
				@keydown.down="keyDownRightArrow"
				@focus="showSearch = true"
				@blur="startHideSearch"
			/>
			<TagSearch
				:bus="bus"
				:filters="[]"
				:exclude="excluded"
				:query="query"
				:active="true"
				@clickTag="tagClicked"
			/>
		</section>
	</div>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {Component, Model} from "nuxt-property-decorator";
import TagSearch from "~/modules/tags/TagSearch.vue";
import {AssetTag} from "~/modules/assets/asset-types";
import SearchFilter from "~/modules/assets/components/search/SearchFilter.vue";

@Component({
	components: {
		TagSearch: TagSearch,
		SearchFilter: SearchFilter,
	}
})
export default class TagsInput extends Vue {
	bus : Vue = new Vue()
	query : string = ''
	showSearch  = false
	hideSearchTimeout : any = null

	@Model('changed',  {
		type: Array as PropType<AssetTag[]>
	})
	readonly tagsLocal! : AssetTag[]

	tagClicked (tag: AssetTag) {
		const newList = [...(this.tagsLocal || [])]
		newList.push(tag)
		this.$emit('changed', newList)
		this.query = ''
	}

	get excluded () : string[] {
		if (!this.tagsLocal || !this.tagsLocal.map) {
			return []
		}
		return this.tagsLocal.map((t : AssetTag) => {
			if (!t) {
				throw new Error('Invalid tag in tagsLocal')
			}
			return t.id
		})
	}

	emitChanged () {
		this.$emit('changed', this.tagsLocal)
	}

	removeTag (idx: number) {
		this.$delete(this.tagsLocal, idx)
		this.emitChanged()
	}

	enter (e: any) {
		e.preventDefault()
		this.bus.$emit('enter')
	}

	keyDownRightArrow (e: any) {
		if (this.query.length && e.target.selectionStart < this.query.length) {
			return
		}

		e.preventDefault()
		this.bus.$emit('next')
	}

	keyUpLeftArrow (e: any) {
		if (this.query.length && e.target.selectionStart > 0) {
			return
		}
		e.preventDefault()
		this.bus.$emit('prev')
	}

	startHideSearch () {
		clearTimeout(this.hideSearchTimeout)
		this.hideSearchTimeout = setTimeout(() => {
			this.showSearch = false
		}, 250)
	}

}
</script>
