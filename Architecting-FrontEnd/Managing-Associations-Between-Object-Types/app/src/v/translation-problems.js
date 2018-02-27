/**
 * @fileOverview  Contains various view functions for managing authors
 * @author Gerd Wagner
 */
vt.v.translationProblems.manage = {
  /** Set up the TranslationProblem management UI */
  setupUserInterface: function () {
    window.addEventListener("beforeunload", vt.v.translationProblems.manage.exit);
    vt.v.translationProblems.manage.refreshUI();
  },
  /** Exit the Manage Translation Problems UI page */
  exit: function () {
    vt.m.TranslationProblem.saveAll();
    // also save learningUnits because learningUnits may be modified when a TranslationProblem is deleted
    vt.m.LearningUnit.saveAll();
  },
  /** Refresh the Manage Translation Problems UI */
  refreshUI: function () {
    // show the manage book UI and hide the other UIs
    document.getElementById("TranslationProblem-M").style.display = "block";
    document.getElementById("TranslationProblem-R").style.display = "none";
    document.getElementById("TranslationProblem-C").style.display = "none";
    document.getElementById("TranslationProblem-U").style.display = "none";
    document.getElementById("TranslationProblem-D").style.display = "none";
  }
};
/**********************************************
 * Use case List Authors
**********************************************/
vt.v.translationProblems.retrieveAndListAll = {
  setupUserInterface: function () {
    var tableBodyEl = document.querySelector("section#TranslationProblem-R>table>tbody");
    var pKeys = Object.keys( vt.m.TranslationProblem.instances);
    var row=null, cell=null, tp=null, i=0;
    tableBodyEl.innerHTML = "";
    for (i=0; i < pKeys.length; i++) {
      tp = vt.m.TranslationProblem.instances[pKeys[i]];
      row = tableBodyEl.insertRow(-1);
      row.insertCell(-1).textContent = tp.source;
      row.insertCell(-1).textContent = tp.targets;
    }
    document.getElementById("TranslationProblem-M").style.display = "none";
    document.getElementById("TranslationProblem-R").style.display = "block";
  }
};
/**********************************************
 * Use case Create TranslationProblem
**********************************************/
vt.v.translationProblems.create = {
  /** initialize the createAuthorForm  */
  setupUserInterface: function () {
    var formEl = document.querySelector("section#TranslationProblem-C > form"),
        saveButton = formEl.commit;
    formEl.source.addEventListener("input", function () { 
      formEl.source.setCustomValidity( 
          vt.m.TranslationProblem.checkSourceAsId( formEl.source.value).message);
    });
    /*SIMPLIFIED CODE: no responsive validation of targets */
    saveButton.addEventListener("click", function (e) {
      var slots = {
          source: formEl.source.value,
          targets: formEl.targets.value
      };
      // check all input fields and show error messages
      formEl.source.setCustomValidity( 
          vt.m.TranslationProblem.checkSourceAsId( slots.source).message);
      /*SIMPLIFIED CODE: no before-submit validation of targets */
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) vt.m.TranslationProblem.add( slots);
    });
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("TranslationProblem-M").style.display = "none";
    document.getElementById("TranslationProblem-C").style.display = "block";
    formEl.reset();
  }
};
/**********************************************
 * Use case Update TranslationProblem
**********************************************/
vt.v.translationProblems.update = {
  /**
   * initialize the update learningUnits UI/form
   */
  setupUserInterface: function () {
    var formEl = document.querySelector("section#TranslationProblem-U > form"),
        saveButton = formEl.commit,
        selectTranslProblemEl = formEl.selectTranslationProblem;
    // set up the author selection list
    util.fillSelectWithOptions( selectTranslProblemEl,
        vt.m.TranslationProblem.instances, "source");
    selectTranslProblemEl.addEventListener("change",
        vt.v.translationProblems.update.handleTrPrSelectChangeEvent);
    // validate constraints on new user input
    formEl.source.addEventListener("input", function () { 
      formEl.source.setCustomValidity( 
          vt.m.TranslationProblem.checkSourceAsId( formEl.source.value).message);
    });
    /*SIMPLIFIED CODE: no responsive validation of targets */

    saveButton.addEventListener("click", function (e) {
      var slots = {
          source: formEl.source.value,
          targets: formEl.targets.value
      };
      // check all relevant input fields and show error messages
      /*SIMPLIFIED CODE: no before-submit validation of targets */
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) vt.m.TranslationProblem.update( slots);
    });
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("TranslationProblem-M").style.display = "none";
    document.getElementById("TranslationProblem-U").style.display = "block";
    formEl.reset();
  },
  /**
   * handle author selection events
   * when an author is selected, populate the form with the author data
   */
  handleTrPrSelectChangeEvent: function () {
    var formEl = document.querySelector("section#TranslationProblem-U > form");
    var tp=null, key = formEl.selectTranslationProblem.value;
    if (key !== "") {
      tp = vt.m.TranslationProblem.instances[key];
      formEl.source.value = tp.source;
      formEl.targets.value = tp.targets;
    } else {
      formEl.reset();
    }
  }
};
/**********************************************
 * Use case Delete TranslationProblem
**********************************************/
vt.v.translationProblems.destroy = {
  /**
   * initialize the deleteAuthorForm
   */
  setupUserInterface: function () {
    var formEl = document.querySelector("section#TranslationProblem-D > form"),
        deleteButton = formEl.commit,
        selectTranslProblemEl = formEl.selectTranslationProblem;
    // set up the author selection list
    util.fillSelectWithOptions( selectTranslProblemEl,
        vt.m.TranslationProblem.instances, "source");
    deleteButton.addEventListener("click", function () {
        var source = selectTranslProblemEl.value;
        if (confirm("Do you really want to delete this problem?")) {
          vt.m.TranslationProblem.destroy( source);
          selectTranslProblemEl.remove( selectTranslProblemEl.selectedIndex);
        };
    });
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("TranslationProblem-M").style.display = "none";
    document.getElementById("TranslationProblem-D").style.display = "block";
  }
};