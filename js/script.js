// Constants
const apiKey = '932e40ebd1ede190b05027b87d5815d2';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const historyList = document.getElementById('history');
const todaySection = document.getElementById('today');
const forecastSection = document.getElementById('forecast');

// Function to fetch weather data from the OpenWeatherMap API
function fetchWeatherData(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Handle and display weather data here
      displayWeatherData(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

// Function to display weather data on the dashboard
function displayWeatherData(data) {
  // Clear previous results
  todaySection.innerHTML = '';
  forecastSection.innerHTML = '';

  // Extract and display current weather data
  const currentWeather = data.list[0]; // Assuming data.list[0] contains current data
  const cityName = data.city.name;
  const date = new Date(currentWeather.dt * 1000); // Convert timestamp to date

  // Create HTML elements for current weather
  const currentWeatherElement = document.createElement('div');
  currentWeatherElement.innerHTML = `
    <h2>${cityName}</h2>
    <p>Date: ${date.toDateString()}</p>
    <!-- Add more elements for weather icon, temperature, humidity, wind speed, etc. -->
  `;

  todaySection.appendChild(currentWeatherElement);

  // Display 5-day forecast
  for (let i = 1; i < data.list.length; i++) {
    const forecastData = data.list[i];
    const forecastDate = new Date(forecastData.dt * 1000);

    // Create HTML elements for each day's forecast and append them to forecastSection
    // Display date, weather icon, temperature, humidity, etc.
  }
}

// Event listener for form submission
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const cityName = searchInput.value.trim();

  if (cityName !== '') {
    fetchWeatherData(cityName);
    // Add cityName to search history
    addToHistory(cityName);
  }
});

// Function to add a city to the search history
function addToHistory(cityName) {
  // Check if the city is already in the history
  const historyItems = historyList.getElementsByTagName('li');
  for (let i = 0; i < historyItems.length; i++) {
    if (historyItems[i].textContent === cityName) {
      return; // City already exists in history
    }
  }

  // Create and append a new history item
  const listItem = document.createElement('li');
  listItem.textContent = cityName;
  historyList.appendChild(listItem);
}

// Event listener for search history clicks
historyList.addEventListener('click', function (e) {
  if (e.target.tagName === 'LI') {
    const cityName = e.target.textContent;
    fetchWeatherData(cityName);
  }
});
