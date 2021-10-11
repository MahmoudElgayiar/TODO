let input = document.querySelector(".task-text"),
    addButton = document.querySelector(".add-task"),
    tasksDiv = document.querySelector(".tasks"),
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
    showTasks();
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
        div.setAttribute("data-id", task.id);
        div.appendChild(document.createTextNode(task.title));
        //create Delete button
        span = document.createElement("span");
        span.className = "delete btn btn-danger";
        span.appendChild(document.createTextNode("Delete"));
        div.appendChild(span);
        //Append Task div to Tasks
        tasksDiv.appendChild(div);
    });
}
function addTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
