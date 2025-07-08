<script>
    import { fly, fade } from 'svelte/transition'

    let { showSettings = false, onClose = () => {}, settings = {} } = $props()

    function addLink() {
        settings.links = [...settings.links, { title: '', url: '' }]
    }

    function removeLink(index) {
        settings.links = settings.links.filter((_, i) => i !== index)
    }

    function handleClose() {
        onClose()
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
                    step="any"
                />
            </div>
            <div class="group">
                <label for="longitude">longitude</label>
                <input
                    id="longitude"
                    type="number"
                    bind:value={settings.longitude}
                    placeholder="e.g. -74.0060"
                    step="any"
                />
            </div>
            <div class="group">
                <div class="setting-label">temperature format</div>
                <div class="radio-group">
                    <label class="radio-label">
                        <input
                            type="radio"
                            bind:group={settings.tempFormat}
                            value="fahrenheit"
                        />
                        fahrenheit
                    </label>
                    <label class="radio-label">
                        <input
                            type="radio"
                            bind:group={settings.tempFormat}
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
                            bind:group={settings.speedFormat}
                            value="mph"
                        />
                        mph
                    </label>
                    <label class="radio-label">
                        <input
                            type="radio"
                            bind:group={settings.speedFormat}
                            value="kmh"
                        />
                        kph
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
                    <button class="add-btn" onclick={addLink}>+ add</button>
                </div>

                <div class="links-list">
                    {#each settings.links as link, index}
                        <div class="link-item">
                            <input
                                type="text"
                                bind:value={link.title}
                                placeholder="title"
                                class="link-input"
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
                    {/each}
                </div>
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
        background: rgba(0, 0, 0, 0.3);
        z-index: 999;
    }

    .settings {
        position: fixed;
        top: 0;
        right: 0;
        width: 40rem;
        height: 100%;
        background: var(--bg-1);
        border-left: 1px solid var(--bg-2);
        z-index: 1000;
        display: flex;
        flex-direction: column;
    }

    .header {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--bg-2);
        display: flex;
        justify-content: space-between;
        align-items: center;

        h2 {
            margin: 0;
        }
    }

    .close-btn {
        font-size: 1.5rem;
        color: var(--txt-3);
        padding: 0.5rem;
        line-height: 1;

        &:hover {
            color: var(--txt-1);
        }
    }

    .content {
        flex: 1;
        padding: 1.5rem;
        overflow-y: auto;
    }

    .group {
        margin-bottom: 1.5rem;
    }

    .group label,
    .setting-label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--txt-2);
        font-size: 0.9rem;
    }

    .group input[type='text'],
    .group input[type='password'],
    .group input[type='number'],
    .group input[type='url'] {
        width: 100%;
        padding: 0.75rem;
        background: var(--bg-1);
        border: 1px solid var(--bg-3);
        border-radius: 0;
        color: var(--txt-2);
        font-family: inherit;
        font-size: 0.9rem;
    }

    .group input:focus {
        outline: none;
        border-color: var(--txt-3);
    }

    .radio-group {
        display: flex;
        gap: 1rem;
    }

    .radio-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .radio-label input[type='radio'] {
        margin: 0;
    }

    .links-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .add-btn {
        background: var(--bg-3);
        border: 1px solid var(--bg-4);
        color: var(--txt-2);
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-size: 0.8rem;
    }

    .add-btn:hover {
        background: var(--bg-4);
    }

    .links-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .link-item {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .link-input {
        flex: 1;
        padding: 0.5rem;
        background: var(--bg-1);
        border: 1px solid var(--bg-3);
        color: var(--txt-2);
        font-family: inherit;
        font-size: 0.8rem;
    }

    .link-input:focus {
        outline: none;
        border-color: var(--txt-3);
    }

    .remove-btn {
        background: none;
        border: none;
        color: var(--txt-3);
        cursor: pointer;
        padding: 0.5rem;
        font-size: 1rem;
        line-height: 1;
    }

    .remove-btn:hover {
        color: var(--txt-1);
    }
</style>
