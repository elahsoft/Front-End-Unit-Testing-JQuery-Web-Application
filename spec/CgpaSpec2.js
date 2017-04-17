var courses = require('../json/courses.json');
var illFormatedCourses = require('../json/illFormattedCourses.json');
var nonObjectCourses =require('../json/nonObjectCourses.json');
// require('../src/CGPACalculator.1.js');

var cGPACalculator = new CGPACalculator();
//Testing without Fixtures
describe('Testing that the json file is not empty', function () {
  var isEmpty = true;
  beforeEach(function () {
    if (typeof (courses) === "object"){
      if (Object.keys(courses).length > 0) {
        isEmpty = false;
      }
    }
  });
  it('json file should not be empty', function () {
    expect(Object.keys(courses).length).toBeGreaterThan(0);
  });
  it('test that the isEmpty is false', function () {
    expect(isEmpty).toBeFalsy();
  });
  it('test that the isEmptyCourses function returns same as above', function () {
    expect(cGPACalculator.isEmptyCourses(courses)).toBeFalsy();
  });
  it('test that the isObject function returns false for []', function () {
    expect(cGPACalculator.isObject(courses)).toBeTruthy();
    expect(cGPACalculator.isObject(illFormatedCourses)).toBeTruthy();
    expect(cGPACalculator.isObject(nonObjectCourses)).toBeFalsy();
  });
});

describe('Testing that the json file contains a well formatted courses object', function () {
  describe('Testing that the isWellFormattedCourses Function Works Well', function () {
    var status1 = false;
    var status2 = false;
    var keys = ['code', 'title', 'units', 'semester'];
    beforeEach(function () {
      _.each(courses, function(department, key){
      if (key === "Computer") {
        _.each(department, function(level, key){
          if (key  === "course2L") {
            _.each(level, function(courseList, key){
               if (_.isEqual(Object.keys(courseList), keys)) {
                 status1 = true;
               }
              });
          }
        });
      }
    });
    _.each(illFormatedCourses, function(department, key){
      if (key === "Computer") {
        _.each(department, function(level, key){
          if (key  === "course2L") {
            _.each(level, function(courseList, key){
               if (_.isEqual(Object.keys(courseList), keys)) {
                 status2 = true;
               }
              });
          }
        });
      }
    });
    });
    it('ill-formatted json file should not equal the above keys', function () {
      expect(status2).toBeFalsy();
    });
    it('well-formatted json file should equal the above keys', function () {
      expect(status1).toBeTruthy();
    });
    it('test that the isWellFormattedCourses function produces same result', function () {
      expect(cGPACalculator.isWellFormattedCourses(illFormatedCourses)).toBeFalsy();
      expect(cGPACalculator.isWellFormattedCourses(courses)).toBeTruthy();
    });
  });
});

describe('Testing that the points computation function works well', function () {
  var unit = 4;
  var grade = 'B';
  var gradePoint = 4;
  var point = unit * gradePoint;
  it('A gradepoint of 5 for a four unit course should give the student 20 points', function () {
    expect(point).toBe(16);
  });
  it('function computePoint should produce same result', function () {
    expect(cGPACalculator.computePoint(unit, grade)).toBe(point);
  });
  it('function evaluateGrade returns 5 for grade B', function () {
    expect(cGPACalculator.evaluateGrade(grade)).toBe(gradePoint);
  });
  it('function computePoint must have called evaluateGrade', function () {
    cGPACalculator = new CGPACalculator();
    // Before training - spies return undefined
    var spy = spyOn(cGPACalculator, "evaluateGrade");
    // cGPACalculator.evaluateGrade = jasmine.createSpy("evaluateGrade spy");
    var point = cGPACalculator.computePoint(unit, grade);
    expect(point).toBeNaN();
    expect(cGPACalculator.evaluateGrade.calls.count()).toBe(1);
     // After training - calls original function, still spies execution
    spy.and.callThrough();
    expect(cGPACalculator.computePoint(unit, grade)).toBe(16);
    expect(cGPACalculator.evaluateGrade.calls.count()).toBe(2);
    expect(cGPACalculator.evaluateGrade).toHaveBeenCalled();
  });
});

describe('Testing that the total point computation function works well', function () {
  var allPoints = [20, 12, 15, 16, 8];
  var totalPoints = 0;
  beforeEach(function () {
    for (var i = 0; i < allPoints.length; i++) {
      totalPoints = totalPoints + allPoints[i];
    }
  });
  it('Array of points like  of [20, 12, 15, 16, 8] should return 71', function () {
    expect(totalPoints).toBe(71);
  });
  it('function computeTotalPoint should produce same result', function () {
    expect(cGPACalculator.computeTotalPoint(allPoints)).toBe(71);
  });
});

describe('Testing that the cGPACalculator.startComputation function calls isWellFormattedCourses & isWellFormatted functions', function () {
  var surname = "Opara";
  var firstName = "Febechukwu";
  var middleName = "Chinonyerem";
  var registrationNumber = "2007/NDM/14392";
  var level = 2;
  var courseOfStudy = "Computer Science";
  var semester = "Rain";
  var grades = ["A", "A", "A", "B", "C", "D", "E", "F"];
  it('Testing that isWellFormatted & isWellFormattedCourses is called', function () {
    cGPACalculator = new CGPACalculator();
    spyOn(cGPACalculator, "isWellFormattedCourses");
    cGPACalculator.startComputation(surname, firstName, middleName, registrationNumber, level, courseOfStudy, semester, courses, grades);
    expect(cGPACalculator.isWellFormattedCourses).toHaveBeenCalled();
    expect(cGPACalculator.isWellFormattedCourses).toHaveBeenCalledWith(courses);
  });
});

//Testing with Html Fixtures
describe('Testing with HTML Fixtures', function () {
  var cGPACalculator = null;
  var fixture = null;
  beforeEach(function () {
    //inject the HTML Fixture for the tests
     fixture = '<script> var cGPACalculator = new CGPACalculator(); </script>'+
     '<div id="fixture">' +
      '<input id="surname" type="text">' +
      '<input id="firstName" type="text">' +
      '<input id="middleName" type="text">' +
      '<input id="registrationNumber" type="text">' +
      '<select id="level"><option value="1">100L</option>' +
      '<option value="2">200L</option>' +
      '<option value="3">300L</option>' +
      '<option value="4">400L</option>' +
      '<option value="5">500L</option></select>' +
      '<select id="courseOfStudy">' +
      '<option value="Computer">Computer Science</option>' +
      '<option value="Geology">Geology</option>' +
      '<option value="Mathematics">Mathematics</option>' +
      '<option value="Physics">Physics</option>' +
      '<option value="Mechanical Engineering">Mechanical Engineering</option></select>'+
    '<select id="semester" onchange="cGPACalculator.enableLoadCourses()">' +
      '<option value="Rain">Rain</option>' +
      '<option value="Harmattan">Harmattan</option></select>' +
      '<button id="loadCourses" onclick="cGPACalculator.showInputTable()" disabled>'+
      '<div id="table"><table><thead><th>Code</th>'+
      '<th>Title</th><th>Units</th><th>Score</th><th>Grade</th>'+
      '<th>Points</th></thead><tbody>'+
      '<tr><td><input id="code1" class="code" readonly="readonly"></td>'+
      '<td><input id="title1" class="title" readonly="readonly"></td>'+
      '<td><input id="units1" class="units" readonly="readonly"></td>'+
      '<td><input id="score1" class="score" onblur="cGPACalculator.showGrade1()"></td>'+
      '<td><input id="grade1" class="grade" readonly="readonly"></td>'+
      '<td><input id="points1" class="points" readonly="readonly"></td></tr>'+
      '<tr><td><input id="code2" class="code" readonly="readonly"></td>'+
      '<td><input id="title2" class="title" readonly="readonly"></td>'+
      '<td><input id="units2" class="units" readonly="readonly"></td>'+
      '<td><input id="score2" class="score" onblur="cGPACalculator.showGrade2()"></td>'+
      '<td><input id="grade2" class="grade" readonly="readonly"></td>'+
      '<td><input id="points2" class="points" readonly="readonly"></td></tr>'+
      '<tr><td><input id="code3" class="code" readonly="readonly"></td>'+
      '<td><input id="title3" class="title" readonly="readonly"></td>'+
      '<td><input id="units3" class="units" readonly="readonly"></td>'+
      '<td><input id="score3" class="score" onblur="cGPACalculator.showGrade3()"></td>'+
      '<td><input id="grade3" class="grade" readonly="readonly"></td>'+
      '<td><input id="points3" class="points" readonly="readonly"></td></tr>'+
      '<tr><td><input id="code4" class="code" readonly="readonly"></td>'+
      '<td><input id="title4" class="title" readonly="readonly"></td>'+
      '<td><input id="units4" class="units" readonly="readonly"></td>'+
      '<td><input id="score4" class="score" onblur="cGPACalculator.showGrade4()"></td>'+
      '<td><input id="grade4" class="grade" readonly="readonly"></td>'+
      '<td><input id="points4" class="points" readonly="readonly"></td></tr>'+
      '<tr><td><input id="code5" class="code" readonly="readonly"></td>'+
      '<td><input id="title5" class="title" readonly="readonly"></td>'+
      '<td><input id="units5" class="units" readonly="readonly"></td>'+
      '<td><input id="score5" class="score" onblur="cGPACalculator.showGrade5()"></td>'+
      '<td><input id="grade5" class="grade" readonly="readonly"></td>'+
      '<td><input id="points5" class="points" readonly="readonly"></td></tr>'+
      '<tr><td><input id="code6" class="code" readonly="readonly"></td>'+
      '<td><input id="title6" class="title" readonly="readonly"></td>'+
      '<td><input id="units6" class="units" readonly="readonly"></td>'+
      '<td><input id="score6" class="score" onblur="cGPACalculator.showGrade6()"></td>'+
      '<td><input id="grade6" class="grade" readonly="readonly"></td>'+
      '<td><input id="points6" class="points" readonly="readonly"></td></tr>'+
      '<tr><td><input id="code7" class="code" readonly="readonly"></td>'+
      '<td><input id="title7" class="title" readonly="readonly"></td>'+
      '<td><input id="units7" class="units" readonly="readonly"></td>'+
      '<td><input id="score7" class="score" onblur="cGPACalculator.showGrade7()"></td>'+
      '<td><input id="grade7" class="grade" readonly="readonly"></td>'+
      '<td><input id="points7" class="points" readonly="readonly"></td></tr>'+
      '<tr><td><input id="code8" class="code" readonly="readonly"></td>'+
      '<td><input id="title8" class="title" readonly="readonly"></td>'+
      '<td><input id="units8" class="units" readonly="readonly"></td>'+
      '<td><input id="score8" class="score" onblur="cGPACalculator.showGrade8()"></td>'+
      '<td><input id="grade8" class="grade" readonly="readonly"></td>'+
      '<td><input id="points8" class="points" readonly="readonly"></td></tr>'+
      '<tr><td colspan="5">Total points Acquired</td>'+
      '<td colspan="5"><input class="total" id="total" readonly="readonly"></td></tr>'+
      '<tr><td colspan="5">CGPA</td>'+
      '<td colspan="5"><input class="cgpa" id="cgpa" readonly="readonly"></td></tr>'+
      '</tbody></table></div>';
    setFixtures(fixture);
    $('#table').hide();
    cGPACalculator = new CGPACalculator();
  });
  describe("Test that all tags that make function calls to be sure that have their props set to it", function () {
    it("Test that semester select tag has onChange property", function () {
      expect($('#semester')).toBeInDOM();
      expect($('#semester')).toHaveAttr("onchange", "cGPACalculator.enableLoadCourses()");
    });
    it("Test that loadCourses button tag has onclick property", function () {
      expect($('#loadCourses')).toHaveAttr("onclick", "cGPACalculator.showInputTable()");
    });
    it("Test that scores input tag has onblur property", function () {
      expect($('#score1')).toHaveAttr("onblur","cGPACalculator.showGrade1()");
      expect($('#score2')).toHaveAttr("onblur","cGPACalculator.showGrade2()");
      expect($('#score3')).toHaveAttr("onblur","cGPACalculator.showGrade3()");
      expect($('#score4')).toHaveAttr("onblur","cGPACalculator.showGrade4()");
      expect($('#score5')).toHaveAttr("onblur","cGPACalculator.showGrade5()");
      expect($('#score6')).toHaveAttr("onblur","cGPACalculator.showGrade6()");
      expect($('#score7')).toHaveAttr("onblur","cGPACalculator.showGrade7()");
      expect($('#score8')).toHaveAttr("onblur","cGPACalculator.showGrade8()");
    });
  });
  describe("Test that button loadCourses is enabled when all fields are filled", function () {
    beforeEach(function () {
      $('#surname').val("Opara");
      $('#firstName').val("Febechukwu");
      $('#middleName').val("Chinonyerem");
      $('#registrationNumber').val("2007/NDM/14392");
      $('#level option[value=2]').prop('selected', 'selected').change();
      $('#courseOfStudy option[value=Computer]').prop('selected', 'selected').change();
      $('#semester option[value=Rain]').prop('selected', 'selected').change();
    });
    it("Test that the loadCourses button is enabled once all data is provided", function () {
      expect($('#loadCourses')).not.toBeDisabled();
    });
  });
  describe("Test loadCourses button click", function () {
    beforeEach(function () {
      spyEvent = spyOnEvent('#loadCourses', 'click');
      $('#loadCourses').trigger("click");
    });
    it("should invoke the loadCourses click event.", function () {
      expect('click').toHaveBeenTriggeredOn('#loadCourses');
      expect(spyEvent).toHaveBeenTriggered();
    });
    it("should show the table once the button is clicked.", function () {
      expect($('#table')).not.toBeHidden();
    });
    it("should have all tags with css class as code, title, units, grade and points to be readonly.", function () {
      expect($('.code')).toHaveAttr("readonly");
      expect($('.title')).toHaveProp("readonly");
      expect($('.units')).toHaveProp("readonly");
      expect($('.grade')).toHaveProp("readonly");
      expect($('.points')).toHaveProp("readonly");
    });
  });

   describe("Test showCourseDetails function", function () {
      var cGPACalculator = null;
      it("Test that showCourseDetails called isEmptyCourses function", function () {
        cGPACalculator = new CGPACalculator();
        spyOn(cGPACalculator, "isEmptyCourses");
        cGPACalculator.showCourseDetails(courses);
        expect(cGPACalculator.isEmptyCourses.calls.count()).toBe(1);
        expect(cGPACalculator.isEmptyCourses).toHaveBeenCalled();
        expect(cGPACalculator.isEmptyCourses).toHaveBeenCalledWith(courses);
      });
      it("Test that showCourseDetails called isWellFormattedCourses function", function () {
        cGPACalculator = new CGPACalculator();
        spyOn(cGPACalculator, "isWellFormattedCourses");
        cGPACalculator.showCourseDetails(courses);
        expect(cGPACalculator.isWellFormattedCourses.calls.count()).toBe(1);
        expect(cGPACalculator.isWellFormattedCourses).toHaveBeenCalled();
        expect(cGPACalculator.isWellFormattedCourses).toHaveBeenCalledWith(courses);
      });
   });
  
   describe("Test that course details are populated on table", function () {
     beforeEach(function () {
        cGPACalculator = new CGPACalculator();
        cGPACalculator.showCourseDetails(courses);
     });
     it("should have all course codes not empty.", function () {
      expect($('#code1').val).not.toBe("");
      expect($('#code2').val).not.toBe("");
      expect($('#code3').val).not.toBe("");
      expect($('#code4').val).not.toBe("");
      expect($('#code5').val).not.toBe("");
      expect($('#code6').val).not.toBe("");
      expect($('#code7').val).not.toBe("");
      expect($('#code8').val).not.toBe("");
    });
    it("should have all course titles not empty.", function () {
      expect($('#title1').val).not.toBe("");
      expect($('#title2').val).not.toBe("");
      expect($('#title3').val).not.toBe("");
      expect($('#title4').val).not.toBe("");
      expect($('#title5').val).not.toBe("");
      expect($('#title6').val).not.toBe("");
      expect($('#title7').val).not.toBe("");
      expect($('#title8').val).not.toBe("");
    });
    it("should have all course units not empty.", function () {
      expect($('#units1').val).not.toBe("");
      expect($('#units2').val).not.toBe("");
      expect($('#units3').val).not.toBe("");
      expect($('#units4').val).not.toBe("");
      expect($('#units5').val).not.toBe("");
      expect($('#units6').val).not.toBe("");
      expect($('#units7').val).not.toBe("");
      expect($('#units8').val).not.toBe("");
    });
    it("should have all course grades empty.", function () {
      expect($('#grade1').val()).toBe("");
      expect($('#grade2').val()).toBe("");
      expect($('#grade3').val()).toBe("");
      expect($('#grade4').val()).toBe("");
      expect($('#grade5').val()).toBe("");
      expect($('#grade6').val()).toBe("");
      expect($('#grade7').val()).toBe("");
      expect($('#grade8').val()).toBe("");
    });
    it("should have all course points empty.", function () {
      expect($('#points1').val()).toBe("");
      expect($('#points2').val()).toBe("");
      expect($('#points3').val()).toBe("");
      expect($('#points4').val()).toBe("");
      expect($('#points5').val()).toBe("");
      expect($('#points6').val()).toBe("");
      expect($('#points7').val()).toBe("");
      expect($('#points8').val()).toBe("");
    });
   });

  describe("Test Entering Score for the 8 courses", function () {
    var cGPACalculator = null;
    beforeEach(function () {
      $('#score1').val("70");
      $('#score1').blur();
      $('#score2').val("80");
      $('#score2').blur();
      $('#score3').val("90");
      $('#score3').blur();
      $('#score4').val("60");
      $('#score4').blur();
      $('#score5').val("50");
      $('#score5').blur();
      $('#score6').val("40");
      $('#score6').blur();
      $('#score7').val("20");
      $('#score7').blur();
      $('#score8').val("10");
      $('#score8').blur();

    });
    it("should populate input tags for grade and points with CORRECT values.", function () {
      expect($('#grade1').val()).toBe("A");
      expect($('#grade2').val()).toBe("A");
      expect($('#grade3').val()).toBe("A");
      expect($('#grade4').val()).toBe("B");
      expect($('#grade5').val()).toBe("C");
      expect($('#grade6').val()).toBe("D");
      expect($('#grade7').val()).toBe("E");
      expect($('#grade8').val()).toBe("F");
      expect($('#points1').val()).toBe('5');
      expect($('#points2').val()).toBe('5');
      expect($('#points3').val()).toBe('5');
      expect($('#points4').val()).toBe('4');
      expect($('#points5').val()).toBe('3');
      expect($('#points6').val()).toBe('2');
      expect($('#points7').val()).toBe('1');
      expect($('#points8').val()).toBe('0');
    });
    it("should call evaluateGrade, computeTotalPoint, computePoint and computeCGPA and  function whenever showGrade is called.", function () {
      cGPACalculator = new CGPACalculator();
      var spy = spyOn(cGPACalculator, "showPoint");
      cGPACalculator.showGrade1();
      expect(cGPACalculator.showPoint).toHaveBeenCalled();
      expect(cGPACalculator.showPoint).toHaveBeenCalledWith(5, "#points1");
      expect(cGPACalculator.showPoint.calls.count()).toBe(1);

      spy = spyOn(cGPACalculator, "evaluateGrade");
      cGPACalculator.showGrade1();
      expect(cGPACalculator.evaluateGrade).toHaveBeenCalled();
      expect(cGPACalculator.evaluateGrade).toHaveBeenCalledWith("A");
      
      spy = spyOn(cGPACalculator, "computePoint");
      cGPACalculator.showGrade1();
      expect(cGPACalculator.computePoint).toHaveBeenCalled();
      
      cGPACalculator.showGrade2();
      cGPACalculator.showGrade3();
      cGPACalculator.showGrade4();
      cGPACalculator.showGrade5();
      cGPACalculator.showGrade6();
      cGPACalculator.showGrade7();
      cGPACalculator.showGrade8();

      
      spy = spyOn(cGPACalculator, "computeTotalPoint");
      cGPACalculator.showGrade8();
      expect(cGPACalculator.computeTotalPoint).toHaveBeenCalled();

      spy = spyOn(cGPACalculator, "computeCGPA");
      cGPACalculator.showGrade8();
      expect(cGPACalculator.computeCGPA).toHaveBeenCalled();
    });
  });

});