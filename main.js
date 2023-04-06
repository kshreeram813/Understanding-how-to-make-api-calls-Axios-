//axios globals
axios.defaults.headers.common["X-Auth-Token"] =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
//!get tokens from jwt.io
// GET REQUEST
function getTodos() {
  // there are couple of ways to make get requests
  //1. axios
  // axios({
  //   method: "get",
  //   url: "https://jsonplaceholder.typicode.com/todos",
  //   params: {
  //     _limit: 5,
  //   },
  //   })
  //go to json placeholder and paste the url of todos or anything u want
  //   .then((res) => showOutput(res)) //this returns a promise so .then
  //   .catch((err) => console.log(err)); //for error handling
  //when u click get u can see things stored in an obj and all data are stored in an array of the todos we need to fetch
  // request is stored in the form of XMLHTTPREQUEST ; if u use node js it will be CLIENT request instance
  // showOutput  shows this in browser window
  //  this is long method

  // instead we can do

  axios
    .get("https://jsonplaceholder.typicode.com/todos?_limit=5", {
      timeout: 5000, // extra functionality u can set time out
    }) //attaching params after ? is better way to write params
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

// POST REQUEST
function addTodo() {
  axios
    .post("https://jsonplaceholder.typicode.com/todos", {
      title: "New Todo",
      completed: false,
    })
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

// PUT/PATCH REQUEST  -- put replaces entire resource while  patch does the  update functionality
function updateTodo() {
  axios
    .put("https://jsonplaceholder.typicode.com/todos/1", {
      title: "Updated todo",
      completed: true,
    }) // we need to put id to put/patch or delete request we need to include the id in our case its "1"
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

// DELETE REQUEST
function removeTodo() {
  axios
    .delete("https://jsonplaceholder.typicode.com/todos/1")
    // no need to specify data cuz we r simply deleting it just needs id

    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

// SIMULTANEOUS DATA
//to get simultaneoes data using axios all we can get posts  and todos and others in an array
function getData() {
  axios
    .all([
      axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5"),
      axios.get("https://jsonplaceholder.typicode.com/posts?_limit=5"),
    ])
    .then(axios.spread((todos, posts) => showOutput(posts)))
    .catch((err) => console.log(err));
  //axios.spread used to spread array of arguments into multiple arguments.it prevents error for multiple ajax req with axios
}

// CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "sometoken",
    },
  };

  axios
    .post(
      "https://jsonplaceholder.typicode.com/todos",
      {
        title: "New Todo",
        completed: false,
      },
      config
    )
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

// TRANSFORMING REQUESTS & RESPONSES
//nnot used much
//can transform ur response or request in certain way
function transformResponse() {
  const options = {
    method: "post",
    url: "https://jsonplaceholder.typicode.com/todos",
    data: {
      title: "Hello World",
    },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase();
      return data;
    }),
  };
  //transformed the title into uppercase
  //we will get helloworld in uppercase if we click transform

  axios(options).then((res) => showOutput(res));
}

// ERROR HANDLING
function errorHandling() {
  axios
    .get("https://jsonplaceholder.typicode.com/todoss", {
      // validateStatus: function (status) {
      //   return status < 500; // reject only if status is greater than 500
      // },
    })
    .then((res) => showOutput(res))
    .catch((err) => {
      if (err.response) {
        //if server responded with status other than 200 range(success range)
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);

        if (err.response.status === 404) {
          alert("Error: Page not found");
        }
      } else if (err.request) {
        //request was made but no response
        console.log(err.request);
      } else {
        console.log(err.message);
      }
    });
}

// CANCEL TOKEN
// to cancel requests on the fly
function cancelToken() {
  const source = axios.cancelToken.source();

  axios
    .get("https://jsonplaceholder.typicode.com/todos", {
      cancelToken: source.token,
    })
    .then((res) => showOutput(res))
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log("Request cancelled", thrown.message);
      }
    });

  if (true) {
    source.cancel("Request cancelled");
  }
}

// INTERCEPTING REQUESTS & RESPONSES
//how to create interceptors
//interceptors: allows us to intercept the request and run some functionality like a logger
axios.interceptors.request.use(
  (config) => {
    console.log(
      `${config.method.toUpperCase()} request sent to ${
        config.url
      } at ${new Date().getTime()}`
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AXIOS INSTANCES
const axiosInstance = axios.create({
  //you can have other custom settings
  baseURL: "https://jsonplaceholder.typicode.com",
});

axiosInstance.get("/comments").then((res) => showOutput(res));

// Show output in browser
function showOutput(res) {
  document.getElementById("res").innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById("get").addEventListener("click", getTodos);
document.getElementById("post").addEventListener("click", addTodo);
document.getElementById("update").addEventListener("click", updateTodo);
document.getElementById("delete").addEventListener("click", removeTodo);
document.getElementById("sim").addEventListener("click", getData);
document.getElementById("headers").addEventListener("click", customHeaders);
document
  .getElementById("transform")
  .addEventListener("click", transformResponse);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("cancel").addEventListener("click", cancelToken);
