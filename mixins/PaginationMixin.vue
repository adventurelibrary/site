<script lang="ts">
import Pagination from "~/components/Pagination.vue";
import {Component} from "nuxt-property-decorator";
import Vue from "vue"
@Component({
	components: {
		Pagination
	}
})
export default class PaginationMixin extends Vue {
	get activePage () : number {
		let page = this.$route.query.page ? parseInt(this.$route.query.page.toString()) : 1
		if (isNaN(page) || !page) {
			return 1
		}

		return page
	}

}
</script>
