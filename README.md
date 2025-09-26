# re-start

a tui-style browser startpage, built with svelte.

features:

- todoist tasks integration
- weather (from open-meteo) with 5-day temperature graph
- drag-and-drop customizable quick links
- stats (load time, ping, fps, viewport size)
- lightweight & performant (&lt;90kb including fonts, loads in &lt;50ms)

## customizations in this fork

- **temperature graph**: visual 5-day weather forecast chart integrated into weather widget
- **drag-and-drop links**: reorder links in settings using drag-and-drop interface
- **same-tab navigation**: links open in current tab instead of new tabs
- **automated build**: post-build script automatically removes chrome-specific manifest entries

### weather widget with temperature graph
![Weather widget showing 5-day temperature graph](Screenshot%202025-09-26%20125553.png)

<img width="2331" height="1319" alt="image" src="https://github.com/user-attachments/assets/e3164af7-fc42-4caf-81ee-a049e05b84c7" />

## installation

### firefox

1. download the latest .xpi file from the `releases` folder.
2. go to the firefox extensions manager (`about:addons`)
3. click the gear icon in the top right.
4. click "Install Add-on From File" and select the .xpi file you downloaded.
5. make sure to click "Add" and "Keep Changes".

### chrome/edge

1. clone/download this repo.
2. run `npm i` (you must have node.js).
3. run `npm run build`. you should see it create a `dist` folder.
   - note: the build script now automatically removes chrome-incompatible manifest entries
4. go to the chrome extensions manager (`chrome://extensions`).
5. turn on developer mode in the top right.
6. click "Load unpacked" in the top left.
7. select the `dist` folder.

### development / building from source

1. clone/download this repo.
2. run `npm i` (you must have node.js).
3. run `npm run dev` to start in development mode. the page will run at `http://localhost:5173`.
4. run `npm run build` to build for production.

## usage tips

- hover your cursor on the top right corner of the startpage, and you should see a settings button appear. click it to configure settings.
- to get your todoist api token, open the todoist website and click your profile in the top left. then go to "Settings" > "Integrations" > "Developer" > "Copy API Token".
- the 'x tasks' text is also a clickable link to todoist.
- you can force a refresh of the weather and todoist widgets by clicking the top left panel labels.
- the ping stat is based on how long a request to <https://www.google.com/generate_204> takes. don't take it too seriously.
- here's a matching [firefox color theme](https://color.firefox.com/?theme=XQAAAAK3BAAAAAAAAABBqYhm849SCicxcUhA3DJozHnOMuotJJDtxcajvY2nrbwtWf53IW6FuMhmsQBmHjQtYV0LyoGIJnESUiSA8WGCMfXU1SYqmE_CaU8iA8bQXAYc2jrXIT6bjoi8T-cSTCi2_9o7kcESfauVKnMZKEKJIeeuT9qsP4Z_T2ya4LBqvZWjm1-pHOmWMq1OU0wrgs4bkzHQWozn4dcm22eBmWyWR55FkcmEsPvvHzhHCZ2ZMQrPXQqrOBLr79GTkJUGa5oslhWTp2LYqdD2gNQ1a8_c5-F91bPVmQerXZWpp-OZ11D1Ai6t1ydqjbVKD3RrGXYJwhcQaAxCKa_ft4VoGrVBq8AXYeJOZdXuOxnYXGhOXXSK_NybBfJLm-2W28qSSdoiW0pTL-iFan3xQQeC0WlSrnRYrRjh7HkgLuI-Ft8Fq5kNC7nVXoo8j9Ml_q2AO_RhE116j_MECbspxaJP58juayX_wNty3V2g5zUsf0gSqpEWGT02oZAF2z6LABKRWTO28wIoMUDvj9WAQGsup95WAmNW7g4WMEIgaiJhmBz9koq0wV7gHQtJB_0x2lJ7WQ488bJi8LvqnW-VT3kZ3GJtyv-yXmRJ)!
