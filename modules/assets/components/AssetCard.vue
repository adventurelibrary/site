<template>
	<li :data-selectable-asset-id="asset.id" class="asset-card" :class="{'selected': isSelected}">
		<div class="select-backdrop" style="position: absolute; z-index: -1; width: 100%; height: 100%;"></div>
		<AssetLink @mousedown="stopPropagation" @click="clickToggleSelected" :asset="asset" class="link">
			<!-- This Element Intentionally Left Empty -->
		</AssetLink>
		<AssetThumbnail :asset="asset" />
		<div class="meta">
			<h3 class="title">
				<AssetLink :asset="asset">{{asset.name}}</AssetLink>
			</h3>
			<h4 class="author">
				<Category :category="asset.category" />
				<span class="author-label">by</span>
				<span class="author-name">
					<!-- Should be a profile link -->
					{{asset.creator_name}}
				</span>
			</h4>
			<figure class="pricing">
				<h4 class="coin-price">
					<AssetDownload :asset="asset" />
				</h4>
			</figure>
			<div class="description">
				{{asset.description}}
			</div>
			<slot name="extra-details"></slot>
			<div class="search-meta">
				<TagList :tags="asset.tags" />
			</div>
		</div>
		<figure class="asset-actions">
			<button @mousedown="stopPropagation" @click="clickToggleSelected" :title="isSelected ? 'Deselect' : 'Select'" class="asset-action action-select" type="button">
				<i :class="{'ci-checkbox': !isSelected, 'ci-checkbox_checked': isSelected}"></i>
			</button>
			<template v-if="!hideDefaultActions">
				<AssetAddToBundle v-if="isLoggedIn" :asset="asset" />
			</template>
			<slot name="extra-actions"></slot>
		</figure>

	</li>
</template>
<script lang="ts">
import {Component, Prop, Getter, Watch, mixins} from "nuxt-property-decorator";
import Vue from "vue";
import {Asset} from "~/modules/assets/asset-types";
import AssetLink from "~/modules/assets/components/AssetLink.vue";
import {getCategory} from "~/modules/categories/categories-api";
import Category from "~/modules/categories/components/Category.vue";
import TagList from "~/modules/tags/TagList.vue";
import {Category as CategoryType} from "~/modules/categories/categories-types"
import AssetDownload from "~/modules/assets/components/AssetDownload.vue";
import AssetAddToBundleButton from "~/modules/assets/components/AssetAddToBundleButton.vue";
import AssetThumbnail from "~/modules/assets/components/AssetThumbnail.vue";
import StopPropagation from "~/mixins/StopPropagation.vue";

@Component({
	components: {
		AssetLink: AssetLink,
		Category: Category,
		TagList: TagList,
		AssetDownload: AssetDownload,
		AssetAddToBundle: AssetAddToBundleButton,
		AssetThumbnail: AssetThumbnail
	}
})
class AssetCard extends mixins(StopPropagation) {
	category : CategoryType | null

	@Getter('isLoggedIn') isLoggedIn : boolean
	@Getter('numSelectedAssets', {
		namespace: 'assets'
	}) numSelectedAssets: number

	@Prop() hideDefaultActions : boolean
	@Prop() asset : Asset

	@Watch('asset.type', {
		immediate: true
	})
	typeChanged () {
		this.category = getCategory(this.asset.category)
	}

	clickToggleSelected (e?: KeyboardEvent) {
		if (e && e.shiftKey) {
			e.preventDefault()
			this.$store.dispatch('assets/shiftClick', this.asset)
			return
		}
		this.toggleSelected()
		return
	}

	toggleSelected () {
		this.$store.dispatch('assets/toggleAsset', this.asset)
  }

	get isSelected () : boolean {
		return !!this.asset.selected
	}
}
export default AssetCard
</script>
