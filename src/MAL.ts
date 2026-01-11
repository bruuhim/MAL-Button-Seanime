/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button to anime details page
 * 
 * Uses ctx.action.newAnimePageButton with onClick as a method
 * Based on Untracked plugin pattern
 * 
 * @version 3.1.0
 * @author bruuhim
 */

function init() {
    $ui.register((ctx: any) => {
        console.log("[MAL Button] v3.1.0 Initializing...");

        /**
         * Get MAL ID from media object
         */
        const mediaToMalId = (media: any): string | null => {
            return media?.idMal ? String(media.idMal) : null;
        };

        // --- Register the MAL button using the official API ---
        if (ctx.action && ctx.action.newAnimePageButton) {
            // Create the button with just the label
            const malButton = ctx.action.newAnimePageButton({
                label: "MAL",
            });

            // Mount the button first
            if (malButton && malButton.mount) {
                malButton.mount();
                console.log("[MAL Button] Button mounted.");
            }

            // Then register the onClick handler (following Untracked plugin pattern)
            if (malButton && malButton.onClick) {
                malButton.onClick(async ({ media }: { media: any }) => {
                    try {
                        console.log("[MAL Button] Button clicked, media:", media);

                        const malId = mediaToMalId(media);

                        if (malId) {
                            const malUrl = `https://myanimelist.net/anime/${malId}`;
                            console.log("[MAL Button] Opening URL:", malUrl);

                            // Use window.open or log
                            if (typeof window !== "undefined" && window.open) {
                                window.open(malUrl, "_blank");
                            } else {
                                console.log("[MAL Button] MAL URL:", malUrl);
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
                });
                console.log("[MAL Button] onClick handler registered.");
            }

            console.log("[MAL Button] Anime page button setup complete.");
        } else {
            console.warn("[MAL Button] ctx.action.newAnimePageButton not available.");
        }
    });
}

init();
