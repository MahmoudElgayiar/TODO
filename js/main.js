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
    addTasksToPage(tasksArray);
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
    tasksArray.forEach((task) => {
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
        deleteAll.removeAttribute("disabled");
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
        if (tasksDiv.innerHTML == "") {
            deleteAll.setAttribute("disabled", true);
        }
    }

    if (e.target.classList.contains("task")) {
        e.target.classList.toggle("done");
        markCompleted(e.target.dataset.id);
    }

    if (e.target.classList.contains("pin")) {
        MoveTaskToPinnedArray(e.target.parentElement.dataset.id);

        deleteTask(e.target.parentElement.dataset.id);
        e.target.parentElement.remove();
        createpinnedTasks(pinnedTasksArray);
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
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

//Delete All Tasks
deleteAll.onclick = function () {
    let confirmation = confirm(
        "You Are Going To Delete All Tasks !! \n Are You Sure ?"
    );
    if (confirmation) {
        localStorage.removeItem("tasks");
        tasksDiv.innerHTML = "";
    }
    deleteAll.setAttribute("disabled", true);
};

//Move Pinned
//Append Task To Pinned Section
function createpinnedTasks(tasks) {
    pinnedTasksDiv.innerHTML = "";
    pinnedTasksArray.forEach((task) => {
        //add task to page
        console.log(task);
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

function MoveTaskToPinnedArray(pinnedtask) {
    let newarray = tasksArray.filter((task) => task.id == pinnedtask);
    pinnedTasksArray = newarray;
}

function MoveTaskFromPinnedArray(pinnedtask) {
    pinnedTasksArray = pinnedTasksArray.filter((task) => task.id == pinnedtask);
}
