/**
 * This file is generated from site-spec.yaml.
 * Do not edit directly.
 * Run npm run site:generate instead.
 */
import type { GameConfig } from './game-types';

export const siteConfig: GameConfig = {
	name: "Twisted Tower",
	shortName: "Twisted Tower",
	title: "Twisted Tower Guide & Wiki",
	description: "Twisted Tower guide and wiki: release info, system requirements, toy weapons, the five themed floors, achievements, and Adventure Plus details.",
	tagline: "A first-person horror-action shooter set in an abandoned 1950s amusement park. Climb the tower, fight, solve puzzles, and rescue the one you love.",
	siteUrl: "https://twisted-tower.vercel.app",
	hubPath: "/",
	hubTitle: "Twisted Tower Guide & Wiki",
	locale: "en",
	releaseStatus: "released",
	releaseDate: "2026-08-18",
	developer: "Atmos Games",
	publisher: "3D Realms",
	platforms: ["PC (Steam)"],
	accentColor: "#e08020",
	accentForeground: "#241608",
	heroImage: "screenshots/hero-carnival.jpg",
	heroAlt: "Twisted Tower carnival surroundings lit in warm amber lights",
	heroPosition: "center",
	disclaimer: "Unofficial fan site. This site is not affiliated with Atmos Games or 3D Realms.",
	portal: {
		heroBadge: "Guide & Wiki",
		primaryCta: {
			label: "Start the Beginner's Guide",
			href: "/beginner-guide/",
		},
		secondaryCta: {
			label: "Browse All Guides",
			href: "#browse-guides",
		},
		statusItems: [
			{
				label: "Release",
				value: "2026-08-18",
			},
			{
				label: "Platform",
				value: "PC (Steam)",
			},
			{
				label: "Price",
				value: "$14.99",
			},
			{
				label: "Length",
				value: "~4–6 hours",
			},
		],
		popularQuestions: [
			{
				label: "When did Twisted Tower release?",
				href: "/release-info/",
			},
			{
				label: "What should I do first?",
				href: "/beginner-guide/",
				context: "Beginner guide → Requirements → Weapons",
			},
			{
				label: "What are the system requirements?",
				href: "/system-requirements/",
			},
			{
				label: "How long is the game?",
				href: "/beginner-guide/",
				context: "Story run ~4–6 hours",
			},
		],
		startHere: [
			{
				title: "Beginner's Guide",
				description: "What to know before your first climb: the core loop, your goal, and your first floor.",
				href: "/beginner-guide/",
				image: "screenshots/interior-amber.jpg",
				label: "Beginner",
				badge: "Start here",
			},
			{
				title: "Toy Weapons Guide",
				description: "The officially announced toy-style arsenal and the Ticket-driven upgrade system.",
				href: "/weapons-guide/",
				image: "screenshots/combat-arena.jpg",
				label: "Weapons",
			},
			{
				title: "The Five Themed Floors",
				description: "The five officially confirmed themed floors: Hotel, Waterpark, Clown Casino, Carnival Forest, and Space Station.",
				href: "/five-floors/",
				image: "screenshots/hero-carnival.jpg",
				label: "Five Floors",
			},
			{
				title: "Achievements Guide",
				description: "All 18 Twisted Tower Steam achievements with their official descriptions.",
				href: "/achievements-guide/",
				label: "Achievements",
			},
		],
		evidence: {
			title: "The Five Floors in Action",
			description: "Official Steam screenshots from inside the tower.",
			items: [
				{
					image: "screenshots/floor-hotel.jpg",
					alt: "Twisted Tower hotel floor interior with warm lighting",
					caption: "Hotel",
					href: "/five-floors/",
				},
				{
					image: "screenshots/floor-clown-casino.jpg",
					alt: "Twisted Tower Clown Casino floor glowing with golden lights",
					caption: "Clown Casino",
					href: "/five-floors/",
				},
				{
					image: "screenshots/floor-carnival-forest.jpg",
					alt: "Twisted Tower Carnival Forest floor with dark green foliage",
					caption: "Carnival Forest",
					href: "/five-floors/",
				},
				{
					image: "screenshots/floor-space-station.jpg",
					alt: "Twisted Tower Space Station floor with neon purple lighting",
					caption: "Space Station",
					href: "/five-floors/",
				},
			],
		},
		showRecentlyUpdated: true,
		maxRecent: 3,
	},
	categories: [
		{
			id: "getting-started",
			label: "Getting Started",
			description: "Basics to know before your first climb up the tower.",
			icon: "rocket",
			order: 1,
			image: "screenshots/interior-amber.jpg",
		},
		{
			id: "gameplay",
			label: "Gameplay",
			description: "Toy weapons, movement toys, and the core combat loop.",
			icon: "puzzle",
			order: 2,
			image: "screenshots/combat-arena.jpg",
		},
		{
			id: "levels",
			label: "Levels",
			description: "The five themed floors inside the tower.",
			icon: "star",
			order: 3,
			image: "screenshots/hero-carnival.jpg",
		},
		{
			id: "game-info",
			label: "Game Info",
			description: "Release info, platforms, and system requirements.",
			icon: "information",
			order: 4,
			image: "screenshots/carnival-night.jpg",
		},
		{
			id: "progression",
			label: "Progress & Achievements",
			description: "The achievement list and Adventure Plus replay details.",
			icon: "clock",
			order: 5,
			image: "screenshots/neon-carnival.jpg",
		},
	],
	pages: [
		{
			id: "beginner-guide",
			slug: "beginner-guide",
			role: "core",
			assetType: "article",
			intents: ["getting-started", "core-loop", "first-floor"],
			relations: [
				{
					pageId: "system-requirements",
					type: "next-step",
				},
				{
					pageId: "weapons-guide",
					type: "next-step",
				},
				{
					pageId: "five-floors",
					type: "related",
				},
			],
			sources: [
				{
					type: "official",
					title: "Steam Store Page",
					url: "https://store.steampowered.com/app/1575990/Twisted_Tower/",
				},
				{
					type: "official",
					title: "3D Realms launch announcement (Gematsu)",
					url: "https://www.gematsu.com/2026/07/twisted-tower-launches-august-18",
				},
			],
			evidence: [
			],
		},
		{
			id: "system-requirements",
			slug: "system-requirements",
			role: "supporting",
			assetType: "reference",
			intents: ["system-requirements", "pc-specs", "minimum-requirements"],
			relations: [
				{
					pageId: "beginner-guide",
					type: "next-step",
				},
				{
					pageId: "release-info",
					type: "related",
				},
			],
			sources: [
				{
					type: "official",
					title: "Steam Store Page — System Requirements",
					url: "https://store.steampowered.com/app/1575990/Twisted_Tower/",
				},
			],
			evidence: [
			],
		},
		{
			id: "release-info",
			slug: "release-info",
			role: "supporting",
			assetType: "reference",
			intents: ["release-date", "price", "platforms", "where-to-buy"],
			relations: [
				{
					pageId: "system-requirements",
					type: "next-step",
				},
				{
					pageId: "beginner-guide",
					type: "related",
				},
			],
			sources: [
				{
					type: "official",
					title: "Steam Store Page",
					url: "https://store.steampowered.com/app/1575990/Twisted_Tower/",
				},
				{
					type: "official",
					title: "3D Realms launch announcement (Gematsu)",
					url: "https://www.gematsu.com/2026/07/twisted-tower-launches-august-18",
				},
				{
					type: "other",
					title: "PlayFront — console status (PC only)",
					url: "https://playfront.de/en/bioshock-trifft-biosphaere-horror-twisted-tower-erobert-den-pc/",
				},
			],
			evidence: [
			],
		},
		{
			id: "weapons-guide",
			slug: "weapons-guide",
			role: "core",
			assetType: "reference",
			intents: ["weapons", "weapon-upgrades", "tickets", "alt-fire"],
			relations: [
				{
					pageId: "beginner-guide",
					type: "related",
				},
				{
					pageId: "movement-toys",
					type: "related",
				},
			],
			sources: [
				{
					type: "official",
					title: "Steam Store Page — toyish arsenal",
					url: "https://store.steampowered.com/app/1575990/Twisted_Tower/",
				},
				{
					type: "other",
					title: "NoobFeed review — alternate fires and upgrades",
					url: "https://www.noobfeed.com/reviews/twisted-tower-review",
				},
			],
			evidence: [
			],
		},
		{
			id: "movement-toys",
			slug: "movement-toys",
			role: "supporting",
			assetType: "reference",
			intents: ["movement", "traversal", "grapple", "dash", "jump"],
			relations: [
				{
					pageId: "weapons-guide",
					type: "related",
				},
				{
					pageId: "five-floors",
					type: "next-step",
				},
			],
			sources: [
				{
					type: "official",
					title: "Steam Store Page — toys for jumping, dashing, grappling",
					url: "https://store.steampowered.com/app/1575990/Twisted_Tower/",
				},
				{
					type: "official",
					title: "Steam Community achievements — official descriptions",
					url: "https://steamcommunity.com/stats/1575990/achievements",
				},
			],
			evidence: [
			],
		},
		{
			id: "five-floors",
			slug: "five-floors",
			role: "core",
			assetType: "article",
			intents: ["levels", "floors", "locations", "world"],
			relations: [
				{
					pageId: "movement-toys",
					type: "next-step",
				},
				{
					pageId: "weapons-guide",
					type: "related",
				},
				{
					pageId: "beginner-guide",
					type: "related",
				},
			],
			sources: [
				{
					type: "official",
					title: "Steam Store Page — five levels",
					url: "https://store.steampowered.com/app/1575990/Twisted_Tower/",
				},
				{
					type: "official",
					title: "3D Realms launch announcement (Gematsu)",
					url: "https://www.gematsu.com/2026/07/twisted-tower-launches-august-18",
				},
			],
			evidence: [
			],
		},
		{
			id: "achievements-guide",
			slug: "achievements-guide",
			role: "supporting",
			assetType: "checklist",
			intents: ["achievements", "steam-achievements", "completion"],
			relations: [
				{
					pageId: "adventure-plus",
					type: "next-step",
				},
				{
					pageId: "five-floors",
					type: "related",
				},
			],
			sources: [
				{
					type: "official",
					title: "Steam Community achievements",
					url: "https://steamcommunity.com/stats/1575990/achievements",
				},
			],
			evidence: [
			],
		},
		{
			id: "adventure-plus",
			slug: "adventure-plus",
			role: "supporting",
			assetType: "article",
			intents: ["new-game-plus", "adventure-plus", "replay"],
			relations: [
				{
					pageId: "achievements-guide",
					type: "related",
				},
				{
					pageId: "five-floors",
					type: "related",
				},
			],
			sources: [
				{
					type: "other",
					title: "NoobFeed review — New Game Plus style mode",
					url: "https://www.noobfeed.com/reviews/twisted-tower-review",
				},
				{
					type: "official",
					title: "Steam Community achievements — Adventure Plus Antic / Plus Mode Pandemonium",
					url: "https://steamcommunity.com/stats/1575990/achievements",
				},
			],
			evidence: [
			],
		},
	],
	routes: [
		{
			id: "first-time-players",
			eyebrow: "New Player Route",
			title: "New Player Route",
			description: "Pages to read in order before your first serious climb.",
			href: "/routes/first-time-players/",
			visual: "screenshots/interior-amber.jpg",
			pages: [
				{
					pageId: "beginner-guide",
					href: "/beginner-guide/",
					title: "Beginner's Guide",
					description: "What to know before your first climb: the core loop, your goal, and your first floor.",
					eyebrow: "Getting Started",
					image: "screenshots/interior-amber.jpg",
				},
				{
					pageId: "system-requirements",
					href: "/system-requirements/",
					title: "System Requirements",
					description: "Minimum and recommended PC specifications for Twisted Tower.",
					eyebrow: "System Info",
				},
				{
					pageId: "weapons-guide",
					href: "/weapons-guide/",
					title: "Toy Weapons Guide",
					description: "The officially announced toy-style arsenal and the Ticket-driven upgrade system.",
					eyebrow: "Arsenal",
					image: "screenshots/combat-arena.jpg",
				},
			],
			fastAnswers: [
				{
					question: "Where should I start?",
					answer: "Begin with the Beginner's Guide.",
					pageId: "beginner-guide",
					href: "/beginner-guide/",
				},
				{
					question: "Can my PC run it?",
					answer: "Check the system requirements page.",
					pageId: "system-requirements",
					href: "/system-requirements/",
				},
				{
					question: "Which weapon should I use?",
					answer: "See the toy weapons guide.",
					pageId: "weapons-guide",
					href: "/weapons-guide/",
				},
			],
		},
		{
			id: "reaching-the-top",
			eyebrow: "Climbing Route",
			title: "Climbing Route",
			description: "Understand the floors, movement toys, and post-game content.",
			href: "/routes/reaching-the-top/",
			visual: "screenshots/carnival-night.jpg",
			pages: [
				{
					pageId: "five-floors",
					href: "/five-floors/",
					title: "The Five Themed Floors",
					description: "The five officially confirmed themed floors: Hotel, Waterpark, Clown Casino, Carnival Forest, and Space Station.",
					eyebrow: "The Climb",
					image: "screenshots/hero-carnival.jpg",
				},
				{
					pageId: "movement-toys",
					href: "/movement-toys/",
					title: "Movement Toys",
					description: "Movement toys confirmed by the official store page and achievements: Harpoon, Fairy Wings, Bouncy Boots, and the Jet Pack.",
					eyebrow: "Movement Tools",
				},
				{
					pageId: "adventure-plus",
					href: "/adventure-plus/",
					title: "Adventure Plus (New Game Plus) Explained",
					description: "The Adventure Plus mode unlocked after your first clear: carry upgrades, open new routes, and face higher difficulty.",
					eyebrow: "Replay",
				},
				{
					pageId: "achievements-guide",
					href: "/achievements-guide/",
					title: "Achievements Guide",
					description: "All 18 Twisted Tower Steam achievements with their official descriptions.",
					eyebrow: "Achievements",
				},
			],
			fastAnswers: [
				{
					question: "How many floors are there?",
					answer: "See the five themed floors page.",
					pageId: "five-floors",
					href: "/five-floors/",
				},
				{
					question: "What happens after I finish?",
					answer: "Adventure Plus unlocks for a second run.",
					pageId: "adventure-plus",
					href: "/adventure-plus/",
				},
				{
					question: "How many achievements are there?",
					answer: "18 total — see the achievements page.",
					pageId: "achievements-guide",
					href: "/achievements-guide/",
				},
			],
		},
	],
	trust: {
		enabled: true,
		pages: {
			about: {
				enabled: true,
				slug: "about",
				path: "/about/",
				title: "About",
				robots: "index,follow",
			},
			editorialMethod: {
				enabled: true,
				slug: "editorial-method",
				path: "/editorial-method/",
				title: "Editorial Method",
				robots: "index,follow",
			},
			privacy: {
				enabled: true,
				slug: "privacy",
				path: "/privacy/",
				title: "Privacy",
				robots: "noindex,follow",
			},
		},
	},
	social: {
		defaultImage: {
			asset: "screenshots/hero-carnival.jpg",
			alt: "Twisted Tower guide and wiki",
		},
	},
};
