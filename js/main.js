let input = document.querySelector(".task-text"),
    addButton = document.querySelector(".add-task"),
    tasksDiv = document.querySelector(".tasks"),
    deleteAll = document.querySelector(".delete-all"),
    tasksArray = [],
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
        span = document.createElement("span");
        span.className = "delete btn btn-danger";
        span.appendChild(document.createTextNode("Delete"));
        div.appendChild(span);
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
