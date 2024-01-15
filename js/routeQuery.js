const input = document.getElementById('busSearch');
const resultsContainer = document.getElementById('results-container');

let TaipeiBusRoutes = [];
let NewTaipeiBusRoutes = [];
let AllBusRoutes = [];

let TaipeiRes = '';
let NewTaipeiRes = '';

let token = '';
let response = '';

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
        const taipeiApiUrl = 'https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Taipei?$format=JSON';
        const newTaipeiApiUrl = 'https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/NewTaipei?$format=JSON';

        // 發送第一個 API 請求
        fetch(taipeiApiUrl, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token,
            },
        })
            .then(response => response.json())
            .then(data => {
                TaipeiRes = data;
                TaipeiBusRoutes = data.map((i) => {
                    return i.RouteName.Zh_tw;
                });
                AllBusRoutes = AllBusRoutes.concat(TaipeiBusRoutes);
            })
            .catch(error => {
                // 處理 API 請求錯誤
                console.error('Error:', error);
            });

        // 發送第二個 API 請求
        fetch(newTaipeiApiUrl, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token,
            },
        })
            .then(response => response.json())
            .then(data => {
                NewTaipeiRes = data;
                NewTaipeiBusRoutes = data.map((i) => {
                    return i.RouteName.Zh_tw;
                });
                AllBusRoutes = AllBusRoutes.concat(NewTaipeiBusRoutes);
            })
            .catch(error => {
                // 處理 API 請求錯誤
                console.error('Error:', error);
            });
    }
}

input.addEventListener('input', function () {
    const inputValue = input.value.trim().toLowerCase();
    const resultItemClass = 'result-item';
    const matchingRoutes = AllBusRoutes.filter(route => route.slice(0, inputValue.length).toLowerCase() === inputValue);
    resultsContainer.innerHTML = '';

    if (inputValue !== '') {
        if (matchingRoutes.length > 0) {
            matchingRoutes.forEach(route => {
                const resultItem = document.createElement('div');
                resultItem.classList.add(resultItemClass);

                // 找到對應的路線資訊
                const routeInfo = findRouteInfo(route);

                if (routeInfo) {
                    // 建立顯示資訊的元素
                    const routeInfoElement = document.createElement('div');
                    routeInfoElement.innerHTML = `<span>${routeInfo.DepartureStopNameZh} — ${routeInfo.DestinationStopNameZh}</span><br><p>路線名稱： ${route}</p>`;

                    // 添加ID
                    routeInfoElement.setAttribute('id', route);

                    // 將資訊加入 resultItem
                    resultItem.appendChild(routeInfoElement);

                    // 傳送路線名稱
                    sessionStorage.setItem('DestinationStop', routeInfo.DestinationStopNameZh);
                    sessionStorage.setItem('DepartureStop', routeInfo.DepartureStopNameZh);
                    sessionStorage.setItem('Route', route);
                } else {
                    // 若找不到路線資訊，僅顯示路線名稱
                    resultItem.textContent = route;
                }
                // 將 resultItem 加入到 resultsContainer
                resultsContainer.appendChild(resultItem);

                // 設定點擊事件
                resultItem.addEventListener('click', function () {
                    let stopApiUrl = `https://tdx.transportdata.tw/api/basic/v2/Bus/StopOfRoute/City/Taipei/${route}?$top=30&$format=JSON`;
                    fetch(stopApiUrl, {
                        method: 'GET',
                        headers: {
                            "Authorization": "Bearer " + token,
                        },
                    })
                        .then(response => response.json())
                        .then(data => {
                            sessionStorage.setItem('RouteData', JSON.stringify(data));
                            window.location.href = '../html/showQuery.html';
                        })
                        .catch(error => {
                            // 處理 API 請求錯誤
                            console.error('Error:', error);
                        });
                });
            });
        };
    }
})

// 在所有路線中尋找特定路線的資訊
function findRouteInfo(routeName) {
    const allRoutes = TaipeiRes.concat(NewTaipeiRes);
    const routeInfo = allRoutes.find(route => route.RouteName.Zh_tw === routeName);
    return routeInfo;
}

