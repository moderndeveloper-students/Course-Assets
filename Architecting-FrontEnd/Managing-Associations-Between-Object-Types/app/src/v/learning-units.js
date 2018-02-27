/**
 * @fileOverview  Contains various view functions for managing books
 * @author Gerd Wagner
 */
vt.v.learningUnits.manage = {
  /**
   * Set up the book data management UI
   */
  setupUserInterface: function () {
    window.addEventListener("beforeunload", vt.v.learningUnits.manage.exit);
    vt.v.learningUnits.manage.refreshUI();
  },
  /**
   * exit the Manage Books UI page
   */
  exit: function () {
    vt.m.LearningUnit.saveAll();
  },
  /**
   * refresh the Manage Books UI
   */
  refreshUI: function () {
    // show the manage book UI and hide the other UIs
    document.getElementById("LearningUnit-M").style.display = "block";
    document.getElementById("LearningUnit-R").style.display = "none";
    document.getElementById("LearningUnit-C").style.display = "none";
    document.getElementById("LearningUnit-U").style.display = "none";
    document.getElementById("LearningUnit-D").style.display = "none";
  }
};
/**********************************************
 * Use case Retrieve/List All Books
**********************************************/
vt.v.learningUnits.retrieveAndListAll = {
  setupUserInterface: function () {
    var tableBodyEl = document.querySelector(
	                  "section#LearningUnit-R>table>tbody");
    var i=0, row=null, lu=null, problemsString="",
	    keys = Object.keys( vt.m.LearningUnit.instances);
    tableBodyEl.innerHTML = "";  // drop old contents
    for (i=0; i < keys.length; i++) {
      lu = vt.m.LearningUnit.instances[keys[i]];
      row = tableBodyEl.insertRow(-1);
      row.insertCell(-1).textContent = lu.learnUnitNo;
      row.insertCell(-1).textContent = lu.title;
      row.insertCell(-1).textContent = lu.author.name;
      problemsString = lu.problems.reduce( function (serialization, probl, i) {
        return i>0 ? serialization + "<br/>" + probl.toString() : probl.toString();
      }, "");
      row.insertCell(-1).innerHTML = problemsString;
    }
    document.getElementById("LearningUnit-M").style.display = "none";
    document.getElementById("LearningUnit-R").style.display = "block";
  }
};
/**********************************************
 * Use case Create LearningUnit
**********************************************/
vt.v.learningUnits.create = {
  /**
   * initialize the learningUnits.create form
   */
  setupUserInterface: function () {
    var formEl = document.querySelector("section#LearningUnit-C > form"),
        selectAuthorEl = formEl.selectAuthor,
        selectProblemsEl = formEl.selectProblems,
        saveButton = formEl.commit;
    // add event listeners for responsive validation 
    formEl.learnUnitNo.addEventListener("input", function () {
      formEl.learnUnitNo.setCustomValidity( 
          vt.m.LearningUnit.checkIsbnAsId( formEl.learnUnitNo.value).message);
    });

    /*SIMPLIFIED CODE: no responsive validation of title */

    // set up the single-choice widget for selecting an author
    util.fillSelectWithOptions( selectAuthorEl, vt.m.Person.instances,
	    "personId", {displayProp:"name"});
    // set up the multiple-choice widget for selecting problems
    util.fillSelectWithOptions( selectProblemsEl,
        vt.m.TranslationProblem.instances, "source");
    // define event handler for saveButton click events    
    saveButton.addEventListener("click", 
	    this.handleSaveButtonClickEvent);
    // define event handler for neutralizing the submit event
    formEl.addEventListener( 'submit', function (e) { 
      e.preventDefault();
      formEl.reset();
    });
    // replace the manage form with the create form
    document.getElementById("LearningUnit-M").style.display = "none";
    document.getElementById("LearningUnit-C").style.display = "block";
    formEl.reset();
  },
  handleSaveButtonClickEvent: function () {
    var i=0, 
	      formEl = document.querySelector("section#LearningUnit-C>form"),
        selProblOptions = formEl.selectProblems.selectedOptions;
    var slots = {
        learnUnitNo: formEl.learnUnitNo.value, 
        title: formEl.title.value,
        author_id: formEl.selectAuthor.value,
        problemIdRefs: []  // list of problem ID references
    };
    // validate all form controls and show error messages 
    formEl.learnUnitNo.setCustomValidity( 
	    vt.m.LearningUnit.checkLearnUnitNoAsId( slots.learnUnitNo).message);
    /*SIMPLIFIED CODE: no before-submit validation of title */
    // save the input data only if all form fields are valid
    if (formEl.checkValidity()) {
      // construct a list of problem ID references
      for (i=0; i < selProblOptions.length; i++) {
        slots.problemIdRefs.push( selProblOptions[i].value);
      }
      vt.m.LearningUnit.add( slots);
    }
  }
};
/**********************************************
 * Use case Update LearningUnit
**********************************************/
vt.v.learningUnits.update = {
  /**
   * Initialize the update learningUnits UI/form. Notice that the Association List
   * Widget for associated translationProblems is left empty initially.
   * It is only set up on book selection
   */
  setupUserInterface: function () {
    var formEl = document.querySelector("section#LearningUnit-U > form"),
        selectLearningUnitEl = formEl.selectLearningUnit,
        selectAuthorEl = formEl.selectAuthor,
        saveButton = formEl.commit;
    // set up the LearningUnit selection list
    util.fillSelectWithOptions( selectLearningUnitEl, vt.m.LearningUnit.instances, 
        "learnUnitNo", {displayProp:"title", noSelOption: true});
    selectLearningUnitEl.addEventListener("change",
        this.handleLearnUnitSelectChangeEvent);

    /*SIMPLIFIED CODE: no responsive validation of title */

    // define event handler for saveButton click events
    saveButton.addEventListener("click", this.handleSaveButtonClickEvent);
    // define event handler for neutralizing the submit event and reseting the form
    formEl.addEventListener( 'submit', function (e) {
      var problemsSelWidget = document.querySelector(
          "section#LearningUnit-U > form .MultiChoiceWidget");
      e.preventDefault();
      problemsSelWidget.innerHTML = "";
      formEl.reset();
    });
    document.getElementById("LearningUnit-M").style.display = "none";
    document.getElementById("LearningUnit-U").style.display = "block";
    formEl.reset();
  },
  /**
   * handle book selection events: when a book is selected, 
   * populate the form with the data of the selected book
   */
  handleLearnUnitSelectChangeEvent: function () {
    var formEl = document.querySelector("section#LearningUnit-U > form"),
        saveButton = formEl.commit,
        problemsSelWidget = formEl.querySelector(".MultiChoiceWidget"),
        key = formEl.selectLearningUnit.value,
        lu=null;
    if (key !== "") {
      lu = vt.m.LearningUnit.instances[key];
      formEl.learnUnitNo.value = lu.learnUnitNo;
      formEl.title.value = lu.title;
      // set up the single-choice widget for selecting an author
      util.fillSelectWithOptions( formEl.selectAuthor, vt.m.Person.instances,
          "personId", {displayProp:"name"});
      formEl.selectAuthor.value = lu.author.personId;
      // set up the associated translationProblems selection widget
      util.createMultipleChoiceWidget( problemsSelWidget, lu.problems,
          vt.m.TranslationProblem.instances, "source");
      saveButton.disabled = false;
    } else {
      formEl.reset();
      formEl.selectAuthor.innerHTML = "";
      problemsSelWidget.innerHTML = "";
      saveButton.disabled = true;
    }
  },
  /**
   * handle form submission events
   */
  handleSaveButtonClickEvent: function () {
    var listItemEl=null, i=0,
        problemIdRefsToRemove=[], problemIdRefsToAdd=[],
        formEl = document.querySelector("section#LearningUnit-U > form"),
        problemsSelWidget = formEl.querySelector(".MultiChoiceWidget"),
        assocProblemsListEl = problemsSelWidget.firstElementChild;
    var slots = { learnUnitNo: formEl.learnUnitNo.value, 
        title: formEl.title.value,
        author_id: formEl.selectAuthor.value,
        problemIdRefs: []  // list of problem ID references
        };
    /*SIMPLIFIED CODE: no before-submit validation of title */
    // save the input data only if all form fields are valid
    if (formEl.checkValidity()) {
      // construct authorsIdRef-ToAdd/ToRemove lists from the association list
      for (i=0; i < assocProblemsListEl.children.length; i++) {
        listItemEl = assocProblemsListEl.children[i];
        if (listItemEl.classList.contains("removed")) {
          problemIdRefsToRemove.push( listItemEl.getAttribute("data-value"));
        }
        if (listItemEl.classList.contains("added")) {
          problemIdRefsToAdd.push( listItemEl.getAttribute("data-value"));
        }
      } 
      // if the add/remove list is non-empty create a corresponding slot
      if (problemIdRefsToRemove.length > 0) {
        slots.problemIdRefsToRemove = problemIdRefsToRemove;
      }
      if (problemIdRefsToAdd.length > 0) {
        slots.problemIdRefsToAdd = problemIdRefsToAdd;
      }
      vt.m.LearningUnit.update( slots);
    }
  }
};
/**********************************************
 * Use case Delete LearningUnit
**********************************************/
vt.v.learningUnits.destroy = {
  /**
   * initialize the learningUnits.destroy form
   */
  setupUserInterface: function () {
    var formEl = document.querySelector("section#LearningUnit-D > form");
    var selectLearningUnitEl = formEl.selectLearningUnit;
    var deleteButton = formEl.commit;
    // set up the learning unit selection list
    util.fillSelectWithOptions( selectLearningUnitEl, vt.m.LearningUnit.instances,
        "learnUnitNo", {displayProp:"title", noSelOption: true});
    deleteButton.addEventListener("click", function () {
        var formEl = document.querySelector("section#LearningUnit-D > form");
        vt.m.LearningUnit.destroy( formEl.selectLearningUnit.value);
        // remove deleted learning unit from select options
        formEl.selectLearningUnit.remove( formEl.selectLearningUnit.selectedIndex);
    });
    // define event handler for neutralizing the submit event
    formEl.addEventListener( 'submit', function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("LearningUnit-M").style.display = "none";
    document.getElementById("LearningUnit-D").style.display = "block";
    formEl.reset();
  }
};