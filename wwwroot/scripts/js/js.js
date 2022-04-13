async function getToDos() {

    const response = await fetch("/api/todos", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {

        const todos = await response.json();
        nothingToDo();
        let todosDone = document.querySelector(".todosDone");
        if (todosDone != null && todos.length > 0) {
            todosDone.remove();
        }
        let header = document.getElementsByClassName("header")[0];
        header.classList.add("hide");
        let start = 1;
        let app = document.getElementById("app");
        let html = "";
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].done == true) {
                todos[i].done = "checked";
            }
            else {
                todos[i].done = "";
            }
            html += `<ul class="todo" data-rowid="${todos[i].id}">
                         <span>
                            <li>${start}</li>
                            <li data-num="${todos[i].id}" class='${todos[i].done === "checked" || todos[i].done === true ? "done" : "notdone"}'>${todos[i].toDoDiscription}</li>
                         </span>
                        <span class="delete-check">
                            <input onclick="doneToDo(${todos[i].id})" type="checkbox" ${todos[i].done === "checked" || todos[i].done === true ? "checked" : ""} /></li>
                            <button onclick="deleteToDo(${todos[i].id})">delete</button></li>
                        </span>
                    </ul>`
            start++;
        }
        let content = document.createElement("div");
        content.innerHTML = html;
        app.appendChild(content);
    }
}

async function doneToDo(id) {
    let discription = document.querySelector("li[data-num='" + id + "']");
    let classElem = discription.classList.value;
    if (classElem === "done") {
        discription.classList.toggle(classElem);
        discription.classList.add("notdone");
    }
    else {
        discription.classList.toggle(classElem);
        discription.classList.add("done");
    }
    let todo = await fetch("/api/todos/" + id, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(t => t.json());
    await fetch("/api/todos/", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: 
            JSON.stringify({ id: todo.id , toDoDiscription: todo.toDoDiscription, done: !todo.done, date: todo.date })
    });
}

async function deleteToDo(id) {
    const response = await fetch("/api/todos/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const todo = await response.json();
        let elem = document.querySelector("ul[data-rowid='" + todo.id + "']");
        console.log(elem);
        elem.classList.add("animate");
        await setTimeout(() => {
            elem.remove();
            nothingToDo();
        }, 600);
    }
}

function nothingToDo() {
    let todoCount = document.getElementsByClassName("todo");
    let div = document.createElement("div");

    let divNothingToDo = document.createElement("div");
    divNothingToDo.className = "todosDone";
    div.append(divNothingToDo);
    divNothingToDo.innerText = 'There are no ToDos! Press "Add ToDo" to add one!';
    if (!todoCount.length) {
        document.getElementById("app").append(divNothingToDo);
    }
}

function reset() {
    let input = document.getElementById("discription");
    if (input.classList.contains("red")) {
        input.classList.toggle("red");
    }
    input.value = "";
}

async function addToDo() {
    let inputDiscription = document.querySelector("#discription");
    if (inputDiscription.value != "" && inputDiscription.value != "Поле не должно быть пустым!") {
        let todosDone = document.querySelector(".todosDone");
        if (todosDone != null) {
            todosDone.remove();
        }
        let discriptionToDo = document.getElementById("discription");
        const response = await fetch("api/todos", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                ToDoDiscription: `${discriptionToDo.value}`,
                Done: false,
                Date: new Date().toISOString()
            })
        });
        if (response.ok === true) {
            const todo = await response.json();
            let app = document.getElementById("app");
            let html = "";
            let start = document.getElementsByClassName("todo").length;
            html += `<ul class="todo" data-rowid="${todo.id}">
                             <span>
                                <li>${start + 1}</li>
                                <li data-num="${todo.id}" class='${todo.done === "checked" || todo.done === true ? "done" : "notdone"}'>${todo.toDoDiscription}</li>
                             </span>
                            <span class="delete-check">
                                <input type="checkbox" onclick="doneToDo(${todo.id})"data-checked="${todo.done}"
                                    ${todo.done == true ? todo.done = "checked" : todo.done = ""} />
                                <button onclick="deleteToDo(${todo.id})">delete</button>
                            </span>
                        </ul>`
            let content = document.createElement("div");
            content.innerHTML = html;
            app.append(content);
            reset();
        }
    }
    else {
        inputDiscription.classList.add("red");
        inputDiscription.value = "Поле не должно быть пустым!";
        setTimeout(() => reset(), 2000);
    }
}


window.addEventListener("load", getToDos());

let btnAdd = document.getElementById("btnAdd");
btnAdd.addEventListener("click", addToDo);