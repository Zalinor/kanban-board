// cохраняем задачи в localstorage как строку JSON
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// загружаем данные из локалсторедж
function loadTasks() {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
};

let tasks = loadTasks();

function renderTasks() {
    const columns = {
        "todo": document.querySelector("#todo .cards"),
        "in-progress": document.querySelector("#in-progress .cards"),
        "done": document.querySelector("#done .cards")
    }

    //очищаем все колонки перед отрисовкой
    Object.values(columns).forEach((column) => {
        column.innerHTML = "";
    });

    tasks.forEach((task) => {
        const card = document.createElement("div");
        card.className = "card";
        card.draggable = true; //перетаскивание, без этого свойства перетаскивание невозможно
        card.dataset.id = task.id; //записываем айди в дом элемент
        card.addEventListener("dragstart", handleDragStart);

        // текст задачи обворачиваем в span чтобы сделать еще кнопку удаления
        const textSpan = document.createElement("span");
        textSpan.textContent = task.text;
        textSpan.className = "task-text";
        textSpan.dataset.id = task.id;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "x";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.id = task.id;

        card.appendChild(textSpan);
        card.appendChild(deleteBtn);
        columns[task.status].appendChild(card);
    });
}



// добавляем задачи

const input = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addTaskBtn");

addTaskBtn.addEventListener("click", () => {
    const text = input.value.trim();

    if (text === "") return;

    const newTask = {
        id: Date.now(),
        text: text,
        status: "todo"
    };

    tasks = [...tasks, newTask];
    saveTasks();
    input.value = "";
    renderTasks();
});

renderTasks();

//срабатывает когда тянешь карточку
//Сохраняет id перетаскиваемой карточки чтобы использовать в Drop
function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.currentTarget.dataset.id);
};

//срабатывает постоянно, пока перетаскиваемый элемент проносят над колонкой
// preventDefault() Обязателен - без него drop не сработает
function handleDragOver(event) {
    event.preventDefault();
}

document.querySelectorAll(".column").forEach((column) => {
    column.addEventListener("dragover", handleDragOver);
    column.addEventListener("drop", handleDrop);
});

//срабатывает когда карточку опустили над колонкой
//достаем айдишник задачи, меняем статус на id той колонки куда бросили и ререндерим доску
function handleDrop(event) {
    event.preventDefault();
    const taskId = Number(event.dataTransfer.getData("text/plain"));
    const newStatus = event.currentTarget.id;

    tasks = tasks.map((task) => {
        if (task.id === taskId) {
            return {...task, status: newStatus};
        }
        return task;
    });

    saveTasks();
    renderTasks();
};

// создаем кнопку удаления задач и вешаем обработчик не на каждую задачку а сразу на документ
// включаем редактирование при клике на карточку
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
        const taskId = Number(event.target.dataset.id);
        tasks = tasks.filter((task) => task.id !== taskId);
        saveTasks();
        renderTasks();
    }
    if (event.target.classList.contains("task-text")) {
        startEditing(event.target);
    }
});

function startEditing(span) {
    const currentText = span.textContent;
    const taskId = Number(span.dataset.id);

    const input = document.createElement('input');
    input.type = "text";    
    input.value = currentText;
    input.className = "edit-input";

    span.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => finishEditing(input, taskId));
   
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            input.blur();
        }
    });
}

function finishEditing(input, taskId) {
    const newText = input.value.trim();

    if (newText !== "") {
        tasks = tasks.map((task) => {
            if (task.id === taskId) {
                return {...task, text: newText};
            }
            return task;
        });
        saveTasks();
    }
    renderTasks();
}