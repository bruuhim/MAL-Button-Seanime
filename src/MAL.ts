/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button to anime details page
 * 
 * @version 1.1.0
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

        /**
         * Handle button click - fetch MAL ID and open link
         */
        malButton.onClick(async (event: any) => {
            const media = event.media;

            try {
                const malId = await getMalId(media);

                if (malId) {
                    const malUrl = `https://myanimelist.net/anime/${malId}`;
                    window.open(malUrl, "_blank");
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
