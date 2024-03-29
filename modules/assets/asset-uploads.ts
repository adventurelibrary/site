import {AssetFormData, NewAsset} from "./asset-types";

export type UploadStatus = 'waiting' | 'signing' | 'signed' | 'uploading' | 'error' | 'complete'

export type ActiveUpload = {
	creator_id: string,
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

// The NewAsset is created when a user drags a new file onto the upload page
// It contains info about the asset (name, description, tags, etc) and a File
// This function converts all those new assets into ActiveUploads
// This is done when the user clicks the big "BEGIN UPLOAD" button after selecting
// one or more files and entering in the asset's information
export function convertNewAssetToActiveUploads (newAssets: NewAsset[], creatorId: string) : ActiveUpload[] {
	return newAssets.map((na: NewAsset, idx: number) : ActiveUpload => {
		const au = {
			creator_id: creatorId,
			title: na.asset.name,
			status: <UploadStatus>'waiting',
			progress: 0,
			error: '',
			signature: '',
			key: idx,
			asset: {
				...na.asset,
			},
			file: na.file,
			params: {}
		}
		return au
	})
}
