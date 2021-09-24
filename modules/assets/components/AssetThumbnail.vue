<template>
	<div class="asset-thumbnail thumbnail" :style="`background-image: url(${src}); opacity: ${opacity}`">
		<!-- This Element Intentionally Left Empty -->
	</div>
</template>
<script lang="ts">

import {Component, Prop, Vue} from "nuxt-property-decorator";
import {Asset} from "~/modules/assets/asset-types";

@Component
export default class AssetThumbnail extends Vue {
	loaded = false
	loading = false
	src = ''
	@Prop() asset : Asset

	mounted () {
		if (process.client) {
			window.addEventListener('scroll', this.onScroll)
			this.onScroll()
		} else {
			this.src = this.asset.thumbnail
			this.loaded = true
		}
	}

	destroyed () {
		window.removeEventListener('scroll', this.onScroll)
	}

	// When the user scrolls, or when
	onScroll () {
		const rect = this.$el.getBoundingClientRect()
		const cutoff = document.documentElement.clientHeight + 100
		console.log('cutoff', cutoff)
		console.log('rect', rect)
		if (rect.top <= cutoff) {
			console.log('cutoff yes', this.asset.name)
			this.loadImage()
			window.removeEventListener('scroll', this.onScroll)
		}
	}

	loadImage () {
		// This is to prevent one scroll creating a bunch of images
		if (this.loading) {
			return
		}
		this.loading = true
		this.src = this.asset.thumbnail
		let img = document.createElement('img')
		img.onload = () => {
			this.loaded = true
			img = null
		}
		img.setAttribute('src', this.src)
	}

	get opacity () {
		return this.loaded ? 1 : 0
	}
}
</script>
