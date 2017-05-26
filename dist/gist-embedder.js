(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["GistEmbedder"] = factory();
	else
		root["GistEmbedder"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var jsonp = __webpack_require__(2);

var getLineNumbers = function getLineNumbers(lineRange) {
  var lineNumbers = [];

  if (!lineRange) return lineNumbers;

  var lineNumberBlocks = String(lineRange).split(',');

  lineNumberBlocks.forEach(function (lineNumberBlock) {
    var range = lineNumberBlock.split('-').map(function (i) {
      return parseInt(i, 10);
    });

    if (range.length === 2) for (var i = range[0]; i <= range[1]; i++) {
      lineNumbers.push(i);
    } else lineNumbers.push(range[0]);
  });

  return lineNumbers;
};

var processGistNode = function processGistNode(node, options) {
  var file = options.file,
      highlight = options.highlight,
      lines = options.lines,
      noFooter = options.noFooter,
      noGutter = options.noGutter;

  var gistHighlightColor = 'rgb(248, 238, 199)';

  var gistFiles = Array.from(node.querySelectorAll('.gist-file'));

  if (file) {
    gistFiles.forEach(function (gistFile, index, fileArr) {
      var filename = gistFile.querySelector('.gist-meta a:nth-child(2)').innerHTML;

      if (filename !== file) {
        gistFile.parentNode.removeChild(gistFile);
        fileArr.splice(index, 1);
      }
    });
  }

  if (highlight) {
    var highlightLineNumbers = getLineNumbers(highlight);

    node.querySelectorAll('.js-file-line-container').forEach(function (container) {
      container.style.width = '100%';
    });

    gistFiles.forEach(function (gistFile) {
      gistFile.querySelectorAll('.blob-code').forEach(function (line, number) {
        if (highlightLineNumbers.indexOf(number + 1) !== -1) {
          line.style.backgroundColor = gistHighlightColor;
        }
      });
    });
  }

  if (lines) {
    var lineNumbers = getLineNumbers(lines);

    gistFiles.forEach(function (gistFile) {
      gistFile.querySelectorAll('.blob-num').forEach(function (gutter, number) {
        if (lineNumbers.indexOf(number + 1) === -1) {
          var line = gutter.parentNode;
          line.parentNode.removeChild(line);
        }
      });
    });
  }

  if (noFooter) {
    gistFiles.forEach(function (gistFile) {
      gistFile.style.borderBottomColor = '#ddd';
      gistFile.querySelector('.gist-data').style.borderBottom = 'none';

      var footer = gistFile.querySelector('.gist-meta');
      footer.parentNode.removeChild(footer);
    });
  }

  if (noGutter) {
    node.querySelectorAll('.blob-num').forEach(function (gutter) {
      gutter.parentNode.removeChild(gutter);
    });
  }

  return node;
};

var createGistNode = function createGistNode(htmlString) {
  var node = document.createElement('div');
  node.innerHTML = htmlString;
  return node.firstChild;
};

var includeStylesheet = function includeStylesheet(stylesheetLink) {
  document.getElementsByTagName('head')[0].appendChild(stylesheetLink);
};

var createStylesheetLink = function createStylesheetLink(stylesheet) {
  var stylesheetLink = document.createElement('link');
  stylesheetLink.type = 'text/css';
  stylesheetLink.href = stylesheet;
  stylesheetLink.rel = 'stylesheet';
  return stylesheetLink;
};

var stylesheetIncluded = function stylesheetIncluded(stylesheet) {
  return Boolean(document.querySelector('link[href=\'' + stylesheet + '\']'));
};

var createSpinner = function createSpinner(alt) {
  var spinner = document.createElement('img');
  spinner.src = 'https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif';
  spinner.style = 'display: block; margin: auto;';
  spinner.alt = alt;
  return spinner;
};

var parseData = function parseData(jsonData) {
  return {
    stylesheet: jsonData.stylesheet,
    gistNode: createGistNode(jsonData.div)
  };
};

var getProperties = function getProperties(block) {
  var _block$dataset = block.dataset,
      gistId = _block$dataset.gistId,
      gistFile = _block$dataset.gistFile,
      gistHighlight = _block$dataset.gistHighlight,
      gistLines = _block$dataset.gistLines,
      gistNoFooter = _block$dataset.gistNoFooter,
      gistNoGutter = _block$dataset.gistNoGutter;


  return {
    id: gistId,
    options: {
      file: gistFile,
      highlight: gistHighlight,
      lines: gistLines,
      noFooter: gistNoFooter,
      noGutter: gistNoGutter
    }
  };
};

var GistEmbedder = function () {
  function GistEmbedder() {
    _classCallCheck(this, GistEmbedder);

    this.cacheStorage = {};
  }

  _createClass(GistEmbedder, [{
    key: 'embedAll',
    value: function embedAll() {
      var _this = this;

      var gistBlocks = document.querySelectorAll('[data-gist-id]');
      gistBlocks.forEach(function (gistBlock) {
        return _this.embed(gistBlock);
      });
    }
  }, {
    key: 'embed',
    value: function embed(gistBlock) {
      var _getProperties = getProperties(gistBlock),
          id = _getProperties.id,
          options = _getProperties.options;

      var url = 'https://gist.github.com/' + id + '.json';

      var loadingIndicator = createSpinner('Loading Gist: ' + url);
      gistBlock.appendChild(loadingIndicator);

      var jsonDataPromise = getData.call(this, url);

      jsonDataPromise.then(parseData).then(function (data) {
        if (!stylesheetIncluded(data.stylesheet)) includeStylesheet(createStylesheetLink(data.stylesheet));

        gistBlock.replaceChild(processGistNode(data.gistNode, options), loadingIndicator);
      }).catch(function (error) {
        console.error(error);

        var message = document.createElement('p');
        message.style.textAlign = 'center';
        message.innerHTML = 'Error loading Gist!';
        gistBlock.replaceChild(message, loadingIndicator);
      });
    }
  }]);

  return GistEmbedder;
}();

function getData(url) {
  var jsonDataPromise = this.cacheStorage[url] || jsonp(url, {
    prefix: '__gist'
  }).promise;
  this.cacheStorage[url] = jsonDataPromise;
  return jsonDataPromise;
}

module.exports = GistEmbedder;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(0);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * MIT license
 */

// Callback index.
var count = 0;

/**
 * JSONP handler
 *
 * Options:
 * - prefix {String} callback prefix (defaults to `__jp`)
 * - param {String} qs parameter (defaults to `callback`)
 * - timeout {Number} how long after the request until a timeout error
 *   is emitted (defaults to `15000`)
 *
 * @param {String} url
 * @param {Object} options optional options
 * @return {Object} Returns a response promise and a cancel handler.
 */
var jsonp = function(url, options) {
    options = options || {};

    var prefix = options.prefix || '__jp';
    var param = options.param || 'callback';
    var timeout = options.timeout ? options.timeout : 15000;
    var target = document.getElementsByTagName('script')[0] || document.head;
    var script;
    var timer;
    var cleanup;
    var cancel;
    var promise;
    var noop = function() {};

    // Generate a unique id for the request.
    var id = prefix + (count++);

    cleanup = function() {
        // Remove the script tag.
        if (script && script.parentNode) {
            script.parentNode.removeChild(script);
        }

        window[id] = noop;

        if (timer) {
            clearTimeout(timer);
        }
    };

    promise = new Promise(function(resolve, reject) {
        if (timeout) {
            timer = setTimeout(function() {
                cleanup();
                reject(new Error('Timeout'));
            }, timeout);
        }

        window[id] = function(data) {
            cleanup();
            resolve(data);
        };

        // Add querystring component
        url += (~url.indexOf('?') ? '&' : '?') + param + '=' + encodeURIComponent(id);
        url = url.replace('?&', '?');

        // Create script.
        script = document.createElement('script');
        script.src = url;
        target.parentNode.insertBefore(script, target);

        cancel = function() {
            if (window[id]) {
                cleanup();
                reject(new Error('Canceled'));
            }
        };

    });

    return {
        promise: promise,
        cancel: cancel
    };
};

module.exports = jsonp;



/***/ })
/******/ ]);
});