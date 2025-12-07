// assets/js/weather.js

const WEATHER_API_KEY = "fa064918b8490c520a9d852076c8ab54";  // Your API key

/**
 * Load weather using browser location
 */
function loadWeather() {
  const weatherBox = document.getElementById("weatherContent");
  if (!weatherBox) return;

  if (!navigator.geolocation) {
    weatherBox.innerHTML = "<p>Location not supported.</p>";
    return;
  }

  weatherBox.innerHTML = "<p>Getting location…</p>";

  navigator.geolocation.getCurrentPosition(fetchWeather, () => {
    weatherBox.innerHTML = "<p>Location permission denied.</p>";
  });
}

/**
 * Fetch weather from OpenWeatherMap
 */
function fetchWeather(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}` +
    `&units=metric&appid=${WEATHER_API_KEY}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => updateWeatherBox(data))
    .catch(() => {
      document.getElementById("weatherContent").innerHTML =
        "<p>Error loading weather.</p>";
    });
}

/**
 * Insert weather into the Hub card
 */
function updateWeatherBox(data) {
  const el = document.getElementById("weatherContent");
  if (!el) return;

  if (data.cod !== 200) {
    el.innerHTML = "<p>Weather unavailable.</p>";
    return;
  }

  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;
  const city = data.name;

  el.innerHTML = `
    <div class="weather-row" style="display:flex; align-items:center; gap:12px;">
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png"
           alt="weather" style="width:55px;height:55px;" />

      <div>
        <strong style="font-size:1.3rem;">${temp}°C</strong><br>
        <span style="text-transform:capitalize;">${desc}</span><br>
        <small style="color:#9ca3af;">${city}</small>
      </div>
    </div>
  `;
}

/**
 * Auto-run ONLY on hub page
 */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.getAttribute("data-page");
  if (page === "hub") {
    loadWeather();
  }
});
