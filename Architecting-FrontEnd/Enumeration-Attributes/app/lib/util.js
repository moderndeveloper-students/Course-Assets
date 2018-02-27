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
   * Creates a "clone" of an object that is an instance of a model class
   *
   * @param {object} obj
   */
  cloneObject: function (obj) {
    var p="", val, 
        clone = Object.create( Object.getPrototypeOf(obj));
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        val = obj[p];
        if (typeof val === "number" ||
            typeof val === "string" ||
            typeof val === "boolean" ||
            val instanceof Date ||
            // list of data values
            Array.isArray( val) &&
              !val.some( function (el) {
                return typeof el === "object";
              })
            ) {
          if (Array.isArray( val)) clone[p] = val.slice(0);
          else clone[p] = val;
        }
        // else clone[p] = cloneObject(val);
      }
    }
    return clone;
  },
  /**
   * Create an option element
   *
   * @param {object} slots
   * @return {object}
   */
  createOption: function (slots) {
    var el = document.createElement("option");
    if (slots.text) el.textContent = slots.text;
    if (slots.value) el.value = slots.value;
    return el;
  },
  /**
   * Create option elements from an entity table (map of objects/records)
   * and insert them into a selection list element
   *
   * @param {object} entities  A map of entity objects/records
   * @param {object} selEl  A select(ion list) element
   * @param {string} keyProp  The standard identifier property
   * @param {string} displayProp [optional]  A property supplying the text 
   *                 to be displayed for each object
   */
  fillSelectWithOptionsFromEntityTable: function (selEl, entities, keyProp, displayProp) {
    var obj=null, i=0, txt="";
    var keys = Object.keys( entities);
    selEl.innerHTML = "";  // delete old content
    // create "no selection yet" entry
    selEl.add( util.createOption({text:" --- ", value:"-"}));
    // loop for creating and inserting individual option elements
    for (i=0; i < keys.length; i++) {
      obj = entities[keys[i]];
      txt = displayProp ? obj[displayProp] : obj[keyProp];
      selEl.add( util.createOption({text: txt, value: obj[keyProp]}));
    }
  },
  /**
   * Create option elements from a label list, which is an array of strings,
   * and insert them into a selection list element
   *
   * @param {object} selEl  A select(ion list) element
   * @param {object} labels  An array list of enum labels
   * @param {boolean} isForOptionalAttribute  A flag for optional enum attributes
   */
  fillSelectWithOptionsFromEnumLabels: function (selEl, labels, isForOptionalAttribute) {
    // delete old content
    selEl.innerHTML = "";
    // create "no selection yet" entry in the case of an optional enum attribute
    if (isForOptionalAttribute) selEl.add( util.createOption({text:" --- ", value:"-"}));
    // loop for creating and inserting individual option elements
    labels.forEach( function (txt,i) {
      selEl.add( util.createOption({text: txt, value: i+1}));
    });
  },
  /**
   * Create option elements from a label list, which is an array of strings,
   * and insert them into a selection list element
   *
   * @param {object} selEl  A select(ion list) element
   * @param {object} labels  An array of option text items
   * @param {object?} selectedIndexes  An array of positive integers
   */
  fillMultiSelectWithOptionsFromEnumLabels: function (selEl, labels, selectedIndexes) {
    // delete old content
    selEl.innerHTML = "";
    // loop for creating and inserting individual option elements
    labels.forEach( function (lbl,i) {
      var optionEl = util.createOption({text: lbl, value: i+1});
      if (selectedIndexes && selectedIndexes.includes(i+1)) {
        // flag the option element with this value as selected
        optionEl.selected = true;
      }
      selEl.add( optionEl);
    });
  },
  /**
   * Create a choice control (radio button or checkbox) element
   *
   * @param {string} t  The type of choice control ("radio" or "checkbox")
   * @param {string} n  The name of the choice control input element
   * @param {string} v  The value of the choice control input element
   * @param {string} lbl  The label text of the choice control
   * @return {object}
   */
  createLabeledChoiceControl: function (t,n,v,lbl) {
    var ccEl = document.createElement("input"),
        lblEl = document.createElement("label");
    ccEl.type = t;
    ccEl.name = n;
    ccEl.value = v;
    lblEl.appendChild( ccEl);
    lblEl.appendChild( document.createTextNode( lbl));
    return lblEl;
  },
  /**
   * Create a choice widget in a given fieldset element.
   * A choice element is either an HTML radio button or an HTML checkbox.
   * @method
   */
  createChoiceWidget: function (containerEl, fld, values,
                                choiceWidgetType, choiceItems) {
    var j=0, el=null,
        choiceControls = containerEl.querySelectorAll("label");
    // remove old content
    for (j=0; j < choiceControls.length; j++) {
      containerEl.removeChild( choiceControls[j]);
    }
    if (!containerEl.hasAttribute("data-bind")) {
      containerEl.setAttribute("data-bind", fld);
    }
    if (values.length >= 1) {
      if (choiceWidgetType === "radio") {
        containerEl.setAttribute("data-value", values[0]);
      } else {  // checkboxes
        containerEl.setAttribute("data-value", "["+ values.join() +"]");
      }
    }
    for (j=0; j < choiceItems.length; j++) {
      // button values = 1..n
      el = util.createLabeledChoiceControl( choiceWidgetType, fld,
          j+1, choiceItems[j]);
      // check the radio button or checkbox
      if (values.includes(j+1)) el.firstElementChild.checked = true;
      containerEl.appendChild( el);
      el.firstElementChild.addEventListener("click", function (e) {
        var btnEl = e.target, i=0, values=[];
        if (choiceWidgetType === "radio") {
          if (containerEl.getAttribute("data-value") !== btnEl.value) {
            containerEl.setAttribute("data-value", btnEl.value);
          } else {
            // turn off radio button
            btnEl.checked = false;
            containerEl.setAttribute("data-value", "");
          }
        } else {  // checkbox
          values = JSON.parse( containerEl.getAttribute("data-value")) || [];
          i = values.indexOf( parseInt( btnEl.value));
          if (i > -1) {
            values.splice(i, 1);  // delete from value list
          } else {  // add to value list
            values.push( btnEl.value);
          }
          containerEl.setAttribute("data-value", "["+ values.join() +"]");
        }
      });
    }
    return containerEl;
  }
};
