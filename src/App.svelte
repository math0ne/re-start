<script>
    import { onMount, onDestroy } from 'svelte'
    import Todoist from './lib/Todoist.svelte'
    import Weather from './lib/Weather.svelte'
    import Links from './lib/Links.svelte'
    import Settings from './lib/Settings.svelte'

    let settings = $state({
        todoistApiToken: '',
        latitude: '',
        longitude: '',
        tempFormat: 'fahrenheit',
        speedFormat: 'mph',
        linksPerColumn: 4,
        links: [
            { title: 'gmail', url: 'https://mail.google.com' },
            { title: 'calendar', url: 'https://calendar.google.com' },
            { title: 'drive', url: 'https://drive.google.com' },
            { title: 'docs', url: 'https://docs.google.com' },
            { title: 'github', url: 'https://github.com' },
            { title: 'slack', url: 'https://slack.com' },
            { title: 'keep', url: 'https://keep.google.com' },
            { title: 'leetcode', url: 'https://leetcode.com/problemset' },
            { title: 'perplexity', url: 'https://perplexity.ai' },
            { title: 'claude', url: 'https://claude.ai' },
            { title: 'aistudio', url: 'https://aistudio.google.com' },
            { title: 'chatgpt', url: 'https://chat.openai.com' },
            { title: 'youtube', url: 'https://youtube.com' },
            { title: 'reddit', url: 'https://reddit.com' },
            { title: 'twitter', url: 'https://x.com' },
            { title: 'feedly', url: 'https://feedly.com' },
        ],
    })
    let showSettings = $state(false)

    let currentHrs = $state('')
    let currentMin = $state('')
    let currentSec = $state('')
    let currentAmPm = $state('')
    let currentDate = $state('')
    let clockInterval = null

    function updateTime() {
        const now = new Date()

        // Convert to 12-hour format
        let hours = now.getHours()
        currentAmPm = hours >= 12 ? 'pm' : 'am'
        hours = hours % 12
        if (hours === 0) hours = 12

        currentHrs = hours.toString().padStart(2, '0')
        currentMin = now.getMinutes().toString().padStart(2, '0')
        currentSec = now.getSeconds().toString().padStart(2, '0')

        // Format date
        currentDate = now
            .toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            .toLowerCase()
    }

    function startClock() {
        updateTime()

        // Calculate milliseconds until next second
        const now = new Date()
        const msUntilNextSecond = 1000 - now.getMilliseconds()

        // Set initial timeout to sync with the next second
        setTimeout(() => {
            updateTime()
            // Now start regular interval that should stay synced
            clockInterval = setInterval(updateTime, 1000)
        }, msUntilNextSecond)
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('settings')
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings)
                settings = { ...settings, ...parsed }
            } catch (e) {
                console.error('failed to get settings from localstorage:', e)
            }
        }
    }

    function closeSettings() {
        showSettings = false
        localStorage.setItem('settings', JSON.stringify(settings))
    }

    onMount(() => {
        loadSettings()
        startClock()
    })

    onDestroy(() => {
        if (clockInterval) {
            clearInterval(clockInterval)
        }
    })
</script>

<main>
    <div class="clock">
        {currentHrs}:{currentMin}:{currentSec}
        <span class="clock-ampm">{currentAmPm}</span>
    </div>
    <div class="date">{currentDate}</div>
    <br />
    <br />
    <div class="widgets">
        <Weather
            latitude={settings.latitude}
            longitude={settings.longitude}
            tempFormat={settings.tempFormat}
            speedFormat={settings.speedFormat}
        />
        {#if settings.todoistApiToken}
            <Todoist token={settings.todoistApiToken} />
        {:else}
            <p>Please configure your Todoist API token in settings</p>
        {/if}
    </div>
    <br />
    <br />
    <Links links={settings.links} linksPerColumn={settings.linksPerColumn} />

    <button
        class="settings-btn"
        onclick={() => (showSettings = true)}
        aria-label="Open settings"
    >
        settings
    </button>

    <!-- Settings Panel -->
    <Settings {showSettings} onClose={closeSettings} {settings} />
</main>

<style>
    main {
        margin: 2rem;
    }
    .clock {
        margin: 0;
        font-size: 3rem;
        font-weight: 300;
        color: var(--txt-1);
        line-height: normal;
    }
    .date {
        margin: 0;
        font-size: 1.5rem;
        color: var(--txt-3);
        line-height: normal;
    }
    .widgets {
        display: flex;
        gap: 6rem;
    }

    .settings-btn {
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 1rem 1.5rem;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 100;
    }

    .settings-btn:hover {
        opacity: 1;
    }
</style>
