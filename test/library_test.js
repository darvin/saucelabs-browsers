var saucelabsBrowserList = require("./")
  , test = require("tape")
  , async = require("async")
  , webdriver = require("./webdriver");

test("SauceLabsBrowserList", function(t){
  var s = saucelabsBrowserList();
  t.ok(s);

  t.equal(s.length, 20);

  t.end();
});