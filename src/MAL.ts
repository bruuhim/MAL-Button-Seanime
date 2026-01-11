/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button to anime details page
 * 
 * @version 2.9.0
 * @author bruuhim
 */

function init() {
    $ui.register((ctx: any) => {
        console.log("[MAL Button] v2.9.0 Initializing...");

        // --- State Management ---
        let currentAnimeId: number | null = null;
        const BUTTON_ID = "mal-injected-button";

        /**
         * Get MAL ID from media object
         */
        const mediaToMalId = (media: any): string | null => {
            return media?.idMal ? String(media.idMal) : null;
        };

        /**
         * Inject MAL button into anime page
         */
        const injectButton = async (navId?: number) => {
            try {
                const animeId = navId || currentAnimeId;
                if (!animeId) {
                    console.log("[MAL Button] No Anime ID available.");
                    return;
                }

                // Find the container - await the promise!
                const container = await ctx.dom.queryOne("[data-media-page-header-entry-details-date-container]");
                if (!container) {
                    console.log("[MAL Button] Container not found, will retry...");
                    return;
                }

                // Check if button already exists - use container.queryOne, not ctx.dom.queryOne
                const existing = await container.queryOne(`[data-${BUTTON_ID}]`);
                if (existing) {
                    console.log("[MAL Button] Button already exists.");
                    return;
                }

                // Fetch anime data to get MAL ID
                const animeEntry = await ctx.anime.getAnimeEntry(animeId);
                const malId = mediaToMalId(animeEntry?.media);

                if (!malId) {
                    console.log("[MAL Button] No MAL ID found for anime:", animeId);
                    return;
                }

                // Create the button element - await the promise!
                const btn = await ctx.dom.createElement("a");

                // Set attributes using the correct API methods
                btn.setAttribute(`data-${BUTTON_ID}`, malId);
                btn.setAttribute("href", `https://myanimelist.net/anime/${malId}`);
                btn.setAttribute("target", "_blank");
                btn.setAttribute("rel", "noopener noreferrer");

                // Set content
                btn.setInnerHTML("MAL");

                // Apply styles
                btn.setStyle("background-color", "#2e51a2");
                btn.setStyle("padding", "0 10px");
                btn.setStyle("border-radius", "9999px");
                btn.setStyle("color", "#fff");
                btn.setStyle("font-weight", "600");
                btn.setStyle("font-size", "0.875rem");
                btn.setStyle("text-decoration", "none");
                btn.setStyle("display", "inline-flex");
                btn.setStyle("align-items", "center");
                btn.setStyle("cursor", "pointer");

                // Append to container
                container.append(btn);

                console.log("[MAL Button] Button injected for MAL ID:", malId);
            } catch (err) {
                console.error("[MAL Button] Injection error:", err);
            }
        };

        // --- Navigation Handler ---
        if (ctx.screen && ctx.screen.onNavigate) {
            ctx.screen.onNavigate(async (nav: any) => {
                // Check if on anime entry page
                if (nav?.pathname !== "/entry" || !nav?.searchParams?.id) return;

                const mediaId = parseInt(nav.searchParams.id);
                if (isNaN(mediaId)) return;

                console.log("[MAL Button] Navigation to anime page, ID:", mediaId);
                currentAnimeId = mediaId;

                await injectButton(mediaId);
            });
            console.log("[MAL Button] Navigation handler registered.");
        } else {
            console.warn("[MAL Button] ctx.screen.onNavigate not available.");
        }

        // --- DOM Observer for Persistence ---
        if (ctx.dom && ctx.dom.observe) {
            ctx.dom.observe("[data-media-page-header-entry-details-date-container]", async () => {
                if (currentAnimeId) {
                    console.log("[MAL Button] DOM changed, re-injecting button...");
                    await injectButton(currentAnimeId);
                }
            });
            console.log("[MAL Button] DOM observer registered.");
        }
    });
}

init();
