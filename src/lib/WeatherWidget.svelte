<script>
    import { onMount } from 'svelte'
    import WeatherAPI from './WeatherAPI.js'

    // Props
    let { latitude, longitude } = $props()

    // State variables
    let currentWeather = $state(null)
    let hourlyForecasts = $state([])
    let isLoading = $state(true)
    let error = $state(null)

    const weatherAPI = new WeatherAPI(latitude, longitude)

    // Load weather data
    async function loadWeatherData() {
        try {
            isLoading = true
            error = null

            const data = await weatherAPI.getWeather()
            currentWeather = data.current
            hourlyForecasts = data.hourlyForecasts
        } catch (err) {
            error = err.message
        } finally {
            isLoading = false
        }
    }

    onMount(() => {
        loadWeatherData()
    })
</script>

<div class="weather-widget">
    {#if isLoading}{:else if error}
        <p class="error">error: {error}</p>
        <button onclick={loadWeatherData}>retry</button>
    {:else if currentWeather}
        <div class="temp">{currentWeather.temperature_2m}°</div>
        <div class="weather">{currentWeather.description}</div>
        <br />
        <div class="stats">
            <div class="col">
                <div>
                    humi <span class="value"
                        >{currentWeather.relative_humidity_2m}%</span
                    >
                </div>
                <div>
                    prec <span class="value"
                        >{currentWeather.precipitation_probability}%</span
                    >
                </div>
            </div>
            <div class="col">
                <div>
                    wind <span class="value"
                        >{currentWeather.wind_speed_10m} mph</span
                    >
                </div>
                <div>
                    feel <span class="value"
                        >{currentWeather.apparent_temperature}°</span
                    >
                </div>
            </div>
        </div>
        <br />
        <div class="forecast">
            <div class="col">
                {#each hourlyForecasts as forecast}
                    <div class="forecast-time">{forecast.formattedTime}</div>
                {/each}
            </div>
            <div class="col">
                {#each hourlyForecasts as forecast}
                    <div class="forecast-temp">{forecast.temperature}°</div>
                {/each}
            </div>
            <div class="col">
                {#each hourlyForecasts as forecast}
                    <div class="forecast-weather">{forecast.description}</div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .temp {
        font-size: 2rem;
        font-weight: 300;
        color: var(--txt-1);
        line-height: normal;
    }
    .weather {
        font-size: 1.25rem;
        color: var(--txt-3);
    }
    .value {
        color: var(--txt-1);
    }
    .stats {
        display: flex;
        gap: 2rem;
    }
    .forecast {
        display: flex;
        gap: 2rem;
    }
    .forecast-time {
        text-align: end;
    }
    .forecast-temp {
        text-align: end;
        color: var(--txt-1);
    }
    .forecast-weather {
        color: var(--txt-3);
    }
</style>
