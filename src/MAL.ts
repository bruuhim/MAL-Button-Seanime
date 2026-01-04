/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

function init() {
    $ui.register((ctx) => {
        
        // Logging system
        const log = {
            id: "mal-button:logs",
            record(message: [string, "Info" | "Warning" | "Error" | "Log" | "Success"]) {
                $store.set(this.id, [...($store.get(this.id) ?? []), message]);
            },

            getEntries(): [string, "Info" | "Warning" | "Error" | "Log" | "Success"][] {
                return $store.get(this.id) ?? [];
            },

            clearEntries() {
                $store.set(this.id, []);
                this.sendInfo("Log cleared!");
            },

            dateFormat() {
                return new Date().toISOString().slice(0, 19);
            },

            sendError(message: string) {
                this.record([`[${this.dateFormat()}] ${message}`, "Error"]);
                console.error(`[MAL Button] ${message}`);
            },

            sendInfo(message: string) {
                this.record([`[${this.dateFormat()}] ${message}`, "Info"]);
                console.info(`[MAL Button] ${message}`);
            },

            sendWarning(message: string) {
                this.record([`[${this.dateFormat()}] ${message}`, "Warning"]);
                console.warn(`[MAL Button] ${message}`);
            },

            sendSuccess(message: string) {
                this.record([`[${this.dateFormat()}] ${message}`, "Success"]);
                console.log(`[MAL Button] ${message}`);
            },

            send(message: string) {
                this.record([`[${this.dateFormat()}] ${message}`, "Log"]);
                console.log(`[MAL Button] ${message}`);
            },
        };
        
        // Tray for showing logs with icon
        const tray = ctx.newTray({
            tooltipText: "MAL Button Logs",
            withContent: true,
            width: '600px',
            iconUrl: "https://raw.githubusercontent.com/bruuhim/MAL-Button-Seanime/refs/heads/main/src/icon.png",
        });
        
        const showLogsState = ctx.state<boolean>(false);
        
        // Create MAL button with text label
        const malButton = ctx.action.newAnimePageButton({ 
            label: "MAL",
        });
        malButton.mount();
        
        // Handle button clicks
        malButton.onClick(async (event: any) => {
            const media = event.media;
            
            log.sendInfo(`=== MAL Button Click ===`);
            log.send(`Anime: ${media.title.userPreferred}`);
            log.send(`Media ID: ${media.id}`);
            log.send(`idMal field: ${media.idMal}`);
            
            try {
                // First check if media has idMal field directly
                let malId: string | null = null;
                
                if (media.idMal) {
                    malId = String(media.idMal);
                    log.sendSuccess(`Found MAL ID in media.idMal: ${malId}`);
                } else {
                    log.sendInfo(`No idMal in media object, fetching full anime entry...`);
                    
                    // Fetch full media object using ctx.anime.getAnimeEntry
                    const animeEntry = await ctx.anime.getAnimeEntry(media.id);
                    
                    if (!animeEntry || !animeEntry.media) {
                        log.sendError(`Failed to fetch full media object`);
                        ctx.toast.error(`Failed to fetch media data`);
                        showLogsState.set(true);
                        tray.open();
                        return;
                    }
                    
                    const fullMedia = animeEntry.media;
                    log.sendSuccess(`Full media object fetched`);
                    
                    // Check idMal in full object
                    if (fullMedia.idMal) {
                        malId = String(fullMedia.idMal);
                        log.sendSuccess(`Found MAL ID: ${malId}`);
                    } else {
                        log.sendWarning("idMal not found in full media object");
                    }
                    
                    // Try external links as fallback
                    if (!malId && fullMedia.externalLinks && fullMedia.externalLinks.length > 0) {
                        log.send(`Found ${fullMedia.externalLinks.length} external links`);
                        for (const link of fullMedia.externalLinks) {
                            log.send(`  - ${link.site}: ${link.id}`);
                            if (link.site?.toLowerCase() === 'myanimelist') {
                                malId = link.id;
                                log.sendSuccess(`Found MAL ID from external link: ${malId}`);
                                break;
                            }
                        }
                    }
                }
                
                if (malId) {
                    const malUrl = `https://myanimelist.net/anime/${malId}`;
                    log.send(`MAL URL: ${malUrl}`);
                    
                    // Use ctx.command.exec to open link in default browser
                    try {
                        log.send(`Opening link via shell command...`);
                        
                        // Simply pass the URL - let shell handle it
                        // This works on all platforms without needing process
                        const result = await ctx.command.exec(`echo "Opening: ${malUrl}"`);
                        log.send(`Shell ready, opening URL...`);
                        
                        // Now open the URL using platform-agnostic approach
                        // Seanime plugin environment handles this via shell
                        await ctx.command.exec(`${(() => {
                            // Determine command based on common environment variables
                            const env = (globalThis as any).__seanime_env || {};
                            if (process?.platform === 'win32' || env.OS === 'Windows_NT') {
                                return `start "" "${malUrl}"`;
                            } else if (process?.platform === 'darwin' || env.PATH?.includes('/Applications')) {
                                return `open "${malUrl}"`;
                            } else {
                                return `xdg-open "${malUrl}"`;
                            }
                        })()}`);
                        
                        log.sendSuccess("Link opened in browser!");
                        ctx.toast.success(`Opening MAL: ${media.title.userPreferred}`);
                    } catch (execErr: any) {
                        log.sendWarning(`Shell exec failed: ${execErr?.message || execErr}`);
                        log.send(`Attempting fallback: copying URL to clipboard`);
                        
                        // Fallback: copy to clipboard
                        try {
                            await ctx.clipboard?.writeText?.(malUrl);
                            ctx.toast.success(`URL copied: ${malUrl}`);
                            log.sendSuccess(`URL copied to clipboard`);
                        } catch (clipErr: any) {
                            log.sendWarning(`Clipboard failed: ${clipErr?.message || clipErr}`);
                            ctx.toast.info(`MAL: ${malUrl}`);
                        }
                    }
                } else {
                    log.sendError(`No MAL ID found for ${media.title.userPreferred}`);
                    ctx.toast.error(`No MAL link found for ${media.title.userPreferred}`);
                }
            } catch (error: any) {
                log.sendError(`Exception: ${error?.message || error}`);
                ctx.toast.error(`Error: ${error?.message || error}`);
            }
            
            // Show logs after a short delay
            ctx.setTimeout(() => {
                showLogsState.set(true);
                tray.open();
            }, 100);
        });
        
        // Tray icon click to show logs
        tray.onClick(() => {
            showLogsState.set(true);
            tray.open();
        });
        
        // Render logs tray
        tray.render(() => {
            if (!showLogsState.get()) {
                return tray.stack({ items: [tray.text("Click MAL button to see logs")] });
            }
            
            const entries = log.getEntries();
            const header = tray.flex(
                [
                    tray.text("MAL Button Logs", {
                        style: {
                            fontSize: "1.2em",
                            fontWeight: "bold",
                        },
                    }),
                    tray.button("Clear", {
                        size: "sm",
                        intent: "alert-subtle",
                        onClick: ctx.eventHandler('clear-logs', () => {
                            log.clearEntries();
                            tray.update();
                        }),
                    }),
                ],
                {
                    direction: "row",
                    style: {
                        justifyContent: "space-between",
                        marginBottom: "8px",
                    },
                }
            );
            
            const logItems = entries.map(([message, type]) => {
                const color: Record<"Info" | "Warning" | "Error" | "Log" | "Success", string> = {
                    Info: "#00afff",
                    Warning: "#ffff5f",
                    Error: "#ff5f5f",
                    Log: "#bcbcbc",
                    Success: "#5fff5f",
                };
                
                return tray.text(message, {
                    style: {
                        fontFamily: "monospace",
                        fontSize: "12px",
                        color: color[type],
                        lineHeight: "1.2",
                    },
                });
            });
            
            const terminal = tray.div(logItems, {
                style: {
                    height: "400px",
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "6px",
                    padding: "8px",
                    overflowY: "auto",
                    fontFamily: "monospace",
                },
            });
            
            return tray.stack([header, terminal], { gap: 2, style: { padding: "12px" }});
        });
        
        log.sendInfo("MAL Button initialized");
    });
}
