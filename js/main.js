let input = document.querySelector(".task-text"),
    addButton = document.querySelector(".add-task"),
    tasksDiv = document.querySelector(".tasks"),
    pinnedTasksDiv = document.querySelector(".pinned-tasks"),
    deleteAll = document.querySelector(".delete-all"),
    tasksArray = [],
    pinnedTasksArray = [],
    TaskId = tasksArray.length;

//get datafrom localStorage
if (localStorage.getItem("tasks") !== null) {
    tasksArray = JSON.parse(localStorage.getItem("tasks"));
    TaskId = tasksArray.length;
    tasksArray.forEach((task) => {
        if (task.pinned) {
            pinTasks(PinnedTasks());
        } else {
            addTasksToPage(OrdinaryTasks());
        }
    });
}

function PinnedTasks() {
    return tasksArray.filter((task) => task.pinned);
}

function OrdinaryTasks() {
    return tasksArray.filter((task) => !task.pinned);
}

//add task on button click
addButton.onclick = function () {
    showTasks(localStorage.getItem("tasks"));
};

//Add Task By Pressing Enter
document.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
        showTasks();
    }
});

//main function to add Tasks
function showTasks() {
    if (input.value !== "") {
        addTaskToTasksArray(input.value);
        input.value = "";
        addTasksToPage(tasksArray);
        addTasksToLocalStorage(tasksArray);
        input.focus();
    }
}

//Add Task To Tasks Array
function addTaskToTasksArray(taskText) {
    let ID = ++TaskId;
    let task = {
        id: ID,
        title: taskText,
        completed: false,
        pinned: false,
    };
    tasksArray.push(task);
}

//Append Task To Page
function addTasksToPage(tasks) {
    tasksDiv.innerHTML = "";
    let Ordinarytasks = OrdinaryTasks();
    Ordinarytasks.forEach((task) => {
        //add task to page
        let div = document.createElement("div");
        div.className = "task";
        if (task.completed) {
            div.className = "task done";
        }
        div.setAttribute("data-id", task.id);
        div.appendChild(document.createTextNode(task.title));
        //create Delete button
        deleteButton = document.createElement("span");
        deleteButton.className = "delete btn btn-danger";
        deleteButton.appendChild(document.createTextNode("Delete"));
        div.appendChild(deleteButton);
        //create Pin Button
        pinButton = document.createElement("span");
        pinButton.className = "pin btn btn-info";
        let pinIcon = document.createElement("i");
        pinIcon.className = "bi bi-pin-angle";
        pinButton.appendChild(pinIcon);
        pinButton.appendChild(document.createTextNode(" Pin"));
        div.appendChild(pinButton);
        //Append Task div to Tasks
        tasksDiv.appendChild(div);
    });
    deleteAll.removeAttribute("disabled");
}

function pinTasks(tasks) {
    pinnedTasksDiv.innerHTML = "";
    let pinnedOnly = PinnedTasks();
    pinnedOnly.forEach((task) => {
        let div = document.createElement("div");
        div.className = "task pinned";
        if (task.completed) {
            div.className = "task done pinned";
        }
        div.setAttribute("data-id", task.id);
        div.appendChild(document.createTextNode(task.title));
        //create Delete button
        deleteButton = document.createElement("span");
        deleteButton.className = "delete btn btn-danger";
        deleteButton.appendChild(document.createTextNode("Delete"));
        div.appendChild(deleteButton);
        //create Pin Button
        pinButton = document.createElement("span");
        pinButton.className = "unpin btn btn-info";
        pinButton.appendChild(document.createTextNode("UnPin"));
        div.appendChild(pinButton);
        //Append Task div to Tasks
        pinnedTasksDiv.appendChild(div);
    });
}

function addTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Delete Task
tasksDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        deleteTask(e.target.parentElement.dataset.id);
        e.target.parentElement.remove();
        if (tasksDiv.innerHTML == "" && pinnedTasksDiv.innerHTML == "") {
            deleteAll.setAttribute("disabled", true);
        }
    }

    if (e.target.classList.contains("task")) {
        e.target.classList.toggle("done");
        markCompleted(e.target.dataset.id);
    }

    if (e.target.classList.contains("pin")) {
        markPinned(e.target.parentElement.dataset.id);
        pinTasks(tasksArray, e.target.parentElement.dataset.id);
        e.target.parentElement.remove();
    }
});

//Delete Task From Array And LocalStorage
function deleteTask(currentTask) {
    tasksArray = tasksArray.filter((task) => task.id != currentTask);
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

//Mark Completed And UnCompleted
function markCompleted(currentTask) {
    tasksArray.forEach((task) => {
        if (task.id == currentTask) {
            task.completed == false
                ? (task.completed = true)
                : (task.completed = false);
        }
    });
    addTasksToLocalStorage(tasksArray);
}

function markPinned(currentTask) {
    tasksArray.forEach((task) => {
        if (task.id == currentTask) {
            task.pinned == false ? (task.pinned = true) : (task.pinned = false);
        }
    });
    addTasksToLocalStorage(tasksArray);
}

//Delete All Tasks
deleteAll.onclick = function () {
    let confirmation = confirm(
        "You Are Going To Delete All Tasks !! \n Are You Sure ?"
    );
    if (confirmation) {
        localStorage.removeItem("tasks");
        tasksDiv.innerHTML = "";
        pinnedTasksDiv.innerHTML = "";
    }
    deleteAll.setAttribute("disabled", true);
};

pinnedTasksDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        deleteTask(e.target.parentElement.dataset.id);
        e.target.parentElement.remove();
    }

    if (e.target.classList.contains("task")) {
        e.target.classList.toggle("done");
        markCompleted(e.target.dataset.id);
    }

    if (e.target.classList.contains("unpin")) {
        markPinned(e.target.parentElement.dataset.id);
        e.target.parentElement.remove();
        addTasksToPage(tasksArray);
        addTasksToLocalStorage(tasksArray);
    }
});
