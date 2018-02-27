/**
 * @fileOverview  App-level controller code
 * @author Gerd Wagner
 */
// main namespace and subnamespace definitions
var vt = {
    m: {},
    v: { translationProblems:{}, people:{}, learningUnits:{}},
    c: { translationProblems:{}, people:{}, learningUnits:{}}
};
vt.c.app = {
  initialize: function() {
  },
  generateTestData: function() {
    try {
      vt.m.Person.instances["1"] = new vt.m.Person({personId:1, name:"Gerd Wagner"});
      vt.m.Person.instances["2"] = new vt.m.Person({personId:2, name:"Richard Boven"});
      vt.m.Person.instances["3"] = new vt.m.Person({personId:3, name:"Aashish Nagpal"});
      vt.m.Person.saveAll();
      vt.m.TranslationProblem.instances["kitchen"] = new vt.m.TranslationProblem(
          {source:"kitchen", targets:"cocina"});
      vt.m.TranslationProblem.instances["bedroom"] = new vt.m.TranslationProblem(
          {source:"bedroom", targets:"el cuarto; el dormitorio; la recámara"});
      vt.m.TranslationProblem.instances["bathroom"] = new vt.m.TranslationProblem(
          {source:"bathroom", targets:"el cuarto de baño"});
      vt.m.TranslationProblem.instances["January"] = new vt.m.TranslationProblem(
          {source:"January", targets:"enero"});
      vt.m.TranslationProblem.instances["February"] = new vt.m.TranslationProblem(
          {source:"February", targets:"febrero"});
      vt.m.TranslationProblem.instances["March"] = new vt.m.TranslationProblem(
          {source:"March", targets:"marzo"});
      vt.m.TranslationProblem.instances["Monday"] = new vt.m.TranslationProblem(
          {source:"Monday", targets:"lunes"});
      vt.m.TranslationProblem.instances["morning"] = new vt.m.TranslationProblem(
          {source:"morning", targets:"mañana; matutino"});
      vt.m.TranslationProblem.saveAll();
      vt.m.LearningUnit.instances["1"] = new vt.m.LearningUnit({learnUnitNo: 1, title:"At Home",
        author_id: 1, problemIdRefs:["kitchen","bedroom","bathroom"]});
      vt.m.LearningUnit.instances["2"] = new vt.m.LearningUnit({learnUnitNo: 2,
        title:"Months, days and times of the day", author_id: 2,
        problemIdRefs:["January","February","March","Monday","morning"]});
      vt.m.LearningUnit.saveAll();
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message);
    }
  },
  clearData: function() {
    try {
      vt.m.Person.instances = {};
      localStorage["people"] = "{}";
      vt.m.TranslationProblem.instances = {};
      localStorage["translation_problems"] = "{}";
      vt.m.LearningUnit.instances = {};
      localStorage["learning_units"] = "{}";
      console.log("All data cleared.");
    } catch (e) {
      console.log( e.constructor.name + ": " + e.message);
    }
  }
};
