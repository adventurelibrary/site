<template>
	<fragment>
		<input type="text" class="filter" v-model="filterText" placeholder="Filter bundles" />
		<div v-if="!$fetchState.pending">
			<div class="bundle-sel-wrapper">
        <ul class="bundle-selector" v-if="bundles.length">
          <li v-for="bundle in bundles"
              :key="bundle.id"
              @click="() => toggleBundle(bundle)"
              :class="{active: bundle.active}"
              class="bundle">
            <div class="circle"></div>
            <h4 class="title">{{bundle.name}}</h4>
            <nuxt-link :to="{name: 'bundle-id', params: {id: bundle.id}}" class="link">Go to Bundle</nuxt-link>
            <p class="description">{{bundle.description || "Filler text"}}</p>
            <img v-if="bundle.cover_thumbnail" style="object-fit: contain;" :src="bundle.cover_thumbnail" />
          </li>
        </ul>
				<div v-else>No bundles found.</div>
      </div>
		</div>
		<div v-else>
			<SignOfLife>
			</SignOfLife>
		</div>
	</fragment>
</template>
<script lang="ts">
import Vue, {PropType} from "vue"
import {Component, Model} from "nuxt-property-decorator";
import {Bundle, BundlesResponse} from "~/modules/bundles/bundle-types";
import {getMyBundles} from "~/modules/bundles/bundles-api";
import LoadingContainer from "~/components/LoadingContainer.vue";
import {Fragment} from "vue-fragment";
import SignOfLife from "~/components/SignOfLife.vue";

type BundleItem = Bundle & {
	active: boolean
}

// This component creates a searchable list containing the currently logged in user's bundles
// They can then select one, none, or many of those bundles
// The parent component can use the v-model directive to get the IDs of the bundles they have selected
// as an array of strings
@Component({
	components: {
		LoadingContainer,
		Fragment,
		SignOfLife: SignOfLife
	}
})
export default class MyBundleSelector extends Vue {
	filterText : string = ''
	bundlesResponse : BundlesResponse = {
    total: 0,
    bundles: []
  }

	@Model('changed',  {
		type: Array as PropType<string[]>
	})
	readonly selectedIds! : string[]

	async fetch () {
		this.bundlesResponse = await getMyBundles()
		this.$emit('loaded', this.bundlesResponse)
	}

	toggleBundle (bundle: Bundle) {
		const index = this.selectedIds.indexOf(bundle.id)
		if (index == -1) {
			this.selectedIds.push(bundle.id)
		} else {
			this.selectedIds.splice(index, 1)
		}
		this.emitChanged()
	}

	emitChanged () {
		this.$emit('changed', this.selectedIds)
	}

	get bundles () : BundleItem[] {
		const list = [...this.bundlesResponse.bundles]
		const filter = this.filterText.trim().toLowerCase()
		const filtered = list.filter((bundle: Bundle) => {
			return bundle.name.toLowerCase().indexOf(filter) >= 0
		})
		const mapped = filtered.map((bundle : Bundle) : BundleItem => {
			const active = this.selectedIds.indexOf(bundle.id) >= 0
			return Object.assign({
				active: active,
			}, bundle)
		})

		return mapped
	}
}
</script>
