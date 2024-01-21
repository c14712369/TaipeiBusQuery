navigator.geolocation.getCurrentPosition(function (position) {
    let location = [position.coords.latitude, position.coords.longitude]
    console.log(location)
}, function (error) {
    alert(error.message);
});

async function getApiResponse() {
    const realTimeApiUrl = `https://api.data.taipei/v1/Bus/Stops`;

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
}

