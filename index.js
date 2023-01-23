
// -- Declare Global Variables --
const listContainer = document.querySelector('.todo-list');
const todoInput = document.querySelector('.todo-input');
const form = document.querySelector('.todo-form');
const btnClear = document.querySelector('.btn-clear');
// -- Define local storage --
let tasks;
if (localStorage.getItem('tasks') === null) {
  tasks = [];
} else {
  tasks = JSON.parse(localStorage.getItem('tasks'));
}
// -- Render tasks --
const displayTasks = function () {
  let newHtml = '';
  tasks.forEach((el) => {
    newHtml += `
    <div class="task-wrapper">
       <div class="description-container">
        <form class="completed-form">
          <input
          id="${el.index}"
           class="checkbox"
           type="checkbox">
          <input 
          id="${el.index}"
           type= "text"
           class="task-text"
           changetask
           value="${el.description}"
           readonly> 
        </form>
       </div>
       <div class="icons-task">
       <i class="fa-solid fa-ellipsis-vertical"></i>
       <i id="${el.index}" class="fa-solid fa-trash-can"></i>
       </div>
      
      </div>`;
  });
  listContainer.innerHTML = newHtml;
};

// LOCAL STORAGE
// --Add tasks to Local Storage --
const addTaskToStorage = function (arr, newTaskInput) {
  // create index
  let index;
  const len = tasks.length;
  if (len === 0 || len === null) {
    index = 0;
  } else {
    index = tasks[len - 1].index + 1;
  }
  // create object and push it to array and LS
  const newTask = { description: newTaskInput, status: false, index };
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
};
// -- Remove task from Local Storage --
const removeItemfromLs = function (id) {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  const index = tasks.findIndex(task => task.index === id);
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
};


// -- Update Local Storage when mdify task description --
const updateLs = function (newInput, id) {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  for (let i = 0; i < tasks.length; i += 1) {
    if (tasks[i].index.toString() === id.toString()) {
      tasks[i].description = newInput;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
};
// -- Update Status Local Storage when checked complete --
const updateStatus = function (id) {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  for (let i = 0; i < tasks.length; i += 1) {
    if (tasks[i].index.toString() === id.toString()) {
      if (tasks[i].status === false) {
        tasks[i].status = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } else {
        tasks[i].status = false;
      }
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }
};
// -- Clear all completed tasks from LS --
const clearfromLS = function () {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks = tasks.filter((e) => e.status === false);
  for (let i = 0; i < tasks.length; i += 1) {
    tasks[i].index = i + 1;
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

/// EVENTS
// --Event to submit the new task --
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTaskInput = todoInput.value;
  if (newTaskInput.match(/^[\s]*$/) !== null) {
    todoInput.value = 'Start the day writing a task to do!';
  } else {
    addTaskToStorage(tasks, newTaskInput);
    todoInput.value = '';
    displayTasks();
  }
});
// -- Get new input from change tasks description --
const getnewInput = function (input, id) {
  const newInput = input;
  input.addEventListener('keyup', () => {
    updateLs(newInput.value, id);
  });
};
// -- Function to handle UI in the task cotianer --
const clickHandle = function (e) {
  if (e.target.classList.contains('task-text')) {
    modifyTaskDescription(e);
  } else if (e.target.classList.contains('fa-trash-can')) {
    deleteTask(e);
  } else if (e.target.classList.contains('checkbox')) {
    updateTaskStatus(e);
  }
};

function modifyTaskDescription(e) {
    const taskTargeted = e.target.parentElement.parentElement.parentElement;
    taskTargeted.querySelector('.fa-ellipsis-vertical').style.display = 'none';
    taskTargeted.querySelector('.fa-trash-can').style.display = 'flex';
    e.target.readOnly = false;
    const { id } = e.target;
    getnewInput(e.target, id);
}

function deleteTask(e) {
    const { id } = e.target;
    removeItemfromLs(id);
    e.target.parentElement.parentElement.remove();
}

function updateTaskStatus(e) {
    const { id } = e.target;
    const checkbox = e.target;
    const sibling = checkbox.closest('.task-wrapper').querySelector('.task-text');
    if (checkbox.checked) {
      sibling.classList.add('completed');
      updateStatus(id);
    } else {
      sibling.classList.remove('completed');
      updateStatus(id);
    }
}

// --Event to handle UI in task --
listContainer.addEventListener('click', clickHandle);
window.addEventListener('load', displayTasks);
// -- Clear all the completed tasks --
btnClear.addEventListener('click', (e) => {
  clearfromLS();
  const button = e.target;
  const sibling = button.closest('.todo-container').querySelectorAll('.task-text');
  sibling.forEach((e) => {
    if (e.classList.contains('completed')) {
      e.parentElement.parentElement.parentElement.remove();
    }
  });
});
