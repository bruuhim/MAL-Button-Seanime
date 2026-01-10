/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button to anime details page
 * 
 * @version 1.1.4
 * @author bruuhim
 */

interface MALState {
    url: string | null;
    animeName: string | null;
    isLoading: boolean;
    error: string | null;
}

function init() {
    $ui.register((ctx: any) => {
        console.log("[MAL Button] Plugin initializing... v1.1.4");
        console.log("[MAL Button] ctx keys:", Object.keys(ctx || {}));
        if (ctx?.app) console.log("[MAL Button] ctx.app keys:", Object.keys(ctx.app));

        // Create MAL button for anime page
        const malButton = ctx.action.newAnimePageButton({
            label: "MAL",
            icon: "https://raw.githubusercontent.com/bruuhim/MAL-Button-Seanime/refs/heads/main/src/icon.png", // Added icon for consistency if supported, though original didn't have it in props
        });
        malButton.mount();

        /**
         * Fetch MAL ID from various sources
         * Priority: media.idMal > externalLinks > manual search
         */
        async function getMalId(media: any): Promise<string | null> {
            // First check: direct MAL ID
            if (media.idMal) {
                return String(media.idMal);
            }

            // Second check: fetch anime entry for external links
            try {
                const animeEntry = await ctx.anime.getAnimeEntry(media.id);

                if (animeEntry?.media) {
                    const fullMedia = animeEntry.media;

                    // Check direct ID
                    if (fullMedia.idMal) {
                        return String(fullMedia.idMal);
                    }

                    // Check external links
                    if (fullMedia.externalLinks && Array.isArray(fullMedia.externalLinks)) {
                        for (const link of fullMedia.externalLinks) {
                            if (link.site && link.site.toLowerCase() === "myanimelist" && link.id) {
                                return link.id;
                            }
                        }
                    }
                }
            } catch (apiError: any) {
                console.warn(`Failed to fetch anime entry: ${apiError?.message || apiError}`);
            }

            return null;
        }

        // Initialize tray as a fallback or for the "anchor" pattern if direct opening isn't possible
        const malTray = ctx.newTray({
            tooltipText: "MyAnimeList",
            iconUrl: "https://raw.githubusercontent.com/bruuhim/MAL-Button-Seanime/refs/heads/main/src/icon.png",
            withContent: true
        });

        const malUrlState = ctx.state<string | null>(null);

        malTray.render(() => {
            const url = malUrlState.get();
            if (!url) return malTray.text("Loading...");
            return malTray.stack([
                malTray.anchor("Open MyAnimeList", {
                    href: url,
                    className: "bg-blue-600 p-2 rounded text-center text-sm font-bold no-underline text-white w-full block"
                })
            ], { style: { padding: "16px" } });
        });

        /**
         * Handle button click - fetch MAL ID and open link
         */
        malButton.onClick(async (event: any) => {
            const media = event.media;

            try {
                const malId = await getMalId(media);

                if (malId) {
                    const malUrl = `https://myanimelist.net/anime/${malId}`;
                    malUrlState.set(malUrl);

                    console.log(`[MAL Button] Attempting to open URL: ${malUrl}`);

                    // Try direct opening first with various likely Seanime APIs
                    try {
                        console.log("[MAL Button] Checking for openExternal...");
                        if (typeof ctx.openExternal === 'function') {
                            console.log("[MAL Button] Using ctx.openExternal");
                            ctx.openExternal(malUrl);
                            return;
                        }
                        console.log("[MAL Button] Checking for openBrowser...");
                        if (typeof ctx.openBrowser === 'function') {
                            console.log("[MAL Button] Using ctx.openBrowser");
                            ctx.openBrowser(malUrl);
                            return;
                        }
                        console.log("[MAL Button] Checking for openURL...");
                        if (typeof ctx.openURL === 'function') {
                            console.log("[MAL Button] Using ctx.openURL");
                            ctx.openURL(malUrl);
                            return;
                        }
                        console.log("[MAL Button] Checking for ctx.app.openBrowser...");
                        if (typeof ctx.app?.openBrowser === 'function') {
                            console.log("[MAL Button] Using ctx.app.openBrowser");
                            ctx.app.openBrowser(malUrl);
                            return;
                        }
                        console.log("[MAL Button] Checking for ctx.app.openExternal...");
                        if (typeof ctx.app?.openExternal === 'function') {
                            console.log("[MAL Button] Using ctx.app.openExternal");
                            ctx.app.openExternal(malUrl);
                            return;
                        }
                    } catch (e) {
                        console.error("[MAL Button] Error during direct opening attempt:", e);
                    }

                    console.log("[MAL Button] No direct opening API found or worked. Falling back to tray.");
                    // If direct opening fails, use the tray as fallback
                    malTray.open();
                } else {
                    ctx.toast.error("❌ No MAL ID found for this anime");
                }
            } catch (error: any) {
                const errorMsg = `Error: ${error?.message || error}`;
                ctx.toast.error(errorMsg);
            }
        });
    });
}
