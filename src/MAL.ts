/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button (blue pill) to anime details page
 * 
 * v3.4.0:
 * - Fixed ReferenceError: setTimeout is not defined (used ctx.setTimeout)
 * - Removed init() wrapper
 * 
 * @version 3.4.0
 * @author bruuhim
 */

$ui.register((ctx: any) => {
    console.log("[MAL Button] v3.4.0 Initializing...");

    // --- Constants ---
    const BUTTON_ATTR = "data-mal-button";
    let lastInjectedId: number | null = null;

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
            // Fallback: This effectively doesn't wait if setTimeout is missing,
            // but prevents the ReferenceError crash.
            resolve();
        }
    });

    /**
     * Wait for the container element to appear
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
     * Inject the MAL button (blue pill) into the header
     */
    const injectButton = async (animeId: number) => {
        try {
            // Wait for container
            const container = await waitForContainer();

            if (!container) {
                console.log("[MAL Button] Container not found after waiting.");
                return;
            }

            // Clean up duplicates
            // We use a simple loop to try to clear distinct elements
            while (true) {
                const existing = await container.queryOne(`[${BUTTON_ATTR}]`);
                if (existing) {
                    await existing.remove();
                    // Small delay to ensure DOM update?
                } else {
                    break;
                }
            }

            // Fetch anime data
            const animeEntry = await ctx.anime.getAnimeEntry(animeId);
            const malId = mediaToMalId(animeEntry?.media);

            if (!malId) {
                console.log("[MAL Button] No MAL ID found for anime:", animeId);
                return;
            }

            // Create the anchor element (blue pill)
            // Use ctx.dom.createElement returns a promise
            const anchor = await ctx.dom.createElement("a");
            anchor.setAttribute(BUTTON_ATTR, malId);
            anchor.setAttribute("href", `https://myanimelist.net/anime/${malId}`);
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

            // Final check to prevent race condition insertion
            // We check if another button was inserted while we were creating ours
            const raceCheck = await container.queryOne(`[${BUTTON_ATTR}]`);
            if (!raceCheck) {
                container.append(anchor);
                lastInjectedId = animeId;
                console.log("[MAL Button] Blue pill injected for MAL ID:", malId);
            } else {
                console.log("[MAL Button] Button already appeared (race condition avoided).");
            }

        } catch (err) {
            console.error("[MAL Button] Injection error:", err);
        }
    };

    // --- Navigation Handler ---
    if (ctx.screen && ctx.screen.onNavigate) {
        ctx.screen.onNavigate(async (nav: any) => {
            if (nav?.pathname !== "/entry" || !nav?.searchParams?.id) return;

            const mediaId = parseInt(nav.searchParams.id);
            if (isNaN(mediaId)) return;

            console.log("[MAL Button] Navigation to anime page, ID:", mediaId);
            await injectButton(mediaId);
        });
    }

    // --- DOM Observer ---
    if (ctx.dom && ctx.dom.observe) {
        ctx.dom.observe("[data-media-page-header-entry-details-date-container]", async () => {
            if (lastInjectedId) {
                const container = await ctx.dom.queryOne("[data-media-page-header-entry-details-date-container]");
                if (container) {
                    const existing = await container.queryOne(`[${BUTTON_ATTR}]`);
                    if (!existing) {
                        console.log("[MAL Button] DOM changed/Button missing, re-injecting...");
                        await injectButton(lastInjectedId);
                    }
                }
            }
        });
    }
});
