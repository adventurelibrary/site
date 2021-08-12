// Fields that are both in our forms and in our db
export type CreatorFields = {
	name: string
}

//
export type Creator = CreatorFields & {
	id: string
	slug: string
}

// This type is for data in our forms, that isn't necessarily stored in our DB
// For example a "[ ] Notify creator of updates" checkbox that emails them about changes
export type CreatorFormData = CreatorFields & {

}

export type CreatorsResponse = {
	total: number
	creators: Creator[]
}
