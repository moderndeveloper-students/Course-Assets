/***********************************************
***  Methods for the use case Update  **********
************************************************/
vt.v.updateLearningUnit = {
  setupUserInterface: function () {
    var formEl = document.forms["LearningUnit"],
        saveButton = formEl.commit;
    var selectEl = formEl.selectLearningUnit,
        levOfDiffFieldsetEl = formEl.querySelector(
            "fieldset[data-bind='levelOfDifficulty']"),
        availTargLangFieldsetEl = formEl.querySelector(
            "fieldset[data-bind='availableTargetLanguages']");
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
          // fill form fields with property values
          ["learnUnitNo","title"].forEach( function (p) {
            formEl[p].value = learnUnit[p] !== undefined ? learnUnit[p] : "";
            // delete previous custom validation error message
            formEl[p].setCustomValidity("");
          });
          // set up the levelOfDifficulty radio button group
          util.createChoiceWidget( levOfDiffFieldsetEl, "levelOfDifficulty",
              [learnUnit.levelOfDifficulty], "radio", vt.m.LevelOfDifficultyEL.labels);
          // set up the availableTargetLanguages checkbox group
          util.createChoiceWidget( availTargLangFieldsetEl, "availableTargetLanguages",
              learnUnit.availableTargetLanguages, "checkbox", vt.m.LanguageEL.labels);
        } else {
          formEl.reset();
        }
    });
    // add event listeners for responsive validation
    formEl.title.addEventListener("input", function () {
      formEl.title.setCustomValidity(
          vt.m.LearningUnit.checkTitle( formEl.title.value).message);
    });
    // mandatory value check
    availTargLangFieldsetEl.addEventListener("click", function () {
      var val = availTargLangFieldsetEl.getAttribute("data-value");
      formEl.availableTargetLanguages[0].setCustomValidity(
          (!val || Array.isArray(val) && val.length === 0) ?
              "At least one language must be selected!":"" );
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
    var levOfDiffFieldsetEl = formEl.querySelector(
            "fieldset[data-bind='levelOfDifficulty']"),
        availTargLangFieldsetEl = formEl.querySelector(
            "fieldset[data-bind='availableTargetLanguages']");
    var slots = {
      learnUnitNo: formEl.learnUnitNo.value,
      title: formEl.title.value,
      levelOfDifficulty: levOfDiffFieldsetEl.getAttribute("data-value"),
      availableTargetLanguages: JSON.parse(
          availTargLangFieldsetEl.getAttribute("data-value"))
    };
    // set error messages in case of constraint violations
    formEl.title.setCustomValidity( vt.m.LearningUnit.checkTitle(
        slots.title).message);
    formEl.levelOfDifficulty[0].setCustomValidity(
        vt.m.LearningUnit.checkLevelOfDifficulty( slots.levelOfDifficulty).message);
    formEl.availableTargetLanguages[0].setCustomValidity(
        vt.m.LearningUnit.checkAvailableTargetLanguages(
            slots.availableTargetLanguages).message);
    if (formEl.checkValidity()) vt.m.LearningUnit.update( slots);
  }
};