// apiFunctions.js

let token = '';

function getAuthorizationHeader() {
    const parameters = {
        grant_type: "client_credentials",
        client_id: "c14712369-dfd8e505-1843-44f2",
        client_secret: "a6900643-59bf-41a3-b142-d3b4bc99c575"
    };

    const authUrl = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

    return fetch(authUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(parameters),
    })
        .then(response => response.json())
        .then(data => {
            token = data.access_token;
            return token;
        })
        .catch(error => {
            // 處理錯誤
            console.error('Error:', error);
        });
}

function getApiResponse(apiUrl, processData) {
    if (token) {
        return fetch(apiUrl, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token,
            },
        })
            .then(response => response.json())
            .then(data => {
                // 根據傳入的處理函數處理數據
                return processData(data);
            })
            .catch(error => {
                // 處理 API 請求錯誤
                console.error('Error:', error);
            });
    }
}