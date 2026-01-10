/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button to anime details page with a polished tray UI
 * 
 * @version 2.0.0
 * @author bruuhim
 */

function init() {
    $ui.register((ctx: any) => {
        console.log("[MAL Button] v2.0.0 Initializing...");

        // --- State Management ---
        const malUrlState = ctx.state<string | null>(null);

        // --- UI Components ---

        // Create the Tray
        const malTray = ctx.newTray({
            tooltipText: "MyAnimeList Quick Access",
            iconUrl: "https://raw.githubusercontent.com/bruuhim/MAL-Button-Seanime/refs/heads/main/src/icon.png",
            withContent: true
        });

        // Register the Button on Anime Page
        const malButton = ctx.action.newAnimePageButton({
            label: "MAL",
            icon: "https://raw.githubusercontent.com/bruuhim/MAL-Button-Seanime/refs/heads/main/src/icon.png",
        });
        malButton.mount();

        // --- Logic ---

        /**
         * Robust MAL ID retrieval
         */
        async function getMalId(media: any): Promise<string | null> {
            // 1. Direct check
            if (media.idMal) return String(media.idMal);

            // 2. Deep check via API
            try {
                const animeEntry = await ctx.anime.getAnimeEntry(media.id);
                const fullMedia = animeEntry?.media;
                if (!fullMedia) return null;

                if (fullMedia.idMal) return String(fullMedia.idMal);

                // Check external links array
                if (fullMedia.externalLinks && Array.isArray(fullMedia.externalLinks)) {
                    const malLink = fullMedia.externalLinks.find((l: any) =>
                        l.site?.toLowerCase() === "myanimelist"
                    );
                    if (malLink?.id) return String(malLink.id);
                }
            } catch (err) {
                console.error("[MAL Button] Failed to fetch deep info:", err);
            }

            return null;
        }

        // --- Renderers ---

        malTray.render(() => {
            const url = malUrlState.get();

            if (!url) {
                return malTray.stack([
                    malTray.text("Fetching MAL link...", { className: "text-zinc-400 animate-pulse text-sm" })
                ], { style: { padding: "20px", display: "flex", justifyContent: "center" } });
            }

            return malTray.stack([
                // Header-like text
                malTray.text("MyAnimeList", { className: "text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2" }),

                // The Main Button
                malTray.anchor("Open MyAnimeList", {
                    href: url,
                    className: "bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all p-3 rounded-lg text-center text-sm font-bold no-underline text-white w-full block shadow-lg shadow-blue-900/20"
                }),

                // Extra info/footer
                malTray.text("External Link", { className: "text-[10px] text-zinc-600 mt-2 text-center" })
            ], {
                style: {
                    padding: "16px",
                    background: "linear-gradient(to bottom, #1a1a1a, #121212)",
                    borderRadius: "12px",
                    minWidth: "200px"
                }
            });
        });

        // --- Event Handlers ---

        malButton.onClick(async (event: any) => {
            const media = event.media;
            if (!media) return;

            // Open tray immediately for visual feedback
            malUrlState.set(null); // Reset to show loading
            malTray.open();

            try {
                const malId = await getMalId(media);
                if (malId) {
                    const url = `https://myanimelist.net/anime/${malId}`;
                    malUrlState.set(url);
                } else {
                    ctx.toast.error("❌ No MAL ID found for this anime");
                    malTray.close();
                }
            } catch (error: any) {
                ctx.toast.error("An error occurred while fetching MAL link");
                malTray.close();
            }
        });

    });
}
