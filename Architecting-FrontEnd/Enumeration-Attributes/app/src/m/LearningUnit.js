/**
 * @fileOverview  Contains definition of model class VocabularyProblem  
 * @author Gerd Wagner
 */

vt.m.LevelOfDifficultyEL = new eNUMERATION("LevelOfDifficultyEL",
    ["basic","intermediate","advanced"]);
vt.m.LanguageEL = new eNUMERATION("LanguageEL",
    {"es":"Spanish","fr":"French","pt":"Portuguese","de":"German"});

/**
 * @class
 */
vt.m.LearningUnit = class {
  constructor (slots) {
    // assign default values to mandatory properties
    this._learnUnitNo = 0;  // number (non-negative integer)
    this._title = "";  // string
    this._levelOfDifficulty = 0;  // number (from LevelOfDifficultyEL)
    this._availableTargetLanguages = [];  // list of numbers (from LanguageEL)
    // is constructor invoked with a non-empty slots argument?
    if (typeof slots === "object" && Object.keys( slots).length > 0) {
      // assign properties by invoking implicit setters
      this.learnUnitNo = slots.learnUnitNo;
      this.title = slots.title;
      this.levelOfDifficulty = slots.levelOfDifficulty;
      this.availableTargetLanguages = slots.availableTargetLanguages;
    }
  }
  get learnUnitNo () {
    return this._learnUnitNo;
  }
  static checkLearnUnitNo( n) {
    if (!n) return new NoConstraintViolation();
    else if (!util.isIntegerOrIntegerString(n) || parseInt(n) < 1) {
      return new RangeConstraintViolation(
          "A learning unit number must be a positive integer!");
    } else {
      return new NoConstraintViolation();
    }
  }
  static checkLearnUnitNoAsId( n) {
    var validationResult = vt.m.LearningUnit.checkLearnUnitNo( n);
    if ((validationResult instanceof NoConstraintViolation)) {
      if (!n) {
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
  }
  set learnUnitNo (n) {
    var validationResult = vt.m.LearningUnit.checkLearnUnitNoAsId( n);
    if (validationResult instanceof NoConstraintViolation) {
      this._learnUnitNo = parseInt( n);
    } else {
      throw validationResult;
    }
  }
  get title () {
    return this._title;
  }
  static checkTitle( t) {
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
  }
  set title (t) {
    var validationResult = vt.m.LearningUnit.checkTitle( t);
    if (validationResult instanceof NoConstraintViolation) {
      this._title = t;
    } else {
      throw validationResult;
    }
  }
  get levelOfDifficulty () {
    return this._levelOfDifficulty;
  }
  static checkLevelOfDifficulty( l) {
    var max = vt.m.LevelOfDifficultyEL.MAX;
    if (!l) {
      return new MandatoryValueConstraintViolation("No level of difficulty chosen/provided!");
    } else if (!util.isIntegerOrIntegerString(l) || parseInt(l) < 1 || parseInt(l) > max) {
      return new RangeConstraintViolation("Level of difficulty must be one of " +
          vt.m.LevelOfDifficultyEL.labels +" !");
    } else {
      return new NoConstraintViolation();
    }
  }
  set levelOfDifficulty (l) {
    var validationResult = vt.m.LearningUnit.checkLevelOfDifficulty( l);
    if (validationResult instanceof NoConstraintViolation) {
      this._levelOfDifficulty = parseInt( l);
    } else {
      throw validationResult;
    }
  }
  get availableTargetLanguages () {
    return this._availableTargetLanguages;
  }
  static checkAvailableTargetLanguage( atl) {
    var max = vt.m.LanguageEL.MAX;
    if (!util.isIntegerOrIntegerString(atl) || parseInt(atl) < 1 ||
        parseInt(atl) > max) {
      return new RangeConstraintViolation(
          "Any item of the availableTargetLanguages list must be a positive integer " +
          "not greater than" + max + " !");
    } else return new NoConstraintViolation();
  }
  static checkAvailableTargetLanguages( langs) {
    var i=0, constraintViolation=null;
    if (langs === undefined || (Array.isArray( langs) && langs.length === 0)) {
      return new MandatoryValueConstraintViolation(
          "At least one available target language must be chosen/provided!");
    } else if (!Array.isArray( langs)) {
      return new RangeConstraintViolation(
          "The value of availableTargetLanguages must be a list/array!");
    } else {
      for (i=0; i < langs.length; i++) {
        constraintViolation = vt.m.LearningUnit.checkAvailableTargetLanguage( langs[i]);
        if (!(constraintViolation instanceof NoConstraintViolation)) {
          return constraintViolation;
        }
      }
      return new NoConstraintViolation();
    }
  }
  set availableTargetLanguages (langs) {
    var validationResult = vt.m.LearningUnit.checkAvailableTargetLanguages( langs);
    if (validationResult instanceof NoConstraintViolation) {
      this._availableTargetLanguages = langs;
    } else {
      throw validationResult;
    }
  }
};

/***********************************************
 ***  Class-level ("static") properties  *******
 ***********************************************/
// initially an empty collection (in the form of a map)
vt.m.LearningUnit.instances = {};

/*********************************************************
 ***  Other Instance-Level Methods  **********************
 *********************************************************/
/**
 * Serialize learning unit object
 * @method
 */
vt.m.LearningUnit.prototype.toString = function () {
  return "LearningUnit{ No: " + this.learnUnitNo + 
      ", Title: " + this.title + 
      ", Level of difficulty: " + this.levelOfDifficulty + 
      ", Avail. target lang.: " + this.availableTargetLanguages.toString() + 
    "}";
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
    // serialize the entity table
    learningUnitsString = JSON.stringify( vt.m.LearningUnit.instances);
    // convert internal to external property names by deleting the _
    learningUnitsString = learningUnitsString.replace(/"_/g,'"');
    localStorage["learning_units"] = learningUnitsString;
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) console.log( N + " learning unit records saved.");
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
      learnUnit.title = slots.title;
      updatedProperties.push("title");
    }
    if (learnUnit.levelOfDifficulty !== parseInt( slots.levelOfDifficulty)) {
      learnUnit.levelOfDifficulty = parseInt( slots.levelOfDifficulty);
      updatedProperties.push("levelOfDifficulty");
    }
    if (!learnUnit.availableTargetLanguages.isEqualTo(
            slots.availableTargetLanguages)) {
      learnUnit.availableTargetLanguages = slots.availableTargetLanguages;
      updatedProperties.push("availableTargetLanguages");
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
  try {
    vt.m.LearningUnit.instances["1"] = new vt.m.LearningUnit({learnUnitNo: 1,
      title:"At the Grocery Store", levelOfDifficulty: vt.m.LevelOfDifficultyEL.BASIC,
      availableTargetLanguages: [vt.m.LanguageEL.FR, vt.m.LanguageEL.ES]
    });
    vt.m.LearningUnit.instances["2"] = new vt.m.LearningUnit({learnUnitNo: 2,
      title:"At the Bakery", levelOfDifficulty: vt.m.LevelOfDifficultyEL.BASIC,
      availableTargetLanguages: [vt.m.LanguageEL.FR, vt.m.LanguageEL.ES, vt.m.LanguageEL.DE]
    });
    vt.m.LearningUnit.instances["3"] = new vt.m.LearningUnit({learnUnitNo: 3,
      title:"Months, Days and Times of the Day",
      levelOfDifficulty: vt.m.LevelOfDifficultyEL.INTERMEDIATE,
      availableTargetLanguages: [vt.m.LanguageEL.ES]
    });
    vt.m.LearningUnit.saveAll();
  } catch (e) {
    console.log( e.constructor.name + ": " + e.message);
  }
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
