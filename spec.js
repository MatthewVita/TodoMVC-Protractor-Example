/**
 * Tasks:
 *
 * - add documentation
 *     - todo deleting at specific indexes
 *     - uncomplete task
 *     - todo editing at specific indexes
 *     - todo checking for strikethrough on completed tasks
 *     - todo uncompleting 2+ times on a task
 *     - todo uncompleteing multiple tasks
 *     - small changes to index.html template
 * - view report to see the describe/it statements
 * - take licecap
 * - push to GH
 */

describe('Task list', function() {
  var applicationUrl = 'http://localhost:8000';

  // In order to isolate the tests, local storage data is clear between
  // test suites since the app stores data exclusively in local storage.
  afterEach(function() {
    browser.executeScript('window.localStorage.clear();');
  });

  // This is a cheap way to get `jasmine.before`
  var before = function(callback) {
    it('', function() {
      callback();
    });
  };

  // Page objects
  var elements = {
    getNewTodoInput:              function() { return element(by.model('newTodo')); },
    getTaskInList:                function(index) { return element.all(by.css('.task')).get(index); },
    getTaskEditInputInList:       function(index) { return element.all(by.css('.edit')).get(index); },
    getTaskCompleteToggleInList:  function(index) { return element.all(by.css('.toggle')).get(index); },
    getTaskDeleteButtonInList:    function(index) { return element.all(by.css('.destroy')).get(index); },
    getMainViewLink:              function() { return element(by.css('.main-link')); },
    getCompletedViewLink:         function() { return element(by.css('.completed-link')); },
    getClearCompletedTasksButton: function() { return element(by.id('clear-completed')); },
    getTodoCount:                 function() { return element(by.id('todo-count')).evaluate('remainingCount'); },
    getTaskListCount:             function() { return element.all(by.css('.task')).count(); }
  };

  var addTask = function(taskText) {
    elements.getNewTodoInput().sendKeys(taskText);
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
  };

  var editTask = function(index, taskTextToAppend) {
    browser.actions().doubleClick(elements.getTaskInList(index)).perform();
    elements.getTaskEditInputInList(index).sendKeys(taskTextToAppend);
    browser.actions().sendKeys(protractor.Key.ENTER).perform();
  };

  var completeTask = function(index) {
    browser.actions().mouseMove(elements.getTaskInList(index)).perform();
    browser.actions().click(elements.getTaskCompleteToggleInList(index)).perform();
  };

  var deleteTask = function(optionalIndex) {
    var index = optionalIndex || 0;
    browser.actions().mouseMove(elements.getTaskInList(index)).perform();
    browser.actions().click(elements.getTaskDeleteButtonInList(index)).perform();
  };

  var navigateToMainView = function() {
    browser.actions().click(elements.getMainViewLink()).perform();
  };

  var navigateToCompletedView = function() {
    browser.actions().click(elements.getCompletedViewLink()).perform();
  };

  var clearCompletedTasks = function() {
    browser.actions().click(elements.getClearCompletedTasksButton()).perform();
  };

  describe('adding a task', function() {
    before(function() {
      browser.get(applicationUrl);
      addTask('task a');
    });

    it('shows the task in the list', function() {
      elements.getTaskInList(0).getText()
        .then(function(text) {
          expect(text).toBe('task a');
        });
    });

    it('represents the task in the task count', function() {
      elements.getTodoCount().getText()
        .then(function(taskCountText) {
          expect(taskCountText).toBe('1 item left');
        });
    });
  });

  describe('editing a task', function() {
    before(function() {
      browser.get(applicationUrl);
      addTask('task a');
      editTask(0, ' - edited');
    });

    it('shows the edited task in the list', function() {
      elements.getTaskInList(0).getText()
        .then(function(text) {
          expect(text).toBe('task a - edited');
        });
    });

    it('represents the edited task in the task count', function() {
      elements.getTodoCount().getText()
        .then(function(taskCountText) {
          expect(taskCountText).toBe('1 item left');
        });
    });
  });

  describe('completing a task', function() {
    before(function() {
      browser.get(applicationUrl);
      addTask('task a');
      completeTask(0);
      navigateToCompletedView();
    });

    it('shows the task in the completed list', function() {
      elements.getTaskInList(0).getText()
        .then(function(text) {
          expect(text).toBe('task a');
        });
    });

    it('does not represent the task in the task count', function() {
      elements.getTodoCount().getText()
        .then(function(taskCountText) {
          expect(taskCountText).toBe('0 items left');
        });
    });
  });

  describe('clearing a completed task', function() {
    before(function() {
      browser.get(applicationUrl);
      addTask('task a');
      completeTask(0);
      navigateToCompletedView();
      clearCompletedTasks();
    });

    it('does not show the task in the completed list', function() {
      expect(elements.getTaskListCount()).toBe(0);
    });

    it('does not represent the task in the task count', function() {
      elements.getTodoCount().isDisplayed()
        .then(function(state) {
          expect(state).toBe(false);
        });
    });
  });

  describe('deleting a task', function() {
    before(function() {
      browser.get(applicationUrl);
      addTask('task a');
      deleteTask();
    });

    it('does not show the task in the list', function() {
      expect(elements.getTaskListCount()).toBe(0);
    });

    it('does not represent the task in the task count', function() {
      elements.getTodoCount().getText()
        .then(function(taskCountText) {
          expect(taskCountText).toBe('');
        });
    });
  });

  describe('adding multiple tasks', function() {
    before(function() {
      browser.get(applicationUrl);
      addTask('task a');
      addTask('task b');
      addTask('task c');
    });

    it('shows the tasks in the list', function() {
      ['a', 'b', 'c'].forEach(function(char, index) {
        elements.getTaskInList(index).getText()
          .then(function(text) {
            expect(text).toBe('task ' + char);
          });
      });
    });

    it('represents the tasks in the task count', function() {
      elements.getTodoCount().getText()
        .then(function(taskCountText) {
          expect(taskCountText).toBe('3 items left');
        });
    });
  });

  describe('editing multiple tasks', function() {
    before(function() {
      browser.get(applicationUrl);
      addTask('task a');
      addTask('task b');
      addTask('task c');
      editTask(0, ' - edited');
      editTask(1, ' - edited');
      editTask(2, ' - edited');
    });

    it('shows the edited tasks in the list', function() {
      ['a', 'b', 'c'].forEach(function(char, index) {
        elements.getTaskInList(index).getText()
          .then(function(text) {
            expect(text).toBe('task ' + char + ' - edited');
          });
      });
    });

    it('represents the edited tasks in the task count', function() {
      elements.getTodoCount().getText()
        .then(function(taskCountText) {
          expect(taskCountText).toBe('3 items left');
        });
    });
  });

  describe('completing multiple tasks', function() {
    before(function() {
      browser.get(applicationUrl);
      addTask('task a');
      addTask('task b');
      addTask('task c');
      completeTask(0);
      completeTask(1);
      completeTask(2);
      navigateToCompletedView();
    });

    it('shows the completed tasks in the completed list', function() {
      ['a', 'b', 'c'].forEach(function(char, index) {
        elements.getTaskInList(index).getText()
          .then(function(text) {
            expect(text).toBe('task ' + char);
          });
      });
    });

    it('does not represent the task in the task count', function() {
      elements.getTodoCount().getText()
        .then(function(taskCountText) {
          expect(taskCountText).toBe('0 items left');
        });
    });
  });

  describe('clearing multiple completed tasks', function() {
    before(function() {
      browser.get(applicationUrl);
      addTask('task a');
      addTask('task b');
      addTask('task c');
      completeTask(0);
      completeTask(1);
      completeTask(2);
      navigateToCompletedView();
      clearCompletedTasks();
    });

    it('does not show the tasks in the completed list', function() {
      expect(elements.getTaskListCount()).toBe(0);
    });

    it('does not represent the task in the task count', function() {
      elements.getTodoCount().isDisplayed()
        .then(function(state) {
          expect(state).toBe(false);
        });
    });
  });

  describe('deleting multiple tasks', function() {
    before(function() {
      browser.get(applicationUrl);
      addTask('task a');
      addTask('task b');
      addTask('task c');
      deleteTask();
      deleteTask();
      deleteTask();
    });

    it('does not show the tasks in the list', function() {
      expect(elements.getTaskListCount()).toBe(0);
    });

    it('does not represent the tasks in the task count', function() {
      elements.getTodoCount().getText()
        .then(function(taskCountText) {
          expect(taskCountText).toBe('');
        });
    });
  });
});

