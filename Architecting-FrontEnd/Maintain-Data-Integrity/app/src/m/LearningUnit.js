/**
 * @fileOverview  Contains definition of model class VocabularyProblem  
 * @author Gerd Wagner
 */

/**
 * @class
 */
vt.m.LearningUnit = function (slots) {
  // assign default values to mandatory properties
  this.learnUnitNo = 0;
  this.title = "";
  // assign properties only if the constructor is invoked with an argument
  if (arguments.length > 0) {
    this.setLearnUnitNo( slots.learnUnitNo);
    this.setTitle( slots.title);
    // optional property
    if (slots.subjectArea) this.setSubjectArea( slots.subjectArea);
  }
};
/***********************************************
 ***  Class-level ("static") properties  *******
 ***********************************************/
// initially an empty collection (in the form of a map)
vt.m.LearningUnit.instances = {};

/**********************************************************
 ***  Checks and Setters  *********************************
 **********************************************************/
vt.m.LearningUnit.checkLearnUnitNo = function (n) {
  if (n === undefined) return new NoConstraintViolation();
  else if (!util.isIntegerOrIntegerString(n) || parseInt(n) < 1) {
    return new RangeConstraintViolation(
        "A learning unit number must be a positive integer!");
  } else {
    return new NoConstraintViolation();
  }
};
vt.m.LearningUnit.checkLearnUnitNoAsId = function (n) {
  var validationResult = vt.m.LearningUnit.checkLearnUnitNo( n);
  if ((validationResult instanceof NoConstraintViolation)) {
    if (n === undefined) {
      validationResult = new MandatoryValueConstraintViolation(
          "A learning unit number must be provided!");
    } else if (vt.m.LearningUnit.instances[String(n)]) {
      validationResult = new UniquenessConstraintViolation(
          "There is already a learning unit record with this number!");
    } else {
      validationResult = new NoConstraintViolation();
    }
  }
  return validationResult;
};
vt.m.LearningUnit.prototype.setLearnUnitNo = function (n) {
  var validationResult = vt.m.LearningUnit.checkLearnUnitNoAsId( n);
  if (validationResult instanceof NoConstraintViolation) {
    this.learnUnitNo = parseInt(n);
  } else {
    throw validationResult;
  }
};
vt.m.LearningUnit.checkTitle = function (t) {
  if (t === undefined) {
    return new MandatoryValueConstraintViolation("A title must be provided!");
  } else if (!util.isNonEmptyString( t)) {
    return new RangeConstraintViolation("The title must be a non-empty string!");
  } else if (t.length < 2 || t.length > 80) {
    return new StringLengthConstraintViolation(
        "The title must have at least 2 and at most 80 characters !");
  } else {
    return new NoConstraintViolation();
  }
};
vt.m.LearningUnit.prototype.setTitle = function (t) {
  var validationResult = vt.m.LearningUnit.checkTitle( t);
  if (validationResult instanceof NoConstraintViolation) {
    this.title = t;
  } else {
    throw validationResult;
  }
};
vt.m.LearningUnit.checkSubjectArea = function (s) {
  if (s === undefined || s === "") return new NoConstraintViolation();  // optional
  else if (typeof s !== "string") {
    return new RangeConstraintViolation("" +
        "The value for subject area must be a string!");
  } else {
    return new NoConstraintViolation();
  }
};
vt.m.LearningUnit.prototype.setSubjectArea = function (s) {
  var validationResult = vt.m.LearningUnit.checkSubjectArea( s);
  if (validationResult instanceof NoConstraintViolation) {
    if (s) this.subjectArea = s;  // do not assign to ""
  } else {
    throw validationResult;
  }
};
/*********************************************************
 ***  Other Instance-Level Methods  **********************
 *********************************************************/
/**
 * Serialize learning unit object
 * @method
 */
vt.m.LearningUnit.prototype.toString = function () {
  return "LearningUnit{ No: " + this.learnUnitNo + ", Title: " +
      this.title +
      (this.subjectArea ? ", SubjectArea: "+ this.subjectArea : "") +"}";
};

/***********************************************
 ***  Class-level ("static") methods  **********
 ***********************************************/
/**
 * Convert learning unit records to instances of LearningUnit
 * @method
 */
vt.m.LearningUnit.convertRec2Obj = function (learnUnitRec) {
  var learnUnit={};
  try {
    learnUnit = new vt.m.LearningUnit( learnUnitRec);
  } catch (e) {
    console.log( e.constructor.name + " while deserializing a record: " +
        e.message);
  }
  return learnUnit;
};
/**
 * Retrieve learning units table from local storage
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
    localStorage["learning_units"] = learningUnitsString;
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
  var learnUnit = null;
  try {
    learnUnit = new vt.m.LearningUnit( slots);
  } catch (e) {
    console.log( e.constructor.name +": "+ e.message);
    learnUnit = null;
  }
  if (learnUnit) {
    vt.m.LearningUnit.instances[learnUnit.learnUnitNo] = learnUnit;
    console.log( learnUnit.toString() + " created!");
  }
};
/**
 * Update an existing learning unit record
 * @method
 */
vt.m.LearningUnit.update = function (slots) {
  var learnUnit = vt.m.LearningUnit.instances[slots.learnUnitNo],
      noConstraintViolated = true,
      updatedProperties = [],
      objectBeforeUpdate = util.cloneObject( learnUnit);
  try {
    if (learnUnit.title !== slots.title) {
      learnUnit.setTitle( slots.title);
      updatedProperties.push("title");
    }
    if (slots.subjectArea && learnUnit.subjectArea !== slots.subjectArea) {
      learnUnit.setSubjectArea( slots.subjectArea);
      updatedProperties.push("subjectArea");
    } else if (!slots.subjectArea && learnUnit.subjectArea !== undefined) {
      delete learnUnit.subjectArea;
      updatedProperties.push("subjectArea");
    }
  } catch (e) {
    console.log( e.constructor.name +": "+ e.message);
    noConstraintViolated = false;
    // restore object to its state before updating
    vt.m.LearningUnit.instances[slots.learnUnitNo] = objectBeforeUpdate;
  }
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      console.log("Properties " + updatedProperties.toString() +
          " modified for learning unit " + slots.learnUnitNo);
    } else {
      console.log("No property value changed for learning unit " + slots.learnUnitNo + "!");
    }
  }
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
  vt.m.LearningUnit.instances["1"] = new vt.m.LearningUnit({learnUnitNo: 1, title:"At the Grocery Store",
      subjectArea:"Shopping"});
  vt.m.LearningUnit.instances["2"] = new vt.m.LearningUnit({learnUnitNo: 2, title:"At the Bakery",
      subjectArea:"Shopping"});
  vt.m.LearningUnit.instances["3"] = new vt.m.LearningUnit({learnUnitNo: 3, title:"Months, Days " +
      "and Times of the Day" });
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
