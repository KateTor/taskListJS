// define ui variables
const form = document.querySelector("#task-form");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");

// load all event listeners - instead of putting in global scope for submit
loadEventListeners();

function loadEventListeners() {
  // DOM Load event (loads existing tasks from local storage)
  document.addEventListener("DOMContentLoaded", getTasks);
  //add task function called
  form.addEventListener("submit", addTask);
  //remove task event
  taskList.addEventListener("click", removeTask);
  //clear task button
  clearBtn.addEventListener("click", clearTasks);
  //filter tasks event
  filter.addEventListener("keyup", filterTasks);
}

// Get tasks saved to local storage
function getTasks() {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  tasks.forEach(function (task) {
    //create a list item
    const li = document.createElement("li");
    // add classname
    li.className = "collection-item";
    // create text node and append to li
    li.appendChild(document.createTextNode(task));
    //create new link element
    const link = document.createElement("a");
    //add class, in materialize secondary content puts it to the right
    link.className = "delete-item secondary-content";
    // add icon html
    link.innerHTML = '<i class ="fa fa-remove"></i>';
    // append link to li
    li.appendChild(link);
    // append li to ul
    taskList.appendChild(li);
  });
}

// add task
function addTask(e) {
  // if statement to make sure something is in field
  if (taskInput.value === "") {
    alert("Add a task");
  }
  //create a list item
  const li = document.createElement("li");
  // add classname
  li.className = "collection-item";
  // create text node and append to li
  li.appendChild(document.createTextNode(taskInput.value));
  //create new link element
  const link = document.createElement("a");
  //add class, in materialize secondary content puts it to the right
  link.className = "delete-item secondary-content";
  // add icon html
  link.innerHTML = '<i class ="fa fa-remove"></i>';
  // append link to li
  li.appendChild(link);
  // append li to ul
  taskList.appendChild(li);

  // store in local storage
  storeTaskInLocalStorage(taskInput.value);

  //clear input
  taskInput.value = "";
  //prevents default otherwise page will refresh after submit b/c that's its default behavior
  e.preventDefault();
}

//Store task
function storeTaskInLocalStorage(task) {
  let tasks;
  // first see if any tasks are already saved
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    // need to parse b/c local storage can only store stings
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }
  //add task to tasks
  tasks.push(task);

  //now save back to local storage as string
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//remove task
function removeTask(e) {
  // clicking gives icon, but you want the a tag so you need to target the parent
  if (e.target.parentElement.classList.contains("delete-item")) {
    //confirmation
    if (confirm("Do you want to delete?")) {
      e.target.parentElement.parentElement.remove();

      //removes task from local storage
      removeTaskFromLocalStorage(e.target.parentElement.parentElement);
    }
  }
}

//remove from local storage function
function removeTaskFromLocalStorage(taskItem) {
  let tasks;
  // first see if any tasks are already saved
  if (localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  tasks.forEach(function (task, index) {
    if (taskItem.textContent === task) {
      tasks.splice(index, 1);
    }
  });
  // reset local storage again
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//clear tasks
function clearTasks() {
  // taskList.innerHTML = '';

  //faster way of doing it - looping through each one
  if (confirm("Do you want to delete?")) {
    while (taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }
  }

  // clear from local storage
  clearTasksFromLocalStorage();
}
//https://jsperf.com/innerhtml-vs-removechild

//clear all of local storage
function clearTasksFromLocalStorage() {
  localStorage.clear();
}

//Filter tasks
function filterTasks(e) {
  //add lower case to match correctly
  const text = e.target.value.toLowerCase();

  //get all doc items, can use for each on query selector b/c it returns node list/ elements by class returns html collection that would need to be converted
  document.querySelectorAll(".collection-item").forEach(function (task) {
    const item = task.firstChild.textContent;
    if (item.toLowerCase().indexOf(text) != -1) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
}
