<script>
    import { onMount, onDestroy } from 'svelte'
    import Todoist from './lib/components/Todoist.svelte'
    import Weather from './lib/components/Weather.svelte'
    import Links from './lib/components/Links.svelte'
    import Settings from './lib/components/Settings.svelte'

    let showSettings = $state(false)

    let loadTime = $state(0)

    let currentHrs = $state('')
    let currentMin = $state('')
    let currentSec = $state('')
    let currentAmPm = $state('')
    let currentDate = $state('')
    let clockInterval = null

    let weatherComponent
    let todoistComponent

    function updateTime() {
        const now = new Date()

        let hours = now.getHours()
        currentAmPm = hours >= 12 ? 'pm' : 'am'
        hours = hours % 12
        if (hours === 0) hours = 12

        currentHrs = hours.toString().padStart(2, '0')
        currentMin = now.getMinutes().toString().padStart(2, '0')
        currentSec = now.getSeconds().toString().padStart(2, '0')

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

        const now = new Date()
        const msUntilNextSecond = 1000 - now.getMilliseconds()

        setTimeout(() => {
            updateTime()
            clockInterval = setInterval(updateTime, 1000)
        }, msUntilNextSecond)
    }

    function closeSettings() {
        showSettings = false
    }

    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            if (weatherComponent) {
                weatherComponent.loadWeather()
            }
            if (todoistComponent) {
                todoistComponent.loadTasks()
            }
        }
    }

    onMount(() => {
        startClock()

        const perfObserver = new PerformanceObserver((list) => {
            const entry = list.getEntries()[0].toJSON()
            loadTime = entry.duration
        })

        perfObserver.observe({ type: 'navigation', buffered: true })

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            )
        }
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
        <Weather bind:this={weatherComponent} />
        <Todoist bind:this={todoistComponent} />
    </div>
    <br />
    <br />
    <Links />
    <br />
    <br />
    <div class="load-time">load: {loadTime} ms</div>

    <button
        class="settings-btn"
        onclick={() => (showSettings = true)}
        aria-label="Open settings"
    >
        settings
    </button>

    <Settings {showSettings} {closeSettings} />
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
    .load-time {
        color: var(--txt-3);
    }
    .settings-btn {
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 1rem 1.5rem;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 100;
        color: var(--txt-3);
    }
    .settings-btn:hover {
        opacity: 1;
    }
</style>
