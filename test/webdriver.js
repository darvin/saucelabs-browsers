var webdriver = require('wd')
  , util = require("util")
  , semverLoose = require('semver-loose');


var compareVersions  = function(a,b) {
  var a = semverLoose.parse(a)
     ,b = semverLoose.parse(b)
  return (a.major==b.major)&&
      ((a.minor==b.minor)||(!a.minor||!b.minor));
};

var comparePlatforms  = function(a,b) {
  var a = a.toLowerCase()
    , b = b.toLowerCase();
  return ((a==b) ||
    (a=="windows 8"&&b=="xp") ||
    (a=="windows 7"&&b=="xp") ||
    (a=="windows 7"&&b=="windows") ||
    (a=="windows 8"&&b=="windows") ||
    (a=="windows xp"&&b=="windows") ||
    (a=="windows xp"&&b=="xp") ||

    (a=="os x 10.6"&&b=="mac") ||
    (a=="os x 10.7"&&b=="mac") ||
    (a=="os x 10.8"&&b=="mac")

    );
};


module.exports = function(browserOpts, callback) {

  var browser = webdriver.remote(
    "ondemand.saucelabs.com"
    , 80
    , "saucelabs-browsers"
    , "226d6d8e-f394-435f-873a-06e4436c8ed9"
  );

  browser.on('status', function(info){
    // console.log('\x1b[36m%s\x1b[0m', info);
  });

  browser.on('command', function(meth, path){
    // console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path);
  });

  var desired = {
    browserName: browserOpts.browserName
    , version: browserOpts.version
    , platform: browserOpts.platform
    , name: "saucelabs_browser"
    , passed: true
    , build: process.env.TRAVIS_BUILD_NUMBER
  }

  browser.init(desired, function() {

    browser.sessionCapabilities(function(err, capabilities) {
      if (err) return callback(err);
      browser.quit(function(err){
        if (err) return callback(err);
        var equalPlatforms = comparePlatforms(desired.platform, capabilities.platform)
          , equalVersions = compareVersions(desired.version, capabilities.version)
          , equalBrowsers = desired.browserName.toLowerCase()==capabilities.browserName.toLowerCase() ;

           
        var isEqual = (equalBrowsers&&equalVersions&&equalPlatforms);

        //opera is stupid
        if (capabilities.browserName.toLowerCase()=="opera"&&equalBrowsers) {
          isEqual = true;
        }

        //android is stupid
        if (capabilities.browserName.toLowerCase()=="android"&&equalBrowsers) {
          isEqual = true;
        }

        if (!isEqual) {
          // console.error(equalPlatforms, equalBrowsers, equalVersions);
          callback(new Error("\nExpected: "+util.inspect(desired,{colors:true})+" , \nActual: "+util.inspect(capabilities,{colors:true})));
        } else {
          callback(null);
        }

      });

    });
    
  })
}

