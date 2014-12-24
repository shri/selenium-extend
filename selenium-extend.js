var webdriver = require('selenium-webdriver');
var by        = require('selenium-webdriver').By;
var until     = require('selenium-webdriver').until;
var chrome    = require('selenium-webdriver/chrome');


module.exports = {
  createChrome: createChrome,
  createChromeWithExtension: createChromeWithExtension,
  addExtend: applyWrapper,
  setWaitTime: setWaitTime
};

var WAITTIME = 10000; // default wait time

function setWaitTime(time) {
  WAITTIME = time;
}

function createChrome(driverPath) {

  var o = new chrome.Options();
  var s = new chrome.ServiceBuilder(driverPath).build(); 
  var driver = chrome.createDriver(o, s);
  applyWrapper(driver);

  return driver;
}

function createChromeWithExtension(extensionPath, driverPath) {

  var o = new chrome.Options();
  o.addArguments("load-extension="+extensionPath); 
  o.addArguments("--extensions-on-chrome-urls"); 
  var s = new chrome.ServiceBuilder(driverPath).build();  
  var driver = chrome.createDriver(o, s);
  driver.manage().window().setSize(1268, 648);
  applyWrapper(driver);

  return driver;
}

function applyWrapper(driver) {

  // Helper

  function waitForElement(css) {

    driver.wait(until.elementLocated(by.css(css)), WAITTIME);
    
  }

  driver.extend = {};

  var extend = driver.extend; 

  // Methods

  extend.enableIncognito = function enableIncognito(numberOfExtensions) {

    // first extension is always selenium

    // assume desire for 2 extensions if numberOfExtensions is undefined
    // (Selenium and a user defined extension)
    if (numberOfExtensions === undefined) {
      numberOfExtensions = 2;
    }

    var extensionsURL = "chrome://extensions-frame"; //used to avoid iframe
    driver.get(extensionsURL);

    extend.isClickable("div#extension-settings-list div:nth-child(1) label.incognito-control input");

    for (var i = 0; i < numberOfExtensions; i++) {
      var num = i + 1;
      extend.click("div#extension-settings-list div.extension-list-item-wrapper:nth-of-type(" + num + ") label.incognito-control input");
    }
    
  };

  extend.isClickable = function waitForClickableElement(css) {

    driver.wait(until.elementLocated(by.css(css)), WAITTIME);

    var element = driver.findElement(by.css(css));
    driver.wait(function () {
      return element.isDisplayed().then(function (displayed) {
        if (!displayed)
          return false;

        return element.isEnabled();
      });
    }, WAITTIME);

  };

  extend.click = function waitAndClick(css) {

    extend.isClickable(css);

    driver
      .findElement(by.css(css))
      .click();
  };

  extend.doubleClick = function waitAndDoubleClick(css) {

    extend.isClickable(css);

    var element = driver.findElement(by.css(css))
    driver
      .actions()
      .doubleClick(element)
      .perform();
  };

  extend.exists = function waitAndExists(css) {

    waitForElement(css);

    // returns promise
    return driver
      .findElement(by.css(css))
      .isEnabled();  

  };

  extend.getText = function waitAndGetText(css) {

    waitForElement(css);

    return driver
      .findElement(by.css(css))
      .getText();
  };

  extend.getValue = function waitAndGetValue(css) {

    waitForElement(css);

    return driver
      .findElement(by.css(css))
      .getAttribute("value");
  };

  extend.selectText = function selectText(css, offset1, offset2){

    waitForElement(css);

    var element = driver.findElement(by.css(css));

    //start drag event
    driver
      .actions()
      .mouseMove(element, 0, 0)
      .mouseDown()
      .mouseMove({x:5, y:0})
      .perform();

    // inject selection
    var script = [
      "var range = document.createRange();",
      "var textNode = document.querySelector('" + css + "').firstChild;",
      "var selection = window.getSelection();",
      "range.setStart(textNode, " + offset1 + ");",
      "range.setEnd(textNode,  " + offset2 + ");",
      "selection.removeAllRanges();",
      "selection.addRange(range);"
    ].join('\n');
    driver.executeScript(script);

    driver
      .actions()
      .mouseUp()
      .perform();
  };

  extend.typeText = function waitAndType(css, text){

    extend.isClickable(css);

    return driver
      .findElement(by.css(css))
      .sendKeys(text);

  };

  extend.toNextWindow = function switchToNextWindow() {
  
    driver.getWindowHandle().then(function(currenthandle){

      driver.getAllWindowHandles().then(function(handles){

        for (id in handles) {
          var handle = handles[id];
          if (handle != currenthandle) {
            driver.switchTo().window(handle);
            break;
          }
        }

      });

    });
  };

  extend.moveToElement = function moveToElement(css) {

    waitForElement(css);

    var script = [
      'var element = document.querySelector("' + css + '");',
      "element.scrollIntoView();"
    ].join('\n');

    driver.executeScript(script);

  };

}


