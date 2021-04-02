<template>
	<div class="tags-input">
		<div class="">
			<input class="form-control"
				v-model="query"
				@keypress.enter="enter"
				@keydown.up="keyUpLeftArrow"
				@keydown.left="keyUpLeftArrow"
				@keydown.right="keyDownRightArrow"
				@keydown.down="keyDownRightArrow"
			/>
		</div>
		<TagSearch
			:bus="bus"
			:filters="[]"
			:exclude="excluded"
			:query="query"
			:active="true"
			@clickTag="tagClicked"
		/>
		<div>
			<span v-for="(tag, idx) in tagsLocal" :key="tag.key">{{tag.label}}&nbsp;<button type="button" @click="() => removeTag(idx)">X</button></span>
		</div>
	</div>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {Component, Model} from "nuxt-property-decorator";
import TagSearch from "~/modules/tags/TagSearch.vue";
import {AssetTag} from "~/lib/assets/asset-types";

@Component({
	components: {
		TagSearch: TagSearch
	}
})
export default class TagsInput extends Vue {
	bus : Vue = new Vue()
	query : string = ''

	@Model('changed',  {
		type: Array as PropType<AssetTag[]>
	})
	readonly tagsLocal! : AssetTag[]

	tagClicked (tag: AssetTag) {
		this.tagsLocal.push(tag)
		this.emitChanged()
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

}
</script>
