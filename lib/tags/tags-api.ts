import {AssetTag} from "~/lib/assets/asset-types";
import {ASSET_TAGS} from "~/lib/tags/tags-consts";

export function getTagById(id: string) : AssetTag | undefined {
	return ASSET_TAGS.find(at => at.id === id)
}
