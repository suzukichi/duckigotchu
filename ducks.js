/**
 * Duckigotchu was built by Suzukichi for Sol. Any unauthorized use is strictly prohibited.
 */
export const duckOpts = [
	{
		// Shroom
		key: 1,
		combo: ['frog', 'candy', 'boba', 'cookie', 'boba', 'candy', 'boba', 'cookie', 'boba', 'candy', 'boba'].reverse()
	},
	{
		// Scissors
		key: 2,
		combo: ['money', 'cookie', 'cookie', 'candy', 'candy', 'boba', 'cookie', 'cookie', 'candy', 'candy', 'boba'].reverse()
	},
	{
		// Poop
		key: 3,
		combo: ['boba','boba','boba','boba','boba','boba','tears','boba','boba','boba','boba','boba'].reverse()
	}
];

export const duckInfo = [
	[
		{
			name: "Baby Knife",
			level: 0,
			power: 'Soft Stab',
			description: "It is just a baby. It was born yesterday. The attack is so soft it feels like a warm blanket ♡",
			icon: 0,
			spritesheet: 'duck0'
		},
		{
			name: "Cleaver Knife",
			level: 1,
			description: "The knife gets fatter & more stress in life. But the attack is a friendly stab because of its kind heart.",
			power: 'Friendly Stab',
			icon: 1,
			spritesheet: 'duck0-1',
			levelUpFrames: {start: 0, end: 1}
		},
		{
			name: "Hand Saw",
			level: 2,
			description: "It takes care of its looks like a teen in love. It has a spiky bottom as a fashion statement.",
			power: 'Ticklish Stab',
			icon: 2,
			spritesheet: 'duck0-2',
			levelUpFrames: {start: 2, end: 3}
		},
		{
			name: "Machete",
			level: 3,
			description: "Losing weight due to a broken heart gave it more strength. The stab is kinda OK, but the heart...",
			power: 'Kinda OK Stab',
			icon: 3,
			spritesheet: 'duck0-3',
			levelUpFrames: {start: 4, end: 5}
		},
		{
			name: "Sword",
			level: 4,
			description: "Looong looong stab~ There’s not much known about this mysterious weapon. But one thing is for sure: it is long...",
			power: 'Lo0ong Stab',
			icon: 4,
			spritesheet: 'duck0-4',
			levelUpFrames: {start: 6, end: 7}
		},
		{
			name: "Fiery Sword",
			level: 5,
			description: "Life gets hard. Someone ate its pudding. Now it’s burning with passion to exterminate everything.",
			power: "Burning Stab",
			icon: 5,
			spritesheet: 'duck0-5',
			levelUpFrames: {start: 8, end: 9}
		},
		{
			name: "Chainsaw Duck",
			level: 6,
			description: "Chainsaw Duck is the epitome of perfection. Enemies break down crying upon seeing it.",
			power: "Deadly Stab",
			icon: 6,
			spritesheet: 'duck0-6',
			levelUpFrames: {start: 10, end: 11}
		}
	],
	[
		{
			name: "Shroom",
			level: '???',
			description: "Not sure if it’s the dumb one or if it makes the enemies go dumb. But it’s very effective!!!",
			power: 'Dumb Stab',
			icon: 7,
			spritesheet: 'duck-shroom',
			levelUpFrames: {start: 16, end: 17}
		}
	],
	[
		{
			name: "Scissors",
			level: '???',
			description: "As powerful as a small artist cutting 9999 stickers to live. But the damage to your hand is fatal...",
			power: 'Cutting Stab',
			icon: 9,
			spritesheet: 'duck-scissors',
			levelUpFrames: {start: 14, end: 15}
		}
	],
	[
		{
			name: "Poopy",
			level: "???",
			description: "Numbing the enemy’s sensory input with a strong stench. You are immune because it’s ur own poop~",
			power: 'Stinky Stab',
			icon: 8,
			spritesheet: 'duck-poop',
			levelUpFrames: {start: 12, end: 13}
		}
	]
];