/* =========================================================
   planner.js  -  COS106 Web Technologies Practical
   Academic Planner - ALL planner logic lives in this file.
   Features:
     - Add tasks (text + priority)
     - Mark tasks complete / pending via checkbox
     - Delete individual tasks
     - Display Total / Completed / Pending counters
     - Persist tasks to localStorage (survives page refresh)
     - Clear all tasks with confirmation
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* --------------------------------------------------
     STATE - tasks array holds all task objects.
     Each task: { id, text, priority, completed, createdAt }
  -------------------------------------------------- */
  let tasks = [];

  /* --------------------------------------------------
     DOM REFERENCES
  -------------------------------------------------- */
  const taskForm      = document.getElementById("taskForm");
  const taskInput     = document.getElementById("taskInput");
  const priorityInput = document.getElementById("priorityInput");
  const taskList      = document.getElementById("taskList");
  const emptyState    = document.getElementById("emptyState");
  const clearAllBtn   = document.getElementById("clearAll");

  /* Stats elements */
  const totalEl     = document.getElementById("totalTasks");
  const completedEl = document.getElementById("completedTasks");
  const pendingEl   = document.getElementById("pendingTasks");

  /* --------------------------------------------------
     LOCAL STORAGE - load saved tasks on page load
  -------------------------------------------------- */
  function loadTasks() {
    const stored = localStorage.getItem("cos106PlannerTasks");
    if (stored) {
      try {
        tasks = JSON.parse(stored);
      } catch (err) {
        tasks = []; /* reset if data is corrupted */
      }
    }
  }

  /* Save current tasks array to localStorage */
  function saveTasks() {
    localStorage.setItem("cos106PlannerTasks", JSON.stringify(tasks));
  }

  /* --------------------------------------------------
     RENDER - rebuild the task list and update counters
  -------------------------------------------------- */
  function renderTasks() {
    taskList.innerHTML = "";

    /* Show/hide the empty state message */
    emptyState.style.display = tasks.length === 0 ? "block" : "none";

    /* Loop over tasks array and create DOM elements */
    tasks.forEach((task, index) => {

      const item = document.createElement("div");
      item.className = "task-item" + (task.completed ? " completed" : "");

      /* Checkbox to toggle complete */
      const checkbox = document.createElement("input");
      checkbox.type    = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => toggleTask(index));

      /* Task description text */
      const text = document.createElement("span");
      text.className   = "task-text";
      text.textContent = task.text;

      /* Priority badge */
      const priorityBadge = document.createElement("span");
      priorityBadge.className = "priority-tag " + task.priority;
      priorityBadge.textContent =
        task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

      /* Delete button */
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

  /* Update the three counter elements */
  function updateStats() {
    const total     = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending   = total - completed;

    totalEl.textContent     = total;
    completedEl.textContent = completed;
    pendingEl.textContent   = pending;
  }

  /* --------------------------------------------------
     TASK OPERATIONS
  -------------------------------------------------- */

  /* Add a new task to the array */
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

  /* Toggle the completed flag for a task by index */
  function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }

  /* Remove a task by index */
  function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  /* --------------------------------------------------
     EVENT LISTENERS
  -------------------------------------------------- */

  /* Form submit - add task */
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();

    if (text === "") {
      taskInput.style.borderColor = "var(--error)";
      taskInput.focus();
      return;
    }

    taskInput.style.borderColor = ""; /* reset error state */
    addTask(text, priorityInput.value);
    taskInput.value      = "";
    priorityInput.value  = "medium";
    taskInput.focus();
  });

  /* Clear all tasks with user confirmation */
  clearAllBtn.addEventListener("click", () => {
    if (tasks.length === 0) return;
    if (confirm("Are you sure you want to delete ALL tasks? This cannot be undone.")) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  });

  /* --------------------------------------------------
     INITIALISE
  -------------------------------------------------- */
  loadTasks();
  renderTasks();

}); /* end DOMContentLoaded */
