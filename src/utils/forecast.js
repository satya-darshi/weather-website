require('dotenv').config()
const fetch = require('node-fetch')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=' + process.env.WEATHERSTACK_KEY + '&query=' + latitude + ',' + longitude

    fetch(url)
        .then(res => res.json())
        .then(body => {
            if (body.error) {
                callback('Unable to find location')
            } else {
                callback(undefined, {
                    description: body.current.weather_descriptions[0],
                    temperature: body.current.temperature,
                    feelsLike: body.current.feelslike,
                    humidity: body.current.humidity,
                    windSpeed: body.current.wind_speed
                })
            }
        })
        .catch(() => {
            callback('Unable to connect to weather service!')
        })
}

module.exports = forecast