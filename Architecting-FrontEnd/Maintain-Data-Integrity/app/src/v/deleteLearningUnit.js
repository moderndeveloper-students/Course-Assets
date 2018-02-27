/***********************************************
***  Methods for the use case "delete learning unit"  ***
************************************************/
vt.v.deleteLearningUnit = {
  setupUserInterface: function () {
    var formEl = document.forms["LearningUnit"],
        deleteButton = formEl.commit,
        selectEl = formEl.selectLearningUnit;
    var key="", keys=[], learnUnit=null, optionEl=null, i=0;
    // load all learning unit objects
    vt.m.LearningUnit.retrieveAll();
    // set up the learning unit selection list
    util.fillSelectWithOptions( vt.m.LearningUnit.instances, selectEl,
        "learnUnitNo", "title");
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