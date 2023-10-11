// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
const API_KEY = "168771779c71f3d64106d8a88376808a";
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchForm = document.querySelector("[data-searchForm]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const lodingScreen = document.querySelector(".loding-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorScreen = document.querySelector(".error-container");

// Initially variables need to be set to some values
let oldTab = userTab;
oldTab.classList.add("current-tab");

// Logic for Switching the tabs
function switchTab(clickedTab) {
    if (clickedTab !== oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = clickedTab;
        oldTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            errorScreen.classList.remove("active");
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorScreen.classList.remove("active");
            getFromSessionStorage();
        }
    }
}
// Check if coordinates are already present in sessioin storage
function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat , lon} = coordinates;
    // Removing the grant access tab
    grantAccessContainer.classList.remove("active");
    // Showing the Loading screen
    lodingScreen.classList.add("active");
    // API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);       
        const data = await response.json();

        // Remove the loading screen
        lodingScreen.classList.remove("active");
        // Scow the user Info screen
        userInfoContainer.classList.add("active");
        // render the information on the user screen
        renderWeatherInfo(data);
        if (!data.sys) {
            throw data;
        }
    }
    catch(err){
        lodingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        errorScreen.classList.add("active");
    }
}
// Function for rendering the information on UI
function renderWeatherInfo(weatherInfo){
    // Fetching all the needed data from the HTML Code
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temprature = document.querySelector("[data-temprature]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");
    
    // Fetch Info from the object and put it in the UI
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temprature.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} % `;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}
const grantAccessButton = document.querySelector("[data-grantAccess]");

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // Alert Throw karna hai 
    }
}
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit" , (e)=>{
    e.preventDefault();
    if(searchInput.value === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(searchInput.value);
    }
});

async function fetchSearchWeatherInfo(city){
    // Loading Screen Show karni padegi
    lodingScreen.classList.add("active");
    errorScreen.classList.remove("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        lodingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        lodingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        // console.log("Inside catch Block");
        errorScreen.classList.add("active");
        // console.log("Inside catch Block2");

    }
}


grantAccessButton.addEventListener("click" , getLocation());

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});
