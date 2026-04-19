const form = document.getElementById('weatherForm')
const searchInput = document.querySelector('.search-input')
const weatherCard = document.querySelector('.weather-card')
const cityEl = document.getElementById('city')
const dateEl = document.getElementById('date')
const iconEl = document.getElementById('icon')
const tempEl = document.getElementById('temp')
const descEl = document.getElementById('desc')
const humEl = document.getElementById('hum')
const windEl = document.getElementById('wind')
const feelsEl = document.getElementById('feels')
const searchBtn = document.querySelector('.search-btn')

const weatherIcons = {
    'sunny': '☀️',
    'clear': '☀️',
    'partly cloudy': '⛅',
    'cloudy': '☁️',
    'overcast': '☁️',
    'mist': '🌫️',
    'fog': '🌫️',
    'rain': '🌧️',
    'drizzle': '🌦️',
    'shower': '🌦️',
    'snow': '❄️',
    'sleet': '🌨️',
    'thunder': '⛈️',
    'storm': '⛈️',
    'blizzard': '❄️',
    'haze': '🌫️',
    'wind': '💨️',
}

function getIcon(description) {
    if (!description) return '🌡️'
    const lower = description.toLowerCase()
    for (const [keyword, emoji] of Object.entries(weatherIcons)) {
        if (lower.includes(keyword)) return emoji
    }
    return '🌡️'
}

function formatDate() {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    })
}

function setLoading(isLoading) {
    searchBtn.textContent = isLoading ? 'Loading...' : 'Search'
    searchBtn.disabled = isLoading
    searchBtn.style.opacity = isLoading ? '0.6' : '1'
}

function showError(message) {
    // Remove any existing error
    const existing = document.querySelector('.msg--error')
    if (existing) existing.remove()

    const err = document.createElement('p')
    err.className = 'msg msg--error'
    err.textContent = message
    form.insertAdjacentElement('afterend', err)

    // Hide weather card
    if (weatherCard) weatherCard.style.display = 'none'
}

function clearError() {
    const existing = document.querySelector('.msg--error')
    if (existing) existing.remove()
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const address = searchInput.value.trim()
        if (!address) return

        clearError()
        setLoading(true)

        fetch(`/weather?address=${encodeURIComponent(address)}`)
            .then(res => res.json())
            .then(data => {
                setLoading(false)

                if (data.error) {
                    showError(data.error)
                    return
                }

                // Populate card
                cityEl.textContent = data.location
                dateEl.textContent = formatDate()
                tempEl.textContent = data.forecast.temperature + '°C'
                descEl.textContent = data.forecast.description
                humEl.textContent = data.forecast.humidity + '%'
                windEl.textContent = data.forecast.windSpeed + ' km/h'
                feelsEl.textContent = data.forecast.feelsLike + '°C'
                iconEl.textContent = getIcon(data.forecast.description)

                // Show card with animation
                weatherCard.style.display = 'block'
                weatherCard.classList.remove('visible')
                void weatherCard.offsetWidth // force reflow for animation
                weatherCard.classList.add('visible')
            })
            .catch(() => {
                setLoading(false)
                showError('Something went wrong. Please try again.')
            })
    })
}