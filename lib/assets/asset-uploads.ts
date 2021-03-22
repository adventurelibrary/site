import {AssetFormData, NewAsset} from "./asset-types";

export type UploadStatus = 'waiting' | 'signing' | 'signed' | 'uploading' | 'error' | 'complete'

export type ActiveUpload = {
	title: string,
	status: UploadStatus,
	progress: number,
	error: string,
	signature: string,
	key: any,
	file: File,
	params: any,
	asset: AssetFormData
}

export function convertNewAssetToActiveUploads (newAssets: NewAsset[]) : ActiveUpload[] {
	return newAssets.map((na: NewAsset, idx: number) : ActiveUpload => {
		return {
			title: na.asset.name,
			status: 'waiting',
			progress: 0,
			error: '',
			signature: '',
			key: idx,
			asset: na.asset,
			file: na.file,
			params: {}
		}
	})
}
