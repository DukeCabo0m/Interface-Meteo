document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '9d6b43d1c447c55e93ec303d84008949';
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
    let currentCity = 'Paris';
    const weatherSide = document.querySelector('.weather-side'); // Sélectionne la div .weather-side une seule fois

    // Fonction pour mettre à jour la météo pour une ville donnée
    function updateWeather(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.cod === '404') {
                    alert('Ville non trouvée.');
                    return;
                }

                // Mettre à jour les informations de localisation et de date
                locationSpan.textContent = `${data.name}, ${data.sys.country}`;
                const date = new Date();
                const optionsDayName = { weekday: 'long' };
                let dayName = date.toLocaleDateString('fr-FR', optionsDayName);
                dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
                dateDayname.textContent = dayName;

                const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };
                const formattedDate = date.toLocaleDateString('fr-FR', optionsDate);
                dateDay.textContent = formattedDate;

                // Mettre à jour les informations météo
                weatherIcon.setAttribute('data-feather', getWeatherIcon(data.weather[0].icon));
                weatherTemp.textContent = `${Math.round(data.main.temp)}°C`;
                weatherDesc.textContent = data.weather[0].description;
                precipitationValue.textContent = `${data.clouds.all}%`;
                humidityValue.textContent = `${data.main.humidity}%`;
                windValue.textContent = `${data.wind.speed} km/h`;

                feather.replace();

                // Mettre à jour l'image de fond en fonction de la ville
                updateBackground(data.name); // Appel direct pour mettre à jour l'image

                // Récupérer les prévisions météo pour les prochains jours
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr&cnt=36`;

                fetch(forecastUrl)
                    .then(forecastResponse => forecastResponse.json())
                    .then(forecastData => {
                        weekList.innerHTML = '';
                        for (let i = 8; i <= 32; i += 8) {
                            const forecast = forecastData.list[i];
                            const day = new Date(forecast.dt * 1000);
                            const dayName = day.toLocaleDateString('fr-FR', { weekday: 'short' });
                            const dayTemp = Math.round(forecast.main.temp);
                            const dayIcon = getWeatherIcon(forecast.weather[0].icon);

                            const listItem = document.createElement('li');
                            listItem.innerHTML = `<i class="day-icon" data-feather="${dayIcon}"></i><span class="day-name">${dayName}</span><span class="day-temp">${dayTemp}°C</span>`;
                            weekList.appendChild(listItem);

                            // Ajouter un événement de clic pour mettre à jour la météo principale avec les prévisions
                            listItem.addEventListener('click', () => {
                                updateMainWeather(forecast);
                            });
                        }
                        feather.replace();
                    })
                    .catch(error => {
                        console.error('Erreur lors de la récupération des prévisions:', error);
                    });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données météo:', error);
                alert('Impossible de récupérer les données météo.');
            });

        currentCity = city;
    }

    function updateMainWeather(forecast) {
        const weatherIcon = document.querySelector('.weather-icon');
        weatherIcon.setAttribute('data-feather', getWeatherIcon(forecast.weather[0].icon));
        weatherTemp.textContent = `${Math.round(forecast.main.temp)}°C`;
        weatherDesc.textContent = forecast.weather[0].description;
        precipitationValue.textContent = `${forecast.clouds.all}%`;
        humidityValue.textContent = `${forecast.main.humidity}%`;
        windValue.textContent = `${forecast.wind.speed} km/h`;

        const date = new Date(forecast.dt * 1000);
        const optionsDayName = { weekday: 'long' };
        let dayName = date.toLocaleDateString('fr-FR', optionsDayName);
        dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        dateDayname.textContent = dayName;

        const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('fr-FR', optionsDate);
        dateDay.textContent = formattedDate;

        feather.replace();

        // Mettre à jour l'image de fond ici aussi, avec le nom de la ville
        const cityName = document.querySelector('.location').textContent.split(',')[0].trim();
        updateBackground(cityName);
    }

    function updateBackground(cityName) {
        const unsplashApiKey = 'YJcSKepSDSjRoYWv6S9gRR8952hP4XnLwjhoRN6Icl4'; // Remplacez par votre clé API Unsplash
        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cityName)}&per_page=1&orientation=landscape&client_id=${unsplashApiKey}`;

        fetch(unsplashUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const imageUrl = data.results[0].urls.regular;
                    weatherSide.style.backgroundImage = `url(${imageUrl})`;
                    weatherSide.style.backgroundSize = 'cover';
                    weatherSide.style.backgroundPosition = 'center';
                } else {
                    weatherSide.style.backgroundImage = 'url(https://images.unsplash.com/photo-1559963110-71b394e7494d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80)';
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de l\'image depuis Unsplash :', error);
                weatherSide.style.backgroundImage = 'url(https://images.unsplash.com/photo-1559963110-71b394e7494d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80)';
            });
    }


    // Fonction pour obtenir l'icône météo correspondante
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

    // Ajouter un événement de clic pour demander le nom de la ville et mettre à jour la météo
    locationButton.addEventListener('click', () => {
        const city = prompt('Entrez le nom de la ville :');
        if (city) {
            updateWeather(city);
        }
    });

    // Mettre à jour la météo pour Paris au chargement de la page
    updateWeather('Paris'); // Initialise l'affichage de la météo
});
