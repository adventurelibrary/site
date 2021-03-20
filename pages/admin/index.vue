<template>
	<div>
		Admin dashboard
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component} from "nuxt-property-decorator";

@Component
export default class AdminIndex extends Vue {
	layout () : string {
		return 'admin'
	}
}
</script>
