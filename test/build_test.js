var browsers = require("../browsers")
  , test = require("tape")
  , async = require("async")
  , webdriver = require("./webdriver");

var shuffle = function(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

browsers = shuffle(browsers);


test("WebDriver good browser", function(t){
  webdriver({
      browserName: "firefox"
    , version: "10.0"
    , platform: "LINUX"
  }, function(err){
    t.error(err);
    t.end();
  });
});

test("WebDriver bad browsers", function(t){
  var badBrowsers = [
    {
        browserName: "Non Existent browser"
      , version: "1"
      , platform: "Non Existent platform"
    },
    {
        browserName: "Safari"
      , version: "6"
      , platform: "Linux"
    }
  ];
  async.map(badBrowsers, function(browserOpts, callback){
    webdriver(browserOpts, function(err){
      t.ok(err, "Bad browsers should throw an error");
      callback(null);
    })
  }, 
  function(err, browsers) {
      t.end();
  });
});

test("SauceLabs Browser Fetched List", function(t){
  t.ok(browsers.length > 20, "Should have a lot of browsers");

  async.mapSeries(browsers, function(browserOpts, callback){
    webdriver(browserOpts, function(err){
      t.error(err, browserOpts.browserName+ " "+ browserOpts.version + " @ "+ browserOpts.platform) ;
      browserOpts.passed = true;
      callback(null, browserOpts);
    })
  }, 
  function(err, browsers) {
      t.end();
  });
});