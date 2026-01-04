/// <reference path="./plugin.d.ts" />
/// <reference path="./app.d.ts" />

function init() {
    $ui.register((ctx) => {
        
        // Create tray for confirmation modal
        const tray = ctx.newTray({
            tooltipText: "MAL",
            withContent: true,
            width: '400px',
        });
        
        // State for MAL URL confirmation
        const confirmUrl = ctx.state<{ url: string; title: string } | null>(null);
        
        // Create MAL button
        const malButton = ctx.action.newAnimePageButton({ label: "MAL" });
        malButton.mount();
        
        // Handle button clicks
        malButton.onClick(async (event) => {
            const media = event.media;
            
            // Try to find MAL ID from external links
            const malLink = media.externalLinks?.find((link: any) => 
                link.site?.toLowerCase() === 'myanimelist'
            );
            
            if (malLink?.id) {
                const malId = malLink.id;
                const malUrl = `https://myanimelist.net/anime/${malId}`;
                confirmUrl.set({ url: malUrl, title: media.title.userPreferred });
                tray.open();
            } else {
                ctx.toast.alert(`Could not find MAL entry for ${media.title.userPreferred}`);
            }
        });
        
        // Render tray with confirmation modal
        tray.render(() => {
            const confirmed = confirmUrl.get();
            
            if (!confirmed) {
                return tray.stack({ items: [tray.text("No anime selected")] });
            }
            
            return tray.stack([
                tray.text(`Open ${confirmed.title} on MAL?`, { isBold: true, size: 'lg' }),
                tray.flex([
                    tray.anchor({
                        text: "Open MAL",
                        href: confirmed.url,
                        target: "_blank",
                        className: "bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md px-4 py-2 transition-colors no-underline"
                    }),
                    tray.button({
                        label: "Cancel",
                        intent: "gray",
                        onClick: ctx.eventHandler('cancel-mal', () => {
                            confirmUrl.set(null);
                            tray.close();
                        })
                    })
                ], { style: { gap: '8px', justifyContent: 'center', marginTop: '12px' }})
            ], { style: { gap: '8px', alignItems: 'center', padding: '16px' }});
        });
    });
}
