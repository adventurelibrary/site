<template>
	<li class="asset-card" :class="{selected: isSelected}">
		<AssetLink @linkClick="clickEventSelectCheck" :asset="asset" class="link">
			<!-- This Element Intentionally Left Empty -->
		</AssetLink>
		<AssetThumbnail :asset="asset" />
		<div class="meta" @click="clickEventSelectCheck">
			<h3 class="title">
				<AssetLink :asset="asset">{{asset.name}}</AssetLink>
			</h3>
			<h4 class="author">
				<Category :category="asset.category" />
				<span class="author-label">by</span>
				<span>
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
      <template v-if="!selectable">
        <button :title="isSelected ? 'Deselect' : 'Select'" class="asset-action action-select" @click="toggleSelected" type="button">
          <i :class="{'ci-checkbox': !isSelected, 'ci-checkbox_checked': isSelected}"></i>
        </button>
      </template>
			<template v-if="!hideDefaultActions">
				<AssetAddToBundle v-if="isLoggedIn" :asset="asset" />
			</template>
			<slot name="extra-actions"></slot>
		</figure>

	</li>
</template>
<script lang="ts">
import {Component, Prop, Getter, Watch} from "nuxt-property-decorator";
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
class AssetCard extends Vue {
	category : CategoryType | null

	@Getter('isLoggedIn') isLoggedIn : boolean
  @Getter('numSelectedAssets', {
  	namespace: 'assets'
	}) numSelectedAssets: number

	@Prop() hideDefaultActions : boolean
	@Prop() asset : Asset
  @Prop() selectable : boolean

	@Watch('asset.type', {
		immediate: true
	})
	typeChanged () {
		this.category = getCategory(this.asset.category)
	}

  toggleSelected (e?: KeyboardEvent) {
		if (e && e.shiftKey) {
			e.preventDefault()
			this.$store.dispatch('assets/shiftClick', this.asset)
			return
		}
    this.$store.dispatch('assets/toggleAsset', this.asset)
  }

	// If you ctrl+click on a link within this card, or on the card itself, we check
	// to see if you are currently selecting assets
	// If you are, then we just select that asset instead of allowing the default click
	// behaviour
  clickEventSelectCheck (e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey) {
      if (this.numSelectedAssets >= 1) {
        e.preventDefault()
        this.toggleSelected()
      }
      return
    }
    if (e && e.shiftKey) {
    	e.preventDefault()
      this.$store.dispatch('assets/shiftClick', this.asset)
    }
  }

	get isSelected () : boolean {
    return !!this.asset.selected
  }
}
export default AssetCard
</script>
