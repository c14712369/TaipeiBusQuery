let receivedData = sessionStorage.getItem('RouteData');
let route = sessionStorage.getItem('Route');
let DestinationStop = sessionStorage.getItem('DestinationStop');
let DepartureStop = sessionStorage.getItem('DepartureStop');
let RouteRealTimeData;
let apiID = 'c14712369-dfd8e505-1843-44f2';
let apiKey = 'a6900643-59bf-41a3-b142-d3b4bc99c575';
let options = {
    "method": "post",
    "headers": {
        "content-type": "application/x-www-form-urlencoded"
    },
    "payload": {
        "grant_type": "client_credentials",
        "client_id": apiID,
        "client_secret": apiKey
    }
};

if (receivedData) {
    let parsedData = JSON.parse(receivedData);
    // 把去、回程資料各自抓出來
    let to = parsedData[0].Stops;
    let from = parsedData[1].Stops;

    // 去程
    const toRoute = document.querySelector('.toRoute');
    const toTitle = document.createElement('div');
    toTitle.className = 'Title';
    toTitle.innerHTML = `<p>往${DestinationStop}</p>`;
    toRoute.appendChild(toTitle);

    for (let i = 0; i < to.length; i++) {

        if (i < to.length - 1) {
            const busStop = document.createElement('div');
            busStop.className = 'bus-stopCon';
            busStop.innerHTML = `<div class="bus-stop"><div class="line"></div></div><p>${to[i].StopName.Zh_tw}</p>`;
            toRoute.appendChild(busStop);
        } else {
            const busStop = document.createElement('div');
            busStop.className = 'bus-stopCon';
            busStop.innerHTML = `<div class="bus-stop"><div></div></div><p>${to[i].StopName.Zh_tw}</p>`;
            toRoute.appendChild(busStop);
        }
    }

    // 回程
    const fromRoute = document.querySelector('.fromRoute');
    const fromTitle = document.createElement('div');
    fromTitle.className = 'Title';
    fromTitle.innerHTML = `<p>往${DepartureStop}</p>`;
    fromRoute.appendChild(fromTitle);

    for (let i = 0; i < from.length; i++) {

        if (i < from.length - 1) {
            const busStop = document.createElement('div');
            busStop.className = 'bus-stopCon';
            busStop.innerHTML = `<div class="bus-stop"><div class="line"></div></div><p>${from[i].StopName.Zh_tw}</p>`;
            fromRoute.appendChild(busStop);
        } else {
            const busStop = document.createElement('div');
            busStop.className = 'bus-stopCon';
            busStop.innerHTML = `<div class="bus-stop"><div></div></div><p>${from[i].StopName.Zh_tw}</p>`;
            fromRoute.appendChild(busStop);
        }
    }

} else {
    console.log('查無資料！');
}

if (route) {

    document.addEventListener("DOMContentLoaded", function () {
        getAuthorizationHeader();
    });

    function getAuthorizationHeader() {
        const parameters = {
            grant_type: "client_credentials",
            client_id: "c14712369-dfd8e505-1843-44f2",
            client_secret: "a6900643-59bf-41a3-b142-d3b4bc99c575"
        };

        const authUrl = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

        fetch(authUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(parameters),
        })
            .then(response => response.json())
            .then(data => {
                token = data.access_token;
                // 請在這裡調用 API 請求
                getApiResponse();
            })
            .catch(error => {
                // 處理錯誤
                console.error('Error:', error);
            });
    }

    function getApiResponse() {
        if (token) {
            const realTimeApiUrl = `https://tdx.transportdata.tw/api/basic/v2/Bus/RealTimeByFrequency/City/Taipei/${route}?%24top=30&%24format=JSON`;

            // 發送第一個 API 請求
            fetch(realTimeApiUrl, {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + token,
                },
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    const RouteRealTimeData = data.map((item) => ({
                        Azimuth: item.Azimuth,
                        // 其他需要的屬性
                    }));
                    console.log(RouteRealTimeData);
                })
                .catch(error => {
                    // 處理 API 請求錯誤
                    console.error('Error:', error);
                });
        }
    }
}
