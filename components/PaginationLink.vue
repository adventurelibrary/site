<template>
	<li :class="{active: link.active, disabled: link.disabled}"><NuxtLink :to="link.to">{{link.label}}</NuxtLink></li>
</template>
<script lang="ts">

import Vue from "vue";
import {Component, Prop} from "nuxt-property-decorator";

export type PaginationLinkType = {
	label: string
	active: boolean
	to: object
	disabled: boolean
}

@Component
export default class PaginationLink extends Vue {
	name: 'PaginationLink'

	@Prop() link : any
}
</script>
