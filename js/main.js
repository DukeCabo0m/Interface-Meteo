// main.js

document.addEventListener('DOMContentLoaded', () => {
    const locationButton = document.querySelector('.button--location');
    const locationSpan = document.querySelector('.weather-card__location');
    const dateDayname = document.querySelector('.weather-card__day-name');
    const dateDay = document.querySelector('.weather-card__day');
    const weatherIcon = document.querySelector('.weather-card__icon');
    const weatherTemp = document.querySelector('.weather-card__temperature');
    const weatherDesc = document.querySelector('.weather-card__description');
    const precipitationValue = document.querySelector('.weather-info__precipitation .weather-info__value');
    const humidityValue = document.querySelector('.weather-info__humidity .weather-info__value');
    const windValue = document.querySelector('.weather-info__wind .weather-info__value');
    const weekList = document.querySelector('.weather-info__week-list');
    const weatherCard = document.querySelector('.weather-card'); // Renommé pour correspondre

    let currentCity = defaultCity;

    // Initialisation de la météo au chargement de la page
    updateWeather(currentCity, locationSpan, dateDayname, dateDay, weatherIcon, weatherTemp, weatherDesc, precipitationValue, humidityValue, windValue, weekList, weatherCard);

    // Gestionnaire d'événement pour le bouton de changement de ville
    locationButton.addEventListener('click', () => {
        const city = prompt('Entrez le nom de la ville :');
        if (city) {
            currentCity = city;
            updateWeather(currentCity, locationSpan, dateDayname, dateDay, weatherIcon, weatherTemp, weatherDesc, precipitationValue, humidityValue, windValue, weekList, weatherCard);
        }
    });

    // Gestionnaire d'événement pour le bouton "Aujourd'hui" (nouveau bouton)
    const todayButton = document.querySelector('.button--today');
    if (todayButton) {
        todayButton.addEventListener('click', () => {
            updateWeather(currentCity, locationSpan, dateDayname, dateDay, weatherIcon, weatherTemp, weatherDesc, precipitationValue, humidityValue, windValue, weekList, weatherCard);
            // Ici, vous pourriez ajouter une logique supplémentaire si nécessaire,
            // comme remonter au premier jour de la prévision de la semaine ou autre.
        });
    }
});