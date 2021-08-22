<template>
	<span class="dollars">{{display}}</span>
</template>
<script lang="ts">

import {Prop, Component, Vue} from "nuxt-property-decorator";

@Component
export default class CentsAsDollars extends Vue {
	@Prop() cents : number

	get display () : string {
		const dollars = (this.cents / 100).toFixed(2)
		return '$' + dollars + ' USD'
	}
}
</script>
