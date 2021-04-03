<template>
	<div>
		<textarea :style="{width: '100%', height: '50em'}" :value="assetsJSON"></textarea>
	</div>
</template>
<script lang="ts">
import {ASSET_TAGS} from "~/lib/tags/tags-consts";
import AdminPage from "~/admin/admin-page";
import {Component} from "nuxt-property-decorator";
import {CATEGORIES} from "~/lib/categories/categories-consts";

const prefixes = ['Sunny', 'Wartorn', 'Frozen', 'Ashen', 'Windy', 'Holy', 'Knightly']
const nouns = ['Town', 'Castle', 'Fort', 'Forest', 'Camp', 'Glade', 'Oasis', 'Fortress', 'Temple', 'Cathedral']
const suffix = ['of Doom', 'of the Queen', 'of the King', 'of Fire', 'of Ice', 'of Orcs']
const visis = ['PENDING', 'HIDDEN', 'PUBLIC', 'PUBLIC', 'PUBLIC', 'PUBLIC']
const words = `But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?`.split(' ')
const files = `0psfjzfws6wbqzp5FYa6Iy7dMKbjEfan.webp
3WMIiVCBsCFK6TDrC7WIT4MgAcPsXY90.webp
5GxQc1YLFlv1ThBQ5gUzcBtSlFtktsiv.webp
6L13wQqQbRfkVHkbPirNKQP0rQWTafRq.jpg
77x1d0EC1AslpTBBO52S6T4vnGMHVM5C.webp
D5QaZcbDesDYdpWG2IA9BJikSMxAok3c.webp
DfI1c2CjEe3kCN5dVHKd0obouHqvhCwn.webp
FILCEmPky8w3JOpH9kT9vPMulzAmaX3h.webp
FksGGD5NZRHwPLURVf4M3OOVt8yjmhqa.webp
KjQB1Q8IWmpKvoGe9XXhtF8Ks9uagzqO.webp
T2S8ERMu1GmB7X2YJEezWHyNH2HNv8hD.webp
YmfITEKD70noeoLjZcfm51O881w10Jjk.webp
Z1lu0OXnDNtHgaEEEi64LpwqRvTPLQfA.webp
eCQm39BljHjyoga4rvYgMRwEj0HwceQ9.webp
fWPd13YkAAEJaxsFDptS7ZZcfmppOreN.webp
jSirOTAfzmD9s51bMv7svFlLGX5kp16U.jpg
lPfZQeZwzyUhGKQkiZL7RVaF4p6YAfjJ.webp
rJsMIN5v9WrbxvvNkJ9r31aUQEIpHNbL.webp
rwUA9j7Aq0Xq9sv9bDPKrYnHdvLsM4jr.webp
zMcs2QXskdFyvO4ExP9JK3BvZv3nrs0F.jpg`.split('\n')

function random (items : any[]) : any {
	return items[Math.floor(Math.random() * items.length)];
}

function getRandomInt(min : number, max : number) : number {
	return min + Math.floor(Math.random() * (max - min + 1));
}

let assets : any[] = []
const assetsHash : Record<any, any> = {}
const slugs : string[] = []

files.forEach((file : string) => {
	const [id, extension] = file.split('.')
	const name = [random(prefixes), random(nouns), random(suffix)].join(' ')
	let slug = ''

	do {
		let inc = getRandomInt(100, 9999)
		slug = name.split(' ').join('-').toLowerCase() + '-' + inc.toString()
	} while (slugs.includes(slug))
	slugs.push(slug)

	let description = ''

	let numWords = getRandomInt(20, 30)
	for (let i = 0; i < numWords; i++) {
		description += random(words) + ' '
	}

	const numTags = getRandomInt(1, 5)
	const tags : string [] = []

	for (let i = 1; i <= numTags; i++) {
		const tag = random(ASSET_TAGS).id
		if (!tags.includes(tag)) {
			tags.push(tag)
		}
	}

	const now = new Date().getTime()
	const uploadedMS = now - getRandomInt(60 * 60 * 1000, 60 * 60 * 1000 * 24 * 7)
	const uploaded = new Date(uploadedMS)

	assets.push({
		id: id,
		category: random(CATEGORIES).id,
		collectionID: "003",
		creatorID: "admin-test",
		description: description,
		fileType: "IMAGE",
		name: name,
		originalFileExt: extension,
		revenueShare: {},
		sizeInBytes: getRandomInt(5718197, 6118197),
		slug: slug,
		tags: tags,
		unlockCount: getRandomInt(0, 1000),
		unlockPrice: 0,
		uploaded: uploaded.toISOString(),
		visibility: random(visis),
	})

	assets.forEach((a) => {
		assetsHash[a.id] = a
	})
})

@Component
export default class GenerateAssets extends AdminPage {
	assets = assets
	assetsJSON = JSON.stringify(assets, null, 2)
}

</script>
