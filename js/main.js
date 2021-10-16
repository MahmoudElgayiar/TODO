let input = document.querySelector(".task-text"),
    addButton = document.querySelector(".add-task"),
    tasksDiv = document.querySelector(".tasks"),
    pinnedTasksDiv = document.querySelector(".pinned-tasks"),
    deleteAll = document.querySelector(".delete-all"),
    show_hide_tasks = document.querySelector(".show-hide-tasks"),
    tasksArray = [],
    completedTasks = [],
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
if (localStorage.getItem("hide-completed") !== null) {
    switch (localStorage.getItem("hide-completed")) {
        case "true":
            show_hide_tasks.checked = true;
            showHideCompletedTasks(show_hide_tasks);
            break;

        case "false":
            show_hide_tasks.checked = false;
            break;
    }
}

//Filter Main Tasks Array To Only Contain Pinned Tasks
function PinnedTasks() {
    return tasksArray.filter((task) => task.pinned);
}

//Filter Main Tasks Array To Only Contain Ordinary Tasks
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

//Write Pinned Task To Page
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

//Add Tasks To Local Storage
function addTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//buttons on Ordinary Tasks
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
        if (show_hide_tasks.checked) {
            showHideCompletedTasks(show_hide_tasks);
        } else {
            pinTasks(tasksArray);
        }
        e.target.parentElement.remove();
    }
});

//Delete Task From Array And LocalStorage
function deleteTask(currentTask) {
    tasksArray = tasksArray.filter((task) => task.id != currentTask);
    addTasksToLocalStorage(tasksArray);
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

//Mark Task As Pinned And Update LocalStorage Values
function markPinned(currentTask) {
    tasksArray.forEach((task) => {
        if (task.id == currentTask) {
            task.pinned == false ? (task.pinned = true) : (task.pinned = false);
        }
    });
    if (
        tasksArray.length !== JSON.parse(localStorage.getItem("tasks")).length
    ) {
        tasksArray = tasksArray.concat(hiddenTasks());
    }

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
        if (show_hide_tasks.checked) {
            showHideCompletedTasks(show_hide_tasks);
        } else {
            addTasksToPage(tasksArray);
            pinTasks(tasksArray);
        }
        if (
            tasksArray.length !==
            JSON.parse(localStorage.getItem("tasks")).length
        ) {
            tasksArray = tasksArray.concat(hiddenTasks());
        }
        addTasksToLocalStorage(tasksArray);
    }
});

document
    .querySelector(".show-hide-tasks")
    .addEventListener("change", function (e) {
        showHideCompletedTasks(e.target);
    });

function showHideCompletedTasks(checkbox) {
    switch (checkbox.checked) {
        case true:
            tasksDiv.innerHTML = "";
            pinnedTasksDiv.innerHTML = "";
            tasksArray = tasksArray.filter(
                (task) => !task.completed || (task.pinned && !task.completed)
            );
            addTasksToPage(tasksArray);
            pinTasks(tasksArray);
            localStorage.setItem("hide-completed", "true");
            console.log(hiddenTasks());

            break;

        case false:
            tasksArray = JSON.parse(localStorage.getItem("tasks"));
            tasksDiv.innerHTML = "";
            pinTasks(tasksArray);
            addTasksToPage(tasksArray);
            localStorage.setItem("hide-completed", "false");
            break;
    }
}

function hiddenTasks() {
    let allTasks = JSON.parse(localStorage.getItem("tasks"));
    return allTasks.filter((task) => task.completed);
}
