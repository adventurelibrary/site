<script lang="ts">
import {Component, Vue} from "nuxt-property-decorator";

/**
 * This mixin is for pages that need to refresh their data
 * when a user logs in or logs out
 * For example on the home page, after logging in, we need
 * to refetch the assets so we can see which ones you have
 * unlocked
 */
@Component
export default class LoggedInFetchMixin extends Vue {
  created () {
    this.$root.$on('loggedOut', this.updateFetch)
    this.$root.$on('loggedIn', this.updateFetch)
  }

  destroyed () {
    this.$root.$off('loggedOut', this.updateFetch)
    this.$root.$off('loggedIn', this.updateFetch)
  }

  async updateFetch () {
    await this.$fetch()
  }
}
</script>
