document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
});

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
        showToDoContainer();
        loadTasksFromServer()
            .then(tasks => {
                loadTasksToList(tasks);
                updateTotalTime();
            })
            .catch(error => console.error("Error loading tasks:", error));
    }
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        localStorage.setItem("isLoggedIn", true);
        showToDoContainer();
        loadTasksFromServer()
            .then(tasks => {
                loadTasksToList(tasks);
                updateTotalTime();
            })
            .catch(error => console.error("Error loading tasks:", error));
    }
}

function showToDoContainer() {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("todo-container").classList.remove("hidden");
}

function addTask() {
    const taskInput = document.getElementById("task-input");
    const timeInput = document.getElementById("time-input");

    const task = taskInput.value.trim();
    const time = parseInt(timeInput.value) || 0;

    if (task) {
        const taskObject = { task, time };
        addTaskToList(taskObject);
        updateTotalTime();
        saveTasksToServer()
            .then(() => {
                taskInput.value = "";
                timeInput.value = "";
            })
            .catch(error => console.error("Error saving tasks:", error));
    }
}

function addTaskToList(taskObject) {
    const taskList = document.getElementById("task-list");
    const li = document.createElement("li");

    li.innerHTML = `
        <span>${taskObject.task}</span>
        <span>${taskObject.time} min</span>
        <button onclick="completeTask(this)">Complete</button>
        <button onclick="deleteTask(this)">Delete</button>
    `;

    taskList.appendChild(li);
}

function completeTask(button) {
    const taskItem = button.parentElement;
    const taskList = document.getElementById("task-list");
    const completedTaskList = document.getElementById("completed-task-list");

    taskItem.classList.add("completed");
    taskList.removeChild(taskItem);

    completedTaskList.appendChild(taskItem);

    updateTotalTime();
    saveTasksToServer()
        .catch(error => console.error("Error saving tasks:", error));
}

function deleteTask(button) {
    const taskItem = button.parentElement;
    const taskList = document.getElementById("task-list");
    const completedTaskList = document.getElementById("completed-task-list");

    if (taskItem.classList.contains("completed")) {
        completedTaskList.removeChild(taskItem);
    } else {
        taskList.removeChild(taskItem);
    }

    updateTotalTime();
    saveTasksToServer()
        .catch(error => console.error("Error saving tasks:", error));
}

function updateTotalTime() {
    const totalTimeValue = document.getElementById("total-time-value");
    const taskItems = document.querySelectorAll("#task-list li:not(.completed)");
    let totalTime = 0;

    taskItems.forEach(item => {
        const time = parseInt(item.children[1].textContent) || 0;
        totalTime += time;
    });

    totalTimeValue.textContent = totalTime;
}

function saveTasksToServer() {
    const taskItems = document.querySelectorAll("#task-list li");
    const completedTaskItems = document.querySelectorAll("#completed-task-list li");

    const tasks = [];
    const completedTasks = [];

    taskItems.forEach(item => {
        const task = item.children[0].textContent;
        const time = parseInt(item.children[1].textContent) || 0;
        tasks.push({ task, time });
    });

    completedTaskItems.forEach(item => {
        const task = item.children[0].textContent;
        const time = parseInt(item.children[1].textContent) || 0;
        completedTasks.push({ task, time });
    });

    const data = { tasks, completedTasks };

    return fetch('tareas.json', {
        method: 'PUT', // Puedes ajustar el método según tus necesidades (GET, POST, PUT, etc.)
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    });
}

function loadTasksFromServer() {
    return fetch('tareas.json') // Cambia 'tareas.json' por la ruta correct
    }
