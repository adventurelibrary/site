<template>
	<div class="" :class="classes" style="padding: 4px 8px;">
		{{filter.label}}
		<a class="p-0" style="color: black; margin-left: 3px;" @click="remove">
			x
		</a>
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import {AssetSearchFilter} from "adventurelibrary/dist/assets/search-filters";

@Component
export default class SearchFilter extends Vue {
	@Prop() filter : AssetSearchFilter
	@Prop() active : boolean

	get badgeColor() : string {
		if (this.filter.type === 'tag') {
			return 'badge-success'
		}
		return 'badge-primary'
	}

	get classes () {
		const classes = ['search-filter badge mr-1', this.badgeColor]
		if (this.active) {
			classes.push('active')
		}
		return classes
	}

	remove () {
		console.log('remove it')
		this.$emit('remove')
	}
}
</script>
<style>
a {
	cursor: pointer;
}

.badge.active {
	border: 1px solid red;
}
</style>
