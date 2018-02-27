/**
 * @fileOverview  Contains various controller functions for managing books
 * @author Gerd Wagner
 */
vt.c.learningUnits.manage = {
  initialize: function () {
    vt.m.Person.retrieveAll();
    vt.m.TranslationProblem.retrieveAll();
    vt.m.LearningUnit.retrieveAll();
    vt.v.learningUnits.manage.setupUserInterface();
  }
};