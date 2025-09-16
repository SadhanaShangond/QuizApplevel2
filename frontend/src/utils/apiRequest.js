async function apiRequest(options) {
    const {
        endpoint,
        method = "GET",
        includeAuth = true,
        body = undefined,
    } = options;

    //Create a new Headers Object
    const headers = new Headers();

    //if the body is an object,set the "content-type" header to "application/json" and stringyfy the body

    let requestBody = body;
    if(body && typeof body === "object"){
        headers.append("Content-Type","application/json");
       requestBody = JSON.stringify(body);
    }

    //if includeAuth is true and there is an access token in localStorage,append in "authorization header with access token"

    if(includeAuth && localStorage.getItem("accessToken"))
        {
        headers.append(
          "Authorization",
          `Bearer ${localStorage.getItem("accessToken")}`
        );
    }

    //Create a new Url object with the base url from the environment variables and the endpoints

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const url = new URL(endpoint, baseUrl);


    //make a fetch request to the api endpoint with specific methods ,headers and body

    const response = await fetch(url, { method, headers, body: requestBody });
    //return the response from the api
    return response;

}
export default apiRequest;