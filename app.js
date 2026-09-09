const startBtn = document.querySelector(".start");
const search = document.querySelector("#inputfield");
const searchIcon = document.querySelector("#searchIcon");
const desc = document.querySelector("#desc");
const temp = document.querySelector("#temp");
const cityName = document.querySelector("#city");
const wind = document.querySelector("#windSpeed");
const humidity = document.querySelector("#humidityper");
const goHome = document.querySelector(".homeBtn");
const icon = document.querySelector("#icon");
const mainBox1 = document.querySelector(".mainBox1");
const mainBox2 = document.querySelector(".mainBox2");
const mainBox3 = document.querySelector(".mainBox3");


startBtn.addEventListener("click", () => {
    mainBox1.classList.add("inactive");
    mainBox2.classList.remove("inactive");
});


function changeIcon(weatherCode) {
    let icons = {
        0: "/images/clear.png",
        1: "/images/clouds.png",
        2: "/images/clouds.png",
        3: "/images/clouds.png",
        45: "/images/mist.png",
        48: "/images/mist.png",
        51: "/images/drizzle.png",
        53: "/images/drizzle.png",
        55: "/images/drizzle.png",
        61: "/images/rain.png",
        63: "/images/rain.png",
        65: "/images/rain.png",
        71: "/images/snow.png",
        73: "/images/snow.png",
        75: "/images/snow.png",
        77: "/images/snow.png",
        80: "/images/rain.png",
        81: "/images/rain.png",
        82: "/images/rain.png",
        95: "/images/rain.png",
        96: "/images/rain.png",
        99: "/images/rain.png"
    };

    icon.src = icons[weatherCode] || "/images/clear.png";
}


const url = "https://api.open-meteo.com/v1/forecast?";
const locationUrl = "https://geocoding-api.open-meteo.com/v1/search?";


async function getWeatherData(city) {

    // First get latitude and longitude of the city
    let locationFinalUrl =
        `${locationUrl}name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    let locationData = await fetch(locationFinalUrl).then(res => res.json());

    console.log(locationData);

    if (!locationData.results || locationData.results.length === 0) {
        mainBox2.classList.add("inactive");
        mainBox3.classList.remove("inactive");

        desc.innerHTML = "description";
        temp.innerHTML = "0°c";
        cityName.innerHTML = "New York";
        wind.innerHTML = "0km/h";
        humidity.innerHTML = "0%";
        search.value = "";
        icon.src = "/images/clear.png";

        return;
    }

    let latitude = locationData.results[0].latitude;
    let longitude = locationData.results[0].longitude;

    // Get weather data
    let finalUrl =
        `${url}latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
        `&wind_speed_unit=kmh`;

    let weatherData = await fetch(finalUrl).then(res => res.json());

    console.log(weatherData);


    // Response handling
    desc.innerHTML = getWeatherDescription(weatherData.current.weather_code);

    temp.innerHTML =
        Math.round(weatherData.current.temperature_2m) + "°c";

    cityName.innerHTML = locationData.results[0].name;

    wind.innerHTML =
        weatherData.current.wind_speed_10m + "km/h";

    humidity.innerHTML =
        weatherData.current.relative_humidity_2m + "%";

    changeIcon(weatherData.current.weather_code);
}


function getWeatherDescription(code) {
    let descriptions = {
        0: "clear sky",
        1: "mainly clear",
        2: "partly cloudy",
        3: "overcast",
        45: "fog",
        48: "depositing rime fog",
        51: "light drizzle",
        53: "moderate drizzle",
        55: "dense drizzle",
        61: "slight rain",
        63: "moderate rain",
        65: "heavy rain",
        71: "slight snow",
        73: "moderate snow",
        75: "heavy snow",
        77: "snow grains",
        80: "slight rain showers",
        81: "moderate rain showers",
        82: "violent rain showers",
        95: "thunderstorm",
        96: "thunderstorm with hail",
        99: "thunderstorm with heavy hail"
    };

    return descriptions[code] || "unknown weather";
}


searchIcon.addEventListener("click", () => {
    getWeatherData(search.value);
});


search.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        getWeatherData(search.value);
    }
});


goHome.addEventListener("click", () => {
    mainBox3.classList.add("inactive");
    mainBox1.classList.remove("inactive");
});