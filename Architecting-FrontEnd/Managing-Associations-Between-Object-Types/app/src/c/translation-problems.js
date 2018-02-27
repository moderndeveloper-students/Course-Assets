/**
 * @fileOverview  Contains various controller functions for managing translation problems
 * @author Gerd Wagner
 */
vt.c.translationProblems.manage = {
  initialize: function () {
    vt.m.Person.retrieveAll();
    vt.m.TranslationProblem.retrieveAll();
    vt.m.LearningUnit.retrieveAll();
    vt.v.translationProblems.manage.setupUserInterface();
  }
};