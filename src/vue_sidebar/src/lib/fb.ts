
let fbPromise : Promise<fb.FacebookStatic>;
export function getFacebookSDK()  {
  if (fbPromise) {
    return fbPromise;
  }

  fbPromise = new Promise((resolve, reject) => {
    window.fbAsyncInit = function() {
      resolve(window.FB);
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      // @ts-ignore
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      // @ts-ignore
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });

  return fbPromise;
}

interface FacebookAuthResponse {
  status: string;
  authResponse: {
    accessToken: string;
    expiresIn: string;
    signedRequest: string;
    userID: string;
  };
}

interface FacebookDataResponse<T> {
  data: Array<T>;
  paging?: {
    cursors?: {
      before?: string;
      after?: string;
    }
    previous?: string;
    next?: string;
  };
}

export interface FacebookAccount {
  id: string;
  name: string;
  access_token: string;
  category: string;
  category_list: Array<{
    id: string;
    name: string;
  }>;
  tasks: Array<string>;
}

// fb api promise
export const fbApi = (api: string, params?: any) => {
  return new Promise(async (resolve, reject) => {
    (await getFacebookSDK()).api(api, params, (response: any) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response);
      }
    });
  });
}

// fb api get all with cursor paging
export const fbApiAll = async (api: string, params?: any) => {
  const response = await fbApi(api, params) as FacebookDataResponse<any>;
  if (response.data && response.paging && response.paging.next) {
    const nextResponse = await fbApiAll(response.paging.next);
    response.data = response.data.concat(nextResponse.data);
  }
  return response;
}