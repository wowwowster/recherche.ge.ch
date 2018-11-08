/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Developped by Fabien Flament (fabien.flament@sword-group.com)
 * Sword Group - Sword Connect, 2018
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Project     : GSA replacement at Genève - Mindbreeze
 * File        : mindbreeze.js
 * Created date: 9 aug. 2018
 * Description : Mindbreeze search application initialization
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */


const API_URL = "https://gspmsa1.parisgsa.lan/api/v2/";
const SERVER_URL = "https://gspmsa1.parisgsa.lan/"
//const API_URL = "https://rechercherec.ge.ch/api/v2/";
const NUMBER_MAX_OF_MONTH_FOR_NEWS = 6;
const NUMBER_MIN_BEFORE_ALTERNATIVE_QUERY = 3;
const FACTOR_FOR_EXPAND_SEARCH = "^0.2";
const OR_OPERATOR = " OR ";
const QUERY_URL_PARAMETER = "query";

var mainSearchWidget = {},
  newsSearchWidget = {},
  suggestListWidgetYouCanTry = {},
  suggestListWidgetAssociatedSearch = {},
  actualitesCanBeDisplayed = false,
  alternativeQueryCanBeDisplayed = false,
  alternativeQueryOnFirstSearch = {},
  bestBetsFound = false,
  application = {},
  initialSessionSearchQuery = "",
  expandSessionSearchQuery = "";

Mindbreeze.require(["client/application", "api/v2/api", "underscore", "service/ajax_channel"],
  function(Application, API, _, AjaxChannel) {

    application = new Application({
      rootEls: [document.getElementById("searchresults"), document.getElementById("suggestListWidgetYouCanTry")],
      startSearch: false, // search be started during initialization if constraints are defined
      updateTitle: false, // as startSearch
      linkOpenTarget: "", // default target option to open links.
      queryURLParameter: QUERY_URL_PARAMETER,
      sources: new AjaxChannel({ // list of search addresses
        url: API_URL
      }),
      callback: function(application) { // function that is called after the initialization of the application. Receives the application object as an argument.

        // escapes html before starting the search and save the query for the session
        // the input hidden is automatically filled after application initialization
        initialSessionSearchQuery = getSearchQueryEscapedFromInputHidden();
        setSearchQueryInInputDisplayed(initialSessionSearchQuery);

        // needs to expand the search if there is more than 1 word to search
        if ((initialSessionSearchQuery.split(" ").length - 1) > 0) {
          expandSessionSearchQuery = expandSearchForMoreResults(initialSessionSearchQuery);
          application.setUnparsedUserQuery(expandSessionSearchQuery);
        } else {
          application.setUnparsedUserQuery(initialSessionSearchQuery);
        }

        // gets the models
        var models = application.models;

        // gets search_view objects from models
        var searchViews = {};
        for (var key in models) {
          if (models.hasOwnProperty(key)) {
            if (key.indexOf("_view") != -1) {
              searchViews[key] = models[key];
            }
          }
        }

        // looking for the main search and the news search
        for (var key in searchViews) {
          if (searchViews.hasOwnProperty(key)) {
            if (models[key].input.get().name.indexOf("main") != -1) {
              mainSearchWidget = models[key];
            } else if (models[key].input.get().name.indexOf("news") != -1) {
              newsSearchWidget = models[key];
            }
          }
        }
        if (mainSearchWidget) {
          // sets the number of results we want to display
          mainSearchWidget.input.attributes.max_page_count = 1; // this value allows to fix the bug of the number of results with the pagination "Back" and "Next"

          // sets the lenght of the snippet content
          mainSearchWidget.input.attributes.content_sample_length = 200;
        }

        if (newsSearchWidget) {
          // sets the order by for the newsSearchWidget
          newsSearchWidget.input.attributes.orderby = "date";
        }

        // gets results from search and adaptation
        API.search.on("loadoutput", function(model, atts, options) {

          // fix the pagination widget problem
          setTimeout(Util.paginationHack, 50);

          // change the title of the page with the searchQuery
          Util.changeTitle(Util.getParamFromUrl(QUERY_URL_PARAMETER));

          if (atts && atts.name && atts.name.indexOf("best") != -1) {
            if (atts.estimated_count > 0) {
              bestBetsFound = true;
            }
          }

          if (atts && atts.name && atts.name.indexOf("main") != -1) {

            // displays the nav bar collections
            document.getElementById("collections").style.display = "";

            // fix the message no result found even if we have bestbets displayed
            atts["bestbets_found"] = bestBetsFound;

            // Displays the alternative query
            if (atts.estimated_count <= NUMBER_MIN_BEFORE_ALTERNATIVE_QUERY) {
              alternativeQueryCanBeDisplayed = true;

              // allows to save the alternative query at the first search to display it when we change the filter
              if (atts.alternatives && atts.alternatives.query_spelling) {

                // removes terms after OR operator
                if (atts.alternatives.query_spelling.entries[0] && atts.alternatives.query_spelling.entries[0].query_expr.unparsed.indexOf(OR_OPERATOR) != -1) {
                  atts.alternatives.query_spelling.entries[0].query_expr.unparsed = atts.alternatives.query_spelling.entries[0].query_expr.unparsed.split(OR_OPERATOR)[0];
                  atts.alternatives.query_spelling.entries[0].html = atts.alternatives.query_spelling.entries[0].html.split(OR_OPERATOR)[0];
                }

                //saves the alternative request
                if (Util.objectIsEmpty(alternativeQueryOnFirstSearch)) {
                  alternativeQueryOnFirstSearch = atts.alternatives.query_spelling;
                }
              }

              //sets the alternative query when the user change the filter
              if (atts.alternatives && !atts.alternatives.query_spelling && !Util.objectIsEmpty(alternativeQueryOnFirstSearch)) {
                atts.alternatives["query_spelling"] = alternativeQueryOnFirstSearch;
              }

            }
            atts["alternative_query_can_be_displayed"] = alternativeQueryCanBeDisplayed;


            // fix the problem of the display of the no result at the first search
            if (atts.estimated_count == 0) {
              atts["no_result_for_value"] = getSearchQueryFromInputDisplayed();
            } else {

              // fills the "Vous pouvez aussi essayer" block
              var divContentYouCanTry = document.getElementById('suggestListWidgetYouCanTry');
              if (divContentYouCanTry && divContentYouCanTry.children[0] && divContentYouCanTry.children[0].children[1] && divContentYouCanTry.children[0].children[1].textContent) {
                // copy the GSA's operation
                var youCanTryQuery = divContentYouCanTry.children[0].children[1].textContent.split('(').pop().split(')')[0];
                if (youCanTryQuery != initialSessionSearchQuery) {
                  divContentYouCanTry.children[0].children[1].innerHTML = "<p><a href=\"#\" data-action=\"searchWithParam(\'" + youCanTryQuery + "\')\">" + youCanTryQuery + "</a></p>";
                  var divToFillYouCanTry = document.getElementById('content_suggestListWidgetYouCanTry');
                  if (divContentYouCanTry && divToFillYouCanTry) {
                    divToFillYouCanTry.innerHTML = divContentYouCanTry.innerHTML;
                  }
                }
              }

              // fills the "Recherche Associée" block
              var divContentAssociated = document.getElementById('suggestListWidget');
              var divToFillAssociated = document.getElementById('content_suggestListWidget');
              var modifiedAssociatedContent = "";
              if (divContentAssociated && divToFillAssociated) {
                if (divContentAssociated.children.length > 0) {

                  // changes the title of the widget by adding the user's query
                  if (divContentAssociated && divContentAssociated.children[0] && divContentAssociated.children[0].children[0] && divContentAssociated.children[0].children[0].innerText) {
                    divContentAssociated.children[0].children[0].innerText = divContentAssociated.dataset.title + initialSessionSearchQuery;
                  }

                  // gets all associated query elements from the content returns by the api.suggest
                  var associatedQuery = [];
                  var elementsToParse = [];
                  if (divContentAssociated && divContentAssociated.children[0] && divContentAssociated.children[0].children[1] && divContentAssociated.children[0].children[1].children) {

                    elementsToParse = divContentAssociated.children[0].children[1].children;

                    if (elementsToParse.length > 0) {
                      var elementToPush = "";
                      for (var i = 0; i < elementsToParse.length; i++) {

                        //gets the string before the OR operator
                        if (elementsToParse[i].innerText.indexOf(OR_OPERATOR) != -1) {
                          elementToPush = elementsToParse[i].innerText.split(OR_OPERATOR)[0];
                        } else {
                          elementToPush = elementsToParse[i].innerText;
                        }

                        //avoid to propose the same query
                        if (elementToPush.toLowerCase() != initialSessionSearchQuery.toLowerCase()) {
                          associatedQuery.push(elementToPush);
                        }
                      }

                      if (associatedQuery.length > 0) {
                        for (var i = 0; i < associatedQuery.length; i++) {
                          modifiedAssociatedContent = modifiedAssociatedContent + "<p><a href=\"#\" data-action=\"searchWithParam(\'" + associatedQuery[i] + "\')\">" + associatedQuery[i] + "</a></p>";
                        }
                      } else {
                        modifiedAssociatedContent = "Aucune recherche associée pour votre recherche.";
                      }
                      divContentAssociated.children[0].children[1].innerHTML = modifiedAssociatedContent;
                    }
                  }
                } else {
                  //if the content does not exist, the widget is not loaded so we need to display it manually
                  divContentAssociated.innerHTML = "<div class=\"suggestListElement\"><h3 class=\"suggestListTitle\">Recherches associées à " + initialSessionSearchQuery + "</h3><ul class=\"nav nav-stacked nav-pills\">Aucune recherche associée pour votre recherche.</ul></div>";
                }
                divToFillAssociated.innerHTML = divContentAssociated.innerHTML;
              }
            }

          } else if (atts && atts.name && atts.name.indexOf("news") != -1) {

            // Displays the actualites panel
            if (atts.estimated_count > 0) {
              _.each(atts.resultset && atts.resultset.results, displayNews);
              atts["actualites_can_be_displayed"] = actualitesCanBeDisplayed;
            }

          }
        });

        // allow to compare the date of the news with the expiry date and to display or not this one
        function displayNews(result) {

          var property = result && result.properties && result.properties["date"];
          var propertyValue = property.data[0].value;

          var dateFromProperty = new Date(propertyValue.substring(0, 4), propertyValue.substring(5, 7), propertyValue.substring(8, 10));

          var today = Util.getDateOfToday();
          today = new Date(today.substring(0, 4), today.substring(5, 7), today.substring(8, 10));

          if (Util.monthDiff(dateFromProperty, today) <= NUMBER_MAX_OF_MONTH_FOR_NEWS) {

            // found one actualites which can be displayed
            actualitesCanBeDisplayed = true;

            articleDateFormatting(property);
            result.properties["display_news"] = {
              id: "display_news",
              name: "Display News",
              data: [{
                value: true
              }]
            };

          } else {
            result.properties["display_news"] = {
              id: "display_news",
              name: "Display News",
              data: [{
                value: false
              }]
            };
          }
        }

        // changes the date into french date

        function articleDateFormatting(property) {

          property.data = _.map(property.data, function(dateToFormat) {
            return {
              value: Util.dateInFrench(dateToFormat.value)
            };
          });
        }
      }

    });
  });

// sets the constraint for the research
function activeCollection(theCollection) {

  // list of constraints
  var myCollection = {};

  // used to know if the orderby date needs to be set (Actualités filter)
  var orderByDate = false;

  // SETS THE ACTIVE CLASS

  // gets all li elements with the specified class name
  var liElements = document.getElementsByClassName("li-filter");

  // removes the active class of the previous li element
  for (var i = 0; i < liElements.length; i++) {
    if (liElements[i].classList.contains("active")) {
      liElements[i].classList.remove("active");
      liElements[i].children[0].disabled = false;
    }
  }

  // adds the active class and disabled the button to avoid a search on the same filter
  document.getElementById(theCollection).parentElement.classList.add("active");
  document.getElementById(theCollection).disabled = true;

  // ADDS THE DATA CONSTRAINT TO THE QUERY
  if (theCollection == "aVotreService") {
    myCollection = {
      unparsed: 'ge_content_type:prestation'
    };

  } else if (theCollection == "actualites") {
    myCollection = {
      unparsed: 'ge_content_type:actualite OR ge_content_type:point_presse OR ge_content_type:communique_presse OR ge_content_type:evenement'
    };
    orderByDate = true;

  } else if (theCollection == "publications") {
    myCollection = {
      unparsed: 'ge_content_type:publications'
    };

  } else if (theCollection == "dossiers") {
    myCollection = {
      unparsed: 'ge_content_type:dossiers OR ge_content_type:dossier'
    };

  } else if (theCollection == "departements") {
    myCollection = {
      unparsed: 'ge_content_type:departements'
    };

  } else {
    myCollection = {
      unparsed: 'ALL'
    };

  }

  // sets the order by for the mainSearchWidget
  orderByDate ? mainSearchWidget.input.attributes.orderby = "date" : mainSearchWidget.input.attributes.orderby = "mes:relevance";

  //displays the initial query if user change the query before clicking on filter
  setSearchQueryInInputDisplayed(initialSessionSearchQuery);

  // sets the constraint by for the mainSearchWidget and post the request
  mainSearchWidget.set("constraint", myCollection);

}

// executes the search on form submit
function search() {
  window.location.href = "?" + QUERY_URL_PARAMETER + "=" + getSearchQueryFromInputDisplayed();
}

// executes the search on form submit
function searchWithParam(param) {
  window.location.href = "?" + QUERY_URL_PARAMETER + "=" + param;
}

function getSearchQueryFromInputHidden() {
  return document.getElementById("query-hidden").value;
}

function getSearchQueryEscapedFromInputHidden() {
  return Util.escapeHtml(document.getElementById("query-hidden").value);
}

function setSearchQueryInInputHidden(param) {
  document.getElementById("query-hidden").value = param;
}

function getSearchQueryFromInputDisplayed() {
  return document.getElementById("srch-term").value;
}

function setSearchQueryInInputDisplayed(param) {
  document.getElementById("srch-term").value = param;
}

function getSearchQueryFromUrl() {
  return Util.getParamFromUrl(QUERY_URL_PARAMETER);
}

function expandSearchForMoreResults(query) {
  var queryOrOperator = query.replace(/\s/g, FACTOR_FOR_EXPAND_SEARCH + OR_OPERATOR) + FACTOR_FOR_EXPAND_SEARCH;
  return query + OR_OPERATOR + "(" + queryOrOperator + ")";
}
