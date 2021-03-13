<template>
	<div class="" :class="classes" style="padding: 10px 8px;">
		{{filter.label}}
		<a class="p-0" style="color: black; margin-left: 3px;" @click="remove">
			x
		</a>
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import {AssetSearchFilter} from "~/lib/assets/search-filters";

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
		this.$emit('remove')
	}
}
</script>
<style>
a {
	cursor: pointer;
}

.badge {
	border: 2px solid transparent
}

.badge.active {
	border-color: red;
}
</style>
