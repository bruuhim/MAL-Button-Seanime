/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button to anime details page
 * 
 * @version 1.1.3
 * @author bruuhim
 */

interface MALState {
    url: string | null;
    animeName: string | null;
    isLoading: boolean;
    error: string | null;
}

function init() {
    $ui.register((ctx) => {
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

                    // Try direct opening first with various likely Seanime APIs
                    try {
                        // @ts-ignore
                        if (typeof ctx.openExternal === 'function') {
                            // @ts-ignore
                            ctx.openExternal(malUrl);
                            return;
                        }
                        // @ts-ignore
                        if (typeof ctx.openBrowser === 'function') {
                            // @ts-ignore
                            ctx.openBrowser(malUrl);
                            return;
                        }
                        // @ts-ignore
                        if (typeof ctx.openURL === 'function') {
                            // @ts-ignore
                            ctx.openURL(malUrl);
                            return;
                        }
                        // @ts-ignore
                        if (typeof ctx.app?.openBrowser === 'function') {
                            // @ts-ignore
                            ctx.app.openBrowser(malUrl);
                            return;
                        }
                        // @ts-ignore
                        if (typeof ctx.app?.openExternal === 'function') {
                            // @ts-ignore
                            ctx.app.openExternal(malUrl);
                            return;
                        }
                    } catch (e) { }

                    // If direct opening fails or isn't available, use the "Browse forums" pattern from provider.ts
                    // which uses tray.anchor. We open the tray so the user can click the anchor.
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
