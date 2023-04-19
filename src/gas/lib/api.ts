import URLFetchRequest = GoogleAppsScript.URL_Fetch.URLFetchRequest;

interface MyCommonRequest {
    url: string
    body?: any,
    method?: 'get' | 'post',
    headers?
}

function buildPostRequest(request: MyCommonRequest): URLFetchRequest {
    const headers = {
        'Content-Type': 'application/json;charset=utf-8',
        ...request.headers
    }

    const {accessToken} = PropertiesService.getDocumentProperties().getProperties()
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`
    }

    const builtRequest = UrlFetchApp.getRequest(request.url, {
        method: request.method || (request.body ? 'post' : 'get'),
        payload: JSON.stringify(request.body),
        headers: headers,
        muteHttpExceptions: false,
    })
    delete (builtRequest.headers['X-Forwarded-For'])
    // console.log(builtRequest)
    return builtRequest
}

export function fetchJson(request: MyCommonRequest) {
    return fetchAllJson([request])[0]
}

export function fetchAllJson(requests: MyCommonRequest[]) {
    const responses = UrlFetchApp.fetchAll(requests.map(request => {
        return buildPostRequest(request)
    }));
    return responses.map((response) => {
        const json = response.getContentText();
        return JSON.parse(json)
    })
}
