/**
 * @fileOverview  Contains various controller functions for managing people
 * @author Gerd Wagner
 */
vt.c.people.manage = {
  initialize: function () {
    vt.m.Person.retrieveAll();
    vt.m.TranslationProblem.retrieveAll();
    vt.m.LearningUnit.retrieveAll();
    vt.v.people.manage.setupUserInterface();
  }
};