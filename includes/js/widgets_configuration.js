//Suggest widget
const SUGGEST_DATA_COUNT = "";
const SUGGEST_DATA_PROPERTY = "";
const SUGGEST_DATA_GROUPED = "false";
const SUGGEST_DATA_SOURCE_ID_PATTERN = "words_and_terms|document_property";
const SUGGEST_DATA_INITIAL_SOURCE_ID_PATTERN = "";

var suggestWidget = document.getElementById('srch-term');
if (suggestWidget) {
  suggestWidget.dataset.count = SUGGEST_DATA_COUNT;
  suggestWidget.dataset.property = SUGGEST_DATA_PROPERTY;
  suggestWidget.dataset.grouped = SUGGEST_DATA_GROUPED;
  suggestWidget.dataset.sourceIdPattern = SUGGEST_DATA_SOURCE_ID_PATTERN;
  suggestWidget.dataset.initialSourceIdPattern = SUGGEST_DATA_INITIAL_SOURCE_ID_PATTERN;
}

//Search widget : main
const SEARCH_MAIN_DATA_NAME = "mainSearchWidget";
const SEARCH_MAIN_DATA_ENABLED_VIEWS = "Everything";
const SEARCH_MAIN_DATA_TEMPLATE_REFID = "main-results";
const SEARCH_MAIN_DATA_PROPAGATE_TO_PARENT = "false";
const SEARCH_MAIN_DATA_REQUIRES_USER_INPUT = "false";
const SEARCH_MAIN_DATA_COUNT = "10";
const SEARCH_MAIN_DATA_CONSTRAINT = 'ALL NOT (fqcategory:"BestBets:bestbets")';

var mainSearchWidget = document.getElementById('mainSearchWidget');
if (mainSearchWidget) {
  mainSearchWidget.dataset.name = SEARCH_MAIN_DATA_NAME;
  mainSearchWidget.dataset.enabledViews = SEARCH_MAIN_DATA_ENABLED_VIEWS;
  mainSearchWidget.dataset.templateRefid = SEARCH_MAIN_DATA_TEMPLATE_REFID;
  mainSearchWidget.dataset.propagateToParent = SEARCH_MAIN_DATA_PROPAGATE_TO_PARENT;
  mainSearchWidget.dataset.requiresUserInput = SEARCH_MAIN_DATA_REQUIRES_USER_INPUT;
  mainSearchWidget.dataset.count = SEARCH_MAIN_DATA_COUNT;
  mainSearchWidget.dataset.constraint = SEARCH_MAIN_DATA_CONSTRAINT;
}

//Search widget : news
const SEARCH_NEWS_DATA_NAME = "newsSearchWidget";
const SEARCH_NEWS_DATA_ENABLED_VIEWS = "Everything";
const SEARCH_NEWS_DATA_TEMPLATE_REFID = "news";
const SEARCH_NEWS_DATA_PROPAGATE_TO_PARENT = "false";
const SEARCH_NEWS_DATA_REQUIRES_USER_INPUT = "false";
const SEARCH_NEWS_DATA_COUNT = "3";
const SEARCH_NEWS_DATA_CONSTRAINT = "ge_content_type:actualite OR ge_content_type:point_presse OR ge_content_type:communique_presse OR ge_content_type:evenement";

var newsSearchWidget = document.getElementById('newsSearchWidget');
if (newsSearchWidget) {
  newsSearchWidget.dataset.name = SEARCH_NEWS_DATA_NAME;
  newsSearchWidget.dataset.enabledViews = SEARCH_NEWS_DATA_ENABLED_VIEWS;
  newsSearchWidget.dataset.templateRefid = SEARCH_NEWS_DATA_TEMPLATE_REFID;
  newsSearchWidget.dataset.propagateToParent = SEARCH_NEWS_DATA_PROPAGATE_TO_PARENT;
  newsSearchWidget.dataset.requiresUserInput = SEARCH_NEWS_DATA_REQUIRES_USER_INPUT;
  newsSearchWidget.dataset.count = SEARCH_NEWS_DATA_COUNT;
  newsSearchWidget.dataset.constraint = SEARCH_NEWS_DATA_CONSTRAINT;
}

//BestBets widget
const BESTBETS_DATA_NAME = "bestBetsWidget";
const BESTBETS_DATA_ENABLED_VIEWS = "Everything";
const BESTBETS_DATA_TEMPLATE_REFID = "best-bets";
const BESTBETS_DATA_PROPAGATE_TO_PARENT = "false";
const BESTBETS_DATA_REQUIRES_USER_INPUT = "true";
const BESTBETS_DATA_COUNT = "5";
const BESTBETS_DATA_CONSTRAINT = 'fqcategory:"BestBets:bestbets"';

var bestBetsWidget = document.getElementById('bestBetsWidget');
if (bestBetsWidget) {
  bestBetsWidget.dataset.name = BESTBETS_DATA_NAME;
  bestBetsWidget.dataset.enabledViews = BESTBETS_DATA_ENABLED_VIEWS;
  bestBetsWidget.dataset.templateRefid = BESTBETS_DATA_TEMPLATE_REFID;
  bestBetsWidget.dataset.propagateToParent = BESTBETS_DATA_PROPAGATE_TO_PARENT;
  bestBetsWidget.dataset.requiresUserInput = BESTBETS_DATA_REQUIRES_USER_INPUT;
  bestBetsWidget.dataset.count = BESTBETS_DATA_COUNT;
  bestBetsWidget.dataset.constraint = BESTBETS_DATA_CONSTRAINT;
}

//Suggest List widget: Vous pouvez aussi essayer
const SUGGEST_LIST_TRY_DATA_NAME = "suggestListWidgetYouCanTry";
const SUGGEST_LIST_TRY_DATA_SOURCE_ID_PATTERN = "words_and_terms";
const SUGGEST_LIST_TRY_DATA_PROPERTY = "title";
const SUGGEST_LIST_TRY_DATA_COUNT = "1";
const SUGGEST_LIST_TRY_DATA_TITLE = "Vous pouvez aussi essayer : &nbsp";

var suggestListWidgetYouCanTry = document.getElementById('suggestListWidgetYouCanTry');
if (suggestListWidgetYouCanTry) {
  suggestListWidgetYouCanTry.dataset.name = SUGGEST_LIST_TRY_DATA_NAME;
  suggestListWidgetYouCanTry.dataset.sourceIdPattern = SUGGEST_LIST_TRY_DATA_SOURCE_ID_PATTERN;
  suggestListWidgetYouCanTry.dataset.property = SUGGEST_LIST_TRY_DATA_PROPERTY;
  suggestListWidgetYouCanTry.dataset.count = SUGGEST_LIST_TRY_DATA_COUNT;
  suggestListWidgetYouCanTry.dataset.title = SUGGEST_LIST_TRY_DATA_TITLE;
}

//Suggest List widget: Recherches associées
const SUGGEST_LIST_DATA_NAME = "suggestListWidget";
const SUGGEST_LIST_DATA_SOURCE_ID_PATTERN = "popularsearches";
const SUGGEST_LIST_DATA_SOURCE = "DOCUMENT_PROPERTY TABS RECENT_QUERY EXTERNAL CONCEPT"
const SUGGEST_LIST_DATA_PROPERTY = "title";
const SUGGEST_LIST_DATA_COUNT = "5";
const SUGGEST_LIST_DATA_TITLE = "Recherches associées à ";

var suggestListWidget = document.getElementById('suggestListWidget');
if (suggestListWidget) {
  suggestListWidget.dataset.name = SUGGEST_LIST_DATA_NAME;
  suggestListWidget.dataset.sourceIdPattern = SUGGEST_LIST_DATA_SOURCE_ID_PATTERN;
  suggestListWidget.dataset.source = SUGGEST_LIST_DATA_SOURCE_ID_PATTERN;
  suggestListWidget.dataset.property = SUGGEST_LIST_DATA_PROPERTY;
  suggestListWidget.dataset.count = SUGGEST_LIST_DATA_COUNT;
  suggestListWidget.dataset.title = SUGGEST_LIST_DATA_TITLE;
}

//Pages widget
const PAGES_DATA_MAX_PAGE_COUNT = "50";

var pagesWidget = document.getElementById('bottom-navigation');
if (pagesWidget) {
  pagesWidget.dataset.maxPageCount = PAGES_DATA_MAX_PAGE_COUNT;
}
