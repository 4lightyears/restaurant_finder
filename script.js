const api_key = "456dac54f8ffe11bc137b4566412057c";
const form = document.getElementById("query-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  let location = formData.get("location");

  getLocation(location);
});

function checkStatus(response) {
  if (response.status !== 200) {
    console.log("error with Status Code: " + response.status);
    return;
  }
}

function getLocation(query) {
  var entityId;
  var entityType;
  var urlLocations =
    "https://developers.zomato.com/api/v2.1/locations?query=" + query;
  fetch(urlLocations, {
    headers: {
      "user-key": api_key,
    },
  })
    .then(function (response) {
      checkStatus(response);

      response.json().then(function (data) {
        entityId = data.location_suggestions[0]["entity_id"];
        entityType = data.location_suggestions[0]["entity_type"];
        title = data.location_suggestions[0]["title"];
        totalResults = data["results_found"];
        start = data["results_start"];
        resultsShown = data["results_shown"];
        getRestaurants(entityId, entityType, title, 0);
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
}

function getRestaurants(entityId, entityType, title, startPoint) {
  let entity_id = entityId;
  let entity_type = entityType;
  let q = title;
  let start = startPoint;
  let totalResults;
  let restaurantsList = [];
  let urlLocationDetails =
    "https://developers.zomato.com/api/v2.1/search?entity_id=" +
    entity_id +
    "&entity_type=" +
    entity_type +
    "&q=" +
    q +
    "&start=" +
    start +
    "&count=20&radius=5000&sort=real_distance&order=asc";
  fetch(urlLocationDetails, {
    headers: {
      "user-key": api_key,
    },
  })
    .then(function (response) {
      checkStatus(response);

      response.json().then(function (data) {
        let size = data["restaurants"].length;
        totalResults = data["results_found"];
        for (var i = 0; i < size; i++) {
          restaurantsList.push([
            data["restaurants"][i]["restaurant"]["name"] +
              " | Rating: " +
              data["restaurants"][i]["restaurant"]["user_rating"][
                "aggregate_rating"
              ],
          ]);
          start++;
        }
        function createElement(name) {
          let li = document.createElement("li");
          li.setAttribute("class", "restaurant-name");
          li.textContent = name;
          return li;
        }
        const resList = document.querySelector("#restaurant-list");
        for (var k of restaurantsList) {
          resList.appendChild(createElement(k));
        }
        if (document.getElementById("load-more")) {
          let item = document.getElementById("list-data");
          let itemLoadMore = document.getElementById("load-more");
          item.removeChild(itemLoadMore);
        }

        let listDataRestaurants = document.getElementById("list-data");
        let buttonLoadMore = document.createElement("button");
        buttonLoadMore.setAttribute("id", "load-more");
        buttonLoadMore.textContent = "Load More";
        listDataRestaurants.appendChild(buttonLoadMore);

        if (start >= 100) {
          let item = document.getElementById("list-data");
          let itemLoadMore = document.getElementById("load-more");
          item.removeChild(itemLoadMore);
        }

        buttonLoadMore.addEventListener("click", (e) => {
          e.preventDefault();
          getRestaurants(entity_id, entity_type, q, start);
        });
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
}
