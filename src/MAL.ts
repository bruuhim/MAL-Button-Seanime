/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button (blue pill) to anime details page
 * 
 * v3.5.0:
 * - Aggressive cleanup of stale buttons (fixes multiple buttons/wrong links)
 * - Strict state management (prevents linking to wrong anime)
 * 
 * @version 3.5.0
 * @author bruuhim
 */

$ui.register((ctx: any) => {
    console.log("[MAL Button] v3.5.0 Initializing...");

    // --- Constants ---
    const BUTTON_ATTR = "data-mal-button";
    let currentAnimeId: number | null = null; // Track ONLY the current valid ID

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
     * Remove ALL existing MAL buttons from a container
     */
    const removeExistingButtons = async (container: any) => {
        try {
            // Loop until we find no more buttons
            for (let i = 0; i < 5; i++) { // Safety limit of 5 removals
                const existing = await container.queryOne(`[${BUTTON_ATTR}]`);
                if (existing) {
                    await existing.remove();
                } else {
                    break;
                }
            }
        } catch (e) {
            console.error("[MAL Button] Error removing buttons:", e);
        }
    };

    /**
     * Inject the MAL button (blue pill) into the header
     */
    const injectButton = async (animeId: number) => {
        // Validation: If the ID changed while we were waiting, abort
        if (currentAnimeId !== animeId) {
            console.log("[MAL Button] Aborting injection: ID changed", animeId, "!==", currentAnimeId);
            return;
        }

        try {
            const container = await waitForContainer();
            if (!container) {
                console.log("[MAL Button] Container not found.");
                return;
            }

            // AGGRESSIVE CLEANUP: Remove old buttons first
            await removeExistingButtons(container);

            // Validation check again after waiting
            if (currentAnimeId !== animeId) return;

            // Fetch anime data
            const animeEntry = await ctx.anime.getAnimeEntry(animeId);
            const malId = mediaToMalId(animeEntry?.media);

            if (!malId) {
                console.log("[MAL Button] No MAL ID found for anime:", animeId);
                return;
            }

            // Create anchor
            const anchor = await ctx.dom.createElement("a");
            anchor.setAttribute(BUTTON_ATTR, malId);
            anchor.setAttribute("href", `https://myanimelist.net/anime/${malId}`);
            anchor.setAttribute("target", "_blank");
            anchor.setAttribute("rel", "noopener noreferrer");
            anchor.setInnerHTML("MAL");

            // Styles
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

            // Final safety check: ensure no button exists before appending
            const check = await container.queryOne(`[${BUTTON_ATTR}]`);
            if (!check) {
                container.append(anchor);
                console.log("[MAL Button] Injected for MAL ID:", malId);
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

            console.log("[MAL Button] Navigated to:", mediaId);
            currentAnimeId = mediaId; // Update global ID immediately
            await injectButton(mediaId);
        });
    }

    // --- DOM Observer ---
    if (ctx.dom && ctx.dom.observe) {
        ctx.dom.observe("[data-media-page-header-entry-details-date-container]", async () => {
            // Only re-inject if we have a valid currentAnimeId
            if (currentAnimeId) {
                const container = await ctx.dom.queryOne("[data-media-page-header-entry-details-date-container]");
                if (container) {
                    const existing = await container.queryOne(`[${BUTTON_ATTR}]`);
                    // If button is missing OR if the existing button has WRONG data
                    if (!existing) {
                        console.log("[MAL Button] Button missing, re-injecting...");
                        await injectButton(currentAnimeId);
                    } else {
                        // Optional: Check if the existing button ID matches current anime?
                        // Can't easily read attributes with current API helper, but remove/add is safer
                    }
                }
            }
        });
    }
});
