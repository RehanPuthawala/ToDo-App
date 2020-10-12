// * To Do Controller
const todoController = (function () {
  class ToDo {
    constructor(value, id) {
      this.value = value;
      this.id = id;
    }
  }

  const allToDos = {
    ToDos: [],
    completed: [],
  };

  return {
    addToDoToDS(value) {
      let id = allToDos.ToDos.length
        ? allToDos.ToDos[allToDos.ToDos.length - 1].id + 1
        : 0;

      allToDos.ToDos.push(new ToDo(value, id));

      return id;
    },

    removeToDoFromDS(ID) {
      let idArr = allToDos.ToDos.map((todo) => todo.id);
      let idIdxOf = idArr.indexOf(ID);
      return allToDos.ToDos.splice(idIdxOf, 1);
    },

    updateToDoToDS(ID, value) {
      allToDos.ToDos.forEach((todo) => {
        if (todo.id === parseInt(ID)) {
          todo.value = value;
        }
      });
    },

    moveToDoToCompleted(id) {
      let completedToDo;
      allToDos.ToDos.forEach((todo, idx) => {
        if (todo.id === parseInt(id)) {
          completedToDo = allToDos.ToDos.splice(idx, 1);
        }
      });

      allToDos.completed.push(completedToDo);
      return completedToDo[0].id;
    },

    removeCompletedToDoFromDS(ID) {
      let idArr = allToDos.completed.map((todo) => todo.id);
      let idIdxOf = idArr.indexOf(ID);
      return allToDos.completed.splice(idIdxOf, 1);
    },

    testing() {
      return allToDos;
    },
  };
})();

// *UI Controller
const UIController = (function () {
  let DOMStrings = {
    addBtn: ".addItem__icon-box--body",
    addInput: ".addItem__input",
    toDoParentElement: ".to-do-list__body",
    removeToDoLabel: ".to-do-list__delete",
    deleteIcon: ".to-do-list__icon--small--delete",
    editIcon: ".to-do-list__icon--small--edit",
    toDoItem: ".to-do-list__item",
    toDoBody: ".to-do-list__body",
    toDoTextBox: ".to-do-list__text-box",
    toDoInput: ".to-do-list__input",
    completedBody: ".completed__body",
  };

  return {
    addToDoToUI(toDo, ID) {
      let toDoHTMLStructure = `<div class="to-do-list__item" id="to-do__${ID}">
      <div class="to-do-list__icon-box--body">
        <i
          class="fa fa-check to-do-list__icon--medium"
          aria-hidden="true"
        ></i>
      </div>

      <div class="to-do-list__text-box">
        <p class="to-do-list__item--text">
          ${toDo}
        </p>
      </div>

      <div class="to-do-list__icon-box">
        <i
          class="fa fa-pencil to-do-list__icon--small to-do-list__icon--small--edit"
          aria-hidden="true"
        ></i>
      </div>
      <div class="to-do-list__icon-box to-do-list__delete">
        <i
          class="fa fa-trash to-do-list__icon--small--delete"
          aria-hidden="true"
        ></i>
      </div>
    </div>`;

      document.querySelector(
        DOMStrings.toDoParentElement
      ).innerHTML += toDoHTMLStructure;

      // Clear And Focus Back on the Input Field
      document.querySelector(DOMStrings.addInput).value = "";
      document.querySelector(DOMStrings.addInput).focus();
    },

    removeToDoFromUI(id) {
      document.getElementById(`to-do__${id}`).remove();
    },

    editToDoToUI(toDoTextBox) {
      let editInput = document.createElement("input");
      editInput.classList.add("to-do-list__input");
      editInput.setAttribute("type", "text");
      editInput.value = toDoTextBox.firstElementChild.innerText;

      toDoTextBox.parentElement.replaceChild(editInput, toDoTextBox);
      editInput.select();
      toDoTextBox.remove();
    },

    updateToDoToUI(toDoInput) {
      let toDoTextBox = document.createElement("div");
      toDoTextBox.classList.add("to-do-list__text-box");
      let toDoText = document.createElement("p");
      toDoText.classList.add("to-do-list__item--text");
      toDoText.textContent = toDoInput.value;

      toDoTextBox.appendChild(toDoText);
      toDoInput.parentElement.replaceChild(toDoTextBox, toDoInput);
    },

    modifyTickIconBox(e) {
      if (e.target.className === "fa fa-check to-do-list__icon--medium") {
        e.target.parentElement.classList.add(
          "to-do-list__icon-box--body--active"
        );
      } else if (e.target.className === "to-do-list__icon-box--body") {
        e.target.classList.add("to-do-list__icon-box--body--active");
      }
    },

    markAsCompletedToDo(completedToDoId) {
      let completedToDo = document.getElementById(`to-do__${completedToDoId}`);
      let completedToDoValue = completedToDo.textContent;
      let completedStructure = `
      <div class="completed__item" id="completed__${completedToDoId}">
        <p class="completed__item--text">${completedToDoValue}</p>
        <div class="completed__icon-box--body">
          <i class="fa fa-trash completed__icon--small--delete" aria-hidden="true"></i>
        </div>
      </div>
      `;
      completedToDo.remove();
      document.querySelector(
        DOMStrings.completedBody
      ).innerHTML += completedStructure;
    },

    removeCompletedToDoFromUI(ID) {
      document.getElementById(`completed__${ID}`).remove();
    },

    getDOMStrings() {
      return DOMStrings;
    },
  };
})();

//* App Controller
const appController = (function (todoCtrl, UICtrl) {
  const DOMStrings = UICtrl.getDOMStrings();

  const ctrlEventHandler = function () {
    //? Add To Do Event Listener
    document
      .querySelector(DOMStrings.addBtn)
      .addEventListener("click", addToDo);

    document
      .querySelector(DOMStrings.addInput)
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          addToDo();
        }
      });

    //? Remove To Do Event Listener
    document
      .querySelector(DOMStrings.toDoBody)
      .addEventListener("click", removeToDo);

    //? Edit To Do Event Listener
    document
      .querySelector(DOMStrings.toDoBody)
      .addEventListener("click", editToDo);

    //? Update To Do Event Listener
    document
      .querySelector(DOMStrings.toDoBody)
      .addEventListener("keypress", updateToDo);

    //? Mark As Completed  To Do Event Listener
    document
      .querySelector(DOMStrings.toDoBody)
      .addEventListener("click", markAsCompleted);

    // Remove Completed To Do Event Listener
    document
      .querySelector(DOMStrings.completedBody)
      .addEventListener("click", removeCompletedToDo);
  };

  const addToDo = function () {
    // 1. Grab Input Text
    let toDo = document.querySelector(DOMStrings.addInput).value;

    // 2. Put Into the ToDo Data Structure in ToDo Controller
    let toDoID = todoCtrl.addToDoToDS(toDo);

    // 3. Update the UI
    if (toDo) UICtrl.addToDoToUI(toDo, toDoID);
  };

  const removeToDo = function (e) {
    if (e.target.className === "fa fa-trash to-do-list__icon--small--delete") {
      let toBeRemovedToDo = e.target.parentElement.parentElement;

      // 2. Grab its ID
      let id = toBeRemovedToDo.id.split("__")[1];

      // 3. Remove ToDo from Data Structure
      todoCtrl.removeToDoFromDS(parseInt(id));

      // 4. Remove ToDo from the UI
      UICtrl.removeToDoFromUI(id);
    }
  };

  const editToDo = function (e) {
    if (
      e.target.className ===
      "fa fa-pencil to-do-list__icon--small to-do-list__icon--small--edit"
    ) {
      let eventTarget = e.target;
      let toDoTextBox = eventTarget.parentElement.previousElementSibling;

      // Update the UI & Show Input Box
      UICtrl.editToDoToUI(toDoTextBox);
    }
  };

  const updateToDo = function (e) {
    if (e.key === "Enter") {
      let toDoInput = document.querySelector(DOMStrings.toDoInput);
      let id = toDoInput.parentElement.id;
      let idNum = id.split("__")[1];

      // 1. Update the To Do In Data Structure
      todoCtrl.updateToDoToDS(idNum, toDoInput.value);

      // 2. Update The UI
      UICtrl.updateToDoToUI(toDoInput);
    }
  };

  const markAsCompleted = function (e) {
    if (
      e.target.className === "fa fa-check to-do-list__icon--medium" ||
      e.target.className === "to-do-list__icon-box--body"
    ) {
      let completedToDo =
        e.target.className === "fa fa-check to-do-list__icon--medium"
          ? e.target.parentElement.parentElement
          : e.target.parentElement;

      // 1. Modify Tick Icon Box
      UICtrl.modifyTickIconBox(e);

      // 2. Update the DS
      let completedId = todoCtrl.moveToDoToCompleted(
        completedToDo.id.split("__")[1]
      );

      // 3. Update The Ui
      UICtrl.markAsCompletedToDo(completedId);
    }
  };

  const removeCompletedToDo = function (e) {
    if (e.target.className === "fa fa-trash completed__icon--small--delete") {
      let completedToDoID = e.target.parentElement.parentElement.id.split("__")[1];

      console.log(completedToDoID);
      // 1. Remove Completed To Do From DS
      todoCtrl.removeCompletedToDoFromDS(parseInt(completedToDoID));

      // 2. Remove Completed To Do From UI
      UICtrl.removeCompletedToDoFromUI(completedToDoID);
    }
  };

  return {
    init() {
      console.log("Application has Started");
      ctrlEventHandler();
    },
  };
})(todoController, UIController);

appController.init();
