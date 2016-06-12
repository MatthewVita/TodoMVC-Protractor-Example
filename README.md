# TodoMVC Protractor Example

Angular Protractor example using TodoMVC (http://todomvc.com/). This is my first take at Protractor, feel free to supply feedback!

![img](https://github.com/MatthewVita/TodoMVC-Protractor-Example/blob/master/tests.gif)

## Run
- Install Node, Chrome, [Protractor](http://www.protractortest.org/#/protractor-setup), and [local-web-server](https://www.npmjs.com/package/local-web-server)
- From the root of the repo, execute `cd todomvc && ws` to spin up a web server with the Angular code
- From the root of the repo, execute `protractor spec.js` to run the tests

## TODOs
- Test deletion of tasks at specific indexes
- Test editing of tasks at specific indexes
- Implement "uncomplete" tests
- Check for strikethrough text on completed tasks
- Figure out a way to include "active" page in existing tests

## License
MIT.

View the [TodoMVC copyright holder list](https://github.com/tastejs/todomvc#license)
