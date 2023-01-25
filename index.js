function updateCardInProgress(card) {
    const body = {
      title: card.children[0].textContent,
      description: card.children[2].textContent,
      isInProgress: true,
      completed: false,
    };

    const callback = (_) => post(card);
    requestToServer(
      `http://localhost:3000/tasks/${card.getAttribute("data-post-id")}`,
      "PUT",
      body,
      callback
    );
  }
  
  const done = document.querySelector(".done");
  const server = "http://localhost:3000/tasks";
  fetch("http://localhost:3000/tasks")
    .then((data) => data.json())
    .then((data) => {
      data.forEach((task) => {
        const { id, title, description, isInProgress, completed } = task;
        const toDoTask = createACard(title, description);
        toDoTask.setAttribute("data-task-id", id);
        if (completed) {
          const done = document.querySelector(".done");
          done.appendChild(toDoTask);
        } else if (isInProgress) {
          const inProgress = document.querySelector(".in-progress");
          inProgress.appendChild(toDoTask);
        } else {
          const toDo = document.querySelector(".todo");
          toDo.appendChild(toDoTask);
        }
      });
    });
  
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault(); //event does not get explicitly handled, its default action should not be taken as it normally would be.
    const form = event.target;
    const description = form.querySelector("textarea").value;
    const title = form.querySelector("input").value;
    const body = {
      title: title,
      description: description,
      isInProgress: false,
      completed: false,
    };
    const callback = (data) => {
      const { id, title, description } = data;
      const cardtodo = createACard(title, description);
      cardtodo.setAttribute("data-task-id", id);
      todo.appendChild(cardtodo);
    };
    requestToServer("http://localhost:3000/tasks", "POST", body, callback);
    window.location.reload();
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
        if (data.ok) {
          return data.json();
        } else {
          throw "Error 400";
        }
      })
      .then((data) => {
        if (data !== undefined) {
          callback(data);
        }
      });
  }
  
  function createACard(title, description) {
    const cardtitle = document.createElement("h2");
    cardtitle.textContent = title;
  
    const carddescription = document.createElement("p");
    cardtitle.textContent = description;
  
    const cardtodo = document.createElement("li");
    cardtodo.appendChild(cardtitle);
    cardtodo.appendChild(carddescription);
    cardtodo.classList.add("card");
    cardtodo.addEventListener("click", (event) =>
      event.target.classList.toggle("selected")
    );
  
    return cardtodo;
  }
  
  function moveCardToDone(card) {
    inProgress.removeChild(card);
    done.appendChild(card);
    card.classList.remove("selected");
  }
  
  function moveCardToInProgress(card) {
    todo.removeChild(card);
  
    inProgress.appendChild(card);
    card.classList.remove("selected");
  }
  
  function updateCardDone(card) {
    const body = {
      title: card.children[0].textContent,
      description: card.children[1].textContent,
      isInProgress: false,
      completed: true,
    };
  
    const callback = (_) => {
      moveCardToDone(card);
    };
  
    requestToServer(
      `http://localhost:3000/tasks/${card.getAttribute("data-task-id")}`,
      "PUT",
      body,
      callback
    );
  }
  
  function updateCardInProgress(card) {
    const body = {
      title: card.children[0].textContent,
      description: card.children[1].textContent,
      isInProgress: true,
      completed: false,
    };
    const callback = (_) => moveCardToInProgress(card);
    requestToServer(
      `http://localhost:3000/tasks/${card.getAttribute("data-task-id")}`,
      "PUT",
      body,
      callback
    );
  }
  
  document
    .querySelector("#move-to-in-progress")
    .addEventListener("click", (event) => {
      event.preventDefault();
      todo.querySelectorAll(".selected").forEach((card) => {
        updateCardInProgress(card);
        window.location.reload();
      });
    });
  
  document.querySelector("#move-to-done").addEventListener("click", (event) => {
    event.preventDefault();
    todo.querySelectorAll(".selected").forEach((card) => {
      updateCardDone(card);
      window.location.reload();
    });
  });