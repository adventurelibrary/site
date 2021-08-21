<template>
	<li class="search-filter" :class="classes">
		<span class="filter-type">{{filter.type}}</span>
		<span class="filter-value">{{filter.label}}</span>
		<a class="filter-delete" @click="remove"></a>
	</li>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import {AssetSearchFilter} from "~/modules/assets/search-filters";

@Component
export default class SearchFilter extends Vue {
	@Prop() filter : AssetSearchFilter
	@Prop() active : boolean

	get classes () {
		const classes = ["search-filter", this.filter.type]
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

