const weatherResult = document.getElementById("weatherResult");
const fetchBtn = document.getElementById("fetchBtn");
const cityInput = document.getElementById("cityInput");

fetchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    weatherResult.innerHTML = `<p class="error">Please enter a city name.</p>`;
    return;
  }
  showFakeWeather(city);
});

function showFakeWeather(city) {
  weatherResult.textContent = "Loading...";

  // simulate a network delay
  setTimeout(() => {
    const fakeData = {
      name: city,
      sys: { country: "IN" },
      main: { temp: (Math.random() * 30 + 10).toFixed(1) },
      weather: [
        { description: getRandomWeatherDescription() }
      ],
      wind: { speed: (Math.random() * 5 + 1).toFixed(1) }
    };

    weatherResult.innerHTML = `
      <div class="weather-info">
        <h2>${fakeData.name}, ${fakeData.sys.country}</h2>
        <p>🌡️ Temp: ${fakeData.main.temp} °C</p>
        <p>🌤️ ${fakeData.weather[0].description}</p>
        <p>💨 Wind: ${fakeData.wind.speed} m/s</p>
      </div>
    `;
  }, 1000); // 1 second delay
}

function getRandomWeatherDescription() {
  const desc = [
    "clear sky",
    "few clouds",
    "scattered clouds",
    "broken clouds",
    "shower rain",
    "rain",
    "thunderstorm",
    "snow",
    "mist"
  ];
  return desc[Math.floor(Math.random() * desc.length)];
}

