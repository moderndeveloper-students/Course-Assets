/**
 * @fileOverview  Defines utility procedures/functions   
 * @author Gerd Wagner
 */
var util = {
 /**
  * Verifies if a value represents an integer
  * @param {string} x
  * @return {boolean}
  */
  isNonEmptyString: function (x) {
    return typeof x === "string" && x.trim() !== "";
  },
  /**
   * Verifies if a value represents an integer or integer string
   * @param {string} x
   * @return {boolean}
   */
  isIntegerOrIntegerString: function (x) {
    return typeof x === "number" && x.toString().search(/^-?[0-9]+$/) == 0 ||
        typeof x === "string" && x.search(/^-?[0-9]+$/) == 0;
  },
  /**
   * Creates a typed "data clone" of an object
   * @param {object} obj
   */
  cloneObject: function (obj) {
    var clone = Object.create( Object.getPrototypeOf(obj));
    for (var p in obj) {
      if (obj.hasOwnProperty(p) && typeof obj[p] != "object") {
        clone[p] = obj[p];
      }
    }
    return clone;
  },
  /**
   * Create option elements from a map of objects
   * and insert them into a select(ion list) element
   *
   * @param {object} m  A map of objects
   * @param {object} selList  A select(ion list) element
   * @param {string} keyProp  The standard identifier property
   * @param {string} displayProp [optional]  A property supplying the text 
   *                 to be displayed for each object
   */
  fillSelectWithOptions: function (m, selList, keyProp, displayProp) {
    var optionEl=null, keys=[], obj=null, i=0;
    keys = Object.keys( m);
    for (i=0; i < keys.length; i++) {
      obj = m[keys[i]];
      obj.index = i+1;  // store selection list index
      optionEl = document.createElement("option");
      optionEl.value = obj[keyProp];
      if (displayProp) {
        // show the values of displayProp in the select list
        optionEl.text = obj[displayProp];
      }
      else {
        // show the values of keyProp in the select list
        optionEl.text = obj[keyProp];
      }
      selList.add( optionEl);
    }
  }
};
