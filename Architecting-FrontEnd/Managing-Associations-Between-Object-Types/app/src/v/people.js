/**
 * @fileOverview  Contains various view functions for managing publishers
 * @author Gerd Wagner
 */
vt.v.people.manage = {
  /**
   * Set up the publisher management UI
   */
  setupUserInterface: function () {
    window.addEventListener("beforeunload", vt.v.people.manage.exit);
    vt.v.people.manage.refreshUI();
  },
  /**
   * Exit the Manage Publishers UI page
   */
  exit: function () {
    vt.m.Person.saveAll();
    // also save learningUnits because learningUnits may be updated/deleted when a publisher is deleted
    vt.m.LearningUnit.saveAll();
  },
  /**
   * Refresh the Manage Publishers UI
   */
  refreshUI: function () {
    // show the manage book UI and hide the other UIs
    document.getElementById("Person-M").style.display = "block";
    document.getElementById("Person-R").style.display = "none";
    document.getElementById("Person-C").style.display = "none";
    document.getElementById("Person-U").style.display = "none";
    document.getElementById("Person-D").style.display = "none";
  }
};
/**********************************************
 * Use case List Publishers
**********************************************/
vt.v.people.retrieveAndListAll = {
  setupUserInterface: function () {
    var tableBodyEl = document.querySelector("section#Person-R>table>tbody");
    var i=0, row=null, person=null, pKeys = Object.keys( vt.m.Person.instances);
    tableBodyEl.innerHTML = "";
    for (i=0; i < pKeys.length; i++) {
      person = vt.m.Person.instances[pKeys[i]];
      row = tableBodyEl.insertRow(-1);
      row.insertCell(-1).textContent = person.personId;
      row.insertCell(-1).textContent = person.name;
    }
    document.getElementById("Person-M").style.display = "none";
    document.getElementById("Person-R").style.display = "block";
  }
};
/**********************************************
 * Use case Create Person
**********************************************/
vt.v.people.create = {
  /**
   * initialize the people.create form
   */
  setupUserInterface: function () {
    var formEl = document.querySelector("section#Person-C > form"),
        saveButton = formEl.commit;
    formEl.personId.addEventListener("input", function () {
      formEl.personId.setCustomValidity(
          vt.m.Person.checkPersonIdAsId( formEl.personId.value).message);
    });
    /*SIMPLIFIED CODE: no responsive validation of name*/
    saveButton.addEventListener("click", function (e) {
      var slots = {
          personId: formEl.personId.value,
          name: formEl.name.value
      };
      // check all input fields and show constraint violation messages
      formEl.personId.setCustomValidity( vt.m.Person.checkPersonIdAsId(
          slots.personId).message);
      /*SIMPLIFIED CODE: no before-submit validation of name */
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) vt.m.Person.add( slots);
    });
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("Person-M").style.display = "none";
    document.getElementById("Person-C").style.display = "block";
    formEl.reset();
  }
};
/**********************************************
 * Use case Update Person
**********************************************/
vt.v.people.update = {
  /**
   * initialize the update learningUnits UI/form
   */
  setupUserInterface: function () {
    var formEl = document.querySelector("section#Person-U > form"),
        saveButton = formEl.commit,
        selectPersonEl = formEl.selectPerson;
    // set up the person selection list
    util.fillSelectWithOptions( selectPersonEl, vt.m.Person.instances,
        "personId", {displayProp:"name"});
    selectPersonEl.addEventListener("change",
        vt.v.people.update.handlePersonSelectChangeEvent);
    // validate constraints on new user input
    /*SIMPLIFIED CODE: no responsive validation of name*/
    // when the update button is clicked and no constraint is violated, 
    // update the publisher record
    saveButton.addEventListener("click", function (e) {
      var slots = {
        personId: formEl.personId.value,
        name: formEl.name.value
      };
      // create error messages in case of constraint violations
      /*MISSING CODE: invoke Person.checkAddress on the address form field*/
      // save the input data only if all of the form fields are valid
      if (formEl.checkValidity()) {
        vt.m.Person.update( slots);
        // update the selection list's option element
        selectPersonEl.options[selectPersonEl.selectedIndex].text = slots.name;
      }
    });
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("Person-M").style.display = "none";
    document.getElementById("Person-U").style.display = "block";
    formEl.reset();
  },
  /**
   * handle publisher selection events
   * when a publisher is selected, populate the form with the data of the selected publisher
   */
  handlePersonSelectChangeEvent: function () {
    var formEl = document.querySelector("section#Person-U > form");
    var key="", pers=null;
    key = formEl.selectPerson.value;
    if (key !== "") {
      pers = vt.m.Person.instances[key];
      formEl.personId.value = pers.personId;
      formEl.name.value = pers.name;
    } else {
      formEl.reset();
    }
  }
};
/**********************************************
 * Use case Delete Person
**********************************************/
vt.v.people.destroy = {
  /**
   * initialize the people.update form
   */
  setupUserInterface: function () {
    var formEl = document.querySelector("section#Person-D > form"),
        deleteButton = formEl.commit;;
    var personSelectEl = formEl.selectPerson;
    // set up the publisher selection list
    util.fillSelectWithOptions( personSelectEl, vt.m.Person.instances,
        "personId", {displayProp:"name"});
    deleteButton.addEventListener("click", function () {
        var formEl = document.querySelector("section#Person-D > form"),
            person_id = formEl.selectPerson.value;
        if (!person_id) return;
        if (confirm("Do you really want to delete the person "+ person_id +"?")) {
          vt.m.Person.destroy( person_id);
          formEl.selectPerson.remove( formEl.selectPerson.selectedIndex);
        }
    });
    // neutralize the submit event
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      formEl.reset();
    });
    document.getElementById("Person-M").style.display = "none";
    document.getElementById("Person-D").style.display = "block";
  }
};