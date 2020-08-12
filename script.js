const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;

let photosArray = [];

// Unsplash Request Setup
let unplashRequestCount = 5; // initializing only 5 GET requests to improve performance.

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
    // making 10 GET requests after loading the home page (when scrolling down).
    unplashRequestCount = 10;
  }
}
// Create Elements For Links and Photos, Add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // Run function for each object in photosArray
  photosArray.forEach((photo) => {
    // Create <a> to link to Unsplash
    const item = document.createElement("a");
    item.setAttribute("href", photo.links.html);
    item.setAttribute("target", "_blank");
    //Create <img> for photo
    const img = document.createElement("img");
    img.setAttribute("src", photo.urls.regular);
    img.setAttribute("alt", photo.alt_description);
    img.setAttribute("title", photo.alt_description);

    // Event Listener, check when each is finished loading
    img.addEventListener("load", imageLoaded);

    // Put <img> inside <a>, then put both inside imageContainer Element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}
// Get photos from Unsplash API
async function getPhotos() {
  try {
    /* See the folder 'infinity-scroll-aws-lambda' for the code of this AWS Lambda function
    (it's just for fun and to hide the Unsplash Secret Key which otherwise would be committed in this repo.)*/
    const response = await fetch(
      `https://656mkg3wdc.execute-api.us-east-1.amazonaws.com/dev/unsplash/api?unplashRequestCount=${unplashRequestCount}`
    );
    const responseJson = await response.json();

    photosArray = responseJson.input; //this .input is a key of the object returned from the AWS Lambda function.
    displayPhotos();
  } catch (error) {
    console.log(error);
    // Error Handling
  }
}
// Check to see if scrolling near bottom of page, if so, load more photos
window.addEventListener("scroll", () => {
  // This works too: window.scrollY >= document.body.offsetHeight * 0.8 && ready
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false; //This is used to avoid fetching too many images, since scrolling events are triggered when the user continues to scroll down the page.
    getPhotos();
  }
});
// Onload
getPhotos();
