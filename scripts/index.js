
let tasks = [
    {id:1, text: "Пример задачки", status: "todo"}
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
        columns[task.status].appendChild(card);
    });
}

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