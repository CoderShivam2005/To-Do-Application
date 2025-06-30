let data = JSON.parse(localStorage.getItem("data")) || [];

const form = document.getElementById("form");
const textInput = document.getElementById("textInput");
const dateInput = document.getElementById("dateInput");
const textarea = document.getElementById("textarea");
const pendingTasksContainer = document.getElementById("pendingTasks");
const completedTasksContainer = document.getElementById("completedTasks");
const addButton = document.getElementById("add");
const taskSummary = document.getElementById("taskSummary");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

const formValidation = () => {
  if (textInput.value.trim() === "") {
    document.getElementById("msg").innerHTML = "Project title cannot be blank";
  } else {
    document.getElementById("msg").innerHTML = "";
    if (addButton.innerText === "Add") {
      acceptData();
    } else {
      const index = parseInt(addButton.getAttribute("data-index"));
      editTask(index);
    }
    addButton.setAttribute("data-bs-dismiss", "modal");
    addButton.click();
    form.reset();
  }
};

const acceptData = () => {
  const task = {
    text: textInput.value,
    date: dateInput.value,
    description: textarea.value,
    completed: false,
  };

  data.push(task);
  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
};

const createTasks = () => {
  pendingTasksContainer.innerHTML = "";
  completedTasksContainer.innerHTML = "";
  
  let completedCount = 0;
  data.forEach((task, index) => {
    const taskElement = createTaskElement(task, index);
    if (task.completed) {
      completedTasksContainer.appendChild(taskElement);
      completedCount++;
    } else {
      pendingTasksContainer.appendChild(taskElement);
    }
  });

  const totalTasks = data.length;
  const pendingTasks = totalTasks - completedCount;
  const summaryText = `${completedCount}/${totalTasks} completed (${pendingTasks} pending)`;
  taskSummary.innerText = summaryText;
};

const createTaskElement = (task, index) => {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.innerHTML = `
    <label class="checkbox-container">
      <input type="checkbox" id="task${index}" ${task.completed ? "checked" : ""} onchange="updateTaskStatus(${index}, this.checked)">
      <span class="checkmark"></span>
    </label>
    <span class="task-title">${task.text}</span>
    <span class="task-date">${task.date}</span>
    <p class="task-description">${task.description}</p>
    <span class="options">
      <i class="fas fa-edit" onclick="openEditForm(${index})"></i>
      <i class="fas fa-trash-alt" onclick="deleteTask(${index})"></i>
    </span>
  `;
  return taskElement;
};

const openEditForm = (index) => {
  const task = data[index];
  textInput.value = task.text;
  dateInput.value = task.date;
  textarea.value = task.description;
  addButton.innerText = "Edit";
  addButton.setAttribute("data-index", index);
};

const editTask = (index) => {
  const task = data[index];
  task.text = textInput.value;
  task.date = dateInput.value;
  task.description = textarea.value;
  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
  form.reset();
  addButton.innerText = "Add";
  addButton.removeAttribute("data-index");
};

const deleteTask = (index) => {
  data.splice(index, 1);
  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
};

const updateTaskStatus = (index, checked) => {
  data[index].completed = checked;
  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
};

createTasks();