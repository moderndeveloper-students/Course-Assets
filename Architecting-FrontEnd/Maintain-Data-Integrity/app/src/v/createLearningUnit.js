/***********************************************
***  Methods for the use case Create  **********
************************************************/
vt.v.createLearningUnit = {
  setupUserInterface: function () {
    var formEl = document.forms['LearningUnit'],
        saveButton = formEl.commit;
    // load all learning unit records
    vt.m.LearningUnit.retrieveAll();
    // add event listeners for responsive validation
    formEl.learnUnitNo.addEventListener("input", function () {
        formEl.learnUnitNo.setCustomValidity(
          vt.m.LearningUnit.checkLearnUnitNoAsId(
              formEl.learnUnitNo.value).message);
    });
    formEl.title.addEventListener("input", function () {
        formEl.title.setCustomValidity(
          vt.m.LearningUnit.checkTitle( formEl.title.value).message);
    });
    formEl.subjectArea.addEventListener("input", function () {
        formEl.subjectArea.setCustomValidity(
          vt.m.LearningUnit.checkSubjectArea(
              formEl.subjectArea.value).message);
    });
    // set an event handler for the submit/save button
    saveButton.addEventListener("click",
        vt.v.createLearningUnit.handleSaveButtonClickEvent);
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    // make sure the data is saved when the browser window/tab is closed
    window.addEventListener("beforeunload", vt.m.LearningUnit.saveAll);
  },
  /**
   * save session data
   */
  handleSaveButtonClickEvent: function () {
    var formEl = document.forms["LearningUnit"];
    var slots = {
      learnUnitNo: formEl.learnUnitNo.value,
      title: formEl.title.value,
      subjectArea: formEl.subjectArea.value
    };
    // set error messages in case of constraint violations
    formEl.learnUnitNo.setCustomValidity(
        vt.m.LearningUnit.checkLearnUnitNoAsId( slots.learnUnitNo).message);
    formEl.title.setCustomValidity(
        vt.m.LearningUnit.checkTitle( slots.title).message);
    formEl.subjectArea.setCustomValidity(
        vt.m.LearningUnit.checkSubjectArea( slots.subjectArea).message);
    // save the changes only if all of them are valid
    if (formEl.checkValidity()) vt.m.LearningUnit.add( slots);
  }
};