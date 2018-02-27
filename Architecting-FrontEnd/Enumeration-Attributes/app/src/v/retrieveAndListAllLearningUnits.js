/**
 * @fileOverview  Contains various view functions for the use case listLearningUnits
 * @author Gerd Wagner
 */
 vt.v.retrieveAndListAllLearningUnits = {
  setupUserInterface: function () {
    var tableBodyEl = document.querySelector("table#learning_units > tbody");
    var keys=[], key="", learnUnit=null, row={}, i=0;
    // load all learning unit records
    vt.m.LearningUnit.retrieveAll();
    keys = Object.keys( vt.m.LearningUnit.instances);
    // for each learning unit, create a table row with a cell for each attribute
    for (i=0; i < keys.length; i++) {
      key = keys[i];
      learnUnit = vt.m.LearningUnit.instances[key];
      row = tableBodyEl.insertRow();
      row.insertCell(-1).textContent = learnUnit.learnUnitNo;
      row.insertCell(-1).textContent = learnUnit.title;
      row.insertCell(-1).textContent = vt.m.LevelOfDifficultyEL.labels[learnUnit.levelOfDifficulty-1];
      row.insertCell(-1).textContent = vt.m.LanguageEL.enumIndexesToNames( learnUnit.availableTargetLanguages);
    }
  }
};