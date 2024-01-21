let receivedData = sessionStorage.getItem("RouteData");
let route = sessionStorage.getItem("RouteName");
let RouteCity = sessionStorage.getItem("RouteCity");
let DestinationStop = sessionStorage.getItem("DestinationStop");
let DepartureStop = sessionStorage.getItem("DepartureStop");
let RouteRealTimeData;
let apiID = "c14712369-dfd8e505-1843-44f2";
let apiKey = "a6900643-59bf-41a3-b142-d3b4bc99c575";
let options = {
  method: "post",
  headers: {
    "content-type": "application/x-www-form-urlencoded",
  },
  payload: {
    grant_type: "client_credentials",
    client_id: apiID,
    client_secret: apiKey,
  },
};

if (receivedData) {
  let parsedData = JSON.parse(receivedData);

  // 把去、回程資料各自抓出來
  let to = parsedData[0].Stops;
  let from = parsedData[1].Stops;

  // 去程
  const toRoute = document.querySelector(".toRoute");
  const toTitle = document.createElement("div");
  toTitle.className = "Title";
  toTitle.innerHTML = `<p>往${DestinationStop}</p>`;
  toRoute.appendChild(toTitle);

  // 抓取當前每台路線公車的座標
  getAuthorizationHeader().then(() => {
    for (let i = 0; i < to.length; i++) {
      //算出每個站牌，距離每個當前路線公車的時間，找出最短的那台並顯示到站時間
      let stopCoords = [
        to[i].StopPosition.PositionLat,
        to[i].StopPosition.PositionLon,
      ];

      initMap(stopCoords);

      // 處理HTML
      if (i < to.length - 1) {
        const busStop = document.createElement("div");
        busStop.className = "bus-stopCon";
        busStop.innerHTML = `<div class="bus-stop"><div class="line"></div></div><p>${to[i].StopName.Zh_tw}</p><button>123</button>`;
        toRoute.appendChild(busStop);
      } else {
        const busStop = document.createElement("div");
        busStop.className = "bus-stopCon";
        busStop.innerHTML = `<div class="bus-stop"><div></div></div><p>${to[i].StopName.Zh_tw}</p><button>123</button>`;
        toRoute.appendChild(busStop);
      }
    }

    // 回程
    const fromRoute = document.querySelector(".fromRoute");
    const fromTitle = document.createElement("div");
    fromTitle.className = "Title";
    fromTitle.innerHTML = `<p>往${DepartureStop}</p>`;
    fromRoute.appendChild(fromTitle);

    for (let i = 0; i < from.length; i++) {
      if (i < from.length - 1) {
        const busStop = document.createElement("div");
        busStop.className = "bus-stopCon";
        busStop.innerHTML = `<div class="bus-stop"><div class="line"></div></div><p>${from[i].StopName.Zh_tw}</p><button>123</button>`;
        fromRoute.appendChild(busStop);
      } else {
        const busStop = document.createElement("div");
        busStop.className = "bus-stopCon";
        busStop.innerHTML = `<div class="bus-stop"><div></div></div><p>${from[i].StopName.Zh_tw}</p><button>123</button>`;
        fromRoute.appendChild(busStop);
      }
    }
  })
} else {
  console.log("查無資料！");
}

async function getAuthorizationHeader() {
  try {
    const parameters = {
      grant_type: "client_credentials",
      client_id: "c14712369-dfd8e505-1843-44f2",
      client_secret: "a6900643-59bf-41a3-b142-d3b4bc99c575",
    };

    const authUrl =
      "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(parameters),
    });

    const data = await response.json();
    token = data.access_token;

    await getApiResponse(); // 授權成功後呼叫 getApiResponse
  } catch (error) {
    console.error("授權失敗：", error);
  }
}

async function getApiResponse() {
  if (token) {
    const realTimeApiUrl = `https://tdx.transportdata.tw/api/basic/v2/Bus/RealTimeByFrequency/City/${RouteCity}/${route}?%24top=30&%24format=JSON`;

    try {
      const response = await fetch(realTimeApiUrl, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await response.json();
      RouteRealTimeData = data.map((item) => ({
        Lat: item.BusPosition.PositionLat,
        Lon: item.BusPosition.PositionLon,
      }));
    } catch (error) {
      console.error("API 請求失敗：", error);
    }
  } else {
    console.error("請先取得授權 token 再進行 API 請求。");
  }
}

async function initMap(startCoords) {
  await getAuthorizationHeader();

  var directionsService = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer();

  for (const [index, value] of RouteRealTimeData.entries()) {
    let request = {
      origin: { lat: startCoords[0], lng: startCoords[1] },
      destination: { lat: index[value], lng: index[value + 1] },
      travelMode: "DRIVING",
    };

    directionsService.route(request, function (result, status) {
      if (status == "OK") {
        directionsRenderer.setDirections(result);
        let drivingTime = result.routes[0].legs[0].duration.text;
        console.log("大約抵達時間：", drivingTime);
      } else {
        console.error("搜尋失敗：", status);
      }
    });
  }
}
