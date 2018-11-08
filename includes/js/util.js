/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Developped by Fabien Flament (fabien.flament@sword-group.com)
 * Sword Group - Sword Connect, 2018
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Project     : GSA replacement at Genève - Mindbreeze
 * File        : util.js
 * Created date: 9 aug. 2018
 * Description : Common utility functions
 * Sources     :  - https://recherche.ge.ch
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

const TITLE_PREFIX = "Résultats de recherche: ";

function Util() {}

// transforms the date into french date format

Util.dateInFrench = function(date) {
  var y = date.substring(0, 4);
  var m = date.substring(5, 7);
  var d = date.substring(8, 10);
  var M = ['', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return d + ' ' + M[parseInt(m)] + ' ' + y;
};


Util.monthDiff = function(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

Util.getDateOfToday = function() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  return today = yyyy + "-" + mm + "-" + dd;

}

//allows to fix the problem of pagination of Mindbreeze
Util.paginationHack = function() {
  $(function() {
    var radius = 4;

    var $pages = $(".pagination ul >li:not(:first-child):not(:last-child)");

    var $activePage = $pages.filter(".active");

    var indexOfActive = $pages.index($activePage);

    var indexOfFirst = indexOfActive - radius

    var indexOfLast = indexOfActive + radius;

    $pages.each(function(i, value) {
      if (i < indexOfFirst || i > indexOfLast) {
        $(value).hide();
      }
    });
    window.scrollTo(0, 0);

  });
}

Util.changeTitle = function(newTitle) {
  $(function() {
    document.title = TITLE_PREFIX + newTitle;
  });
}

Util.escapeHtml = function(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  };

  return text.replace(/[&<>]/g, function(m) { return map[m]; });
}


Util.getParamFromUrl = function(searchParam) {
  var url = new URL(window.location.href);
  var paramValue = url.searchParams.get(searchParam);
  if (paramValue) {
    return paramValue;
  }
  return "";
}

Util.objectIsEmpty = function(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
