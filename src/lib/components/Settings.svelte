<script>
    import { fly, fade } from 'svelte/transition'
    import { settings, saveSettings } from '../settings-store.svelte.js'

    let { showSettings = false, closeSettings } = $props()

    // @ts-ignore
    const version = __APP_VERSION__

    function addLink() {
        settings.links = [...settings.links, { title: '', url: '' }]
    }

    function removeLink(index) {
        settings.links = settings.links.filter((_, i) => i !== index)
    }

    let draggedIndex = $state(null)
    let dropIndicatorIndex = $state(null)

    function handleDragStart(event, index) {
        draggedIndex = index
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/html', '')
    }

    function handleDragOver(event, index) {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'

        if (draggedIndex === null || draggedIndex === index) {
            dropIndicatorIndex = null
            return
        }

        // Determine if we're dropping above or below the target item
        const rect = event.currentTarget.getBoundingClientRect()
        const midY = rect.top + rect.height / 2
        const isAbove = event.clientY < midY

        // Calculate the drop indicator position
        if (isAbove) {
            dropIndicatorIndex = index
        } else {
            dropIndicatorIndex = index + 1
        }
    }

    function handleDragLeave() {
        dropIndicatorIndex = null
    }

    function handleDrop(event, targetIndex) {
        event.preventDefault()

        if (draggedIndex === null) {
            draggedIndex = null
            dropIndicatorIndex = null
            return
        }

        // Determine final drop position
        const rect = event.currentTarget.getBoundingClientRect()
        const midY = rect.top + rect.height / 2
        const isAbove = event.clientY < midY

        let dropIndex
        if (isAbove) {
            dropIndex = targetIndex
        } else {
            dropIndex = targetIndex + 1
        }

        // Don't move if dropping in the same position
        if (dropIndex === draggedIndex || dropIndex === draggedIndex + 1) {
            draggedIndex = null
            dropIndicatorIndex = null
            return
        }

        const newLinks = [...settings.links]
        const draggedLink = newLinks[draggedIndex]

        // Remove the dragged item
        newLinks.splice(draggedIndex, 1)

        // Adjust drop index if we removed an item before it
        const adjustedDropIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex

        // Insert at new position
        newLinks.splice(adjustedDropIndex, 0, draggedLink)

        settings.links = newLinks
        draggedIndex = null
        dropIndicatorIndex = null
    }

    function handleDragEnd() {
        draggedIndex = null
        dropIndicatorIndex = null
    }

    function handleClose() {
        saveSettings(settings)
        closeSettings()
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            handleClose()
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showSettings}
    <div
        class="backdrop"
        onclick={handleClose}
        onkeydown={(e) => e.key === 'Enter' && handleClose()}
        role="button"
        tabindex="0"
        transition:fade={{ duration: 200 }}
    ></div>

    <div class="settings" transition:fly={{ x: 640, duration: 200 }}>
        <div class="header">
            <h2>settings</h2>
            <button class="close-btn" onclick={handleClose}>×</button>
        </div>

        <div class="content">
            <div class="group">
                <div class="setting-label">time format</div>
                <div class="radio-group">
                    <label class="radio-label">
                        <input
                            type="radio"
                            bind:group={settings.timeFormat}
                            value="12hr"
                        />
                        12 hour
                    </label>
                    <label class="radio-label">
                        <input
                            type="radio"
                            bind:group={settings.timeFormat}
                            value="24hr"
                        />
                        24 hour
                    </label>
                </div>
            </div>
            <div class="group">
                <label for="todoist-token">todoist api token</label>
                <input
                    id="todoist-token"
                    type="password"
                    bind:value={settings.todoistApiToken}
                />
            </div>
            <div class="group">
                <label for="latitude">latitude</label>
                <input
                    id="latitude"
                    type="number"
                    bind:value={settings.latitude}
                    step="0.01"
                />
            </div>
            <div class="group">
                <label for="longitude">longitude</label>
                <input
                    id="longitude"
                    type="number"
                    bind:value={settings.longitude}
                    step="0.01"
                />
            </div>
            <div class="group">
                <div class="setting-label">temperature format</div>
                <div class="radio-group">
                    <label class="radio-label">
                        <input
                            type="radio"
                            bind:group={settings.tempUnit}
                            value="fahrenheit"
                        />
                        fahrenheit
                    </label>
                    <label class="radio-label">
                        <input
                            type="radio"
                            bind:group={settings.tempUnit}
                            value="celsius"
                        />
                        celsius
                    </label>
                </div>
            </div>
            <div class="group">
                <div class="setting-label">speed format</div>
                <div class="radio-group">
                    <label class="radio-label">
                        <input
                            type="radio"
                            bind:group={settings.speedUnit}
                            value="mph"
                        />
                        mph
                    </label>
                    <label class="radio-label">
                        <input
                            type="radio"
                            bind:group={settings.speedUnit}
                            value="kmh"
                        />
                        kmh
                    </label>
                </div>
            </div>
            <div class="group">
                <label for="linksPerColumn">links per column</label>
                <input
                    id="linksPerColumn"
                    type="number"
                    bind:value={settings.linksPerColumn}
                    step="1"
                />
            </div>
            <div class="group">
                <div class="links-header">
                    <div class="setting-label">links</div>
                    <button class="add-btn" onclick={addLink}>add link</button>
                </div>
                <div class="links-list">
                    {#each settings.links as link, index}
                        {#if dropIndicatorIndex === index && draggedIndex !== null}
                            <div class="drop-indicator"></div>
                        {/if}
                        <div
                            class="link"
                            class:dragging={draggedIndex === index}
                            draggable="true"
                            role="button"
                            tabindex="0"
                            ondragstart={(e) => handleDragStart(e, index)}
                            ondragover={(e) => handleDragOver(e, index)}
                            ondragleave={handleDragLeave}
                            ondrop={(e) => handleDrop(e, index)}
                            ondragend={handleDragEnd}
                        >
                            <div class="drag-handle" title="Drag to reorder">
                                <div class="drag-dots">
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                </div>
                            </div>
                            <input
                                type="text"
                                bind:value={link.title}
                                placeholder="title"
                                class="link-input name"
                            />
                            <input
                                type="url"
                                bind:value={link.url}
                                placeholder="https://example.com"
                                class="link-input"
                            />
                            <button
                                class="remove-btn"
                                onclick={() => removeLink(index)}
                            >
                                ×
                            </button>
                        </div>
                        {#if dropIndicatorIndex === settings.links.length && index === settings.links.length - 1 && draggedIndex !== null}
                            <div class="drop-indicator"></div>
                        {/if}
                    {/each}
                </div>
            </div>
            <div class="version">
                re-start
                {#if version}v{version}
                {/if} • made with ❤️ by
                <a href="https://refact0r.dev" target="_blank">refact0r</a>
                •
                <a href="https://github.com/refact0r/re-start" target="_blank"
                    >github</a
                >
            </div>
        </div>
    </div>
{/if}

<style>
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
    }
    .settings {
        position: fixed;
        top: 0;
        right: 0;
        width: 40rem;
        height: 100%;
        background: var(--bg-1);
        border-left: 2px solid var(--bg-3);
        z-index: 1000;
        display: flex;
        flex-direction: column;
    }
    .header {
        padding: 0.75rem 1rem 0.75rem 1.5rem;
        border-bottom: 2px solid var(--bg-3);
        display: flex;
        justify-content: space-between;
        align-items: center;

        h2 {
            margin: 0;
        }
    }
    .close-btn {
        padding: 0 0.5rem;
        font-size: 1.75rem;
        line-height: 2.25rem;
        font-weight: 300;
    }
    .content {
        flex: 1;
        padding: 1.5rem;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--bg-3) var(--bg-1);
    }
    .group {
        margin-bottom: 1.5rem;
    }
    .group > label,
    .setting-label {
        display: block;
        margin-bottom: 0.5rem;
    }
    .group input[type='text'],
    .group input[type='password'],
    .group input[type='number'],
    .group input[type='url'] {
        width: 100%;
        padding: 0.5rem;
        background: var(--bg-2);
        border: 2px solid var(--bg-3);
    }
    .links-header {
        display: flex;
        justify-content: space-between;
    }
    .add-btn {
        height: 1.5rem;
    }
    .link {
        display: flex;
        margin-bottom: 0.5rem;
        align-items: center;
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    .link.dragging {
        opacity: 0.5;
        transform: rotate(2deg);
    }
    .drop-indicator {
        height: 2px;
        background: var(--txt-2);
        margin: 0.25rem 0;
        border-radius: 1px;
        box-shadow: 0 0 4px var(--txt-2);
        animation: pulse 1s ease-in-out infinite alternate;
    }
    @keyframes pulse {
        from { opacity: 0.6; }
        to { opacity: 1; }
    }
    .drag-handle {
        cursor: grab;
        padding: 0.5rem 0.25rem;
        margin-right: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .drag-handle:active {
        cursor: grabbing;
    }
    .drag-dots {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2px;
        width: 8px;
        height: 12px;
    }
    .dot {
        width: 2px;
        height: 2px;
        background-color: var(--txt-3);
        border-radius: 50%;
    }
    .drag-handle:hover .dot {
        background-color: var(--txt-2);
    }
    .link-input.name {
        width: 12rem;
        margin-right: 0.5rem;
    }
    .remove-btn {
        padding-left: 0.5rem;
        font-size: 1.5rem;
        font-weight: 300;
    }
    .version {
        color: var(--txt-3);
    }
</style>
