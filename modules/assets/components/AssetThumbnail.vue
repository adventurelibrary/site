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
		if (rect.top <= cutoff) {
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

		console.log('Remove this, it is for testing')
		this.src = 'https://advl-thumbs.s3.us-west-000.backblazeb2.com/HEOLDCcFXhY7Ty7gZ7RKwO0EGSjctBNG/q7KHcNoetjwGsFIh9gyTdEabo4itv35B.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=000379815001f7c0000000003%2F20210929%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20210929T032851Z&X-Amz-Expires=3600&X-Amz-Signature=8360a883b84c875571e6a29277b852a8ec40b802372b2b375c07f633c8b8cf4e&X-Amz-SignedHeaders=host'

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
