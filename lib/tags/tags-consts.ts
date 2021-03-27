import {AssetTag} from "~/lib/assets/asset-types";
import {SelectOption} from "~/lib/helpers";

export const ASSET_TAGS : AssetTag[] = `Winter,Summer,Fall,Spring,Fantasy,Orc,Archer,Priest,Barbarian,Town,Village,Castle`
.split(',')
.sort()
.map((label: string) => {
	return {
		label: label,
		id: (label.toLocaleLowerCase()),
	}
})


export const TagOptions : SelectOption[] = ASSET_TAGS.map((type: AssetTag) : SelectOption => {
	return {
		value: type.id,
		label: type.label
	}
})
