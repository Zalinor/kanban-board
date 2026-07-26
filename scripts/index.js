
let tasks = [
    {id:1, text: "", status: "todo"},
    {id:2, text: "", status: "in-progress"},
    {id:3, text: "", status: "done"}
];

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
        card.textContent = task.text;
        card.draggable = true; //перетаскивание, без этого свойства перетаскивание невозможно
        card.dataset.id = task.id; //записываем айди в дом элемент
        card.addEventListener("dragstart", handleDragStart);
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
    input.value = "";
    renderTasks();
});

renderTasks();

//срабатывает когда тянешь карточку
//Сохраняет id перетаскиваемой карточки чтобы использовать в Drop
function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.id);
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

    renderTasks();
};