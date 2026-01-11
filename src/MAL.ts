/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button to anime details page
 * 
 * Uses ctx.action.newAnimePageButton API for stable button injection
 * 
 * @version 2.8.0
 * @author bruuhim
 */

function init() {
    $ui.register((ctx: any) => {
        console.log("[MAL Button] v2.8.0 Initializing...");

        /**
         * Robust MAL ID retrieval from media object
         */
        const mediaToMalId = (media: any): string | null => {
            return media?.idMal ? String(media.idMal) : null;
        };

        // --- Official API Button ---
        // Uses ctx.action.newAnimePageButton which is the stable, sandbox-safe approach
        if (ctx.action && ctx.action.newAnimePageButton) {
            ctx.action.newAnimePageButton({
                label: "MAL",
                onClick: async (animeId: number) => {
                    try {
                        console.log("[MAL Button] Button clicked for anime ID:", animeId);

                        const animeEntry = await ctx.anime.getAnimeEntry(animeId);
                        const malId = mediaToMalId(animeEntry?.media);

                        if (malId) {
                            const malUrl = `https://myanimelist.net/anime/${malId}`;
                            // Open in new tab
                            if (typeof window !== "undefined" && window.open) {
                                window.open(malUrl, "_blank");
                            } else {
                                // Fallback: use ctx.system if available
                                console.log("[MAL Button] Opening URL:", malUrl);
                            }
                        } else {
                            console.warn("[MAL Button] No MAL ID found for this anime.");
                            if (ctx.toast) {
                                ctx.toast.error("No MAL ID found for this anime.");
                            }
                        }
                    } catch (err) {
                        console.error("[MAL Button] Error:", err);
                        if (ctx.toast) {
                            ctx.toast.error("Failed to get MAL link.");
                        }
                    }
                }
            });
            console.log("[MAL Button] Registered anime page button.");
        } else {
            console.warn("[MAL Button] ctx.action.newAnimePageButton not available.");
        }
    });
}

init();
