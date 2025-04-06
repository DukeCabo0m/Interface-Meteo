// functions.js

/**
 * Récupère l'icône météo correspondante à partir du code d'icône OpenWeatherMap.
 * @param {string} iconCode - Le code d'icône OpenWeatherMap.
 * @returns {string} Le nom de l'icône Feather à afficher.
 */
function getWeatherIcon(iconCode) {
    switch (iconCode) {
        case '01d': return 'sun';
        case '01n': return 'moon';
        case '02d': case '02n': return 'cloud';
        case '03d': case '03n': return 'cloud';
        case '04d': case '04n': return 'cloud';
        case '09d': case '09n': return 'cloud-rain';
        case '10d': case '10n': return 'cloud-rain';
        case '11d': case '11n': return 'zap';
        case '13d': case '13n': return 'cloud-snow';
        case '50d': case '50n': return 'wind';
        default: return 'help-circle';
    }
}

/**
 * Met à jour l'image de fond de la page en fonction du nom de la ville.
 * @param {string} cityName - Le nom de la ville pour laquelle récupérer l'image.
 * @param {HTMLElement} weatherSide - L'élément HTML où afficher l'image de fond.
 * @returns {Promise<void>}
 */
async function updateBackground(cityName, weatherSide) {
    try {
        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cityName)}&per_page=1&orientation=landscape&client_id=${unsplashApiKey}`;
        const response = await fetch(unsplashUrl);
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const imageUrl = data.results[0].urls.regular;
            weatherSide.style.backgroundImage = `url(${imageUrl})`;
            weatherSide.style.backgroundSize = 'cover';
            weatherSide.style.backgroundPosition = 'center';
        } else {
             weatherSide.style.backgroundImage = 'url(https://images.unsplash.com/photo-1559963110-71b394e7494d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80)';
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'image depuis Unsplash :', error);
        weatherSide.style.backgroundImage = 'url(https://images.unsplash.com/photo-1559963110-71b394e7494d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80)';
    }
}

/**
 * Met à jour les informations météorologiques principales affichées dans la page.
 * @param {object} forecastData - Les données météorologiques à afficher.
 * @param {HTMLElement} locationSpan - L'élément HTML pour afficher la localisation.
 * @param {HTMLElement} dateDayname - L'élément HTML pour afficher le nom du jour.
 * @param {HTMLElement} dateDay - L'élément HTML pour afficher la date.
 * @param {HTMLElement} weatherIcon - L'élément HTML pour afficher l'icône de la météo.
 * @param {HTMLElement} weatherTemp - L'élément HTML pour afficher la température.
 * @param {HTMLElement} weatherDesc - L'élément HTML pour afficher la description de la météo.
 * @param {HTMLElement} precipitationValue - L'élément HTML pour afficher la valeur de précipitation.
 * @param {HTMLElement} humidityValue - L'élément HTML pour afficher la valeur d'humidité.
 * @param {HTMLElement} windValue - L'élément HTML pour afficher la vitesse du vent.
 */
function updateMainWeather(forecastData, locationSpan, dateDayname, dateDay, weatherIcon, weatherTemp, weatherDesc, precipitationValue, humidityValue, windValue) {
    try {
        weatherIcon.setAttribute('data-feather', getWeatherIcon(forecastData.weather[0].icon));
        weatherTemp.textContent = `${Math.round(forecastData.main.temp)}°C`;
        weatherDesc.textContent = forecastData.weather[0].description;
        precipitationValue.textContent = `${forecastData.clouds.all}%`;
        humidityValue.textContent = `${forecastData.main.humidity}%`;
        windValue.textContent = `${forecastData.wind.speed} km/h`;

        const date = new Date(forecastData.dt * 1000);
        const optionsDayName = { weekday: 'long' };
        let dayName = date.toLocaleDateString('fr-FR', optionsDayName);
        dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        dateDayname.textContent = dayName;

        const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('fr-FR', optionsDate);
        dateDay.textContent = formattedDate;

        feather.replace();
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la météo principale", error);
    }
}

/**
 * Met à jour les informations météorologiques de la page pour une ville donnée.
 * @param {string} city - Le nom de la ville pour laquelle récupérer les données.
 * @param {HTMLElement} locationSpan - L'élément HTML pour afficher la localisation.
 * @param {HTMLElement} dateDayname - L'élément HTML pour afficher le nom du jour.
 * @param {HTMLElement} dateDay - L'élément HTML pour afficher la date.
 * @param {HTMLElement} weatherIcon - L'élément HTML pour afficher l'icône de la météo.
 * @param {HTMLElement} weatherTemp - L'élément HTML pour afficher la température.
 * @param {HTMLElement} weatherDesc - L'élément HTML pour afficher la description de la météo.
 * @param {HTMLElement} precipitationValue - L'élément HTML pour afficher la valeur de précipitation.
 * @param {HTMLElement} humidityValue - L'élément HTML pour afficher la valeur d'humidité.
 * @param {HTMLElement} windValue - L'élément HTML pour afficher la vitesse du vent.
 * @param {HTMLElement} weekList - L'élément HTML pour afficher les prévisions de la semaine.
 * @param {HTMLElement} weatherSide - L'élément HTML où afficher l'image de fond.
 * @returns {Promise<void>}
 */
async function updateWeather(city, locationSpan, dateDayname, dateDay, weatherIcon, weatherTemp, weatherDesc, precipitationValue, humidityValue, windValue, weekList, weatherSide) {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        const data = await response.json();

        if (data.cod === '404') {
            alert('Ville non trouvée.');
            return;
        }

        locationSpan.textContent = `${data.name}, ${data.sys.country}`;
        const date = new Date();
        const optionsDayName = { weekday: 'long' };
        let dayName = date.toLocaleDateString('fr-FR', optionsDayName);
        dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        dateDayname.textContent = dayName;

        const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('fr-FR', optionsDate);
        dateDay.textContent = formattedDate;

        weatherIcon.setAttribute('data-feather', getWeatherIcon(data.weather[0].icon));
        weatherTemp.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDesc.textContent = data.weather[0].description;
        precipitationValue.textContent = `${data.clouds.all}%`;
        humidityValue.textContent = `${data.main.humidity}%`;
        windValue.textContent = `${data.wind.speed} km/h`;

        feather.replace();
        await updateBackground(data.name, weatherSide);

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr&cnt=36`;
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error(`Erreur HTTP! Statut: ${forecastResponse.status}`);
        }
        const forecastData = await forecastResponse.json();

        weekList.innerHTML = '';
        for (let i = 8; i <= 32; i += 8) {
            const forecast = forecastData.list[i];
            const day = new Date(forecast.dt * 1000);
            const dayName = day.toLocaleDateString('fr-FR', { weekday: 'short' });
            const dayTemp = Math.round(forecast.main.temp);
            const dayIcon = getWeatherIcon(forecast.weather[0].icon);

            const listItem = document.createElement('li');
            listItem.innerHTML = `<i class="day-icon" data-feather="${dayIcon}"></i><span class="day-name">${dayName}</span><span class="day-temp">${dayTemp}°C</span>`;
            listItem.addEventListener('click', () => {
                updateMainWeather(forecast, locationSpan, dateDayname, dateDay, weatherIcon, weatherTemp, weatherDesc, precipitationValue, humidityValue, windValue);
            });
            weekList.appendChild(listItem);
        }
        feather.replace();
    } catch (error) {
        console.error('Erreur lors de la récupération des données météo:', error);
        alert('Impossible de récupérer les données météo.');
    }
}