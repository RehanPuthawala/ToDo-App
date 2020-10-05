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
    addToDo(value) {
      let id = allToDos.ToDos.length
        ? allToDos.ToDos[allToDos.ToDos.length - 1].id + 1
        : 0;

      allToDos.ToDos.push(new ToDo(value, id));
    },

    testing() {
      return allToDos;
    },
  };
})();

// *UI Controller
const UIController = (function () {
  let DOMStrings = {
    addBtn: ".addItem__add-btn",
    addInput: ".addItem__input",
  };

  return {
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
  };

  const addToDo = function () {
    // 1. Grab Input Text
    let toDo = document.querySelector(DOMStrings.addInput).value;

    // 2. Put Into the ToDo Data Structure in ToDo Controller
    todoCtrl.addToDo(toDo);

    // 3. Update the UI
  };

  return {
    init() {
      console.log("Application has Started");
      ctrlEventHandler();
    },
  };
})(todoController, UIController);

appController.init();
