/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * v1.0.15:
 * - Stable Rollback to v1.0.12 (Proper init() wrapper + Blue Pill).
 * 
 * @version 1.0.15
 * @author bruuhim
 */

function init() {
    $ui.register((ctx: any) => {
        console.log("[MAL Button] v1.0.15 Initializing (Final Stability Rollback)...");

        // --- Constants ---
        const BUTTON_ATTR = "data-mal-button";
        let currentMediaId: number | null = null;

        /**
         * Get MAL ID from media object
         */
        const mediaToMalId = (media: any): string | null => {
            return media?.idMal ? String(media.idMal) : null;
        };

        /**
         * Helper to wait using ctx.setTimeout
         */
        const wait = (ms: number) => new Promise<void>((resolve) => {
            if (ctx.setTimeout) {
                ctx.setTimeout(resolve, ms);
            } else {
                resolve();
            }
        });

        /**
         * Wait for the container element
         */
        const waitForContainer = async (retries = 10, interval = 500): Promise<any> => {
            for (let i = 0; i < retries; i++) {
                const container = await ctx.dom.queryOne("[data-media-page-header-entry-details-date-container]");
                if (container) return container;
                await wait(interval);
            }
            return null;
        };

        /**
         * Remove ALL existing MAL buttons
         */
        const removeExistingButtons = async (container: any) => {
            try {
                for (let i = 0; i < 5; i++) {
                    const existing = await container.queryOne(`[${BUTTON_ATTR}]`);
                    if (existing) {
                        await existing.remove();
                    } else {
                        break;
                    }
                }
            } catch (e) {
                console.error("[MAL Button] Cleanup error:", e);
            }
        };

        /**
         * Safely fetch Anime Entry
         */
        const getAnimeEntrySafe = async (id: number) => {
            try {
                if (ctx.anime && ctx.anime.getAnimeEntry) {
                    return await ctx.anime.getAnimeEntry(id);
                }
            } catch (e) {
                // Ignore "no cached data" errors
            }
            return null;
        };

        /**
         * Safely fetch Manga Entry
         */
        const getMangaEntrySafe = async (id: number) => {
            try {
                if (ctx.manga && ctx.manga.getMangaEntry) {
                    return await ctx.manga.getMangaEntry(id);
                }
            } catch (e) {
                // Ignore "no cached data" errors
            }
            return null;
        };

        /**
         * Inject the MAL button
         */
        const injectButton = async (mediaId: number) => {
            if (currentMediaId !== mediaId) return;

            try {
                const container = await waitForContainer();
                if (!container) return;

                await removeExistingButtons(container);

                if (currentMediaId !== mediaId) return;

                // --- DATA FETCHING ---
                let malId: string | null = null;
                let type: "anime" | "manga" = "anime";

                // 1. Try Anime
                const animeEntry = await getAnimeEntrySafe(mediaId);
                malId = mediaToMalId(animeEntry?.media);

                // 2. Try Manga if no Anime ID
                if (!malId) {
                    const mangaEntry = await getMangaEntrySafe(mediaId);
                    malId = mediaToMalId(mangaEntry?.media);
                    if (malId) type = "manga";
                }

                if (!malId) return;

                // Create Anchor
                const anchor = await ctx.dom.createElement("a");
                anchor.setAttribute(BUTTON_ATTR, malId);
                anchor.setAttribute("href", `https://myanimelist.net/${type}/${malId}`);
                anchor.setAttribute("target", "_blank");
                anchor.setAttribute("rel", "noopener noreferrer");
                anchor.setInnerHTML("MAL");

                // Blue Pill Styles
                anchor.setStyle("background-color", "#2e51a2");
                anchor.setStyle("padding", "0 10px");
                anchor.setStyle("border-radius", "9999px");
                anchor.setStyle("color", "#fff");
                anchor.setStyle("font-weight", "600");
                anchor.setStyle("font-size", "0.875rem");
                anchor.setStyle("text-decoration", "none");
                anchor.setStyle("display", "inline-flex");
                anchor.setStyle("align-items", "center");
                anchor.setStyle("cursor", "pointer");
                anchor.setStyle("margin-left", "0.5rem");

                const check = await container.queryOne(`[${BUTTON_ATTR}]`);
                if (!check) {
                    container.append(anchor);
                    console.log("[MAL Button] Injected successfully.");
                }

            } catch (err) {
                console.error("[MAL Button] Critical injection error:", err);
            }
        };

        // --- Navigation Handler ---
        if (ctx.screen && ctx.screen.onNavigate) {
            ctx.screen.onNavigate(async (nav: any) => {
                if (!nav?.pathname?.includes("entry") || !nav?.searchParams?.id) return;

                const mediaId = parseInt(nav.searchParams.id);
                if (isNaN(mediaId)) return;

                console.log("[MAL Button] Navigated to:", mediaId);
                currentMediaId = mediaId;
                await injectButton(mediaId);
            });
        }

        // --- DOM Observer ---
        if (ctx.dom && ctx.dom.observe) {
            ctx.dom.observe("[data-media-page-header-entry-details-date-container]", async () => {
                if (currentMediaId) {
                    const container = await ctx.dom.queryOne("[data-media-page-header-entry-details-date-container]");
                    if (container) {
                        const existing = await container.queryOne(`[${BUTTON_ATTR}]`);
                        if (!existing) {
                            await injectButton(currentMediaId);
                        }
                    }
                }
            });
        }
    });
}

// NOTE: No manual init() call here. Seanime calls it automatically if defined.
