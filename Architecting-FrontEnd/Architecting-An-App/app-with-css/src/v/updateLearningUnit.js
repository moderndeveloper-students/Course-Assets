/***********************************************
***  Methods for the use case updateLearningUnit  ******
************************************************/
vt.v.updateLearningUnit = {
  setupUserInterface: function () {
    var formEl = document.forms["LearningUnit"],
        saveButton = formEl.commit,
        selectLearningUnitEl = formEl.selectLearningUnit;
    var key="", keys=[], learnUnit=null, optionEl=null, i=0;
    // load all learning unit objects
    vt.m.LearningUnit.retrieveAll();
    // populate the selection list
    keys = Object.keys( vt.m.LearningUnit.instances);
    for (i=0; i < keys.length; i++) {
      key = keys[i];
      learnUnit = vt.m.LearningUnit.instances[key];
      optionEl = document.createElement("option");
      optionEl.text = learnUnit.title;
      optionEl.value = learnUnit.learnUnitNo;
      selectLearningUnitEl.add( optionEl, null);
    }
    // when a learning unit is selected, populate the form with the learning unit data
    selectLearningUnitEl.addEventListener("change", function () {
        var learnUnit=null, key = selectLearningUnitEl.value;
        if (key) {
          learnUnit = vt.m.LearningUnit.instances[key];
          formEl.learnUnitNo.value = learnUnit.learnUnitNo;
          formEl.title.value = learnUnit.title;
          formEl.description.value = learnUnit.description;
        } else {
          formEl.reset();
        }
    });
    // Set a click event handler for the save/submit button
    saveButton.addEventListener("click", 
        vt.v.updateLearningUnit.handleSaveButtonClickEvent);
    // Set a handler for the event when the browser window/tab is closed
    window.addEventListener("beforeunload", vt.m.LearningUnit.saveAll);
  },
  // save data
  handleSaveButtonClickEvent: function () {
    var formEl = document.forms["LearningUnit"];
    var slots = { learnUnitNo: parseInt( formEl.learnUnitNo.value),
          title: formEl.title.value, 
          description: formEl.description.value
        };
    vt.m.LearningUnit.update( slots);
    formEl.reset();
  }
};