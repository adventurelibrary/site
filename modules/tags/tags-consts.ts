import {AssetTag} from "~/modules/assets/asset-types";
import {SelectOption} from "~/lib/helpers";

export const ASSET_TAGS = [
	{
		"name": "abomination",
		"aliases": [
			"aberration"
		]
	},
	{
		"name": "alien",
		"aliases": []
	},
	{
		"name": "angel",
		"aliases": []
	},
	{
		"name": "anime",
		"aliases": []
	},
	{
		"name": "archery",
		"aliases": []
	},
	{
		"name": "arctic",
		"aliases": []
	},
	{
		"name": "armor",
		"aliases": []
	},
	{
		"name": "artificer",
		"aliases": []
	},
	{
		"name": "assassin",
		"aliases": []
	},
	{
		"name": "axe",
		"aliases": []
	},
	{
		"name": "barbarian",
		"aliases": []
	},
	{
		"name": "bard",
		"aliases": []
	},
	{
		"name": "bat",
		"aliases": []
	},
	{
		"name": "bear",
		"aliases": []
	},
	{
		"name": "beast",
		"aliases": []
	},
	{
		"name": "bird",
		"aliases": []
	},
	{
		"name": "boat",
		"aliases": []
	},
	{
		"name": "bow",
		"aliases": []
	},
	{
		"name": "car",
		"aliases": []
	},
	{
		"name": "cart",
		"aliases": []
	},
	{
		"name": "cat",
		"aliases": []
	},
	{
		"name": "centaur",
		"aliases": []
	},
	{
		"name": "city",
		"aliases": [
			"town"
		]
	},
	{
		"name": "cleric",
		"aliases": []
	},
	{
		"name": "construct",
		"aliases": []
	},
	{
		"name": "cow",
		"aliases": []
	},
	{
		"name": "crossbow",
		"aliases": []
	},
	{
		"name": "cultist",
		"aliases": []
	},
	{
		"name": "cyberpunk",
		"aliases": []
	},
	{
		"name": "dagger",
		"aliases": []
	},
	{
		"name": "day",
		"aliases": []
	},
	{
		"name": "desert",
		"aliases": []
	},
	{
		"name": "dinosaur",
		"aliases": []
	},
	{
		"name": "dog",
		"aliases": []
	},
	{
		"name": "door",
		"aliases": []
	},
	{
		"name": "dragon",
		"aliases": []
	},
	{
		"name": "dragonborn",
		"aliases": []
	},
	{
		"name": "druid",
		"aliases": []
	},
	{
		"name": "dungeon",
		"aliases": []
	},
	{
		"name": "dwarf",
		"aliases": []
	},
	{
		"name": "elemental",
		"aliases": []
	},
	{
		"name": "elf",
		"aliases": []
	},
	{
		"name": "entertainer",
		"aliases": []
	},
	{
		"name": "fall",
		"aliases": [
			"autumn"
		]
	},
	{
		"name": "fantasy",
		"aliases": []
	},
	{
		"name": "farm",
		"aliases": [
			"rural"
		]
	},
	{
		"name": "female",
		"aliases": []
	},
	{
		"name": "fairy",
		"aliases": [
			"fey"
		]
	},
	{
		"name": "devil",
		"aliases": [
			"demon",
			"fiend"
		]
	},
	{
		"name": "combat",
		"aliases": [
			"fight",
			"battle"
		]
	},
	{
		"name": "fighter",
		"aliases": [
			"combatant"
		]
	},
	{
		"name": "fish",
		"aliases": []
	},
	{
		"name": "gargoyle",
		"aliases": []
	},
	{
		"name": "gear",
		"aliases": []
	},
	{
		"name": "ghost",
		"aliases": []
	},
	{
		"name": "ghoul",
		"aliases": []
	},
	{
		"name": "giant",
		"aliases": []
	},
	{
		"name": "gnome",
		"aliases": []
	},
	{
		"name": "goat",
		"aliases": []
	},
	{
		"name": "goblin",
		"aliases": []
	},
	{
		"name": "gothic",
		"aliases": []
	},
	{
		"name": "grassland",
		"aliases": []
	},
	{
		"name": "guard",
		"aliases": []
	},
	{
		"name": "gun",
		"aliases": []
	},
	{
		"name": "witch",
		"aliases": [
			"hag"
		]
	},
	{
		"name": "half-elf",
		"aliases": []
	},
	{
		"name": "half-orc",
		"aliases": []
	},
	{
		"name": "halfling",
		"aliases": []
	},
	{
		"name": "hills",
		"aliases": []
	},
	{
		"name": "historical",
		"aliases": []
	},
	{
		"name": "horror",
		"aliases": []
	},
	{
		"name": "horse",
		"aliases": [
			"pony"
		]
	},
	{
		"name": "human",
		"aliases": []
	},
	{
		"name": "insect/bug",
		"aliases": []
	},
	{
		"name": "interior",
		"aliases": []
	},
	{
		"name": "jungle",
		"aliases": []
	},
	{
		"name": "king",
		"aliases": []
	},
	{
		"name": "queen",
		"aliases": []
	},
	{
		"name": "knight",
		"aliases": []
	},
	{
		"name": "kobold",
		"aliases": []
	},
	{
		"name": "kraken",
		"aliases": []
	},
	{
		"name": "laser",
		"aliases": []
	},
	{
		"name": "lizardfolk",
		"aliases": []
	},
	{
		"name": "mace",
		"aliases": []
	},
	{
		"name": "magic",
		"aliases": []
	},
	{
		"name": "male",
		"aliases": []
	},
	{
		"name": "marsh",
		"aliases": [
			"bog"
		]
	},
	{
		"name": "merchant",
		"aliases": []
	},
	{
		"name": "modern",
		"aliases": []
	},
	{
		"name": "monk",
		"aliases": []
	},
	{
		"name": "monochrome",
		"aliases": []
	},
	{
		"name": "monster",
		"aliases": []
	},
	{
		"name": "monstrosity",
		"aliases": []
	},
	{
		"name": "mountain",
		"aliases": []
	},
	{
		"name": "mummy",
		"aliases": []
	},
	{
		"name": "mythology",
		"aliases": []
	},
	{
		"name": "night",
		"aliases": []
	},
	{
		"name": "noble",
		"aliases": []
	},
	{
		"name": "nonbinary",
		"aliases": []
	},
	{
		"name": "ocean/sea",
		"aliases": []
	},
	{
		"name": "ogre",
		"aliases": []
	},
	{
		"name": "ooze",
		"aliases": [
			"slime"
		]
	},
	{
		"name": "orc",
		"aliases": []
	},
	{
		"name": "paladin",
		"aliases": []
	},
	{
		"name": "panel",
		"aliases": []
	},
	{
		"name": "pastoral",
		"aliases": []
	},
	{
		"name": "peasant",
		"aliases": []
	},
	{
		"name": "pirate",
		"aliases": []
	},
	{
		"name": "plant creature",
		"aliases": []
	},
	{
		"name": "ranger",
		"aliases": []
	},
	{
		"name": "rat",
		"aliases": []
	},
	{
		"name": "ring",
		"aliases": []
	},
	{
		"name": "road",
		"aliases": [
			"street"
		]
	},
	{
		"name": "rogue",
		"aliases": []
	},
	{
		"name": "ruin",
		"aliases": []
	},
	{
		"name": "sailor",
		"aliases": []
	},
	{
		"name": "Science Fiction",
		"aliases": [
			"sci-fi",
			"scifi",
			"sci fi",
		]
	},
	{
		"name": "scout",
		"aliases": []
	},
	{
		"name": "sheep",
		"aliases": []
	},
	{
		"name": "shield",
		"aliases": []
	},
	{
		"name": "ship",
		"aliases": []
	},
	{
		"name": "coastal",
		"aliases": [
			"shore"
		]
	},
	{
		"name": "skeleton",
		"aliases": []
	},
	{
		"name": "snake",
		"aliases": []
	},
	{
		"name": "sorcerer",
		"aliases": []
	},
	{
		"name": "spaceship",
		"aliases": []
	},
	{
		"name": "spear",
		"aliases": []
	},
	{
		"name": "spell",
		"aliases": []
	},
	{
		"name": "spider",
		"aliases": []
	},
	{
		"name": "spring",
		"aliases": []
	},
	{
		"name": "staff",
		"aliases": []
	},
	{
		"name": "steampunk",
		"aliases": []
	},
	{
		"name": "subterranean",
		"aliases": [
			"underdark"
		]
	},
	{
		"name": "summer",
		"aliases": []
	},
	{
		"name": "swamp",
		"aliases": []
	},
	{
		"name": "sword",
		"aliases": []
	},
	{
		"name": "cat folk",
		"aliases": [
			"tabaxi"
		]
	},
	{
		"name": "talisman",
		"aliases": [
			"amulet"
		]
	},
	{
		"name": "tech",
		"aliases": []
	},
	{
		"name": "temple",
		"aliases": []
	},
	{
		"name": "thug",
		"aliases": []
	},
	{
		"name": "tiefling",
		"aliases": []
	},
	{
		"name": "train",
		"aliases": []
	},
	{
		"name": "troll",
		"aliases": []
	},
	{
		"name": "undead",
		"aliases": []
	},
	{
		"name": "unicorn",
		"aliases": []
	},
	{
		"name": "city",
		"aliases": [
			"urban"
		]
	},
	{
		"name": "urban fantasy",
		"aliases": []
	},
	{
		"name": "urchin",
		"aliases": []
	},
	{
		"name": "vampire",
		"aliases": []
	},
	{
		"name": "wand",
		"aliases": []
	},
	{
		"name": "warlock",
		"aliases": []
	},
	{
		"name": "wilderness nature",
		"aliases": []
	},
	{
		"name": "winter",
		"aliases": []
	},
	{
		"name": "witch",
		"aliases": []
	},
	{
		"name": "wizard",
		"aliases": []
	},
	{
		"name": "wolf",
		"aliases": []
	},
	{
		"name": "world",
		"aliases": []
	},
	{
		"name": "worm",
		"aliases": []
	},
	{
		"name": "ww2",
		"aliases": [
			"World War 2"
		]
	},
	{
		"name": "young",
		"aliases": []
	},
	{
		"name": "snake folk",
		"aliases": [
			"Yuan-Ti"
		]
	},
	{
		"name": "zombie",
		"aliases": []
	}
].map((tag) => {
	return {
		label: tag.name,
		id: tag.name,
		aliases: tag.aliases || []
	}
})

// Options are used to build the <option> tags in a <select>
export const TagOptions : SelectOption[] = ASSET_TAGS.map((type)  => {
	return {
		value: type.id,
		label: type.label
	}
})
