// JavaScript (script.js)

$(document).ready(function () {
  //  OpenWeather API key
  const apiKey = '932e40ebd1ede190b05027b87d5815d2';

  // Function to fetch current weather data
  function fetchCurrentWeather(cityName) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    $.ajax({
      url: queryURL,
      method: 'GET',
    }).then(function (response) {
      // Update the DOM with current weather data
      $('#current-weather').empty(); // Clear previous data
      const currentWeather = response.weather[0];
      const iconURL = `http://openweathermap.org/img/wn/${currentWeather.icon}.png`;

      const currentWeatherHTML = `
        <h2>${response.name}, ${response.sys.country}</h2>
        <p>Date: ${new Date(response.dt * 1000).toLocaleDateString()}</p>
        <img src="${iconURL}" alt="${currentWeather.description}">
        <p>Temperature: ${response.main.temp} °C</p>
        <p>Humidity: ${response.main.humidity}%</p>
        <p>Wind Speed: ${response.wind.speed} m/s</p>
      `;

      $('#current-weather').append(currentWeatherHTML);
      
      // After fetching current weather, also fetch the 5-day forecast
      fetchFiveDayForecast(cityName);
    });
  }

  // Function to fetch 5-day forecast data
  function fetchFiveDayForecast(cityName) {
    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    $.ajax({
      url: queryURL,
      method: 'GET',
    }).then(function (response) {
      // Update the DOM with 5-day forecast data
      $('#forecast').empty(); // Clear previous data
      const forecasts = response.list.slice(0, 5); // Only the next 5 days

      forecasts.forEach(function (forecast) {
        const weather = forecast.weather[0];
        const iconURL = `http://openweathermap.org/img/wn/${weather.icon}.png`;

        const forecastHTML = `
          <div class="forecast-item">
            <p>Date: ${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
            <img src="${iconURL}" alt="${weather.description}">
            <p>Temperature: ${forecast.main.temp} °C</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
          </div>
        `;

        $('#forecast').append(forecastHTML);
      });
    });
  }

  // Event listener for form submission
  $('#search-form').on('submit', function (event) {
    event.preventDefault();
    const cityName = $('#search-input').val();

    // Fetch current weather and 5-day forecast for the entered city
    fetchCurrentWeather(cityName);

    // Add the searched city to the search history
    addToSearchHistory(cityName);
  });

  // Function to add the searched city to the search history
  function addToSearchHistory(cityName) {
    // Retrieve existing search history from localStorage or initialize an empty array
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Add the new city to the search history array
    searchHistory.push(cityName);

    // Save the updated search history back to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

    // Update the search history list in the DOM
    updateSearchHistoryList(searchHistory);
  }

  // Function to update the search history list in the DOM
  function updateSearchHistoryList(searchHistory) {
    $('#history').empty(); // Clear previous history

    // Display up to the last 6 searched cities
    const maxLength = Math.min(6, searchHistory.length);

    for (let i = 0; i < maxLength; i++) {
      const listItem = $('<li>').text(searchHistory[i]);
      $('#history').append(listItem);

      // Add click event listener to search for the clicked city again
      listItem.on('click', function () {
        const selectedCity = $(this).text();
        $('#search-input').val(selectedCity);
        $('#search-form').submit(); // Trigger a new search
      });
    }
  }

  // Initialize search history list on page load
  const initialSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  updateSearchHistoryList(initialSearchHistory);
});
