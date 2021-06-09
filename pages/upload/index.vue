<template>
	<div>
		<h1>Upload</h1>
		<p>Choose which Creator to upload as</p>
		<ul>
			<li v-for="creator in creators" :key="creator.id">
				<nuxt-link :to="{name: 'upload-as-id', params: {id: creator.id}}">{{creator.name}}</nuxt-link>
			</li>
		</ul>
	</div>
</template>
<script lang="ts">

import {Component, Vue} from "nuxt-property-decorator";
import {Context} from "@nuxt/types";
import {computeAjaxList, doAjax, newAjax} from "~/lib/ajax";
import {Creator, CreatorsResponse} from "~/modules/creators/creator-types";
import {getMyCreators} from "~/modules/creators/creator-api";

@Component({
	components: {
	}
})
export default class UploadPage extends Vue {
	creatorSlug : string
	creatorsAjax = newAjax<CreatorsResponse>({
		total: 0,
		creators: []
	})

	async loadCreators () {

	}

	// fetching asset data and related assets array
	async asyncData (ctx: Context) {
		const cajax = newAjax<CreatorsResponse>({
			total: 0,
			creators: []
		})
		await doAjax<CreatorsResponse>(cajax, async () => {
			return await getMyCreators()
		})

		// If they only own one creator then just select that automatically for them
		if (cajax.data && cajax.data.creators && cajax.data.creators.length === 1) {
			//ctx.redirect(`/upload/as/${cajax.data.creators[0].id}`)
			return
		}
		return {
			creatorSlug: ctx.params.slug,
			creatorsAjax: cajax
		}
	}

	get creators() : Creator[] {
		const list = [{ id: "test37", name: "test37" }]; //computeAjaxList(this.creatorsAjax, 'creators')
		return list
	}
}
</script>
