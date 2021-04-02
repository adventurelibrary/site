<template>
	<div>
		<textarea :style="{width: '100%', height: '50em'}" :value="assetsJSON"></textarea>
	</div>
</template>
<script lang="ts">
import {Asset} from "~/lib/assets/asset-types";
import {ASSET_TAGS} from "~/lib/tags/tags-consts";
import {CREATORS} from "~/lib/creators/creator-consts";
import AdminPage from "~/admin/admin-page";
import {Component} from "nuxt-property-decorator";
import {CATEGORIES} from "~/lib/categories/categories-consts";

const prefixes = ['Sunny', 'Wartorn', 'Frozen', 'Ashen', 'Windy', 'Holy', 'Knightly']
const nouns = ['Town', 'Castle', 'Fort', 'Forest', 'Camp', 'Glade', 'Oasis', 'Fortress', 'Temple', 'Cathedral']
const suffix = ['of Doom', 'of the Queen', 'of the King', 'of Fire', 'of Ice', 'of Orcs']
const thumbnails = [
	'https://i.imgur.com/PT9rhuR.jpg',
	'https://i.imgur.com/QwJOh0m.jpg',
	'https://i.imgur.com/Egt9lhm.jpg',
	'https://i.imgur.com/BiCSIx3.jpg',
	'https://i.imgur.com/HHQ21gl.jpg',
	'https://i.imgur.com/aDNse7v.jpg'
]
const visis = ['PENDING', 'HIDDEN', 'PUBLIC', 'PUBLIC', 'PUBLIC', 'PUBLIC']
const words = `But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?`.split(' ')

function random (items : any[]) : any {
	return items[Math.floor(Math.random() * items.length)];
}

let id = 0
function generateID () {
	return (++id + new Date().getTime()).toString()
}

function getRandomInt(min : number, max : number) : number {
	return min + Math.floor(Math.random() * (max - min + 1));
}

let assets : Asset[] = []
const assetsHash : Record<any, any> = {}

for (let i = 0; i <= 100; i++) {
	const name = [random(prefixes), random(nouns), random(suffix)].join(' ')
	const slug = name.split(' ').join('-').toLowerCase()
	const id = generateID()

	const dupe = assets.findIndex((ass) => {
		return ass.slug === slug
	})

	if (dupe >= 0) {
		continue
	}

	let description = ''

	let numWords = getRandomInt(20, 30)
	for (let i = 0; i < numWords; i++) {
		description += random(words) + ' '
	}

	const creator = random(CREATORS)

	const tagIDs : Record<string, number> = {}

	let numTags = getRandomInt(1, 6)
	for (let i = 1; i <= numTags; i++) {
		const tag = random(ASSET_TAGS)
		tagIDs[tag.id] = getRandomInt(1,5)
	}

	assets.push({
		id: id,
		name: name,
		description: description,
		slug: slug,
		thumbnail: random(thumbnails),
		category: random(CATEGORIES).id,
		creatorName: creator.name,
		creatorID: creator.id,
		tagIDs: tagIDs,
		tags: [],
		visibility: random(visis)
	})

	assets.forEach((a) => {
		assetsHash[a.id] = a
	})
}

@Component
export default class GenerateAssets extends AdminPage {
	assets = assets
	assetsJSON = JSON.stringify(assetsHash, null, 2)
}

</script>
