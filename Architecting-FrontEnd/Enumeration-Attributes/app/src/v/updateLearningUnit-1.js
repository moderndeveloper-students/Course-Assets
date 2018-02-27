/***********************************************
***  Methods for the use case Update  **********
************************************************/
vt.v.updateLearningUnit = {
  setupUserInterface: function () {
    var formEl = document.forms["LearningUnit"],
        saveButton = formEl.commit;
    var selectEl = formEl.selectLearningUnit,
        levelOfDiffSelEl = formEl.levelOfDifficulty,
        availTargetLangSelEl = formEl.availableTargetLanguages;
    // load all learning unit records
    vt.m.LearningUnit.retrieveAll();
    // set up the selection list for the object to be updated
    util.fillSelectWithOptionsFromEntityTable( selectEl,
        vt.m.LearningUnit.instances, "learnUnitNo", "title");
    // when a learning unit is selected, populate the form with its data
    selectEl.addEventListener("change", function () {
        var learnUnit=null, key = selectEl.value;
        if (key) {
          learnUnit = vt.m.LearningUnit.instances[key];
          // populate the selection list for the levelOfDifficulty enum attribute
          util.fillSelectWithOptionsFromEnumLabels(
              levelOfDiffSelEl, vt.m.LevelOfDifficultyEL.labels);
          // fill form fields with property values
          ["learnUnitNo","title","levelOfDifficulty"].forEach( function (p) {
            formEl[p].value = learnUnit[p] !== undefined ? learnUnit[p] : "";
            // delete previous custom validation error message
            formEl[p].setCustomValidity("");
          });
          /* populate the multi-selection list for availableTargetLanguages, which
             is mandatory, so there's no need for an unselect event listener */
          util.fillMultiSelectWithOptionsFromEnumLabels(
              availTargetLangSelEl, vt.m.LanguageEL.labels,
              learnUnit.availableTargetLanguages
          );
        } else {
          formEl.reset();
        }
    });
    // add event listeners for responsive validation
    formEl.title.addEventListener("input", function () {
      formEl.title.setCustomValidity(
          vt.m.LearningUnit.checkTitle( formEl.title.value).message);
    });
    // simplified validation: check only mandatory value
    levelOfDiffSelEl.addEventListener("change", function () {
      levelOfDiffSelEl.setCustomValidity(
          (levelOfDiffSelEl.value==="-") ? "A value must be selected!":"" );
    });
    // check mandatory value constraint for multiple selection list
    availTargetLangSelEl.addEventListener("change", function () {
      availTargetLangSelEl.setCustomValidity(
          (availTargetLangSelEl.selectedOptions.length === 0) ? "A value must be selected!":"" );
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
    formEl.title.setCustomValidity( vt.m.LearningUnit.checkTitle(
        slots.title).message);
    formEl.levelOfDifficulty.setCustomValidity(
        vt.m.LearningUnit.checkLevelOfDifficulty( slots.levelOfDifficulty).message);
    formEl.availableTargetLanguages.setCustomValidity(
        vt.m.LearningUnit.checkAvailableTargetLanguages(
            slots.availableTargetLanguages).message);
    if (formEl.checkValidity()) vt.m.LearningUnit.update( slots);
  }
};