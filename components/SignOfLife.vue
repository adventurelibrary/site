<template>
	<figure class="sign-of-life">
		<!--img src="~/assets/AL_icon_only_white-anim.svg"-->
		<inline-svg src="/_nuxt/assets/AL_icon_only_white-anim.svg" />
		<figcaption class="loading-message">
			<slot></slot>
		</figcaption>
	</figure>
</template>

<script lang="ts">
import Vue from "vue"
import {Component} from "nuxt-property-decorator";
import InlineSvg from "vue-inline-svg";

@Component({
	components: {
		InlineSvg
	}
})
export default class SignOfLife extends Vue {

}
</script>
