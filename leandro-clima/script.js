const form = document.getElementById('weather-form');
const result = document.getElementById('weather-result');
const mapDiv = document.getElementById('map');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = document.getElementById('city').value.trim();

  if (!city) return;

  const apiKey = '45e0d45acf7e3f3d90188481d8dab14e'; // OpenWeatherMap
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;

  try {
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.length) {
      result.innerHTML = `<p>Cidade não encontrada. Tente novamente.</p>`;
      mapDiv.innerHTML = '';
      return;
    }

    const { lat, lon, name, country } = geoData[0];

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const icon = weatherData.weather[0].icon;
    const description = weatherData.weather[0].description;

    result.innerHTML = `
      <h2>${name}, ${country}</h2>
      <p><img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}"> ${description}</p>
      <p>🌡️ Temperatura: ${weatherData.main.temp}°C</p>
      <p>💧 Umidade: ${weatherData.main.humidity}%</p>
      <p>💨 Vento: ${weatherData.wind.speed} km/h</p>
    `;

    // Mapa com Leaflet
    mapDiv.innerHTML = `<iframe width="100%" height="300" frameborder="0" style="border:0"
      src="https://maps.google.com/maps?q=${lat},${lon}&z=12&output=embed" allowfullscreen></iframe>`;
  } catch (err) {
    result.innerHTML = `<p>Erro ao buscar clima.</p>`;
    console.error(err);
  }
});

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}
