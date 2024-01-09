function onTitleLoad() {
    var squareElements = document.querySelectorAll('.square');

    squareElements.forEach(function (square) {
        square.classList.remove('square-hidden');
    });
}

function successCallback(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log("緯度: " + latitude + ", 經度: " + longitude);
}

function errorCallback(error) {
    console.error("無法取得User地理位置： " + error.message);
}

function redirect(url) {
    window.location.href = url;
}

document.addEventListener('DOMContentLoaded', function () {
    var titleElement = document.getElementById('title');
    titleElement.addEventListener('animationend', function (event) {
        setTimeout(() => {
            if (event.animationName === 'moveUp') {
                onTitleLoad();

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
                } else {
                    console.log("此瀏覽器無法使用navigator.geolocation");
                }
            }
        }, 300)
    });
});
