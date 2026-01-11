/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button to anime details page with native styling
 * 
 * @version 2.4.1
 * @author bruuhim
 */

function init() {
    $ui.register((ctx: any) => {
        console.log("[MAL Button] v2.5.0 (Async DOM) Initializing...");


        // --- State Management ---
        const malUrlState = ctx.state<string | null>(null);
        // --- DOM Injection Logic ---

        // Function to inject the button
        const injectButton = async (navId?: number) => {
            // SAFE ATTRIBUTE SETTER
            const setProp = (el: any, key: string, val: string) => {
                if (!el) return;
                try {
                    let hasSetAttr = false;
                    try { hasSetAttr = typeof el.setAttribute === 'function'; } catch (e) { }

                    if (hasSetAttr) {
                        try {
                            el.setAttribute(key, val);
                        } catch (e) {
                            el[key] = val;
                        }
                    } else {
                        el[key] = val;
                    }
                } catch (e) {
                    console.log(`[MAL Button] Failed to set ${key}:`, e);
                }
            };

            try {
                console.log("[MAL Button] injectButton ENTRY. navId:", navId);

                if (!ctx.dom) {
                    console.log("[MAL Button] ctx.dom is missing, cannot inject.");
                    return;
                }

                // Determine the Anime ID
                let animeId = navId;
                if (!animeId) {
                    console.log("[MAL Button] No Anime ID found in injectButton call.");
                }

                if (!animeId) return;

                // The container selector
                const containerSelector = 'div[data-anime-meta-section-buttons-container="true"]';

                // Find container using ctx.dom (awaiting just in case)
                const container = await ctx.dom.queryOne(containerSelector);
                console.log("[MAL Button] Container found?", !!container);

                if (container) {
                    // Check if button exists
                    const existingBtn = await ctx.dom.queryOne("#mal-injected-button");
                    if (existingBtn) {
                        console.log("[MAL Button] Button already exists. Removing to re-inject.");
                        try {
                            if (typeof existingBtn.remove === "function") {
                                existingBtn.remove();
                            } else {
                                console.log("[MAL Button] element.remove() is missing.");
                            }
                        } catch (e) {
                            console.log("[MAL Button] Failed to remove existing button:", e);
                        }
                    }

                    // Create the button using ctx.dom (AWAITING because it returns a Promise!)
                    const btn = await ctx.dom.createElement("button");
                    console.log("[MAL Button] Button Created:", btn);

                    // USE SETPROP INSTEAD OF SETATTRIBUTE
                    setProp(btn, "id", "mal-injected-button");
                    setProp(btn, "type", "button");
                    setProp(btn, "class", "UI-Button_root whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--gray] border border-transparent bg-transparent hover:underline active:text-gray-700 dark:text-gray-300 dark:active:text-gray-200 UI-IconButton_root p-0 flex-none text-xl h-8 w-8 px-0");

                    // MAL Icon
                    if (typeof btn.setInnerHtml === "function") {
                        btn.setInnerHtml(`<span class="md:inline-block"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M433.2 121.6c-18.4-1.6-47.6 11.2-47.6 11.2l-32.8 19.6-18-20.8s-22.4-23.2-56-23.2 -58.4 20-58.4 20-29.2-22.4-60-22.4-55.2 24.8-55.2 24.8l-18.8 21.6 -32-19.2s-28-14.8-49.2-12.8c-29.2 2.8-31.2 30.8-31.2 30.8v256s6.8 30.8 36.8 26c26.8-4 43.6-18.4 43.6-18.4l29.6-21.2 25.6 22.8s15.6 12 37.6 12 35.6-10.4 35.6-10.4l30.4-25.2 32.4 26s16.4 11.6 38.4 11.6 38.4-12.8 38.4-12.8l26.4-22.4 28.8 20.8s17.2 15.6 44 11.2c27.6-4.4 30-33.6 30-33.6V152.8C511.6 152.8 458.8 124 433.2 121.6zM149.2 339.2l-37.6 25.2s-3.6 2.4-5.6-2.4c-2-4.4 3.2-10 3.2-10l84-180.8s2.8-6 8.8-4.8c6 1.2 8.4 7.6 8.4 7.6l21.6 169.2s1.2 6.8-4.8 8.8c-6 2-8-4.4-8-4.4L199.6 298h-42.8L149.2 339.2zM281.2 360.4h-34s-6 0.8-7.6-5.2c-1.6-6 4-8.8 4-8.8l77.6-167.6s2.4-6 8.8-5.6c6.4 0.4 8.4 6 8.4 6l79.2 168s4.4 6.8-1.6 10c-6 3.2-9.6-1.6-9.6-1.6l-20.8-45.6H310L281.2 360.4zM263.6 208.8l-26 54.8h52.8L263.6 208.8zM203.2 258.8l-15.6-88-22.4 88H203.2z"></path></svg></span>`);
                    } else if (typeof btn.setHtml === "function") {
                        btn.setHtml(`<span class="md:inline-block"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M433.2 121.6c-18.4-1.6-47.6 11.2-47.6 11.2l-32.8 19.6-18-20.8s-22.4-23.2-56-23.2 -58.4 20-58.4 20-29.2-22.4-60-22.4-55.2 24.8-55.2 24.8l-18.8 21.6 -32-19.2s-28-14.8-49.2-12.8c-29.2 2.8-31.2 30.8-31.2 30.8v256s6.8 30.8 36.8 26c26.8-4 43.6-18.4 43.6-18.4l29.6-21.2 25.6 22.8s15.6 12 37.6 12 35.6-10.4 35.6-10.4l30.4-25.2 32.4 26s16.4 11.6 38.4 11.6 38.4-12.8 38.4-12.8l26.4-22.4 28.8 20.8s17.2 15.6 44 11.2c27.6-4.4 30-33.6 30-33.6V152.8C511.6 152.8 458.8 124 433.2 121.6zM149.2 339.2l-37.6 25.2s-3.6 2.4-5.6-2.4c-2-4.4 3.2-10 3.2-10l84-180.8s2.8-6 8.8-4.8c6 1.2 8.4 7.6 8.4 7.6l21.6 169.2s1.2 6.8-4.8 8.8c-6 2-8-4.4-8-4.4L199.6 298h-42.8L149.2 339.2zM281.2 360.4h-34s-6 0.8-7.6-5.2c-1.6-6 4-8.8 4-8.8l77.6-167.6s2.4-6 8.8-5.6c6.4 0.4 8.4 6 8.4 6l79.2 168s4.4 6.8-1.6 10c-6 3.2-9.6-1.6-9.6-1.6l-20.8-45.6H310L281.2 360.4zM263.6 208.8l-26 54.8h52.8L263.6 208.8zM203.2 258.8l-15.6-88-22.4 88H203.2z"></path></svg></span>`);
                    } else {
                        console.log("[MAL Button] No HTML setter found on element.");
                    }

                    // On Click
                    if (typeof btn.addEventListener === "function") {
                        btn.addEventListener("click", async () => {
                            try {
                                ctx.toast.info("Fetching MAL link...");
                                const animeEntry = await ctx.anime.getAnimeEntry(animeId);
                                const malId = await getMalId(animeEntry.media);

                                if (malId) {
                                    const url = `https://myanimelist.net/anime/${malId}`;
                                    ctx.action.openUrl(url);
                                } else {
                                    ctx.toast.error("No MAL ID found");
                                }
                            } catch (e) {
                                console.error("MAL Click Error", e);
                                ctx.toast.error("Failed to open MAL");
                            }
                        });
                    } else {
                        console.log("[MAL Button] addEventListener is missing on created element.");
                    }

                    // Determine insertion point
                    const anilistLink = await container.queryOne("a[href*='anilist.co']");
                    if (anilistLink) {
                        anilistLink.insertAfter(btn);
                    } else {
                        container.append(btn);
                    }
                    console.log("[MAL Button] Button injected successfully.");

                } else {
                    console.log("[MAL Button] Container not found.");
                }
            } catch (err) {
                console.error("[MAL Button] FATAL ERROR inside injectButton", err);
            }
        };

        // --- Logic ---

        /**
         * Robust MAL ID retrieval
         * Optimized per community feedback to rely on media.idMal
         */
        // @ts-ignore
        async function getMalId(media: $app.AL_BaseAnime): Promise<string | null> {
            // Direct check is sufficient as idMal is always returned if available
            if (media.idMal) return String(media.idMal);
            return null;
        }

        // --- Event Handlers ---

        // This is the key: Run injection on navigation
        // Based on feedback from notwen
        if (ctx.screen && ctx.screen.onNavigate) {
            ctx.screen.onNavigate((data: any) => {
                // console.log("[MAL Button] onNavigate:", data);
                if (!data) return;

                // Handle object with pathname/searchParams (Seanime v2.7+)
                if (typeof data === "object" && (data.pathname || data.path)) {
                    const path = data.pathname || data.path;
                    if (path && (path.includes("/entry") || path.includes("/anime"))) {
                        const searchId = data.searchParams?.id;
                        console.log("[MAL Button] v2.4.8 Navigation detected, ID:", searchId);
                        if (searchId) {
                            // Inject with ID
                            injectButton(Number(searchId));

                            // Also try again after 500ms in case of render delay (using setTimeout if not strictly blocked, 
                            // but since we know it's blocked, we can't. 
                            // We'll trust the DOM is reactive or onNavigate fires after mount).
                            return;
                        }
                    }
                }

                // Legacy string check
                if (typeof data === "string" && data.includes("/anime/")) {
                    injectButton();
                }
            });
        }

        // Initial load check
        injectButton();


    });
}
