/***********************************************
***  Methods for the use case Create  **********
************************************************/
vt.v.createLearningUnit = {
  setupUserInterface: function () {
    var formEl = document.forms['LearningUnit'],
        saveButton = formEl.commit;
    var levelOfDiffSelEl = formEl.levelOfDifficulty,
        availTargetLangSelEl = formEl.availableTargetLanguages;
    // load all learning unit records
    vt.m.LearningUnit.retrieveAll();
    // set up selection lists for enum attributes
    util.fillSelectWithOptionsFromEnumLabels(
        levelOfDiffSelEl, vt.m.LevelOfDifficultyEL.labels);
    util.fillMultiSelectWithOptionsFromEnumLabels(
        availTargetLangSelEl, vt.m.LanguageEL.labels);
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
	/*
    // check mandatory value constraint for radio button group
    levOfDiffFieldsetEl.addEventListener("click", function () {
      formEl.levelOfDifficulty[0].setCustomValidity(
          (!levOfDiffFieldsetEl.getAttribute("data-value")) ?
              "A level of difficulty must be selected!":"" );
    });
	*/
    // check mandatory value constraint for multiple selection list
    availTargetLangSelEl.addEventListener("change", function () {
      availTargetLangSelEl.setCustomValidity(
          (availTargetLangSelEl.selectedOptions.length === 0) ? "A value must be selected!":"" );
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
    var i=0, formEl = document.forms["LearningUnit"];
    var selectedLangs = formEl.availableTargetLanguages.selectedOptions;
    var slots = {
      learnUnitNo: formEl.learnUnitNo.value,
      title: formEl.title.value,
      levelOfDifficulty: formEl.levelOfDifficulty.value,
      availableTargetLanguages: []
    };
    // construct the list of selected availableTargetLanguages
    for (i=0; i < selectedLangs.length; i++) {
      slots.availableTargetLanguages.push(
          parseInt( selectedLangs[i].value));
    }
    // set error messages in case of constraint violations
    formEl.learnUnitNo.setCustomValidity(
        vt.m.LearningUnit.checkLearnUnitNoAsId( slots.learnUnitNo).message);
    formEl.title.setCustomValidity(
        vt.m.LearningUnit.checkTitle( slots.title).message);
    formEl.levelOfDifficulty.setCustomValidity(
        vt.m.LearningUnit.checkLevelOfDifficulty( slots.levelOfDifficulty).message);
    formEl.availableTargetLanguages.setCustomValidity(
        vt.m.LearningUnit.checkAvailableTargetLanguages(
            slots.availableTargetLanguages).message);
    // save the changes only if all of them are valid
    if (formEl.checkValidity()) vt.m.LearningUnit.add( slots);
  }
};