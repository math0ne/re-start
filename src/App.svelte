<script>
    import { onMount, onDestroy } from 'svelte'
    import TodoistWidget from './lib/TodoistWidget.svelte'
    import WeatherWidget from './lib/WeatherWidget.svelte'

    // Get API token from environment variables
    const apiToken = import.meta.env.VITE_TODOIST_API_TOKEN
    const latitude = import.meta.env.VITE_LATITUDE
    const longitude = import.meta.env.VITE_LONGITUDE

    // Clock state
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
        if (hours === 0) hours = 12 // Convert 0 to 12 for 12am/12pm

        currentHrs = hours.toString().padStart(2, '0')
        currentMin = now.getMinutes().toString().padStart(2, '0')
        currentSec = now.getSeconds().toString().padStart(2, '0')

        // Format date (e.g., "Sunday, July 6, 2025")
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

    onMount(() => {
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
        <WeatherWidget {latitude} {longitude} />
        {#if apiToken}
            <TodoistWidget token={apiToken} />
        {:else}
            <p>Please add your Todoist API token to the .env file</p>
        {/if}
    </div>
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
        gap: 4rem;
    }
</style>
