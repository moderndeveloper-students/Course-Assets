/**
 * @fileOverview  Contains various view functions for the use case listLearningUnits
 * @author Gerd Wagner
 */
 vt.v.retrieveAndListAllLearningUnits = {
  setupUserInterface: function () {
    var tableBodyEl = document.querySelector("table#learning_units > tbody");
    var keys=[], key="", row={}, i=0;
    // load all learning unit objects
    vt.m.LearningUnit.retrieveAll();
    keys = Object.keys( vt.m.LearningUnit.instances);
    // for each learning unit, create a table row with a cell for each attribute
    for (i=0; i < keys.length; i++) {
      key = keys[i];
      row = tableBodyEl.insertRow();
      row.insertCell(-1).textContent = vt.m.LearningUnit.instances[key].learnUnitNo;
      row.insertCell(-1).textContent = vt.m.LearningUnit.instances[key].title;
      row.insertCell(-1).textContent = vt.m.LearningUnit.instances[key].description;
    }
  }
};