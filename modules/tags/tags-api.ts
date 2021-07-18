import {AssetTag} from "~/modules/assets/asset-types";
import {ASSET_TAGS} from "~/modules/tags/tags-consts";

export function getTagById(id: string) : AssetTag | undefined {
	return ASSET_TAGS.find(at => at.id === id)
}

export function tagListToMap(tags: AssetTag[]) : Record<string, number> {
	const rec :Record<string, number>= {}
	tags.forEach((tag) => {
		rec[tag.id] = 1
	})
	return rec
}
