const input = document.getElementById('busSearch');
const resultsContainer = document.getElementById('results-container');

let TaipeiBusRoutes = [];
let NewTaipeiBusRoutes = [];
let AllBusRoutes = [];

let TaipeiRes = '';
let NewTaipeiRes = '';

fetch('https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/Taipei?%24&%24format=JSON').then(
    res => {
        return res.json();
    }
).then(data => {
    TaipeiRes = data;
    TaipeiBusRoutes = data.map((i) => {
        return i.RouteName.Zh_tw;
    });
    AllBusRoutes = AllBusRoutes.concat(TaipeiBusRoutes);
});

fetch('https://tdx.transportdata.tw/api/basic/v2/Bus/Route/City/NewTaipei?%24&%24format=JSON').then(
    res => {
        return res.json();
    }
).then(data => {
    NewTaipeiRes = data;
    NewTaipeiBusRoutes = data.map((i) => {
        return i.RouteName.Zh_tw;
    });
    AllBusRoutes = AllBusRoutes.concat(NewTaipeiBusRoutes);
});

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
                } else {
                    // 若找不到路線資訊，僅顯示路線名稱
                    resultItem.textContent = route;
                }
                // 將 resultItem 加入到 resultsContainer
                resultsContainer.appendChild(resultItem);

                // 設定點擊事件
                resultItem.addEventListener('click', function () {
                    fetch(`https://tdx.transportdata.tw/api/basic/v2/Bus/StopOfRoute/City/Taipei/${route}?%24top=30&%24format=JSON`).then(
                        res => {
                            return res.json();
                        }
                    ).then(data => {
                        sessionStorage.setItem('RouteData', JSON.stringify(data));
                        window.location.href = '../html/showQuery.html'
                    });
                });

            });
        }
    }
});

// 在所有路線中尋找特定路線的資訊
function findRouteInfo(routeName) {
    const allRoutes = TaipeiRes.concat(NewTaipeiRes);
    const routeInfo = allRoutes.find(route => route.RouteName.Zh_tw === routeName);
    return routeInfo;
}

