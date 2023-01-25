const login = document.querySelector(".login_form");

login.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const userName = form.querySelector("input").value;
  const body = {
    name: userName,
  };
  callback = (_) => {
    console.log("User logged in");
  };

  requestToServer("http://localhost:3000/login", "POST", body, callback);
  window.location.href = "index.html";
  form.reset();
});

function requestToServer(url, method, body, callback) {
    fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((data) => {
        if (!data.ok) {
          throw "Cannot fetch data";
        } else {
          return data.json();
        }
      })
      .finally((data) => {
        if (data !== undefined) {
          callback(data);
        }
      });
  }