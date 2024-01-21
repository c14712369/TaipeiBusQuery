function onTitleLoad() {
    var squareElements = document.querySelectorAll('.square');

    squareElements.forEach(function (square) {
        square.classList.remove('square-hidden');
    });
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
            }
        }, 300)
    });
});
