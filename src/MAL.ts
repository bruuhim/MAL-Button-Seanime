/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

function init() {
    $ui.register((ctx) => {
        
        // Create MAL button
        const malButton = ctx.action.newAnimePageButton({ 
            label: "MAL",
        });
        malButton.mount();
        
        // State for MAL URL
        const malUrlState = ctx.state<string | null>(null);
        const animeNameState = ctx.state<string | null>(null);
        const copiedState = ctx.state<boolean>(false);
        
        // Tray to show the link
        const malTray = ctx.newTray({
            tooltipText: "MAL Link",
            withContent: true,
            width: '550px',
            iconUrl: "https://raw.githubusercontent.com/bruuhim/MAL-Button-Seanime/refs/heads/main/src/icon.png",
        });
        
        // Handle button click
        malButton.onClick(async (event: any) => {
            const media = event.media;
            
            try {
                let malId: string | null = null;
                
                if (media.idMal) {
                    malId = String(media.idMal);
                } else {
                    const animeEntry = await ctx.anime.getAnimeEntry(media.id);
                    
                    if (animeEntry?.media) {
                        const fullMedia = animeEntry.media;
                        if (fullMedia.idMal) {
                            malId = String(fullMedia.idMal);
                        } else if (fullMedia.externalLinks) {
                            for (const link of fullMedia.externalLinks) {
                                if (link.site?.toLowerCase() === 'myanimelist') {
                                    malId = link.id;
                                    break;
                                }
                            }
                        }
                    }
                }
                
                if (malId) {
                    const url = `https://myanimelist.net/anime/${malId}`;
                    malUrlState.set(url);
                    animeNameState.set(media.title.userPreferred);
                    copiedState.set(false);
                    ctx.toast.success(`📌 Click link to copy`);
                    malTray.open();
                } else {
                    ctx.toast.error(`No MAL ID found`);
                }
            } catch (error: any) {
                ctx.toast.error(`Error: ${error?.message || error}`);
            }
        });
        
        // Render tray with link
        malTray.render(() => {
            const url = malUrlState.get();
            const animeName = animeNameState.get();
            const copied = copiedState.get();
            
            if (!url) {
                return malTray.stack({
                    items: [malTray.text("Click MAL button to get link")],
                });
            }
            
            return malTray.stack({
                items: [
                    malTray.text(animeName || "MyAnimeList", {
                        style: {
                            fontSize: "1em",
                            fontWeight: "bold",
                            marginBottom: "12px",
                        },
                    }),
                    malTray.button(url, {
                        intent: copied ? "success" : "primary",
                        onClick: ctx.eventHandler('copy-mal-link', () => {
                            // Store in window object for clipboard access
                            (window as any).malLinkToCopy = url;
                            copiedState.set(true);
                            ctx.toast.success("Copied! Paste in browser.");
                            // Reset after 2 seconds
                            ctx.setTimeout(() => {
                                copiedState.set(false);
                                malTray.update();
                            }, 2000);
                        }),
                        style: {
                            fontSize: "0.95em",
                            padding: "12px 16px",
                            wordBreak: "break-all",
                        },
                    }),
                    malTray.text(copied ? "✓ Copied to clipboard!" : "Click to copy link", {
                        style: {
                            fontSize: "0.85em",
                            color: copied ? "#4ade80" : "#888",
                            marginTop: "8px",
                        },
                    }),
                ],
                gap: 0,
                style: {
                    padding: "16px",
                },
            });
        });
    });
}
