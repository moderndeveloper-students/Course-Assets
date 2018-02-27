/**
 * @fileOverview  Contains definition of model class VocabularyProblem  
 * @author Gerd Wagner
 */

/**
 * @class
 */
vt.m.LearningUnit = function (slots) {
    this.learnUnitNo = slots.learnUnitNo;
    this.title = slots.title;
    this.description = slots.description;
};
/***********************************************
 ***  Class-level ("static") properties  *******
 ***********************************************/
// initially an empty collection (in the form of a map)
vt.m.LearningUnit.instances = {};

/***********************************************
 ***  Class-level ("static") methods  **********
 ***********************************************/
/**
 * Convert learning unit records to objects
 * @method
 */
vt.m.LearningUnit.convertRec2Obj = function (learnUnitRec) {
  return new vt.m.LearningUnit( learnUnitRec);
};
/**
 * Retrieve learning unit table from local storage
 * @method
 */
vt.m.LearningUnit.retrieveAll = function () {
  var key="", keys=[], learningUnitsString="", learningUnits={}, i=0;
  try {
    if (localStorage["learning_units"]) {
      learningUnitsString = localStorage["learning_units"];
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (learningUnitsString) {
    learningUnits = JSON.parse( learningUnitsString);
    keys = Object.keys( learningUnits);
    console.log( keys.length +" learningUnits loaded.");
    for (i=0; i < keys.length; i++) {
      key = keys[i];
      vt.m.LearningUnit.instances[key] =
          vt.m.LearningUnit.convertRec2Obj( learningUnits[key]);
    }
  }
};
/**
 * Save all learning unit objects to Local Storage
 * @method
 */
vt.m.LearningUnit.saveAll = function () {
  var learningUnitsString="", error=false,
      N = Object.keys( vt.m.LearningUnit.instances).length;
  try {
    learningUnitsString = JSON.stringify( vt.m.LearningUnit.instances);
    localStorage.setItem("learning_units", learningUnitsString);
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) console.log( N + " learning units saved.");
};
/**
 * Create a new learning unit object and add it to the class population
 * @method
 */
vt.m.LearningUnit.add = function (slots) {
  vt.m.LearningUnit.instances[String( slots.learnUnitNo)] =
      new vt.m.LearningUnit(slots);
  console.log("Learning unit " + slots.learnUnitNo + " created!");
};
/**
 * Update an existing learning unit record
 * @method
 */
vt.m.LearningUnit.update = function (slots) {
  // retrieve learning unit from main memory database
  var learnUnit = vt.m.LearningUnit.instances[String( slots.learnUnitNo)];
  // if property value has been changed, assign new value
  if (learnUnit.title !== slots.title) learnUnit.title = slots.title;
  if (learnUnit.description !== slots.description) {
    learnUnit.description = slots.description;
  }
  console.log("Learning unit " + slots.learnUnitNo + " modified!");
};
/**
 * Delete a learning unit record from persistent storage
 * @method
 */
vt.m.LearningUnit.destroy = function (learnUnitNo) {
  if (vt.m.LearningUnit.instances[learnUnitNo]) {
    delete vt.m.LearningUnit.instances[learnUnitNo];
    console.log("Learning unit " + learnUnitNo + " deleted");
  } else {
    console.log("There is no learning unit with number " + learnUnitNo +
        " in the database!");
  }
};
/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 * Create and save test data
 * @method
 */
vt.m.LearningUnit.createTestData = function () {
  vt.m.LearningUnit.instances["1"] = new vt.m.LearningUnit({learnUnitNo: 1, title:"At Home",
      description:"About rooms and places in the home, types of houses, places where people " +
      "live, and objects of the home."});
  vt.m.LearningUnit.instances["2"] = new vt.m.LearningUnit({learnUnitNo: 2, title:"Months, Days " +
      "and Times of the Day", description:"About the names of months and days of the week, and " +
      "about different times of the day."});
  vt.m.LearningUnit.saveAll();
};
/**
 * Clear data store by dropping all learning unit records
 * @method
 */
vt.m.LearningUnit.clearData = function () {
  if (confirm("Do you really want to delete all learning unit data?")) {
    vt.m.LearningUnit.instances = {};
    localStorage.setItem("learning_units", "{}");
  }
};
