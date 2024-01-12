let receivedData = sessionStorage.getItem('RouteData');

if (receivedData) {
    var parsedData = JSON.parse(receivedData);

} else {
    console.log('No data available.');
}

console.log(parsedData[0].Stops)
console.log(parsedData[1])

let to = parsedData[0].Stops;
let from = parsedData[1].Stops;

const container = document.querySelector('.container');

for (let i = 0; i < to.length; i++) {

    if (i < to.length - 1) {
        const busStop = document.createElement('div');
        busStop.className = 'bus-stopCon';
        busStop.innerHTML = `<div class="bus-stop"><div class="line"></div></div><p>${to[i].StopName.Zh_tw}</p>`;
        container.appendChild(busStop);
    } else {
        const busStop = document.createElement('div');
        busStop.className = 'bus-stopCon';
        busStop.innerHTML = `<div class="bus-stop"><div></div></div><p>${to[i]}</p>`;
        container.appendChild(busStop);
    }
}

