"use strict";
const fetch = require("node-fetch");
const apiKey = "YOUR_UNSPLASH_SECRET_KEY";

module.exports.wrapUnsplashKeyAPI = async (event, context, callback) => {
  const unplashRequestCount = event.queryStringParameters.unplashRequestCount;
  const response = await unsplashFetch(unplashRequestCount);

  callback(null, response);
};

const unsplashFetch = (count) => {
  const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;
  return fetch(apiUrl)
    .then((resp) => resp.json())
    .then((response) => ({
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: response,
      }),
    }))
    .catch((err) => ({
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Unable to get resource",
        error: err,
      }),
    }));
};
