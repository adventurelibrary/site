<script lang="ts">
import Vue from "vue";
import { Component, State } from "nuxt-property-decorator";
import { AssetTag, Asset } from "~/modules/assets/asset-types";
import { Category } from "~/modules/categories/categories-types";

@Component({
  components: {},
})
export default class SearchUpdateMixin extends Vue {
  @State("tagToSearch") tag: AssetTag;
  @State("categoryToSearch") category: Category;

  async addTagToSearch(tag: AssetTag) {
    console.log("SearchUpdateMixin addTagToSearch:", JSON.stringify(tag));
    //this.$emit('tag')
    try {
      console.log("dispatch attempt inside");
      this.$root.$emit("addSearchTag", { tag: this.tag })
      console.log("dispatch attempt inside 2");
    } catch (ex) {
      console.log("Adding tag to search failed.", ex);
      return;
    }
  }
}

/*

	async clickUnlockAsset () {
		let result
		try {
			result = await this.$store.dispatch('unlockAsset', {
				asset: this.asset
			})
		} catch (ex) {
			this.notifyError(ex.toString())
			return
		}
		if (result === 'unlocked') {
			this.notifySuccess(`Unlocked ${this.asset.name}`)
			this.asset.unlocked = true
		}
	}

*/
</script>