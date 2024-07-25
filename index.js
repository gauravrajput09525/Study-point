const taskArray = getDataFromLocalStorage();
displayDeleteAll(taskArray);
taskArray.forEach((task) => {
  addTaskHandler(task);
});

function displayDeleteAll(taskArray) {
  if (taskArray.length) {
    document.getElementById("deleteAll").style.display = "block";
  } else {
    document.getElementById("deleteAll").style.display = "none";
  }
}

function addTask() {
  const task = document.getElementById("input").value;
  if (task?.length) {
    setDataToLocalStorage(task);
    addTaskHandler(task);
  } else {
    alert("please enter task");
  }
}

function createListTextElement(task) {
  let spanElementForText = document.createElement("span");
  spanElementForText.className = "text";
  spanElementForText.innerText = task;
  return spanElementForText;
}
function createActionsElement(task) {
  let spanElementForAction = document.createElement("span");
  spanElementForAction.className = "actions";

  let editButtonElement = document.createElement("button");
  editButtonElement.innerText = "Edit";
  editButtonElement.className = "editBtn";
  editButtonElement.addEventListener("click", editHandler);

  let deleteButtonElement = document.createElement("button");
  deleteButtonElement.innerText = "Delete";
  deleteButtonElement.className = "deletetBtn";
  deleteButtonElement.addEventListener("click", deleteHandler);

  let pinButtonElement = document.createElement("button");
  pinButtonElement.innerText = "Pin";
  pinButtonElement.className = "pintBtn";
  pinButtonElement.addEventListener("click", togglePin);

  spanElementForAction.append(
    pinButtonElement,
    editButtonElement,
    deleteButtonElement,
  );
  return spanElementForAction;
}

function addTaskHandler(task) {
  let listElement = document.createElement("li");

  listElement.addEventListener("click", selectList);

  let spanElementForText = createListTextElement(task);
  let actionElement = createActionsElement();

  const uid = Math.round(Math.random() * 10000000000);
  listElement.setAttribute("uid", uid);

  listElement.append(spanElementForText, actionElement);

  let list = document.getElementById("List");
  list.appendChild(listElement);
  document.getElementById("input").value = "";
  document.getElementById("deleteAll").style.display = "block";
}

function getDataFromLocalStorage() {
  let tasks = localStorage.getItem("tasks");
  tasks = tasks ? JSON.parse(tasks) : [];
  return tasks;
}

function setDataToLocalStorage(task) {
  const taskArray = getDataFromLocalStorage();
  taskArray.push(task);
  const stringfiedTasks = JSON.stringify(taskArray);
  localStorage.setItem("tasks", stringfiedTasks);
}

function onKeyPress(event) {
  if (event.keyCode === 13) {
    addTask();
  }
}

function deleteAll() {
  localStorage.removeItem("tasks");
  location.reload();
}

function editHandler(event) {
  const button = event.target;
  button.innerText = "Save";
  button.className = "saveBtn";
  button.removeEventListener("click", editHandler);
  button.addEventListener("click", saveHandler);
  const actionsElement = button.parentElement;
  const listElement = actionsElement.parentElement;
  const textElement = listElement.firstChild;

  const inputElement = document.createElement("input");
  inputElement.value = textElement.innerText;
  inputElement.className = "editInput";

  listElement.replaceChild(inputElement, textElement);
}

function saveHandler(event) {
  const button = event.target;
  button.innerText = "Edit";
  button.className = "editBtn";
  button.removeEventListener("click", saveHandler);
  button.addEventListener("click", editHandler);

  const actionsElement = button.parentElement;
  const listElement = actionsElement.parentElement;
  const uid = listElement.getAttribute("uid");
  const index = getNodeIndex(uid);
  // console.log(index);

  const inputElement = listElement.firstChild;
  const value = inputElement.value;

  storeDataUsingIndex(value, index);

  const textElement = document.createElement("span");
  textElement.className = "text";
  textElement.innerText = value;

  listElement.replaceChild(textElement, inputElement);
}

function deleteHandler(event) {
  const button = event.target;
  const actionElement = button.parentElement;
  const listElement = actionElement.parentElement;
  const uid = listElement.getAttribute("uid");
  const index = getNodeIndex(uid);
  deleteDataUsingIndex(index);
}

function getNodeIndex(uid) {
  const listItems = Array.from(document.getElementsByTagName("li"));
  const updatedIndex = listItems.findIndex((item) => {
    return item.getAttribute("uid") === uid;
  });
  return updatedIndex;
}

function storeDataUsingIndex(task, index) {
  const taskList = localStorage.getItem("tasks");
  const taskArray = JSON.parse(taskList);
  taskArray.splice(index, 1, task);
  const stringfiedTasks = JSON.stringify(taskArray);
  localStorage.setItem("tasks", stringfiedTasks);
}

function deleteDataUsingIndex(index) {
  const taskList = localStorage.getItem("tasks");
  const taskArray = JSON.parse(taskList);
  taskArray.splice(index, 1);
  const stringfiedTasks = JSON.stringify(taskArray);
  localStorage.setItem("tasks", stringfiedTasks);
  location.reload();
}

// function deleteSelectedDataUsingIndex(index) {
//   const taskList = localStorage.getItem("tasks");
//   const taskArray = JSON.parse(taskList);
//   taskArray.splice(index, 1);
//   const stringfiedTasks = JSON.stringify(taskArray);
//   localStorage.setItem("tasks", stringfiedTasks);
// }

function selectList(event) {
  let list = event.target;
  // list.className = 'selected'
  if (list.className) {
    list.className = "";
  } else {
    list.className = "selected";
  }
  toggleDeleteSelected();
}

function toggleDeleteSelected() {
  let selectedLists = Array.from(document.getElementsByClassName("selected"));
  if (selectedLists.length > 0) {
    document.getElementById("deleteAll").style.display = "none";
    document.getElementById("deleteSelected").style.display = "block";
  } else {
    document.getElementById("deleteSelected").style.display = "none";
    document.getElementById("deleteAll").style.display = "block";
  }
}

function deleteSelected() {
  let lists = Array.from(document.querySelectorAll(".selected"));
  let listIndex = [];
  for (i = 0; i < lists.length; i++) {
    const uid = lists[i].getAttribute("uid");
    const index = getNodeIndex(uid);
    listIndex.push(index);
  }

  const taskList = localStorage.getItem("tasks");
  const taskArray = JSON.parse(taskList);

  const tempArray = taskArray.filter((items, index) => {
    return !listIndex.includes(index);
  });
  const stringfiedTasks = JSON.stringify(tempArray);
  localStorage.setItem("tasks", stringfiedTasks);
  location.reload();
}

function togglePin(event) {
  const button = event.target;
  const actionElement = button.parentElement;
  const childNodes = actionElement.childNodes;
  const btnString = childNodes[0].innerText;
  if(btnString === 'Pin'){
    childNodes[0].innerText = 'Unpin'
    childNodes[1].style.display = 'none'
    childNodes[2].style.display = 'none'
  }else{
    childNodes[0].innerText = 'Pin'
    childNodes[1].style.display = ''
    childNodes[2].style.display = ''
  }
}