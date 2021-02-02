<template>
	<div class="pagination">
		<ol>
			<Link v-for="(link, idx) in links" :key="idx" :link="link"></Link>
		</ol>
	</div>
</template>
<script lang="ts">
import Vue from "vue"
import {Component, Prop} from "nuxt-property-decorator";
import PaginationLink, {PaginationLinkType} from "~/components/PaginationLink.vue";


@Component({
	components: {
		Link: PaginationLink
	},
})
export default class Pagination extends Vue {
	@Prop()
	totalItems : Number
	@Prop()
	itemsPerPage : Number
	@Prop()
	activePage : Number
	@Prop()
	to : any

	get links () {
		if (!this.to || !this.to.name) {
			return []
		}

		const links : PaginationLinkType[] = []
		const numPages = Math.ceil(this.totalItems / this.itemsPerPage)
		console.log('numPages', numPages)
		console.log('totalItems', this.totalItems)
		console.log('per page', this.itemsPerPage)
		for(let i = 1; i <= numPages; i++) {
			let query = Object.assign({}, this.to.query || {}, {
				page: i
			})

			let label = i.toString()
			let disabled = false

			if (i == this.activePage - 1) {
				label = 'Prev'
			}

			if (this.activePage == 1 && i == 1) {
				disabled = true
			}

			if (i == 1) {
				delete query.page
			}

			links.push({
				disabled: disabled,
				active: this.activePage == i,
				label: label,
				to: Object.assign({}, this.to, {
					query
				})
			})

		}
		return links
	}
}
</script>
