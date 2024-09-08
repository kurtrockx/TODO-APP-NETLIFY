"use strict";

const currentTasks = document.querySelector(".current-tasks");
const newTaskButton = document.querySelector(".newTask-button");
const submitTaskButton = document.querySelector(".submit-task");
const addTaskContainer = document.querySelector(".add-task");
const inputTask = document.querySelector(".input-task");
let taskArray = [];

class Task {
  _date = new Date();
  date = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(this._date);

  time = `${this._date.getHours() % 12}:${this._date.getMinutes()} ${
    this._date.getHours() > 12 ? "PM" : "AM"
  }`;
  constructor(taskName) {
    this.taskName = taskName;
  }

  isFinished = false;
}

//Save to local storage
const saveTask = function (arr) {
  localStorage.setItem("tasks", JSON.stringify(arr));
};
//Get from local Storage
const getTask = function () {
  const data = JSON.parse(localStorage.getItem("tasks"));
  if (!data) return;
  taskArray = data;
  renderTasks(taskArray);
};

//Show input field for new task submittion
const toggleInput = function () {
  addTaskContainer.classList.toggle("hide");
  inputTask.value = "";
    inputTask.focus();
};
newTaskButton.addEventListener("click", toggleInput);

//Render tasks to container
const renderTasks = function (arr) {
  currentTasks.innerHTML = "";
  arr.forEach((e, i) => {
    const finishedHTML =
      e.isFinished === true
        ? `<s class="task-name">${e.taskName}</s>`
        : `<p class="task-name">${e.taskName}</p>`;

    const html = `
    <div class="task" name="task-select" data-task="${i}">
    <input type="checkbox" class="checkbox" name="task-select" data-task="${i}" ${
      e.isFinished === true ? 'checked="true"' : ""
    }/>
    ${finishedHTML}
      <button class="delete-task">✖</button>
    </div>
      `;
    currentTasks.insertAdjacentHTML("beforeend", html);
  });
};

//Add new task to task array and insert html
const submitFunction = () => {
  if (!inputTask.value) return;
  const newTask = new Task(inputTask.value);
  taskArray.push(newTask);
  renderTasks(taskArray);
  saveTask(taskArray);
  toggleInput();
};

submitTaskButton.addEventListener("click", submitFunction);
window.addEventListener("keydown", function (e) {
  if (e.key === "Enter") submitFunction();
});

//Delete task
currentTasks.addEventListener("click", function (e) {
  const deleteBtn = e.target.closest(".delete-task");
  if (!deleteBtn) return;
  const taskDel = deleteBtn.closest(".task").dataset.task;
  taskArray.splice(taskDel, 1);
  renderTasks(taskArray);
  saveTask(taskArray);
  if (!taskArray[0]) {
    localStorage.removeItem("tasks");
    location.reload();
  }
});
//Complete a task
currentTasks.addEventListener("click", function (e) {
  const clicked = e.target.closest(".checkbox");
  if (!clicked) return;
  const toFinish = clicked.dataset.task;

  if (clicked.checked) {
    taskArray.at(toFinish).isFinished = true;
  } else {
    taskArray.at(toFinish).isFinished = false;
  }
  saveTask(taskArray);
  renderTasks(taskArray);
});

getTask();
