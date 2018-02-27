/***********************************************
***  Methods for the use case createLearningUnit  ******
************************************************/
vt.v.createLearningUnit = {
  setupUserInterface: function () {
    var saveButton = document.forms["LearningUnit"].commit;
    // load all learning unit objects
    vt.m.LearningUnit.retrieveAll();
    // Set a click event handler for the save/submit button
    saveButton.addEventListener("click", 
        vt.v.createLearningUnit.handleSaveButtonClickEvent);
    // Set a handler for the event when the browser window/tab is closed
    window.addEventListener("beforeunload", vt.m.LearningUnit.saveAll);
  },
  // save user input data
  handleSaveButtonClickEvent: function () {
    var formEl = document.forms["LearningUnit"];
    var slots = {
          learnUnitNo: parseInt( formEl.learnUnitNo.value),
          title: formEl.title.value,
          description: formEl.description.value
    };
    vt.m.LearningUnit.add( slots);
    formEl.reset();
  }
};