const API_KEY = "f644dd69d6ba436faf5235055231903";

async function fetchLocation(location) {
	try {
		const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`, {mode: "cors"});
		const data = await response.json();
		return data;
	} catch(e) {
		console.log(e);
	}
}

async function getWeatherInfo(location) {
	try {
		const data = await fetchLocation(location);
		const weatherInfo = await data.current;
		const locationInfo = await data.location;
		return {
			city: locationInfo.name,
			country: locationInfo.country,
			localtime: locationInfo.localtime,
			temperature: weatherInfo.temp_c,
			humidity: weatherInfo.humidity,
			condition: weatherInfo.condition
		}
	} catch(e) {
		console.log(e);
	}
}

const input = document.getElementById("location");
const okButton = document.getElementById("ok-button");
okButton.addEventListener("click", () => {
	const loadingText = document.createElement("p");
	loadingText.id = "loading-text";
	loadingText.textContent = "Loading...";
	document.body.appendChild(loadingText);
	getWeatherInfo(input.value)
		.then(response => {
			displayWeather(response);
		})
		.catch(e => console.log(e))
		.finally(() => document.body.removeChild(loadingText));
});

function displayWeather(weather) {
	const div = document.getElementById("weather-info");
	if(div.hasAttribute("hidden"))
	{
		div.removeAttribute("hidden");
	}
	else
	{
		while (div.firstChild) { // remove previous content
			div.removeChild(div.lastChild);
		}
	}

	const locationText = document.createElement("h2");
	locationText.textContent = weather.city + ", " + weather.country;
	div.appendChild(locationText);

	const timeText = document.createElement("p");
	timeText.textContent = weather.localtime.substr(weather.localtime.length-5);
	div.appendChild(timeText);

	const conditionDiv = document.createElement("div");
	conditionDiv.id = "condition-div";
	const conditionImg = document.createElement("img");
	const conditionImgUrl = weather.condition.icon;
	fetch("http:"+conditionImgUrl)
		.then(response => {
			if(response.ok) {
				conditionImg.src = response.url;
			}
		})
		.catch(e => console.log(e));

	conditionDiv.appendChild(conditionImg);
	const conditionText = document.createElement("p");
	conditionText.textContent = weather.condition.text;
	conditionDiv.appendChild(conditionText);
	div.appendChild(conditionDiv);

	const temperatureText = document.createElement("p");
	temperatureText.textContent = weather.temperature + "°C";
	temperatureText.id = "temperature";
	div.appendChild(temperatureText);

	const humidityText = document.createElement("p");
	humidityText.textContent = "Humidity: " + weather.humidity + "%";
	div.appendChild(humidityText);
}