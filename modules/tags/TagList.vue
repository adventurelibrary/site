<template>
	<span class="tag-list">
		<span class="tag" v-for="tag in tags" :key="tag.key">{{tag.label}}</span>
	</span>
</template>
<script lang="ts">
import {Component, Vue, Prop} from "nuxt-property-decorator";
import {AssetTag} from "~/lib/assets/asset-types";

@Component
export default class TagList extends Vue {
	@Prop() tags : AssetTag[]
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
