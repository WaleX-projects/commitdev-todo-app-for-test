const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const count = document.getElementById('task-count');
const clearCompleted = document.getElementById('clear-completed');

let tasks = JSON.parse(localStorage.getItem('todo-tasks') || '[]');

function saveTasks() {
  localStorage.setItem('todo-tasks', JSON.stringify(tasks));
}

function renderTasks() {
  if (tasks.length === 0) {
    list.innerHTML = '<li class="empty-state">No tasks yet. Add one above.</li>';
    count.textContent = '0 tasks';
    return;
  }

  const remaining = tasks.filter((task) => !task.done).length;
  count.textContent = `${remaining} ${remaining === 1 ? 'task' : 'tasks'} left`;

  list.innerHTML = tasks
    .map(
      (task) => `
        <li class="todo-item ${task.done ? 'done' : ''}">
          <label class="task-main">
            <input class="checkbox" type="checkbox" ${task.done ? 'checked' : ''} data-id="${task.id}" />
            <span class="task-text">${task.text}</span>
          </label>
          <button class="delete-btn" data-id="${task.id}" aria-label="Delete task">✕</button>
        </li>
      `
    )
    .join('');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.unshift({
    id: Date.now(),
    text,
    done: false,
  });

  saveTasks();
  input.value = '';
  renderTasks();
});

list.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const id = Number(button.dataset.id);
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
});

list.addEventListener('change', (event) => {
  const checkbox = event.target.closest('input[type="checkbox"]');
  if (!checkbox) return;

  const id = Number(checkbox.dataset.id);
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );

  saveTasks();
  renderTasks();
});

clearCompleted.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  renderTasks();
});

renderTasks();
