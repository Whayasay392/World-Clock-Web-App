const addedTimeList = {};
let countries = {};


const availableTimezones = [];

let test;

class TimeData {
  // Used to create new time object
  constructor(country, time, amPm, date, timezone) {
    this.country = country;
    this.time = time;
    this.amPm = amPm;
    this.date = date;
    this.timezone = timezone;
  }
}

const domObjects = {
  // Store DOM elements to be used
  searchInput: document.querySelector("#search input"),
  searchIcon: document.querySelector(".search-icon"),
  HTMLBoilerPlate: document.getElementById("boiler-plate"),
  addedTimeZone: document.getElementById("added-time-zone"),
};

Number.prototype.pad = function (size) {
  //pad minute and hour output with leading zero's
  var s = String(this);
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
};

class RenderAddedItems {
  renderAddedTimezone(timeData, countryCode) {
    // Render HTML Boilerplate in the DOM
    // this.time.textContent = timeData.time;

    const timeList = timeData.time.split(":");
    let hour = parseInt(timeList[0]);
    const minute = parseInt(timeList[1]);
    // console.log(minute)
    this.min.textContent = minute.pad(2);

    // console.log(this.min)
    console.log(hour);
    if (hour < 12) {
      this.hour.textContent = hour.pad(2);
      this.amPm.textContent = "am";
      this.amIcon.classList.add("display-icon");
      console.log("here");
    } else if (hour >= 12) {
      hour = hour - 12;
      console.log("here");
      this.hour.textContent = hour.pad(2);
      this.amPm.textContent = "pm";
      this.pmIcon.classList.add("display-icon");
    }

    

    const updateTime = new UpdateTime(minute, hour, this.min, this.hour);
    updateTime.updateMin();
    updateTime.updateHour();

    this.date.textContent = timeData.date;
    this.country.textContent = timeData.country;
    this.timeZone.textContent = timeData.timezone;

    this.HTMLBoilerPlate.id = countryCode;

    console.log(this.HTMLBoilerPlate);
    domObjects.addedTimeZone.appendChild(this.HTMLBoilerPlate);
    addedTimeList[countryCode] = this.HTMLBoilerPlate;

    console.log(addedTimeList);
  }

  renderList(timeData, countryCode) {
    this.HTMLBoilerPlate = domObjects["HTMLBoilerPlate"].cloneNode(true);

    this.pmIcon = this.HTMLBoilerPlate.querySelector(".pm");
    this.amIcon = this.HTMLBoilerPlate.querySelector(".am");
    this.hour = this.HTMLBoilerPlate.querySelector(".time .hour");
    this.min = this.HTMLBoilerPlate.querySelector(".time .min");
    this.amPm = this.HTMLBoilerPlate.querySelector(".am-pm");
    this.date = this.HTMLBoilerPlate.querySelector(".date");
    this.country = this.HTMLBoilerPlate.querySelector(".country");
    this.deleteBtn = this.HTMLBoilerPlate.querySelector(".delete-btn");
    this.timeZone = this.HTMLBoilerPlate.querySelector(".timezone");

    domObjects.addedTimeZone.innerHTML = "";

    for (let timeItem in addedTimeList) {
      domObjects.addedTimeZone.append(addedTimeList[timeItem]);
    }
    // console.log(domObjects.addedTimeList)
    this.renderAddedTimezone(timeData, countryCode);

    this.deleteBtn.addEventListener("click", function () {
      // console.log(this.parentNode)
      const selectedItemId = this.parentNode.id;
      const deleteTimezone = new DeleteTimezone();
      deleteTimezone.deleteItem(selectedItemId);
    });
  }
}

class UpdateTime {
  // Updates hour and min data added on regula intervals
  constructor(min, hour, minDOM, hourDOM) {
    (this.min = min),
      (this.hour = hour),
      (this.minDOM = minDOM),
      (this.hourDOM = hourDOM);
  }

  updateHourHandler() {
    this.hour++;
    if (hour > 12) {
      this.hour = 1;
    }
    this.hourDOM.textContent = this.hour.pad(2);
  }

  updateMinHandler() {
    this.min++;
    console.log(this.min);
    console.log(typeof this.min);
    if (this.min > 60) {
      this.min = 1;
    }
    console.log(this.min);
    this.minDOM.textContent = this.min.pad(2);
  }

  updateHour() {
    // const hourDOM = this.hourDOM;
    // let hour = this.hour;
    setInterval(this.updateHourHandler.bind(this), 60 * 60 * 1000);
  }
  updateMin() {
    // const minDOM = this.minDOM;
    // let min = this.min;
    setInterval(this.updateMinHandler.bind(this), 60 * 1000);
  }
}

class DeleteTimezone {
  deleteItem(selectedItemId) {
    const addedTimeZoneDiv = domObjects.addedTimeZone;
    const selectedItem = document.getElementById(`${selectedItemId}`);
    addedTimeZoneDiv.removeChild(selectedItem);
    delete addedTimeList[selectedItemId];
  }
}

// Logic to addEventListener and call necessary function to validate user input
class EventListener {
  static init() {
    const searchInput = domObjects["searchInput"];
    const searchIcon = domObjects["searchIcon"];

    searchInput.addEventListener(
      "keydown",
      this.searchInputHandler.bind(searchInput, this)
    );

    searchIcon.addEventListener("click", (event) => {
      event.preventDefault();
      const userInput = searchInput.value;
      this.searchIconHandler(userInput);
    });
  }

  static searchInputHandler(event, EventListener) {
    // calls searchIconHandler when 'Enter' key is pressed
    if (event.key === "Enter") {
      event.preventDefault();
      EventListener.searchIconHandler(this.value);
    }
  }

  static searchIconHandler(userInput) {
    //////////////should call on validateUserInput /////////////
    // Handles Click on search icon and also when Enter key is pressed(Called in searchInputHandler)
    validateUserInput(userInput);
    console.log(userInput);
  }
}

///////////////////////////// API /////////// :)

const getTimezones = () => {
  //Generates all countries list to be used to validate user input
  fetch(
    "https://cors-anywhere.herokuapp.com/http://api.timezonedb.com/v2.1/list-time-zone?key=GQ7OZD3IEZN9&format=json"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const generatedTimezones = data.zones;
      generatedTimezones.forEach((timezone) => {
        availableTimezones.push(timezone.zoneName);
      });
      console.log(availableTimezones);
      

      $(function () { // Init autocomplete plugin
        $("input").autocomplete({
          source: [availableTimezones],
        });
      });
      
  
      for (const id in generatedTimezones) {                          ///
        // Converts API response to object format of {country: id}    ///
        const country = generatedTimezones[id];                       ///  
        countries[country] = id;                                      /// 
      }

      // console.log(countries);                                         ///
    })
    .catch((err) => {
      console.log(err);
    });
};

// const generateTimezoneData = (countryCode) => {
//   // Use country code to generate timezone to be parsed into
//   //generateTime function to generate current time for the country
//   fetch(
//     `https://cors-anywhere.herokuapp.com/https://countries-cities.p.rapidapi.com/location/country/${countryCode}?format=json`,
//     {
//       method: "GET",
//       headers: {
//         "x-rapidapi-host": "countries-cities.p.rapidapi.com",
//         "x-rapidapi-key": "0f48d1e7efmsh27f074765b2d7eap100291jsne90996e210bd",
//       },
//     }
//   )
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       return {
//         country: data.name,
//         timezone: data.timezone.timezone.split("/"),
//       };
//     })
//     .then((res) => {
//       // console.log(countryCode)
//       const timezone = res.timezone;
//       const location = timezone[0];
//       const area = timezone[1];
//       console.log("gen");
//       generateTime(res.country, location, area, countryCode);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

const generateTimezoneData = (timezone) => {
  fetch(`https://cors-anywhere.herokuapp.com/http://api.timezonedb.com/v2.1/get-time-zone?key=GQ7OZD3IEZN9&format=json&by=zone&zone=${timezone}`)
    .then((response) => {

      return response.json();
    })
    .then((data) => {
      console.log(data)
      const country = data.countryName;

      const timezone = data.abbreviation;
      const date = data.formatted.slice(0, 10);
      const time = data.formatted.slice(11, 16);
      const zoneName = data.zoneName;
      const timeData = new TimeData(country, time, "am", date, timezone);
      const rederAddedItem = new RenderAddedItems();
      rederAddedItem.renderList(timeData, zoneName);
    })
    .catch((err) => {
      console.log(err);
    });
};

const validateUserInput = (userInput) => {
  if (availableTimezones.includes(userInput)) {

    let countryCode = countries[userInput];
    if (addedTimeList.hasOwnProperty(countryCode)) {
      alert("Country already added :)");
      return;
    }
    console.log(userInput)
    generateTimezoneData(userInput); //parse in country code
  } else {
    alert("Country format wrong!");
  }
};

EventListener.init();
getTimezones();

// $("#tags").combobox();
