Mindbreeze.require([
  "client/extensions",
  "jquery",
  "api/v2/api", 
  "underscore"
], function(
  ClientExtensions,
  $,
  API,
  _
) {

  window.SharePointOfficeLaunchURL = function(action, url) {
    if (navigator.msLaunchUri) {
      var cmd = "";
      if (action == "edit") {
        cmd = "ofe|u|"
      }
      else if (action == "view") {
        cmd = "ofv|u|"
      }
      
      if (cmd && url.match(/(do[tc][xm]?)(\?.*)?$/)) {
        navigator.msLaunchUri("ms-word:" + cmd + url, null, function() {
          window.open(url);
        });
        return;
      }
      else if (cmd && url.match(/(xl[stm][xm]?)(\?.*)?$/)) {
        navigator.msLaunchUri("ms-excel:" + cmd + url, null, function() {
          window.open(url);
        });
        return;
      }
      else if (cmd && url.match(/(p[op][ts][xm]?)(\?.*)?$/)) {
        navigator.msLaunchUri("ms-powerpoint:" + cmd + url, null, function() {
          window.open(url);
        });
        return;
      }
    }
    window.open(url);    
  }

  API.search.on("loadoutput", function(model, atts, options) {
    if ( (atts && atts.resultset && atts.resultset.results) || (atts && atts.results) ) {
      _.each( (atts.resultset && atts.resultset.results) || atts.results, function(result) {

        if (result.properties.actions && result.properties.actions.properties) {

          _.each(result.properties.actions.properties, function (prop) { 
            if (prop.id == "Open") {

              var isMicrosoftSharePointDocument = _.find(prop.data && prop.data[0] && prop.data[0].value && prop.data[0].value.properties, function (propAction) { 
                return propAction.key === "category" && propAction.value === "Microsoft-SharePoint" 
              });

              if (isMicrosoftSharePointDocument) {
                var properties = prop.data[0];
                var url = properties.value["href"] && properties.value["href"].replace(/ /g,"%20");
                if (url.indexOf("javascript:window.SharePointOfficeLaunchURL") < 0) {
                  var actionObject = _.find(properties.value.properties, function (el) { return el.key === "action" });
                  var action = actionObject && actionObject.value;

                  var sharePointOfficeLaunchLink = "javascript:window.SharePointOfficeLaunchURL('" + action + "','" + url + "')";
                  var fullSharePointOfficeLaunchLink = "<a href=" + sharePointOfficeLaunchLink + ">" + prop.name + "</a>";

                  prop.data[0].html = fullSharePointOfficeLaunchLink;
                  prop.data[0].value.href = sharePointOfficeLaunchLink;
                }
              }

            }
          });

        }

      });
    }
  });

});
