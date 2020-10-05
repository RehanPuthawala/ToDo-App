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
    toDoItem: ".to-do-list__item",
    toDoBody: ".to-do-list__body",
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

    getDOMStrings() {
      return DOMStrings;
    },
  };
})();

//* App Controller
const appController = (function (todoCtrl, UICtrl) {
  const DOMStrings = UICtrl.getDOMStrings();

  const ctrlEventHandler = function () {
    document
      .querySelector(DOMStrings.addBtn)
      .addEventListener("click", addToDo);

    document
      .querySelector(DOMStrings.toDoBody)
      .addEventListener("click", removeToDo);
  };

  const addToDo = function () {
    // 1. Grab Input Text
    let toDo = document.querySelector(DOMStrings.addInput).value;

    // 2. Put Into the ToDo Data Structure in ToDo Controller
    let toDoID = todoCtrl.addToDoToDS(toDo);

    // 3. Update the UI
    UICtrl.addToDoToUI(toDo, toDoID);
  };

  const removeToDo = function (e) {
    if (e.target.className === "fa fa-trash to-do-list__icon--small--delete") {
      let toBeRemovedToDo = document
        .querySelector(DOMStrings.removeToDoLabel)
        .closest(DOMStrings.toDoItem);

      // 2. Grab its ID
      let id = toBeRemovedToDo.id.split("__")[1];

      // 3. Remove ToDo from Data Structure
      todoCtrl.removeToDoFromDS(id);

      // 4. Remove ToDo from the UI
      UICtrl.removeToDoFromUI(id);
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
