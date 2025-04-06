document.addEventListener('DOMContentLoaded', () => {
    const locationButton = document.querySelector('.location-button');
    const locationSpan = document.querySelector('.location');
    const dateDayname = document.querySelector('.date-dayname');
    const dateDay = document.querySelector('.date-day');
    const weatherIcon = document.querySelector('.weather-icon');
    const weatherTemp = document.querySelector('.weather-temp');
    const weatherDesc = document.querySelector('.weather-desc');
    const precipitationValue = document.querySelector('.precipitation .value');
    const humidityValue = document.querySelector('.humidity .value');
    const windValue = document.querySelector('.wind .value');
    const weekList = document.querySelector('.week-list');
    const weatherSide = document.querySelector('.weather-side');


    let currentCity = defaultCity;

    // Initialisation de la météo au chargement de la page
    updateWeather(currentCity, locationSpan, dateDayname, dateDay, weatherIcon, weatherTemp, weatherDesc, precipitationValue, humidityValue, windValue, weekList, weatherSide);

    // Gestionnaire d'événement pour le bouton de changement de ville
    locationButton.addEventListener('click', () => {
        const city = prompt('Entrez le nom de la ville :');
        if (city) {
            currentCity = city;
            updateWeather(currentCity, locationSpan, dateDayname, dateDay, weatherIcon, weatherTemp, weatherDesc, precipitationValue, humidityValue, windValue, weekList, weatherSide);
        }
    });
});