// 從routeQuery帶回來之資料
let receivedData = sessionStorage.getItem("RouteData");
let route = sessionStorage.getItem("RouteName");
let RouteCity = sessionStorage.getItem("RouteCity");
let DestinationStop = sessionStorage.getItem("DestinationStop");
let DepartureStop = sessionStorage.getItem("DepartureStop");
let estimatedArrivalTime;

// 去、回程車站站牌的座標
let to
let from

// API所需參數
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
  // 把去、回程資料各自抓出來
  let parsedData = JSON.parse(receivedData);
  to = parsedData[0].Stops;
  from = parsedData[1].Stops;

  // 抓取當前路線公車的預計到站時間
  getAuthorizationHeader()
}

// 獲取TDX Token，呼叫預計到站時間API
function getAuthorizationHeader() {
  try {
    let parameters = {
      grant_type: "client_credentials",
      client_id: "c14712369-dfd8e505-1843-44f2",
      client_secret: "a6900643-59bf-41a3-b142-d3b4bc99c575",
    };

    let authUrl =
      "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

    $.ajax({
      type: "POST",
      url: authUrl,
      crossDomain: true,
      dataType: 'JSON',
      data: parameters,
      async: false,
      success: function (data) {
        token = data.access_token
        getEstimatedArrivalTime(token)
      },
      error: function (xhr, textStatus, thrownError) {
      }
    });
  } catch (error) {
    console.error("授權失敗：", error);
  }
}

// 預計到站時間API
function getEstimatedArrivalTime(token) {
  $.ajax({
    type: 'GET',
    url: `https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/${RouteCity}/${route}?&%24format=JSON`,
    headers: {
      "Authorization": "Bearer " + token,
    },
    async: false,
    success: function (Data) {
      console.log(Data)
      processTo(Data)
      processFrom(Data)
    },
    error: function (xhr, textStatus, thrownError) {
      console.log('Error:', thrownError);
    }
  });
}

// 處理去程HTML
function processTo(estimatedArrivalTime) {
  // 處理去程
  let toRoute = document.querySelector(".toRoute");
  let toTitle = document.createElement("div");
  toTitle.className = "Title";
  toTitle.innerHTML = `<p>往${DestinationStop}</p>`;
  toRoute.appendChild(toTitle);

  for (let i = 0; i < to.length; i++) {
    // 找出公車預估到站時間
    let stopData = estimatedArrivalTime.filter((bus) => bus.StopName.Zh_tw === to[i].StopName.Zh_tw);
    // 轉換成分鐘
    let arrivedTime = Math.round(stopData[0].EstimateTime / 60);
    console.log(stopData)
    console.log(arrivedTime)

    // 渲染到站時間
    let busArrivedText;

    if (arrivedTime > 1) {
      busArrivedText = `${arrivedTime} 分鐘到站`;
    } else if (arrivedTime > 0 && arrivedTime < 1) {
      busArrivedText = '即將到站';
    } else if (arrivedTime === 0) {
      busArrivedText = '即將到站'; // 或者你可以設定為其他文字，視情況而定
    } else {
      busArrivedText = '未發車';
    }

    // 處理HTML
    if (i < to.length - 1) {
      let busStop = document.createElement("div");
      busStop.className = "bus-stopCon";
      busStop.innerHTML = `<div class="bus-stop"><div class="line"></div></div><p>${to[i].StopName.Zh_tw}</p><button>${busArrivedText}</button>`;
      toRoute.appendChild(busStop);
    } else {
      let busStop = document.createElement("div");
      busStop.className = "bus-stopCon";
      busStop.innerHTML = `<div class="bus-stop"><div></div></div><p>${to[i].StopName.Zh_tw}</p><button>${busArrivedText}</button>`;
      toRoute.appendChild(busStop);
    }
  }
}

// 處理回程HTML
function processFrom(estimatedArrivalTime) {
  // 處理回程
  let fromRoute = document.querySelector(".fromRoute");
  let fromTitle = document.createElement("div");
  fromTitle.className = "Title";
  fromTitle.innerHTML = `<p>往${DepartureStop}</p>`;
  fromRoute.appendChild(fromTitle);

  for (let i = 0; i < from.length; i++) {
    // 找出公車預估到站時間
    let stopData = estimatedArrivalTime.filter((bus) => bus.StopName.Zh_tw === from[i].StopName.Zh_tw);
    // 轉換成分鐘
    let arrivedTime = Math.round(stopData[0].EstimateTime / 60);
    console.log(stopData)
    console.log(arrivedTime)

    // 渲染到站時間
    let busArrivedText;

    if (arrivedTime > 1) {
      busArrivedText = `${arrivedTime} 分鐘到站`;
    } else if (arrivedTime > 0 && arrivedTime < 1) {
      busArrivedText = '即將到站';
    } else if (arrivedTime === 0) {
      busArrivedText = '即將到站'; // 或者你可以設定為其他文字，視情況而定
    } else {
      busArrivedText = '未發車';
    }

    if (i < from.length - 1) {
      let busStop = document.createElement("div");
      busStop.className = "bus-stopCon";
      busStop.innerHTML = `<div class="bus-stop"><div class="line"></div></div><p>${from[i].StopName.Zh_tw}</p><button>${busArrivedText}</button>`;
      fromRoute.appendChild(busStop);
    } else {
      let busStop = document.createElement("div");
      busStop.className = "bus-stopCon";
      busStop.innerHTML = `<div class="bus-stop"><div></div></div><p>${from[i].StopName.Zh_tw}</p><button>${busArrivedText}</button>`;
      fromRoute.appendChild(busStop);
    }
  }
}
