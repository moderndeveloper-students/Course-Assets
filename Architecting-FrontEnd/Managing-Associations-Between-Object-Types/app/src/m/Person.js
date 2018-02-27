/**
 * @fileOverview  The model class Person with property definitions, (class-level) check methods,
 *                setter methods, and the special methods saveAll and retrieveAll
 * @person Gerd Wagner
 */

// ***********************************************
// *** Constructor with property definitions *****
// ***********************************************
vt.m.Person = class {
  constructor (slots) {
    // set the default values for the parameter-free default constructor
    this._personId = 0;        // number (integer)
    this._name = "";           // string
    // is constructor invoked with a non-empty slots argument?
    if (typeof slots === "object" && Object.keys( slots).length > 0) {
      // assign properties by invoking implicit setters
      this.personId = slots.personId;
      this.name = slots.name;
    }
  }
  get personId() {
    return this._personId;
  }
  static checkPersonId( id) {
    if (id === undefined) {
      return new NoConstraintViolation();  // may be optional as an IdRef
    } else {
      // convert to integer
      id = parseInt( id);
      if (isNaN( id) || !Number.isInteger( id) || id < 1) {
        return new RangeConstraintViolation(
            "The person ID must be a positive integer!");
      } else {
        return new NoConstraintViolation();
      }
    }
  }
  static checkPersonIdAsId( id) {
    var constraintViolation = vt.m.Person.checkPersonId(id);
    if ((constraintViolation instanceof NoConstraintViolation)) {
      // convert to integer
      id = parseInt(id);
      if (isNaN(id)) {
        return new MandatoryValueConstraintViolation(
            "A positive integer value for the person ID is required!");
      } else if (vt.m.Person.instances[String(id)]) {  // convert to string if number
        constraintViolation = new UniquenessConstraintViolation(
            'There is already a person record with this person ID!');
      } else {
        constraintViolation = new NoConstraintViolation();
      }
    }
    return constraintViolation;
  }
  static checkPersonIdAsIdRef( id) {
    var constraintViolation = vt.m.Person.checkPersonId( id);
    if ((constraintViolation instanceof NoConstraintViolation) &&
        id !== undefined) {
      if (!vt.m.Person.instances[String(id)]) {
        constraintViolation = new ReferentialIntegrityConstraintViolation(
            'There is no person record with this person ID!');
      }
    }
    return constraintViolation;
  }
  set personId(id) {
    var constraintViolation = vt.m.Person.checkPersonIdAsId( id);
    if (constraintViolation instanceof NoConstraintViolation) {
      this._personId = parseInt( id);
    } else {
      throw constraintViolation;
    }
  }
  get name() {
    return this._name;
  }
  set name( n) {
    /*SIMPLIFIED CODE: no validation with vt.m.Person.checkName */
    this._name = n;
  }
  toString() {
    return "Person{ ID:"+ this.personId +", name:"+ this.name +"}";
  }
  /**
   *  Convert person object to row/record
   *  May include special conversion for references
   */
  toRow() {
    var row = {};
    Object.keys( this).forEach( function (p) {
      var v = this[p];
      if (p.charAt(0) === "_") p = p.substr( 1);
      row[p] = v;
    }, this);
    return row;
  }
}
// ***********************************************
// *** Class-level ("static") properties *********
// ***********************************************
vt.m.Person.instances = {};

// *****************************************************
// *** Class-level ("static") methods ***
// *****************************************************
/**
 *  Create a new Person row
 */
vt.m.Person.add = function (slots) {
  var pers = null;
  try {
    pers = new vt.m.Person( slots);
  } catch (e) {
    console.log( e.constructor.name + ": " + e.message);
    pers = null;
  }
  if (pers) {
    vt.m.Person.instances[String( pers.personId)] = pers;
    console.log("Saved: " + pers.name);
  }
};
/**
 *  Update an existing Person row
 */
vt.m.Person.update = function (slots) {
  var pers = vt.m.Person.instances[String( slots.personId)],
      noConstraintViolated = true,
      ending = "",
      updatedProperties = [],
      objectBeforeUpdate = util.cloneObject( pers);
  try {
    if (pers.name !== slots.name) {
      pers.name = slots.name;
      updatedProperties.push("name");
    }
  } catch (e) {
    console.log( e.constructor.name + ": " + e.message);
    noConstraintViolated = false;
    // restore object to its state before updating
    vt.m.Person.instances[String(slots.personId)] = objectBeforeUpdate;
  }
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      ending = updatedProperties.length > 1 ? "ies" : "y";
      console.log("Propert"+ending+" " + updatedProperties.toString() +
          " modified for person " + pers.name);
    } else {
      console.log("No property value changed for person " +
          pers.name + " !");
    }
  }
};
/**
 *  Delete an existing Person row
 */
vt.m.Person.destroy = function (id) {
  var persKey = String(id),
      pers = vt.m.Person.instances[persKey],
      key="", keys=[], lu=null, i=0;
  // delete all dependent LearningUnits
  keys = Object.keys( vt.m.LearningUnit.instances);
  for (i=0; i < keys.length; i++) {
    key = keys[i];
    lu = vt.m.LearningUnit.instances[key];
    if (lu.author.personId === id) delete vt.m.LearningUnit.instances[key];
  }
  // delete the person object
  delete vt.m.Person.instances[persKey];
  console.log("Person " + pers.name + " deleted.");
};
/**
 *  Load all publisher rows and convert them to objects
 */
vt.m.Person.retrieveAll = function () {
  var key="", keys=[], personRows={}, i=0;
  if (!localStorage["people"]) localStorage["people"] = "{}";
  try {
    personRows = JSON.parse( localStorage["people"]);
  } catch (e) {
    console.log("Error when reading from Local Storage\n" + e);
  }
  keys = Object.keys( personRows);
  console.log( keys.length +" person records loaded.");
  for (i=0; i < keys.length; i++) {
    key = keys[i];
    try {
      vt.m.Person.instances[key] = new vt.m.Person( personRows[key]);
    } catch (e) {
      console.log( e.constructor.name + " while deserializing person "+
          key +": "+ e.message);
    }
  }
};
/**
 *  Save all author objects as rows
 */
vt.m.Person.saveAll = function () {
  var key="", personRows={}, pers=null, i=0;
  var keys = Object.keys( vt.m.Person.instances);
  for (i=0; i < keys.length; i++) {
    key = keys[i];
    pers = vt.m.Person.instances[key];
    personRows[key] = pers.toRow();
  }
  try {
    localStorage["people"] = JSON.stringify( personRows);
    console.log( keys.length +" people saved.");
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
  }
};
