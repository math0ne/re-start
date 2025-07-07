<script>
    import { onMount, onDestroy } from 'svelte'
    import TodoistWidget from './lib/TodoistWidget.svelte'

    // Get API token from environment variables
    const apiToken = import.meta.env.VITE_TODOIST_API_TOKEN

    // Clock state
    let currentHrs = $state('')
    let currentMin = $state('')
    let currentSec = $state('')
    let currentDate = $state('')
    let clockInterval = null

    function updateTime() {
        const now = new Date()

        // Format time (HH:MM:SS) and replace colons with styled spans
        currentHrs = now.getHours().toString().padStart(2, '0')
        currentMin = now.getMinutes().toString().padStart(2, '0')
        currentSec = now.getSeconds().toString().padStart(2, '0')

        // Format date (e.g., "Sunday, July 6, 2025")
        currentDate = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
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
    <h1 class="clock">
        {currentHrs}:{currentMin}<span class="clock-sec">:{currentSec}</span>
    </h1>
    <h2 class="date">{currentDate}</h2>
    {#if apiToken}
        <TodoistWidget token={apiToken} />
    {:else}
        <p>Please add your Todoist API token to the .env file</p>
    {/if}
</main>

<style>
    main {
        margin: 2rem;
    }
    .clock {
        margin: 0;
        font-size: 3rem;
        letter-spacing: -0.02ch;
        font-variant-numeric: tabular-nums;
        font-feature-settings: 'tnum';
    }
    .clock-sec {
        font-size: 2.25rem;
    }
    .date {
        margin: 0;
        font-size: 1.5rem;
        color: var(--txt-3);
    }
</style>
