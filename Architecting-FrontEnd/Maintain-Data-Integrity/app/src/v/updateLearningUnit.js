/***********************************************
***  Methods for the use case Update  **********
************************************************/
vt.v.updateLearningUnit = {
  setupUserInterface: function () {
    var formEl = document.forms["LearningUnit"],
        saveButton = formEl.commit,
        selectEl = formEl.selectLearningUnit;
    // load all learning unit records
    vt.m.LearningUnit.retrieveAll();
    // set up the learning unit selection list
    util.fillSelectWithOptions( vt.m.LearningUnit.instances, selectEl,
        "learnUnitNo", "title");
    // when a learning unit is selected, populate the form with its data
    selectEl.addEventListener("change", function () {
        var learnUnit=null, key = selectEl.value;
        if (key) {
          learnUnit = vt.m.LearningUnit.instances[key];
          ["learnUnitNo","title","subjectArea"].forEach( function (p) {
            formEl[p].value = learnUnit[p] !== undefined ? learnUnit[p] : "";
            // delete previous custom validation error message
            formEl[p].setCustomValidity("");
          });
        } else {
          formEl.reset();
        }
    });
    // add event listeners for responsive validation
    formEl.title.addEventListener("input", function () {
      formEl.title.setCustomValidity(
          vt.m.LearningUnit.checkTitle( formEl.title.value).message);
    });
    formEl.subjectArea.addEventListener("input", function () {
      formEl.subjectArea.setCustomValidity(
          vt.m.LearningUnit.checkSubjectArea(
              formEl.subjectArea.value).message);
    });
    // Set an event handler for the submit/save button
    saveButton.addEventListener("click",
        vt.v.updateLearningUnit.handleSaveButtonClickEvent);
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    // Set a handler for the event when the browser window/tab is closed
    window.addEventListener("beforeunload", vt.m.LearningUnit.saveAll);
   },
  // save data
  handleSaveButtonClickEvent: function () {
    var formEl = document.forms["LearningUnit"];
    var slots = {
      learnUnitNo: formEl.learnUnitNo.value,
      title: formEl.title.value,
      subjectArea: formEl.subjectArea.value
    };
    // set error messages in case of constraint violations
    formEl.title.setCustomValidity( vt.m.LearningUnit.checkTitle( slots.title).message);
    formEl.subjectArea.setCustomValidity(
        vt.m.LearningUnit.checkSubjectArea( slots.subjectArea).message);
    if (formEl.checkValidity()) vt.m.LearningUnit.update( slots);
  }
};