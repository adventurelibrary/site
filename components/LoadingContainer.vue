<template>
	<section role="loading-container" class="loading-container">
		<div v-if="loading">
			<slot name="loading">
				Loading...
			</slot>
		</div>
		<div v-if="error">
			<slot name="error">
				{{error}}
			</slot>
		</div>
		<template v-if="!loading && !error">
			<slot />
		</template>
	</section>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import {Fragment} from "vue-fragment";

@Component
export default class LoadingContainer extends Vue {
	@Prop() loading: boolean
	@Prop() error: string
}
</script>
