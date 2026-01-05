/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

/**
 * MAL Button Plugin for Seanime
 * Adds a MyAnimeList link button to anime details page
 * 
 * @version 1.0.0
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
        });
        malButton.mount();

        // Initialize state
        const malUrlState = ctx.state<string | null>(null);
        const animeNameState = ctx.state<string | null>(null);
        const isLoadingState = ctx.state<boolean>(false);
        const errorState = ctx.state<string | null>(null);

        // Create tray for displaying the link
        const malTray = ctx.newTray({
            tooltipText: "MyAnimeList Link",
            withContent: true,
            width: "600px",
            iconUrl: "https://raw.githubusercontent.com/bruuhim/MAL-Button-Seanime/refs/heads/main/src/icon.png",
        });

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
         * Handle button click - fetch MAL ID and display link
         */
        malButton.onClick(async (event: any) => {
            const media = event.media;

            try {
                isLoadingState.set(true);
                errorState.set(null);

                const malId = await getMalId(media);

                if (malId) {
                    const malUrl = `https://myanimelist.net/anime/${malId}`;
                    const animeName = media.title?.userPreferred || media.title?.english || "Unknown";

                    malUrlState.set(malUrl);
                    animeNameState.set(animeName);

                    ctx.toast.success("✅ MAL Link Ready - Open tray to copy");
                    malTray.open();
                } else {
                    const errorMsg = "❌ No MAL ID found for this anime";
                    errorState.set(errorMsg);
                    ctx.toast.error(errorMsg);
                }
            } catch (error: any) {
                const errorMsg = `Error: ${error?.message || error}`;
                errorState.set(errorMsg);
                ctx.toast.error(errorMsg);
            } finally {
                isLoadingState.set(false);
            }
        });

        /**
         * Render tray content with copy instructions
         */
        malTray.render(() => {
            const url = malUrlState.get();
            const animeName = animeNameState.get();
            const isLoading = isLoadingState.get();
            const error = errorState.get();

            if (error) {
                return malTray.stack({
                    items: [
                        malTray.text("⚠️ Error", {
                            style: {
                                fontSize: "1.1em",
                                fontWeight: "bold",
                                color: "#ff6b6b",
                                marginBottom: "8px",
                            },
                        }),
                        malTray.text(error, {
                            style: {
                                fontSize: "0.9em",
                                color: "#ff6b6b",
                                padding: "12px",
                                background: "rgba(255, 107, 107, 0.1)",
                                borderRadius: "6px",
                                lineHeight: "1.4",
                            },
                        }),
                    ],
                    gap: 0,
                    style: { padding: "16px" },
                });
            }

            if (isLoading) {
                return malTray.stack({
                    items: [
                        malTray.text("⏳ Loading...", {
                            style: {
                                fontSize: "1em",
                                fontWeight: "bold",
                            },
                        }),
                    ],
                    gap: 0,
                    style: { padding: "16px" },
                });
            }

            if (!url) {
                return malTray.stack({
                    items: [
                        malTray.text("Click MAL button to fetch link", {
                            style: {
                                fontSize: "0.95em",
                                color: "#999",
                            },
                        }),
                    ],
                    gap: 0,
                    style: { padding: "16px" },
                });
            }

            return malTray.stack({
                items: [
                    // Anime name
                    malTray.text(animeName || "MyAnimeList", {
                        style: {
                            fontSize: "1.1em",
                            fontWeight: "bold",
                            marginBottom: "12px",
                            color: "#333",
                        },
                    }),

                    // MAL Link
                    malTray.text(url, {
                        style: {
                            fontSize: "0.9em",
                            color: "#2980b9",
                            fontFamily: "monospace",
                            padding: "12px",
                            background: "rgba(41, 128, 185, 0.1)",
                            border: "1px solid rgba(41, 128, 185, 0.3)",
                            borderRadius: "6px",
                            wordBreak: "break-all",
                            lineHeight: "1.5",
                            userSelect: "text",
                            cursor: "text",
                        },
                    }),

                    // Copy instructions
                    malTray.text("📋 How to copy:", {
                        style: {
                            fontSize: "0.85em",
                            fontWeight: "600",
                            marginTop: "12px",
                            color: "#333",
                        },
                    }),

                    malTray.text("1. Select the URL above (triple-click or drag)\n2. Right-click → Copy\n3. Paste anywhere (Ctrl+V / Cmd+V)", {
                        style: {
                            fontSize: "0.8em",
                            color: "#666",
                            lineHeight: "1.6",
                            padding: "8px 0",
                            whiteSpace: "pre-wrap",
                        },
                    }),

                    // Footer note
                    malTray.text("🔗 Or open directly in browser (requires external browser plugin)", {
                        style: {
                            fontSize: "0.75em",
                            color: "#999",
                            marginTop: "8px",
                            fontStyle: "italic",
                        },
                    }),
                ],
                gap: 0,
                style: {
                    padding: "16px",
                    maxWidth: "100%",
                },
            });
        });
    });
}
