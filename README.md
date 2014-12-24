selenium-extend
===============

selenium-extend is an npm module that makes
async [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver) code a lot more 
sane. It's most valuable when used in
conjunction with the selenium chromedriver
and makes working with chrome extensions
in the context of the chromedriver much
easier.

selenium-extend does not overwrite existing
driver functionality. selenium-extend adds
an object named `extend` with various methods that
wrap selenium-webdriver functions into 
functions that make sense in the context
of navigating a browser.

##Installation

```sh
npm install --save selenium-extend
```

##Initialization

Creating a new driver with extend methods:
```js
var extend = require('selenium-extend');

// constructing raw chrome
var driverPath = "path/to/chromedriver";
var driver = extend.createChrome(driverPath); //returns a Chrome WebDriver

// constructing chrome with an extension
var extensionPath = "path/to/chrome/extension/folder"; //unpacked chrome extension
var driverPath = "path/to/chromedriver";
var driver = extend.createChromeWithExtension(extensionPath, driverPath);
```

Adding extend methods to an existing driver:
```js
var extend = require('selenium-extend');

extend.addExtend(driver);
```

You can also set the maximum wait time for async events:
```js
extend.setWaitTime(10000); // sets maximum wait time to 10000ms
                           // default WAITTIME is 10000ms
```

##API

Enable incognito for chrome extensions/selenium web driver:
```js
driver.extend.enableIncognito();  // enables for both selenium and extension

driver.extend.enableIncognito(n); // enables for up to n extensions, in order
                                  // from first to last, selenium is always
                                  // the first extension
```

Check is an element is clickable:
```js
var clickable = driver.extend.isClickable(css); // returns boolean true or false
                                                // waits until WAITTIME
                                                // css is a css selector
```

Click on an element:
```js
driver.extend.click(css); //css is selector
```

Double click on an element (really useful for selecting all in input):
```js
driver.extend.doubleClick(css);
```

Check if an element exists:
```js
driver.extend.exists(css);
```

Get the text value of an element:
```js
driver.extend.getText(css);
```

Get the value of an element (input):
```js
driver.extend.getValue(css);
```

Emulate selecting text in DOM with a mouse pointer:
```js
// offset1 and 2 are the character offsets of the text node to highlight text in
driver.extend.selectText(css, offset1, offset2);
```

Type text into an element:
```js
driver.extend.typeText(css, "text to type in element");
```

Switch to the next window:
```js
driver.extend.toNextWindow();
```

Scroll browser to element:
```js
driver.extend.moveToElement(css);
```

##Future

The following are still to be done:
--tests
--constructors for other browsers
--any other types of browser interactions (e.g. hover, 
scroll, double click, etc)


##License
Created by Shri Ganeshram, please attribute in forks.
Licensed under the MIT License.
