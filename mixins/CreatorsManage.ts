import {Component, Vue} from "nuxt-property-decorator";
import {Context} from "@nuxt/types";

@Component
export default class CreatorsManage extends Vue {
	creatorId: string

	async asyncData (ctx: Context) {
		return {
			creatorId: ctx.route.params.id
		}
	}
}
