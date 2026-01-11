/// <reference path="./app.d.ts" />
/// <reference path="./core.d.ts" />
/// <reference path="./plugin.d.ts" />
/// <reference path="./system.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button (blue pill) to anime and manga details pages.
 *
 * v1.0.1:
 * - Fix handling of "GoError: no cached data available" (graceful try/catch).
 * - Improved robustness when switching between Anime/Manga.
 *
 * @version 1.0.1
 * @author bruuhim
 */

function init() {
	$ui.register((ctx) => {
		const reloadCd = ctx.state<number>(2_000); // initially reload after 2s if dom is not ready

		function isCustomSource(mediaId?: number) {
			return (mediaId ?? 0) >= 2 ** 31;
		}

		ctx.screen.onNavigate(async ({ pathname, searchParams }) => {
			// Not in anime/manga page
			if (!["/entry", "/manga/entry"].includes(pathname)) return;
			const id = Number(searchParams.id);

			// Is a custom source
			if (isCustomSource(Number(searchParams.id))) return;

			const type: $app.AL_MediaType = pathname === "/entry" ? "ANIME" : "MANGA";
			const getEntry =
				type === "ANIME" ? ctx.anime.getAnimeEntry : ctx.manga.getMangaEntry;
			const entry = await getEntry(id);
			const media = entry.media;

			const $CONTAINER = `[data-${type.toLowerCase()}-meta-section-buttons-container]`;
			const container = await ctx.dom.queryOne($CONTAINER, {
				withInnerHTML: true,
				identifyChildren: true,
			});

			// DOM is not ready if container is unavailable in anime/manga page
			if (!container) {
				ctx.setTimeout(() => {
					// Load the current screen after x seconds
					ctx.screen.loadCurrent();
					// increment load times by 2s everytime it fails to load
					reloadCd.set(reloadCd.get() + 2_000);
				}, reloadCd.get());
				const duration = reloadCd.get() / 1000;

				return console.log(
					`Could not retrieve ${$CONTAINER}, reloading in ${duration}s`
				);
			}

			try {
				const oldEl = await container.query(`[data-custom-idmal]`);
				// Remove all instances of old buttons
				if (oldEl.length) oldEl.forEach((el) => el.remove());
				if (!media) {
					return console.log(`Media object for ${id} could not be found`);
				}

				if (!media.idMal) {
					return console.log(`Anilist media ${id} has no equivalent MAL entry`);
				}

				const btnAL = await container.queryOne("a");
				// This usually does not happen but just catch just in case
				if (!btnAL) return console.log(`Error: Anilist button was not found.`);

				const btnMAL = await ctx.dom.createElement("a");
				for (const [prop, val] of Object.entries({
					href: `https://myanimelist.net/${type.toLowerCase()}/${media.idMal}`,
					target: "_blank",
					"data-custom-idmal": `${media.idMal}`,
				}))
					btnMAL.setAttribute(prop, val);

				const icnMAL = await ctx.dom.createElement("svg");
				for (const [prop, val] of Object.entries({
					// stroke: "currentcolor", // makes the letters too thick
					fill: "currentcolor",
					viewBox: "0 0 24 24",
					xmlns: "http://www.w3.org/2000/svg",
				}))
					icnMAL.setAttribute(prop, val);
				icnMAL.setStyle("width", "2rem");

				icnMAL.setInnerHTML(
					`<svg stroke="currentcolor" fill="currentcolor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.273 7.247v8.423l-2.103-.003v-5.216l-2.03 2.404-1.989-2.458-.02 5.285H.001L0 7.247h2.203l1.865 2.545 2.015-2.546zm8.628 2.069.025 6.335h-2.365l-.008-2.871h-2.8c.07.499.21 1.266.417 1.779.155.381.298.751.583 1.128l-1.705 1.125c-.349-.636-.622-1.337-.878-2.082a9.3 9.3 0 0 1-.507-2.179c-.085-.75-.097-1.471.107-2.212a3.9 3.9 0 0 1 1.161-1.866c.313-.293.749-.5 1.1-.687s.743-.264 1.107-.359a7.4 7.4 0 0 1 1.191-.183c.398-.034 1.107-.066 2.39-.028l.545 1.749H14.51c-.593.008-.878.001-1.341.209a2.24 2.24 0 0 0-1.278 1.92l2.663.033.038-1.81zm3.992-2.099v6.627l3.107.032-.43 1.775h-4.807V7.187z"/>
                    </svg>`
				);

				btnMAL.append(icnMAL);
				btnAL.after(btnMAL);
			} catch (error) {
				console.log(error);
			}
		});
	});
}
