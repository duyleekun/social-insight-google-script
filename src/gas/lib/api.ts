import URLFetchRequest = GoogleAppsScript.URL_Fetch.URLFetchRequest;

type UrlQuery = {[k in string]: string|number|boolean}
interface MyCommonRequest {
    url: string
    body?: any,
    method?: 'get' | 'post',
    headers?,
    query? : UrlQuery
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
    let url = request.url
    if (request.query) {
        url = makeQueryString(url, request.query)
    }
    const builtRequest = UrlFetchApp.getRequest(url, {
        method: request.method || (request.body ? 'post' : 'get'),
        payload: JSON.stringify(request.body),
        headers: headers,
        muteHttpExceptions: true,
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
        const text = response.getContentText();
        if (response.getResponseCode() >= 400) {
            console.error(text)
        }
        return JSON.parse(text)
    })
}

const makeQueryString = (url, params : UrlQuery = {}) => {
    const paramString = Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + paramString;
};
