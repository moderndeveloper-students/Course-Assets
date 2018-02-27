/***********************************************
***  Methods for the use case "delete learning unit"  ***
************************************************/
vt.v.deleteLearningUnit = {
  setupUserInterface: function () {
    var deleteButton = document.forms["LearningUnit"].commit;
    var selectEl = document.forms['LearningUnit'].selectLearningUnit;
    var key="", keys=[], learnUnit=null, optionEl=null, i=0;
    // load all learning unit objects
    vt.m.LearningUnit.retrieveAll();
    keys = Object.keys( vt.m.LearningUnit.instances);
    // populate the selection list
    for (i=0; i < keys.length; i++) {
      key = keys[i];
      learnUnit = vt.m.LearningUnit.instances[key];
      optionEl = document.createElement("option");
      optionEl.text = learnUnit.title;
      optionEl.value = learnUnit.learnUnitNo;
      selectEl.add( optionEl, null);
    }
    // Set a click event handler for the submit/delete button
    deleteButton.addEventListener("click", 
        vt.v.deleteLearningUnit.handleDeleteButtonClickEvent);
    // Set a handler for the event when the browser window/tab is closed
    window.addEventListener("beforeunload", vt.m.LearningUnit.saveAll);
  },
  // Event handler for deleting a learning unit
  handleDeleteButtonClickEvent: function () {
    var selectEl = document.forms["LearningUnit"].selectLearningUnit;
    var learnUnitNo = selectEl.value;
    if (learnUnitNo) {
      vt.m.LearningUnit.destroy( learnUnitNo);
      // remove deleted learning unit from select options
      selectEl.remove( selectEl.selectedIndex);
    }
  }
};