#!/usr/bin/env node

var PLATFORMS_URL = "https://saucelabs.com/docs/platforms"
  , jsdom = require("jsdom")
  , request = require('request')
  , fs = require("fs")
  , path = require("path")
  , _ = require("underscore");

var platformAlias = function(platformAliases, browser, platformName) {
  var newPlatformName = platformAliases[platformName];
  if (browser.toLowerCase()=="android")
    newPlatformName = "android";
  return newPlatformName? newPlatformName: platformName;
};

request(PLATFORMS_URL, function(err, response, body){
  jsdom.defaultDocumentFeatures = { 
    FetchExternalResources   : ['script'],
    ProcessExternalResources : ['script'],
    MutationEvents           : '2.0',
    QuerySelector            : false
  };

  var doc   = jsdom.jsdom(body);
  var window = doc.createWindow();
  window.addEventListener('load', function () {
      var browsersData = window.browsers_data.webdriver;
      var browsersResult = [];
      _.each(browsersData, function(browsersByOs, os){
        _.each(browsersByOs, function(browserVersions, browser){
          _.each(browserVersions, function(browserVersion) {
              browsersResult.push({
              browserName:browser,
              platform: platformAlias(window.os_consumer, browser, browserVersion.full_os),
              version: browserVersion.version
            });
          })
        })
      })

      window.close();
      fs.writeFileSync(path.join(__dirname, "browsers.json"), JSON.stringify(browsersResult, null, 2));
  });

})



