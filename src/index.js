function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}
// Updates the temperature in the UI
function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "562fcad81f0b3f7577282336ebcbcfd5";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function updateCity(response) {
  const cityName = document.querySelector("#city");
  cityName.innerHTML = `${response.data.name}`;
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  const descriptionUI = document.querySelector("#description");
  descriptionUI.innerHTML = `${response.data.weather[0].description}`;

  const humidityUI = document.querySelector("#humidity-rate");
  humidityUI.innerHTML = `${response.data.main.humidity}%`;

  const windSpeedUI = document.querySelector("#wind-speed");
  windSpeedUI.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;

  const cloudinessUI = document.querySelector("#cloud");
  cloudinessUI.innerHTML = `${response.data.clouds.all}%`;
  const temperatureNew = document.querySelector("#temp-special");
  temperatureNew.innerHTML = Math.round(response.data.main.temp);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].descriptionx);
  getForecast(response.data.coord);
}
function searchCity(city) {
  let apiKey = "562fcad81f0b3f7577282336ebcbcfd5";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateCity);
}

function handleSubmit(event) {
  event.preventDefault();
  let textInput = document.querySelector("#city-input");
  const city = textInput.value.trim();

  if (!city) return;

  searchCity(city);

  textInput.value = "";
}
const searchForm = document.querySelector("#form-special");
searchForm.addEventListener("submit", handleSubmit);