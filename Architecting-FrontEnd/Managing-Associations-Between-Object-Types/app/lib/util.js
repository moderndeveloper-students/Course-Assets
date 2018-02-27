/**
 * @fileOverview  Defines utility procedures/functions   
 * @author Gerd Wagner
 */
var util = {
  /**
   * Serialize a Date object as an ISO date string 
   * @return  YYYY-MM-DD
   */
  createIsoDateString: function (d) {
    return d.toISOString().substring(0,10);
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
  // *************** D O M - Related ****************************************
  /**
   * Create a Push Button
   * @param {string} txt [optional]
   * @return {object}
   */
  createPushButton: function( txt) {
    var pB = document.createElement("button");
    pB.type = "button";
    if (txt) pB.textContent = txt;
    return pB;
  },
  /**
   * Create a DOM option element
   * 
   * @param {string} val
   * @param {string} txt 
   * @param {string} classValues [optional]
   * 
   * @return {object}
   */
  createOption: function( val, txt, classValues) {
    var el = document.createElement("option");
    el.value = val;
    el.text = txt;
    if (classValues) el.className = classValues;
    return el;
  },
  /**
   * Create a time element from a Date object
   *
   * @param {object} d
   * @return {object}
   */
  createTimeElem: function (d) {
    var tEl = document.createElement("time");
    tEl.textContent = d.toLocaleDateString();
    tEl.datetime = d.toISOString();
    return tEl;
  },
  /**
   * Create a list element from an map of objects
   *
   * @param {object} et  An entity table
   * @param {string} displayProp  The object property to be displayed in the list
   * @return {object}
   */
  createListFromMap: function (et, displayProp) {
    var listEl = document.createElement("ul");
    util.fillListFromMap( listEl, et, displayProp);
    return listEl;
  },
  /**
   * Fill a list element with items from an entity table
   *
   * @param {object} listEl  A list element
   * @param {object} et  An entity table
   * @param {string} displayProp  The object property to be displayed in the list
   */
  fillListFromMap: function (listEl, et, displayProp) {
    var keys=[], listItemEl=null;
    // delete old contents
    listEl.innerHTML = "";
    // create list items from object property values
    keys = Object.keys( et);
    for (var j=0; j < keys.length; j++) {
      listItemEl = document.createElement("li");
      listItemEl.textContent = et[keys[j]][displayProp];
      listEl.appendChild( listItemEl);
    }
  },
  /**
   * Fill a select element with option elements created from a
   * map of objects 
   *
   * @param {object} selectEl  A select(ion list) element
   * @param {object} selectionRange  A map of objects
   * @param {string} keyProp  The standard identifier property
   * @param {object} optPar [optional]  A record of optional parameter slots
   *                 including optPar.displayProp and optPar.selection
   */
  fillSelectWithOptions: function (selectEl, selectionRange, keyProp, optPar) {
    var optionEl = null, keys=[], obj=null, displayProp="", i=0;
    // delete old contents
    selectEl.innerHTML = "";
    if (!selectEl.multiple && optPar && optPar.noSelOption) {
      // create "no selection" entry
      selectEl.add( util.createOption(""," --- "));
    }
    // create option elements from object property values
    keys = Object.keys( selectionRange);
    for (i=0; i < keys.length; i++) {
      obj = selectionRange[keys[i]];
      if (optPar && optPar.displayProp) displayProp = optPar.displayProp;
      else displayProp = keyProp;
      optionEl = util.createOption( obj[keyProp], obj[displayProp]);
      // if invoked with a selection argument, flag the selected options
      if (selectEl.multiple && optPar && optPar.selection && 
          optPar.selection[keyProp]) {
        // flag the option element with this value as selected
        optionEl.selected = true;
      }
      selectEl.add( optionEl);
    }
  },
  // *************** Multiple Choice Widget ****************************************
  /**
   * Create the contents of an Multiple Choice widget, which is a div containing 
   * 1) a choice list (a list of chosen items), where each item has a delete button,
   * 2) a div containing a select element and an add button allowing to add a selected item 
   *    to the association list    
   *
   * @param {object} widgetContainerEl  The widget's container div   
   * @param {object} selectionRange  An map of objects, which is used to 
   *                 create the options of the select element
   * @param {object} selection  An map of objects, which is used to
   *                 fill the selection list 
   * @param {string} keyProp  The standard identifier property of the range object type
   * @param {string} optPar [optional]  An optional record of optional parameter slots,
   *                 including "displayProp" 
   */
  createMultipleChoiceWidget: function (widgetContainerEl, selection, selectionRange, 
      keyProp, displayProp, minCard) {
    var assocListEl = document.createElement("ul"),  // shows associated objects
        selectEl = document.createElement("select"),
        el=null;
    if (minCard === undefined) minCard = 0;  // default
    // delete old contents
    widgetContainerEl.innerHTML = "";
    // create association list items from property values of associated objects
    if (!displayProp) displayProp = keyProp;
    util.fillChoiceSet( assocListEl, selection, keyProp, displayProp);
    // event handler for removing an associated item from the association list
    assocListEl.addEventListener( 'click', function (e) {
      var listItemEl=null, listEl=null;
      if (e.target.tagName === "BUTTON") {  // delete/undo button
        listItemEl = e.target.parentNode;
        listEl = listItemEl.parentNode;
        if (listEl.children.length <= minCard) {
          alert("A book must have at least one author!");
          return;
        }
        if (listItemEl.classList.contains("removed")) {
          // undoing a previous removal
          listItemEl.classList.remove("removed");
          // change button text
          e.target.textContent = "✕";
        } else if (listItemEl.classList.contains("added")) {
          // removing an added item means moving it back to the selection range 
          listItemEl.parentNode.removeChild( listItemEl);
          optionEl = util.createOption( listItemEl.getAttribute("data-value"), 
              listItemEl.firstElementChild.textContent);
          selectEl.add( optionEl);          
        } else { 
          // removing an ordinary item
          listItemEl.classList.add("removed");
          // change button text
          e.target.textContent = "undo";          
        }
      }
    });
    widgetContainerEl.appendChild( assocListEl);
    el = document.createElement("div");
    el.appendChild( selectEl);
    el.appendChild( util.createPushButton("add"));
    // event handler for adding an item from the selection list to the association list
    selectEl.parentNode.addEventListener( 'click', function (e) {
      var assocListEl = e.currentTarget.parentNode.firstElementChild,
          selectEl = e.currentTarget.firstElementChild;
      if (e.target.tagName === "BUTTON") {  // add button
        if (selectEl.value) {
          util.addItemToChoiceSet( assocListEl, selectEl.value, 
              selectEl.options[selectEl.selectedIndex].textContent, "added");
          selectEl.remove( selectEl.selectedIndex);
          selectEl.selectedIndex = 0;
        }
      }
    });
    widgetContainerEl.appendChild( el);
    // create select options from selectionRange minus selection
    util.fillMultipleChoiceWidgetWithOptions( selectEl, selectionRange, keyProp,
        {"displayProp": displayProp, "selection": selection});
  },
  /**
   * Fill the select element of an Multiple Choice Widget with option elements created 
   * from the selectionRange minus an optional selection set specified in optPar
   *
   * @param {object} aa  An map of objects
   * @param {object} selList  A select(ion list) element
   * @param {string} keyProp  The standard identifier property
   * @param {object} optPar [optional]  An record of optional parameter slots
   *                 including optPar.displayProp and optPar.selection
   */
  fillMultipleChoiceWidgetWithOptions: function (selectEl, selectionRange, keyProp, optPar) {
    var keys=[], obj=null, displayProp="", i=0;
    // delete old contents
    selectEl.innerHTML = "";
    // create "no selection yet" entry 
    selectEl.add( util.createOption(""," --- "));
    // create option elements from object property values
    keys = Object.keys( selectionRange);
    for (i=0; i < keys.length; i++) {
      // if invoked with a selection argument, only add options for objects
      // that are not yet selected
      if (!optPar || !optPar.selection || !optPar.selection[keys[i]]) {
        obj = selectionRange[keys[i]];
        if (optPar && optPar.displayProp) displayProp = optPar.displayProp;
        else displayProp = keyProp;
        selectEl.add( util.createOption( obj[keyProp], obj[displayProp]));
      }
    }
  },
  /**
   * Fill a Choice Set element with items
   *
   * @param {object} listEl  A list element
   * @param {object} selection  An entity table for filling the Choice Set
   * @param {string} keyProp  The standard ID property of the entity table
   * @param {string} displayProp  A text property of the entity table
   */
  fillChoiceSet: function (listEl, selection, keyProp, displayProp) {
    var keys=[], obj=null;
    // delete old contents
    listEl.innerHTML = "";
    // create list items from object property values
    keys = Object.keys( selection);
    for (var j=0; j < keys.length; j++) {
      obj = selection[keys[j]];
      util.addItemToChoiceSet( listEl, obj[keyProp], obj[displayProp]);
    }
  },
  /**
   * Add an item to a Choice Set element
   *
   * @param {object} listEl  A list element
   * @param {string} stdId  A standard identifier of an object
   * @param {string} humanReadableId  A human-readable ID of the object
   */
  addItemToChoiceSet: function (listEl, stdId, humanReadableId, classValue) {
    var listItemEl=null, el=null;
    listItemEl = document.createElement("li");
    listItemEl.setAttribute("data-value", stdId);
    el = document.createElement("span");
    el.textContent = humanReadableId;
    listItemEl.appendChild( el);
    el = util.createPushButton("✕");
    listItemEl.appendChild( el);
    if (classValue) listItemEl.classList.add( classValue);
    listEl.appendChild( listItemEl);
  },
};
/**
 * Create a "clone" of an object that is an instance of a model class
 *
 * @param {object} obj
 */
util.cloneObject = function (obj) {
  var p="", val,
      clone = Object.create( Object.getPrototypeOf(obj));
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      val = obj[p];
      if (typeof val === "number" ||
          typeof val === "string" ||
          typeof val === "boolean" ||
          val instanceof Date ||
          // typed object reference
          typeof val === "object" && !!val.constructor ||
          Array.isArray( val) &&  // list of data values
            !val.some( function (el) {
              return typeof el === "object";
            }) ||
          Array.isArray( val) &&  // list of typed object references
            val.every( function (el) {
              return (typeof el === "object" && !!el.constructor);
            })
      ) {
        if (Array.isArray( val)) clone[p] = val.slice(0);
        else clone[p] = val;
      }
      // else clone[p] = cloneObject(val);
    }
  }
  return clone;
};
