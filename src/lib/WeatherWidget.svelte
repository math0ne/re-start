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
    {#if isLoading}
        <p>Loading weather data...</p>
    {:else if error}
        <p class="error">Error: {error}</p>
        <button onclick={loadWeatherData}>Retry</button>
    {:else if currentWeather}
        <!-- Current Weather -->
        <div class="current-weather">
            <div class="current-info">
                <p>
                    {currentWeather.description}
                </p>
                <p>
                    {currentWeather.temperature_2m}°C
                </p>
                <p>
                    <strong>Humidity:</strong>
                    {currentWeather.relative_humidity_2m}%
                </p>
                <p>
                    <strong>Precipitation:</strong>
                    {currentWeather.precipitation_probability}%
                </p>
                <p>
                    <strong>Wind Speed:</strong>
                    {currentWeather.wind_speed_10m} km/h
                </p>
            </div>
        </div>

        <!-- Hourly Forecasts -->
        <div class="hourly-forecast">
            <h4>Upcoming Forecast</h4>
            <div class="forecast-list">
                {#each hourlyForecasts as forecast}
                    <div class="forecast-item">
                        <span class="forecast-time"
                            >{forecast.formattedTime}</span
                        >
                        <span class="forecast-temp"
                            >{forecast.temperature}°C</span
                        >
                        <span class="forecast-weather"
                            >{forecast.description}</span
                        >
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
</style>
