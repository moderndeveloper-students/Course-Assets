/**
 * @fileOverview  Contains definition of model class VocabularyProblem  
 * @author Gerd Wagner
 */

/**
 * @class
 */
vt.m.LearningUnit = class {
  constructor(slots) {
    // assign default values to mandatory properties
    this._learnUnitNo = 0;  // number (non-negative integer)
    this._title = "";       // string
    this._author = null;    // object (from Person)
    this._problems = [];    // list of objects (from TranslationProblem)
    // is constructor invoked with a non-empty slots argument?
    if (typeof slots === "object" && Object.keys(slots).length > 0) {
      // assign properties by invoking implicit setters
      this.learnUnitNo = slots.learnUnitNo;
      this.title = slots.title;
      // assign object reference or ID reference
      this.author = slots.author || slots.author_id;
      this.problems = slots.problems || slots.problemIdRefs;
    }
  }

  get learnUnitNo() {
    return this._learnUnitNo;
  }

  static checkLearnUnitNo(n) {
    if (!n) return new NoConstraintViolation();
    else if (!util.isIntegerOrIntegerString(n) || parseInt(n) < 1) {
      return new RangeConstraintViolation(
          "A learning unit number must be a positive integer!");
    } else {
      return new NoConstraintViolation();
    }
  }

  static checkLearnUnitNoAsId(n) {
    var validationResult = vt.m.LearningUnit.checkLearnUnitNo(n);
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

  set learnUnitNo(n) {
    var validationResult = vt.m.LearningUnit.checkLearnUnitNoAsId(n);
    if (validationResult instanceof NoConstraintViolation) {
      this._learnUnitNo = parseInt(n);
    } else {
      throw validationResult;
    }
  }

  get title() {
    return this._title;
  }

  set title(t) {
    //SIMPLIFIED CODE: no validation with checkTitle
    this._title = t;
  }

  get author() {
    return this._author;
  }

  static checkAuthor(person_id) {
    var validationResult = null;
    if (!person_id) {
      validationResult = new MandatoryValueConstraintViolation(
          "An author must be provided!");
    } else {
      // invoke foreign key constraint check
      validationResult = vt.m.Person.checkPersonIdAsIdRef(person_id);
    }
    return validationResult;
  }

  set author(p) {
    var validationResult = null;
    // p can be an ID reference or an object reference
    var pers_id = (typeof p !== "object") ? p : p.personId;
    validationResult = vt.m.LearningUnit.checkAuthor(pers_id);
    if (validationResult instanceof NoConstraintViolation) {
      // create the new author reference
      this._author = vt.m.Person.instances[pers_id];
    } else {
      throw validationResult;
    }
  }

  get problems() {
    return this._problems;
  }

  static checkProblem( problem_id) {
    var validationResult = null;
    if (!problem_id) {
      validationResult = new NoConstraintViolation();
    } else {
      // invoke foreign key constraint check
      validationResult =
          vt.m.TranslationProblem.checkSourceAsIdRef( problem_id);
    }
    return validationResult;
  }

  addProblem( p) {
    var validationResult = null,
        authorIdRefStr = "";
    // p can be an ID reference or an object reference
    var problem_id = (typeof p !== "object") ? p : p.source;
    validationResult = vt.m.LearningUnit.checkProblem(problem_id);
    if (problem_id &&
        validationResult instanceof NoConstraintViolation) {
      // add the new translation problem reference
      this._problems.push(vt.m.TranslationProblem.instances[problem_id]);
    } else {
      throw validationResult;
    }
  }

  removeProblem( p) {
    var validationResult=null, i=0;
    // p can be an ID reference or an object reference
    var source = (typeof p !== "object") ? p : p.source;
    validationResult = vt.m.LearningUnit.checkProblem( source);
    if (validationResult instanceof NoConstraintViolation) {
      // delete the problem reference from the problems list
      for (i=0; i < this._problems.length; i++) {
        if (this._problems[i].source === source) this._problems.splice(i, 1);
      }
    } else {
      throw validationResult;
    }
  }

  set problems( p) {
    var keys = [], i = 0;
    this._problems = [];
    if (!Array.isArray(p)) {
      throw new RangeConstraintViolation(
          "A list of problem references must be provided!");
    }
    for (i = 0; i < p.length; i++) {
      this.addProblem(p[i]);
    }
  }
  toString() {
    return "LearningUnit{ No: " + this.learnUnitNo +
        ", Title: " + this.title +
        ", Author: " + this.author.name +
        "}";
  }
  /**
   *  Convert object to row
   */
  toRow() {
    var row = {};
    Object.keys( this).forEach( function (p) {
      // copy only property slots with underscore prefix
      if (p.charAt(0) === "_") {
        switch (p) {
          case "_author":
            // convert object reference to ID reference
            if (this._author) row.author_id = this._author.personId;
            break;
          case "_problems":
            // convert the list of object references to ID references
            row.problemIdRefs = [];
            this._problems.forEach( function (problem) {
              row.problemIdRefs.push( problem.source);
            });
            break;
          default:
            // remove underscore prefix
            row[p.substr(1)] = this[p];
        }
      }
    }, this);
    return row;
  }
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
  var lu = vt.m.LearningUnit.instances[slots.learnUnitNo],
      noConstraintViolated = true,
      updatedProperties = [],
      objectBeforeUpdate = util.cloneObject( lu);
  try {
    if (lu.title !== slots.title) {
      lu.title = slots.title;
      updatedProperties.push("title");
    }
    if ("author_id" in slots &&
        (!lu.author || lu.author.personId !== parseInt( slots.author_id))) {
      lu.author = slots.author_id;
      updatedProperties.push("author");
    }
    if ("problemIdRefsToAdd" in slots) {
      updatedProperties.push("problems(added)");
      for (i=0; i < slots.problemIdRefsToAdd.length; i++) {
        lu.addProblem( slots.problemIdRefsToAdd[i]);
      }
    }
    if ("problemIdRefsToRemove" in slots) {
      updatedProperties.push("problems(removed)");
      for (i=0; i < slots.problemIdRefsToRemove.length; i++) {
        lu.removeProblem( slots.problemIdRefsToRemove[i]);
      }
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
      console.log("No property value changed for learning unit " +
          slots.learnUnitNo + "!");
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
/**
 * Retrieve learning units table from local storage
 * @method
 */
vt.m.LearningUnit.retrieveAll = function () {
  var key="", keys=[], learningUnitsString="", learningUnitRows={}, i=0;
  try {
    if (localStorage["learning_units"]) {
      learningUnitsString = localStorage["learning_units"];
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (learningUnitsString) {
    learningUnitRows = JSON.parse( learningUnitsString);
    keys = Object.keys( learningUnitRows);
    console.log( keys.length +" learningUnits loaded.");
    try {
      for (i=0; i < keys.length; i++) {
        key = keys[i];
        vt.m.LearningUnit.instances[key] =
            new vt.m.LearningUnit( learningUnitRows[key]);
      }
    } catch (e) {
      console.log( e.constructor.name + " while deserializing learning " +
          "unit "+ key +": "+ e.message);
    }
  }
};
/**
 * Save all learning unit objects to Local Storage
 * @method
 */
vt.m.LearningUnit.saveAll = function () {
  var key="", rows={}, obj=null, i=0;
  var keys = Object.keys( vt.m.LearningUnit.instances);
  // convert the map of objects to map of corresponding rows
  for (i=0; i < keys.length; i++) {
    key = keys[i];
    obj = vt.m.LearningUnit.instances[key];
    // serialize LearningUnit object
    rows[key] = obj.toRow();
  }
  try {
    localStorage["learning_units"] = JSON.stringify( rows);
    console.log( keys.length +" learning units saved.");
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
  }
};
