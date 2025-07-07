import descriptions from './descriptions.json'

/**
 * OpenMeteo Weather API client with data processing utilities
 */
class WeatherAPI {
    constructor(latitude, longitude) {
        this.baseUrl = 'https://api.open-meteo.com/v1/forecast'
        this.latitude = latitude
        this.longitude = longitude
    }

    /**
     * Get processed weather data including current conditions and hourly forecasts
     */
    async getWeather() {
        const rawData = await this._fetchWeatherData()

        return {
            current: this._processCurrentWeather(rawData.current),
            hourlyForecasts: this._processHourlyForecast(
                rawData.hourly,
                rawData.current.time
            ),
        }
    }

    /**
     * Private method to fetch raw weather data from API
     */
    async _fetchWeatherData() {
        const params = new URLSearchParams({
            latitude: this.latitude.toString(),
            longitude: this.longitude.toString(),
            hourly: 'temperature_2m,weather_code,is_day',
            current:
                'temperature_2m,weather_code,relative_humidity_2m,precipitation_probability,wind_speed_10m,is_day',
            timezone: 'auto',
            forecast_hours: '24',
        })

        const response = await fetch(`${this.baseUrl}?${params}`)

        if (!response.ok) {
            throw new Error(`open-meteo fetch failed: ${response.status}`)
        }

        return await response.json()
    }

    /**
     * Process current weather data with descriptions
     */
    _processCurrentWeather(currentData) {
        return {
            ...currentData,
            description: this._getWeatherDescription(
                currentData.weather_code,
                currentData.is_day === 1
            ),
        }
    }

    /**
     * Process hourly forecast to get every 3rd hour starting 3 hours from current hour
     */
    _processHourlyForecast(hourlyData, currentTime) {
        const currentHour = new Date(currentTime).getHours()
        const forecasts = []

        // Find the current hour in the forecast
        let currentIndex = 0
        for (let i = 0; i < hourlyData.time.length; i++) {
            const forecastHour = new Date(hourlyData.time[i]).getHours()
            if (forecastHour >= currentHour) {
                currentIndex = i
                break
            }
        }

        // Get forecasts every 3 hours starting from 3 hours after current, up to 5 forecasts
        for (
            let i = 0;
            i < 5 && currentIndex + (i + 1) * 3 < hourlyData.time.length;
            i++
        ) {
            const index = currentIndex + (i + 1) * 3
            forecasts.push({
                time: hourlyData.time[index],
                temperature: hourlyData.temperature_2m[index],
                weatherCode: hourlyData.weather_code[index],
                description: this._getWeatherDescription(
                    hourlyData.weather_code[index],
                    hourlyData.is_day[index] === 1
                ),
                formattedTime: this._formatTime(hourlyData.time[index]),
            })
        }

        return forecasts
    }

    /**
     * Get weather description from code
     */
    _getWeatherDescription(weatherCode, isDay = true) {
        const timeOfDay = isDay ? 'day' : 'night'
        return (
            descriptions[weatherCode]?.[timeOfDay]?.description ||
            `Code ${weatherCode}`
        )
    }

    /**
     * Format time to display (e.g., "2 PM")
     */
    _formatTime(timeString) {
        const date = new Date(timeString)
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
        })
    }
}

export default WeatherAPI
