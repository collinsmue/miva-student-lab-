document.addEventListener("DOMContentLoaded", () => {

  let tasks = [];

  const taskForm      = document.getElementById("taskForm");
  const taskInput     = document.getElementById("taskInput");
  const priorityInput = document.getElementById("priorityInput");
  const taskList      = document.getElementById("taskList");
  const emptyState    = document.getElementById("emptyState");
  const clearAllBtn   = document.getElementById("clearAll");

  const totalEl     = document.getElementById("totalTasks");
  const completedEl = document.getElementById("completedTasks");
  const pendingEl   = document.getElementById("pendingTasks");

  function loadTasks() {
    const stored = localStorage.getItem("cos106PlannerTasks");
    if (stored) {
      try {
        tasks = JSON.parse(stored);
      } catch (err) {
        tasks = [];
      }
    }
  }

  function saveTasks() {
    localStorage.setItem("cos106PlannerTasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";

    emptyState.style.display = tasks.length === 0 ? "block" : "none";

    tasks.forEach((task, index) => {

      const item = document.createElement("div");
      item.className = "task-item" + (task.completed ? " completed" : "");

      const checkbox = document.createElement("input");
      checkbox.type    = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => toggleTask(index));

      const text = document.createElement("span");
      text.className   = "task-text";
      text.textContent = task.text;

      const priorityBadge = document.createElement("span");
      priorityBadge.className = "priority-tag " + task.priority;
      priorityBadge.textContent =
        task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

      const delBtn = document.createElement("button");
      delBtn.className   = "delete-btn";
      delBtn.innerHTML   = "&times;";
      delBtn.setAttribute("aria-label", "Delete task: " + task.text);
      delBtn.addEventListener("click", () => deleteTask(index));

      item.append(checkbox, text, priorityBadge, delBtn);
      taskList.appendChild(item);
    });

    updateStats();
  }

  function updateStats() {
    const total     = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending   = total - completed;

    totalEl.textContent     = total;
    completedEl.textContent = completed;
    pendingEl.textContent   = pending;
  }

  function addTask(text, priority) {
    const newTask = {
      id:        Date.now(),
      text:      text,
      priority:  priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
  }

  function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  // Add task
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();

    if (text === "") {
      taskInput.style.borderColor = "var(--error)";
      taskInput.focus();
      return;
    }

    taskInput.style.borderColor = "";
    addTask(text, priorityInput.value);
    taskInput.value      = "";
    priorityInput.value  = "medium";
    taskInput.focus();
  });

  // Clear all tasks
  clearAllBtn.addEventListener("click", () => {
    if (tasks.length === 0) return;
    if (confirm("Are you sure you want to delete ALL tasks? This cannot be undone.")) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  });

  loadTasks();
  renderTasks();

});
