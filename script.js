const selectedDateSpan = document.getElementById("selected-date");
const moonDataDiv = document.getElementById("moon-data");
const tideDataDiv = document.getElementById("tide-data");
const sunDataDiv = document.getElementById("sun-data");

// Function to update the displayed date
function updateSelectedDate(date) {
  selectedDateSpan.textContent = formatDate(date);
}

// Function to format the date for display
function formatDate(date) {
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// Function to handle fetching data for the previous day
function getPreviousDayData() {
  const currentDate = new Date(selectedDateSpan.textContent);
  currentDate.setDate(currentDate.getDate() - 1);
  updateSelectedDate(currentDate);
  updateDataDisplay(currentDate);
}

// Function to handle fetching data for the next day
function getNextDayData() {
  const currentDate = new Date(selectedDateSpan.textContent);
  currentDate.setDate(currentDate.getDate() + 1);
  updateSelectedDate(currentDate);
  updateDataDisplay(currentDate);
}

// Function to update the data display
function updateDataDisplay(date) {
  // Fetch tide data
  fetch("tide_data.xml")
    .then(response => response.text())
    .then(data => {
      const tideData = parseTideData(data);
      displayData("Tide Data", tideData, tideDataDiv); // Specify the target div
    });

  // Fetch sun data
  fetch("sun_data.xml")
    .then(response => response.text())
    .then(data => {
      const sunData = parseSunData(data);
      displayData("Sun Data", sunData, sunDataDiv); // Specify the target div
    });

  // Fetch moon data
  fetch("moon_data.xml")
    .then(response => response.text())
    .then(data => {
      const moonData = parseMoonData(data);
      displayData("Moon Data", moonData, moonDataDiv); // Specify the target div
    });
}

// Function to parse tide data
function parseTideData(xml) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");
  const tides = xmlDoc.getElementsByTagName("pr");
  const tideData = [];
  for (let i = 0; i < tides.length; i++) {
    const t = tides[i].getAttribute("t");
    const v = tides[i].getAttribute("v");
    const type = tides[i].getAttribute("type");
    tideData.push(`<pr t="${t}"  v="${v}"  type="${type}"/>`);
  }
  return tideData;
}

// Function to parse sun data
function parseSunData(xml) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");
  const sunData = xmlDoc.getElementsByTagName("pr");
  const formattedSunData = [];
  for (let i = 0; i < sunData.length; i++) {
    const t = sunData[i].getAttribute("t");
    const type = sunData[i].getAttribute("type");
    formattedSunData.push(`<pr t="${t}"  type="${type}"/>`);
  }
  return formattedSunData;
}

// Function to parse moon data
function parseMoonData(xml) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");
  const moonData = xmlDoc.getElementsByTagName("pr");
  const formattedMoonData = [];
  for (let i = 0; i < moonData.length; i++) {
    const t = moonData[i].getAttribute("t");
    const type = moonData[i].getAttribute("type");
    formattedMoonData.push(`"${t}" "${type}"`);
  }
  return formattedMoonData;
}

// Function to display data in cards
function displayData(title, data, targetDiv) {
  const card = document.createElement("div");
  card.classList.add("card");

  const cardTitle = document.createElement("h3");
  cardTitle.textContent = title;
  card.appendChild(cardTitle);

  const ul = document.createElement("ul");
  data.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = item;
    ul.appendChild(li);
  });

  card.appendChild(ul);

  // Clear previous content and append the new card to the target div
  targetDiv.innerHTML = '';
  targetDiv.appendChild(card);
}

// Initial data display for the current date
const currentDate = new Date();
updateSelectedDate(currentDate);
updateDataDisplay(currentDate);
