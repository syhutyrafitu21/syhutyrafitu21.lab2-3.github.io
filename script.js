const classNames = {
  TODO_ITEM: 'todo-container',
  TODO_CHECKBOX: 'todo-checkbox',
  TODO_TEXT: 'todo-text',
  TODO_DELETE: 'todo-delete',
}

const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');

let itemCount = 0;
let uncheckedCount = 0;
let todoListData = [];

function updateCounters() {
  itemCountSpan.innerHTML = itemCount;
  uncheckedCountSpan.innerHTML = uncheckedCount;
}

function updateTodoListFromLocalStorage() {
  const storedTodoList = JSON.parse(localStorage.getItem('todoList'));
  if (storedTodoList) {
    todoListData = storedTodoList;
    itemCount = todoListData.length;
    uncheckedCount = todoListData.filter(item => !item.checked).length;
    renderTodoList();
    updateCounters();
  }
}

function saveTodoListToLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoListData));
}

function newTodo() {
  const task = prompt('Що у вас за нова задача?', 'Нова задача');

  if (task && task.trim() !== '') {
    itemCount += 1;
    uncheckedCount += 1;

    todoListData.push({
      id: itemCount,
      text: task,
      checked: false,
    });
    saveTodoListToLocalStorage();

    updateCounters();
    renderTodoList();
  }
}

function checkTodo(id) {
  const checkBox = document.getElementById(id);
  const itemId = parseInt(id.replace('myCheck', ''), 10);

 
  const todoItem = todoListData.find(item => item.id === itemId);
  if (todoItem) {
    todoItem.checked = checkBox.checked;
  }

  saveTodoListToLocalStorage();

  if (checkBox.checked) {
    uncheckedCount -= 1;
  } else {
    uncheckedCount += 1;
  }

  updateCounters();
}

function deleteTodo(value) {
  const itemId = parseInt(value, 10);


  const index = todoListData.findIndex(item => item.id === itemId);
  if (index !== -1) {
    todoListData.splice(index, 1);

    saveTodoListToLocalStorage();
  }

  const check = document.getElementById('myCheck' + value).checked;
  const deleteButton = document.getElementById(value);
  deleteButton.parentNode.removeChild(deleteButton);

  if (!check) {
    uncheckedCount -= 1;
  }
  itemCount -= 1;
  updateCounters();
}

function renderTodoList() {
  list.innerHTML = '';
  todoListData.forEach(item => {
    const todoList = document.createElement('li');
    todoList.className = classNames.TODO_ITEM;
    todoList.id = item.id;
    list.appendChild(todoList);

    const todoCheck = document.createElement('input');
    todoCheck.className = classNames.TODO_CHECKBOX;
    todoCheck.type = 'checkbox';
    todoCheck.id = 'myCheck' + item.id;
    todoCheck.checked = item.checked;
    todoCheck.setAttribute('onClick', 'checkTodo(this.id)');
    todoList.appendChild(todoCheck);

    const todoText = document.createTextNode(item.text);
    todoList.appendChild(todoText);

    const todoDelete = document.createElement('button');
    todoDelete.className = 'todo-delete btn btn-danger btn-sm';
    todoDelete.innerText = 'Видалити';
    todoDelete.value = item.id;
    todoDelete.setAttribute('onClick', 'deleteTodo(this.value)');
    todoList.appendChild(todoDelete);
  });
} 
updateTodoListFromLocalStorage();