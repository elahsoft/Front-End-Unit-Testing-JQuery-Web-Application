
  /**
   * Create a CGPACalculator.
   * @constructor
   */
  function CGPACalculator() {
    this.surname = "";
    this.firstName = "";
    this.middleName = "";
    this.registrationNumber = "";
    this.level = "";
    this.courseOfStudy = "";
    this.semester = "";
    this.cgpa = 0;
    this.totalPoints = 0;
    this.points = [];
    this.units = [];
    this.totalUnits = 0;
    this.gradeSystem = {"A": 5, "B": 4, "C": 3, "D": 2, "E": 1, "F": 0};
  }

  /**
   * isEmptyCourses
   * 
   * Checks that the courses 
   * object isn't empty.
   * 
   * @param {object} courses
   * @returns {boolean} returns boolean
   */
  CGPACalculator.prototype.isEmptyCourses = function(courses) {
    var status = true;
    if (this.isObject(courses)) {
      if (Object.keys(courses).length > 0) {
        status = false;
      }
    }
    return status;
  }

  /**
     * isObject
     * 
     * Checks that the courses 
     * variable is an object.
     * 
     * @param {object} courses
     * @returns {boolean} returns boolean
     */
  CGPACalculator.prototype.isObject = function(courses) {
    var status = false;
    if (Object.prototype.toString.call(courses) === '[object Object]') {
      status = true;
    }
    return status;
  }

  /**
     * isWellFormattedCourses
     * 
     * Checks that the courses variable
     * is formatted as expected.
     * 
     * @param {object} courses
     * @returns {boolean} returns boolean
     */
  CGPACalculator.prototype.isWellFormattedCourses = function(courses) {
    var status = false;
    var keys = ['code', 'title', 'units', 'semester'];
    _.each(courses, function (department, key) {
      if (key === "Computer") {
        _.each(department, function (level, key) {
          if (key === "course2L") {
            _.each(level, function (courseList, key) {
              if (_.isEqual(Object.keys(courseList), keys)) {
                status = true;
              }
            });
          }
        });
      }
    });
    return status;
  }

 /**
     * computePoint
     * 
     * computes the point acquired 
     * for a particular grade
     * 
     * @param {number} unit
     * @param {String} grade
     * @returns {number} returns point computed
     */
  CGPACalculator.prototype.computePoint = function(unit, grade) {
    var gradeValue = this.evaluateGrade(grade);
    var point =  gradeValue * unit;
    return point;
  }

  /**
     * evaluateGrade
     * 
     * finds point equivalence of grade
     * 
     * @param {String} grade
     * @returns {number} returns point equivalence of grade
     */
  CGPACalculator.prototype.evaluateGrade = function(grade) {
    return this.gradeSystem[grade];
  }

  /**
     * computeTotalPoint
     * 
     * calculates the total acummulated
     * points from all courses
     * 
     * @param {Array} points
     * @returns {number} returns total of points
     */
  CGPACalculator.prototype.computeTotalPoint = function(points) {
    for (var i = 0; i < points.length; i++) {
      this.totalPoints = this.totalPoints + points[i];
    }
    return this.totalPoints;
  }

  /**
     * startComputation
     * 
     * kicks off the computation
     * of the cgpa
     * 
     * @param {String} surname
     * @param {String} firstName
     * @param {String} middleName
     * @param {String} registrationNumber
     * @param {String} level
     * @param {String} courseOfStudy
     * @param {String} semester
     * @param {Object} courses
     * @returns {void} returns nothing
     */
  CGPACalculator.prototype.startComputation = function(surname, firstName, middleName, registrationNumber, level, courseOfStudy, semester, courses, grades) {
    this.surname = surname;
    this.firstName = firstName;
    this.middleName = middleName;
    this.registrationNumber = registrationNumber;
    this.level = level;
    this.courseOfStudy = courseOfStudy;
    this.semester = semester;
    var isEmpty = this.isEmptyCourses(courses);
    var points = [];
    if (isEmpty === false) {
      var isWellFormatted = this.isWellFormattedCourses(courses);
      var i = 0;
      if (isWellFormatted) {
        _.each(courses, function (department, key) {
      if (key === courseOfStudy) {
        _.each(department, function (leve, key) {
          if (key === level) {
            _.each(leve, function (courseList, key) {
              points[i] = this.computePoint(courseList["units"], grades[i]);
              i = i + 1;
            });
          }
            });
          }
        });
      }
      this.totalPoints = this.computeTotalPoint(points);
      }
    }

     /**
     * enableLoadCourses
     * 
     * enables the loading 
     * of courses
     * 
     * @param {void} 
     * @returns {void} returns nothing
     */
    CGPACalculator.prototype.enableLoadCourses = function() {
      $('#loadCourses').removeAttr('disabled');
    }

    /**
     * showCourseDetails
     * 
     * shows the course 
     * details
     * 
     * @param {courses} all courses object
     * @returns {void} returns nothing
     */
    CGPACalculator.prototype.showCourseDetails = function(courses) {
      var dept = $('#courseOfStudy').val();
      var studentLevel = $('#level').val();
      var semester = $('#semester').val();
      var isEmpty = this.isEmptyCourses(courses);
      if (isEmpty === false) {
        var isWellFormatted = this.isWellFormattedCourses(courses);
        var i = 1;
        if (isWellFormatted) {
          _.each(courses, function (department, key) {
          if (key === dept) {
            _.each(department, function (leve, key) {
            if (key === studentLevel) {
                _.each(leve, function (courseList, key) {
                   if (courseList["semester"] === semester) {
                    $('#code'+i).val(courseList["code"]);
                    $('#title'+i).val(courseList["title"]);
                    $('#units'+i).val(courseList["units"]);
                    i = i + 1;
                   }
              });
            }
              });
            }
            });
          }
    }
  }

    /**
     * showInputTable
     * 
     * shows the input 
     * table
     * 
     * @param {void} 
     * @returns {void} returns nothing
     */
    CGPACalculator.prototype.showInputTable = function() {
      $('#table').show();
    }

    /**
     * evaluateScore
     * 
     * evaluate Score
     * 
     * @param {score} number
     * @returns {number} returns grade
     */
    CGPACalculator.prototype.evaluateScore = function(score) {
      var grade = "";
      if (score >= 70 && score <= 100) {
        grade = 'A';
      }
      else if (score >= 60 && score <= 69) {
        grade = 'B';
      }
      else if (score >= 50 && score <= 59) {
        grade = 'C';
      }
      else if (score >= 30 && score <= 49) {
        grade = 'D';
      }
      else if (score >= 20 && score <= 29) {
        grade = 'E';
      }
      else {
        grade = 'F';
      }
      return grade;
    }

    /**
     * showGrade1 - showGrade8
     * 
     * displays the evaluated grade
     * 
     * @param {void}
     * @returns {void}
     */
    CGPACalculator.prototype.showGrade1 = function() {
      var grade1 = document.getElementById('score1').value;
      var unit = document.getElementById('units1').value;
      var grade = this.evaluateScore(grade1);
      var poin = this.computePoint(unit, grade1);
      this.points.push(poin);
      this.units.push(unit);
      $('#grade1').val(grade);
      var point = this.evaluateGrade(grade);
      this.showPoint(point, '#points1');
    }

    CGPACalculator.prototype.showGrade2 = function() {
      var grade2 = document.getElementById('score2').value;
      var unit = document.getElementById('units2').value;
      var grade = this.evaluateScore(grade2);
      var poin = this.computePoint(unit, grade2);
      this.points.push(poin);
      this.units.push(unit);
      $('#grade2').val(grade);
      var point = this.evaluateGrade(grade);
      this.showPoint(point, '#points2');
    }

    CGPACalculator.prototype.showGrade3 = function() {
      var grade3 = document.getElementById('score3').value;
      var unit = document.getElementById('units3').value;
      var grade = this.evaluateScore(grade3);
      var poin = this.computePoint(unit, grade3);
      this.points.push(poin);
      this.units.push(unit);
      $('#grade3').val(grade);
      var point = this.evaluateGrade(grade);
      this.showPoint(point, '#points3');
    }

    CGPACalculator.prototype.showGrade4 = function() {
      var grade4 = document.getElementById('score4').value;
      var unit = document.getElementById('units4').value;
      var grade = this.evaluateScore(grade4);
      var poin = this.computePoint(unit, grade4);
      this.points.push(poin);
      this.units.push(unit);
      $('#grade4').val(grade);
      var point = this.evaluateGrade(grade);
      this.showPoint(point, '#points4');
    }

    CGPACalculator.prototype.showGrade5 = function() {
      var grade5 = document.getElementById('score5').value;
      var unit = document.getElementById('units5').value;
      var grade = this.evaluateScore(grade5);
      var poin = this.computePoint(unit, grade5);
      this.points.push(poin);
      this.units.push(unit);
      $('#grade5').val(grade);
      var point = this.evaluateGrade(grade);
      this.showPoint(point, '#points5');
    }

    CGPACalculator.prototype.showGrade6 = function() {
      var grade6 = document.getElementById('score6').value;
      var unit = document.getElementById('units6').value;
      var grade = this.evaluateScore(grade6);
      var poin = this.computePoint(unit, grade6);
      this.points.push(poin);
      this.units.push(unit);
      $('#grade6').val(grade);
      var point = this.evaluateGrade(grade);
      this.showPoint(point, '#points6');
    }

    CGPACalculator.prototype.showGrade7 = function() {
      var grade7 = document.getElementById('score7').value;
      var unit = document.getElementById('units7').value;
      var grade = this.evaluateScore(grade7);
      var poin = this.computePoint(unit, grade7);
      this.points.push(poin);
      this.units.push(unit);
      $('#grade7').val(grade);
      var point = this.evaluateGrade(grade);
      this.showPoint(point, '#points7');
    }

    CGPACalculator.prototype.showGrade8 = function() {
      var grade8 = document.getElementById('score8').value;
      var unit = document.getElementById('units8').value;
      var grade = this.evaluateScore(grade8);
      var poin = this.computePoint(unit, grade8);
      this.points.push(poin);
      this.units.push(unit);
      $('#grade8').val(grade);
      var point = this.evaluateGrade(grade);
      this.showPoint(point, '#points8');
      this.computeTotalPoint(this.points);
      this.computeCGPA();
    }

    /**
     * showPoint
     * 
     * displays the associated
     * points of the grade
     * 
     * @param {void}
     * @returns {void}
     */
    CGPACalculator.prototype.showPoint = function(point, elementId) {
      this.points.push(point);
      $(elementId).val(point);
    }

    /**
     * computeTotalUnits
     * 
     * computes the
     * total units
     * 
     * @param {void}
     * @returns {void}
     */
    CGPACalculator.prototype.computeTotalUnits = function() {
      for (var i=0; i<this.units.length; i++) {
        this.totalUnits = this.totalUnits + this.units[i];
      }
    }

    /**
     * computeCGPA
     * 
     * computes the
     * cgpa
     * 
     * @param {void}
     * @returns {void}
     */
    CGPACalculator.prototype.computeCGPA = function() {
      this.totalUnits = this.computeTotalUnits();
      this.cgpa = this.totalPoints / this.totalUnits;
      this.showCGPA();
      this.showTotalPoints();
    }

    /**
     * showCGPA
     * 
     * displays the
     * cgpa
     * 
     * @param {void}
     * @returns {void}
     */
    CGPACalculator.prototype.showCGPA = function() {
      $('#cgpa').val(this.cgpa);
    }

    /**
     * showTotalPoints
     * 
     * displays the
     * total points
     * 
     * @param {void}
     * @returns {void}
     */
    CGPACalculator.prototype.showTotalPoints = function() {
      $('#total').val(this.totalPoints);
    }

// export default CGPACalculator;