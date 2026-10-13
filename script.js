const taskInput = document.querySelector("#task-input");
const addBtn = document.querySelector("#add-btn");
const taskList = document.querySelector("#task-list");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = [];
let currentFilter = "all";

// ---------- Render ----------
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <span>${task.text}</span>
      <button class="delete-btn" data-id="${task.id}">Delete</button>
    `;

    // Toggle complete when clicking the text
    li.querySelector("span").addEventListener("click", () => {
      toggleTask(task.id);
    });

    taskList.appendChild(li);
  });
}

// ---------- Add Task ----------
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = "";
  renderTasks();
  saveTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// ---------- Toggle Complete ----------
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  renderTasks();
  saveTasks();
}

// ---------- Delete Task ----------
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = Number(e.target.dataset.id);
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    saveTasks();
  }
});

// ---------- Filters ----------
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ---------- localStorage ----------
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
  renderTasks();
}

// Load tasks when page opens
loadTasks();
