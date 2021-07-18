<script lang="ts">
import Pagination from "~/components/Pagination.vue";
import {Component, Watch} from "nuxt-property-decorator";
import Vue from "vue"
import {Route} from "vue-router";

// Returns the current page name, taken from the `?page=32` query param
// If none is set, it assumes you're on page `
export function getRouteQueryPage(route : Route) : number {
  let page = route.query.page ? parseInt(route.query.page.toString()) : 1
  if (isNaN(page) || !page) {
    return 1
  }

  return page
}

// This mixin is for route pages that have pagination
// Those pages can define their own pageChanged function
// to override the one defined below. It will be called when
// a link with a new page is clicked
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
  watchActivePage (newVal : Route, oldVal : Route) {
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
