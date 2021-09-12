<template>
	<figure class="sign-of-life">
		<img src="~/assets/AL_icon_only_white-anim.svg">
		<figcaption>
			<slot></slot>
		</figcaption>
	</figure>
</template>

<script lang="ts">
import Vue from "vue"

export default class SignOfLife extends Vue {

}
</script>
