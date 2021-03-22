<template>
	<li class="" :class="classes">
		<span class="filter-type">{{filter.type}}</span>
		<span class="filter-value">{{filter.label}}</span>
		<a class="filter-delete" @click="remove"></a>
	</li>
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
		const classes = ["search-filter", this.badgeColor]
		if (this.active) {
			classes.push("active")
		}
		return classes
	}

	remove () {
		this.$emit("remove")
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
