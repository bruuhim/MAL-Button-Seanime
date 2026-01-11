/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button to anime details page with native styling
 * 
 * @version 2.7.2
 * @author bruuhim
 */

function init() {
    $ui.register((ctx: any) => {
        console.log("[MAL Button] v2.7.2 Initializing...");

        // --- State Management (simple closure variable) ---
        let currentAnimeId: number | null = null;

        // --- DOM Injection Logic ---

        // Function to inject the button
        const injectButton = async (navId?: number) => {
            try {
                // Determine the Anime ID
                const animeId = navId || currentAnimeId;

                if (!animeId) {
                    // console.log("[MAL Button] No Anime ID available for injection.");
                    return;
                }

                if (!ctx.dom) return;

                // Pre-fetch MAL ID
                let malId: string | null = null;
                try {
                    const animeEntry = await ctx.anime.getAnimeEntry(animeId);
                    malId = mediaToMalId(animeEntry.media);
                } catch (e) {
                    console.error("[MAL Button] Error fetching MAL ID:", e);
                }

                if (!malId) return;

                const malUrl = `https://myanimelist.net/anime/${malId}`;
                const containerSelector = 'div[data-anime-meta-section-buttons-container="true"]';

                const container = await ctx.dom.queryOne(containerSelector);
                if (!container) return;

                // Check if button exists
                const existingBtn = await ctx.dom.queryOne("#mal-injected-button");
                if (existingBtn) return; // Don't re-inject if it's there

                // Create the anchor link
                const btn = await ctx.dom.createElement("a");

                if (typeof btn.setAttribute === "function") {
                    btn.setAttribute("id", "mal-injected-button");
                    btn.setAttribute("href", malUrl);
                    btn.setAttribute("target", "_blank");
                    btn.setAttribute("title", "Open on MyAnimeList");
                    // ENHANCED STYLING: Solid Blue, White Text, added padding for the "MAL" label
                    btn.setAttribute("class", "UI-Button_root whitespace-nowrap font-bold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-blue-500 shadow-sm bg-[#2e51a2] hover:bg-[#1c3a8c] text-white hover:text-white h-9 px-3 gap-2 border-none");
                }

                if (typeof btn.setInnerHtml === "function") {
                    // Added "MAL" text label so it's impossible to miss
                    btn.setInnerHtml(`<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg"><path d="M433.2 121.6c-18.4-1.6-47.6 11.2-47.6 11.2l-32.8 19.6-18-20.8s-22.4-23.2-56-23.2 -58.4 20-58.4 20-29.2-22.4-60-22.4-55.2 24.8-55.2 24.8l-18.8 21.6 -32-19.2s-28-14.8-49.2-12.8c-29.2 2.8-31.2 30.8-31.2 30.8v256s6.8 30.8 36.8 26c26.8-4 43.6-18.4 43.6-18.4l29.6-21.2 25.6 22.8s15.6 12 37.6 12 35.6-10.4 35.6-10.4l30.4-25.2 32.4 26s16.4 11.6 38.4 11.6 38.4-12.8 38.4-12.8l26.4-22.4 28.8 20.8s17.2 15.6 44 11.2c27.6-4.4 30-33.6 30-33.6V152.8C511.6 152.8 458.8 124 433.2 121.6zM149.2 339.2l-37.6 25.2s-3.6 2.4-5.6-2.4c-2-4.4 3.2-10 3.2-10l84-180.8s2.8-6 8.8-4.8c6 1.2 8.4 7.6 8.4 7.6l21.6 169.2s1.2 6.8-4.8 8.8c-6 2-8-4.4-8-4.4L199.6 298h-42.8L149.2 339.2zM281.2 360.4h-34s-6 0.8-7.6-5.2c-1.6-6 4-8.8 4-8.8l77.6-167.6s2.4-6 8.8-5.6c6.4 0.4 8.4 6 8.4 6l79.2 168s4.4 6.8-1.6 10c-6 3.2-9.6-1.6-9.6-1.6l-20.8-45.6H310L281.2 360.4zM263.6 208.8l-26 54.8h52.8L263.6 208.8zM203.2 258.8l-15.6-88-22.4 88H203.2z"></path></svg> <span>MAL</span>`);
                }

                if (container.append) {
                    container.append(btn);
                    console.log("[MAL Button] Button injected successfully (v2.7.1).");
                }

            } catch (err) {
                console.error("[MAL Button] Injection error:", err);
            }
        };

        // --- Persistence Logic (Observer) ---
        // This watches the container and re-injects if React wipes it.
        const containerSelector = 'div[data-anime-meta-section-buttons-container="true"]';
        if (ctx.dom && ctx.dom.observe) {
            ctx.dom.observe(containerSelector, () => {
                injectButton();
            });
        }

        // --- Logic ---

        /**
         * Robust MAL ID retrieval
         */
        const mediaToMalId = (media: any) => media?.idMal ? String(media.idMal) : null;

        // --- Event Handlers ---
        if (ctx.screen && ctx.screen.onNavigate) {
            ctx.screen.onNavigate(async (nav: any) => {
                if (nav?.navId) {
                    console.log("[MAL Button] v2.7.2 Navigation detected, ID:", nav.navId);
                    currentAnimeId = nav.navId;
                    await injectButton(nav.navId);
                }
            });
        }

        // Initial load check
        injectButton();
    });
}

init();
