<template>
<table class="data-table">
	<thead>
		<tr>
			<th v-for="head in headers" :key="head">{{head}}</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="(item, itemIdx) in items" :key="itemIdx">
			<template v-for="(colName, index) in rawColumnNames" >
				<template v-if="$scopedSlots[colName]">
					<slot
							:name="colName"
							:item="item"
							:index="itemIdx"
					/>
				</template>
				<td
						v-else
						:key="index"
				>
					{{ String(item[colName]) }}
				</td>
			</template>
		</tr>
	</tbody>
</table>
</template>
<script lang="ts">
import {Component, Prop, Vue} from "nuxt-property-decorator";
import {titleCase} from "~/lib/helpers";

@Component
export default class DataTable extends Vue {
	@Prop() fields : string[]
	@Prop() items : any[]

	get headers () {
		return this.fields.map((field) => {
			return titleCase(field)
		})
	}

	get rawColumnNames () {
		return this.fields
	}
}

</script>
