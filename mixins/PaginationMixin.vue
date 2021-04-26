<script lang="ts">
import Pagination from "~/components/Pagination.vue";
import {Component, Watch} from "nuxt-property-decorator";
import Vue from "vue"
import {Route} from "vue-router";

export function getRouteQueryPage(route : Route) : number {
  let page = route.query.page ? parseInt(route.query.page.toString()) : 1
  if (isNaN(page) || !page) {
    return 1
  }

  return page
}


@Component({
	components: {
		Pagination
	}
})
export default class PaginationMixin extends Vue {
	get activePage () : number {
		const page = getRouteQueryPage(this.$route)

		return page
	}

	@Watch('$route')
  watchActivePage (newVal, oldVal) {
    const after = getRouteQueryPage(newVal)
    const before = getRouteQueryPage(oldVal)
    if (after != before) {
      this.pageChanged()
    }
  }

	// This function should be overridden by the component using this mixin
	async pageChanged () {}
}
</script>
