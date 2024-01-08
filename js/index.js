function searchBus() {
    // 在此處實現搜尋公車資訊的邏輯
    // 可以使用 JavaScript 來動態生成和更新列表
    // 也可以使用 AJAX 或其他技術從後端獲取資料
}

function showRoute(busNumber) {
    // 在此處實現顯示路線上所有站名的邏輯
    // 可以使用 JavaScript 來動態生成和更新列表
    // 也可以使用 AJAX 或其他技術從後端獲取資料
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
} else {
    console.log("此瀏覽器無法使用navigator.geolocation");
}

function successCallback(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log("緯度: " + latitude + ", 經度: " + longitude);
}

function errorCallback(error) {
    console.error("無法取得User地理位置： " + error.message);
}
