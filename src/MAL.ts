/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button to anime details page with a polished tray UI
 * 
 * @version 2.2.2
 * @author bruuhim
 */

function init() {
    $ui.register((ctx: any) => {
        console.log("[MAL Button] v2.2.2 Initializing...");

        // --- State Management ---
        const malUrlState = ctx.state<string | null>(null);
        // We need a specific state for the tray loading if we want to show a spinner there
        const malTrayState = ctx.state<{ loading: boolean }>({ loading: false });

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
         * Optimized per community feedback to rely on media.idMal
         */
        // @ts-ignore
        async function getMalId(media: $app.AL_BaseAnime): Promise<string | null> {
            // Direct check is sufficient as idMal is always returned if available
            if (media.idMal) return String(media.idMal);
            return null;
        }

        // --- Renderers ---

        malTray.render(() => {
            const url = malUrlState.get();
            const loading = malTrayState.get()?.loading || false;

            if (loading) {
                return malTray.stack([
                    malTray.text("Fetching MAL link...", { className: "text-center text-sm animate-pulse text-zinc-400 py-4" })
                ], { style: { padding: "20px", display: "flex", justifyContent: "center" } });
            }

            if (!url) {
                return malTray.stack([
                    malTray.text("No MAL ID found", { className: "text-center text-red-400 font-bold py-4" }),
                    malTray.text("Try copying the name manually.", { className: "text-center text-xs text-zinc-500" })
                ], { style: { padding: "16px" } });
            }

            return malTray.stack([
                // Header-like text
                malTray.text("MyAnimeList", { className: "text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2" }),

                // The Main Button
                malTray.anchor("Open MyAnimeList", {
                    href: url,
                    className: "bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all p-3 rounded-lg text-center text-sm font-bold no-underline text-white w-full block shadow-lg shadow-blue-900/20"
                })
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
            malTray.open();

            // Set loading state in tray
            malTrayState.set({ loading: true });

            try {
                // If we already have the URL, just stop loading (tray will render link)
                if (malUrlState.get()) {
                    malTrayState.set({ loading: false });
                    return;
                }

                // Fetch ID
                const malId = await getMalId(media);

                if (malId) {
                    const malUrl = `https://myanimelist.net/anime/${malId}`;
                    malUrlState.set(malUrl);
                }
            } catch (error) {
                console.error("[MAL Button] Error:", error);
                ctx.toast.error("Failed to find MAL ID");
            } finally {
                malTrayState.set({ loading: false });
            }
        });

    });
}
