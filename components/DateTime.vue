<template>
	<span class="date-time" :title="iso">{{display}}</span>
</template>
<script lang="ts">
import {Component, Prop, Vue} from "nuxt-property-decorator";

@Component
export default class DateTime extends Vue {
	@Prop() dateTime : Date | string

	get iso () {
		return new Date(this.dateTime).toISOString()
	}

	get display () {
		const dt = new Date(this.dateTime)
		const now = new Date()
		const year = dt.getFullYear() != now.getFullYear() ? 'numeric' : false

		const options : any = {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
			hour: 'numeric',
			minute: '2-digit'
		}

		if (year) {
			options.year = year
		}

		return dt.toLocaleTimeString([], options)
	}
}
</script>
