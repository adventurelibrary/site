import {NewAsset} from "./asset-types";
import {sleep} from "../helpers";

export type UploadStatus = 'waiting' | 'signing' | 'signed' | 'uploading' | 'error' | 'complete'

export type ActiveUpload = {
	title: string,
	status: UploadStatus,
	progress: number,
	error: string,
	signature: string,
	key: any
}

export function convertNewAssetToActiveUploads (newAssets: NewAsset[]) : ActiveUpload[] {
	return newAssets.map((na: NewAsset, idx: number) : ActiveUpload => {
		return {
			title: na.asset.title,
			status: 'waiting',
			progress: 0,
			error: '',
			signature: '',
			key: idx
		}
	})
}
