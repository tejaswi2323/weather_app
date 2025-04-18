const apiKey = "99a966a728017608ed6ed290852b7d1a";
function getWeather() {
  const location = document.getElementById("locationInput").value;
  if (!location) return alert("Please enter a location");
  fetchWeatherData(`q=${location}`);
}

function getLocationWeather() {
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    fetchWeatherData(`lat=${latitude}&lon=${longitude}`);
  });
}

function fetchWeatherData(query) {
  const currentURL = `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=metric`;

  // Current Weather
  fetch(currentURL)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod !== 200) return alert(data.message);
      document.getElementById("currentWeather").innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <p>${data.weather[0].main} - ${data.weather[0].description}</p>
        <p>🌡️ ${data.main.temp}°C</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>💨 Wind: ${data.wind.speed} m/s</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
      `;
    });

  // 5-Day Forecast
  fetch(forecastURL)
    .then((res) => res.json())
    .then((data) => {
      const daily = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      document.getElementById("forecast").innerHTML = `
        <h2>5-Day Forecast</h2>
        ${daily
          .map(
            (day) => `
          <div class="forecast-card">
            <strong>${new Date(day.dt_txt).toLocaleDateString()}</strong>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
            <p>${day.weather[0].main}</p>
            <p>${day.main.temp}°C</p>
          </div>
        `
          )
          .join("")}
      `;
    });
}
