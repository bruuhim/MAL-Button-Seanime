/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button to anime details page
 * 
 * Uses ctx.action.newAnimePageButton with ctx.eventHandler
 * 
 * @version 3.0.0
 * @author bruuhim
 */

function init() {
    $ui.register((ctx: any) => {
        console.log("[MAL Button] v3.0.0 Initializing...");

        // --- State Management ---
        let currentAnimeId: number | null = null;

        /**
         * Get MAL ID from media object
         */
        const mediaToMalId = (media: any): string | null => {
            return media?.idMal ? String(media.idMal) : null;
        };

        // --- Register the MAL button using the official API ---
        if (ctx.action && ctx.action.newAnimePageButton) {
            const malButton = ctx.action.newAnimePageButton({
                label: "MAL",
                onClick: ctx.eventHandler("mal-button-click", async (animeId: number) => {
                    try {
                        console.log("[MAL Button] Button clicked for anime ID:", animeId);

                        const animeEntry = await ctx.anime.getAnimeEntry(animeId);
                        const malId = mediaToMalId(animeEntry?.media);

                        if (malId) {
                            const malUrl = `https://myanimelist.net/anime/${malId}`;
                            console.log("[MAL Button] Opening URL:", malUrl);

                            // Use ctx.system.openURL or fallback
                            if (ctx.system && ctx.system.openURL) {
                                ctx.system.openURL(malUrl);
                            } else if (typeof window !== "undefined" && window.open) {
                                window.open(malUrl, "_blank");
                            } else {
                                // Log the URL if we can't open it
                                console.log("[MAL Button] Cannot open URL directly. MAL URL:", malUrl);
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
                })
            });

            // Mount the button
            if (malButton && malButton.mount) {
                malButton.mount();
                console.log("[MAL Button] Button mounted.");
            }

            console.log("[MAL Button] Anime page button registered.");
        } else {
            console.warn("[MAL Button] ctx.action.newAnimePageButton not available.");
        }

        // --- Track navigation for the current anime ID ---
        if (ctx.screen && ctx.screen.onNavigate) {
            ctx.screen.onNavigate(async (nav: any) => {
                if (nav?.pathname === "/entry" && nav?.searchParams?.id) {
                    const mediaId = parseInt(nav.searchParams.id);
                    if (!isNaN(mediaId)) {
                        currentAnimeId = mediaId;
                        console.log("[MAL Button] Navigation to anime page, ID:", mediaId);
                    }
                }
            });
        }
    });
}

init();
