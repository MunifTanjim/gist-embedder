'use strict'

const jsonp = require('jsonp-promise')

const getLineNumbers = lineRange => {
  let lineNumbers = []

  if (!lineRange) return lineNumbers

  let lineNumberBlocks = String(lineRange).split(',')

  lineNumberBlocks.forEach(lineNumberBlock => {
    let range = lineNumberBlock.split('-').map(i => parseInt(i, 10))

    if (range.length === 2)
      for (let i = range[0]; i <= range[1]; i++)
        lineNumbers.push(i)
    else lineNumbers.push(range[0])
  })

  return lineNumbers
}

const processGistNode = (node, options) => {
  let { file, highlight, lines, noFooter, noGutter } = options
  let gistHighlightColor = 'rgb(248, 238, 199)'

  let gistFiles = Array.from(node.querySelectorAll('.gist-file'))

  if (file) {
    gistFiles.forEach((gistFile, index, fileArr) => {
      let filename = gistFile.querySelector('.gist-meta a:nth-child(2)')
        .innerHTML

      if (filename !== file) {
        gistFile.parentNode.removeChild(gistFile)
        fileArr.splice(index, 1)
      }
    })
  }

  if (highlight) {
    let highlightLineNumbers = getLineNumbers(highlight)

    node.querySelectorAll('.js-file-line-container').forEach(container => {
      container.style.width = '100%'
    })

    gistFiles.forEach(gistFile => {
      gistFile.querySelectorAll('.blob-code').forEach((line, number) => {
        if (highlightLineNumbers.indexOf(number + 1) !== -1) {
          line.style.backgroundColor = gistHighlightColor
        }
      })
    })
  }

  if (lines) {
    let lineNumbers = getLineNumbers(lines)

    gistFiles.forEach(gistFile => {
      gistFile.querySelectorAll('.blob-num').forEach((gutter, number) => {
        if (lineNumbers.indexOf(number + 1) === -1) {
          let line = gutter.parentNode
          line.parentNode.removeChild(line)
        }
      })
    })
  }

  if (noFooter) {
    gistFiles.forEach(gistFile => {
      gistFile.style.borderBottomColor = '#ddd'
      gistFile.querySelector('.gist-data').style.borderBottom = 'none'

      let footer = gistFile.querySelector('.gist-meta')
      footer.parentNode.removeChild(footer)
    })
  }

  if (noGutter) {
    node.querySelectorAll('.blob-num').forEach(gutter => {
      gutter.parentNode.removeChild(gutter)
    })
  }

  return node
}

const createGistNode = htmlString => {
  let node = document.createElement('div')
  node.innerHTML = htmlString
  return node.firstChild
}

const includeStylesheet = stylesheetLink => {
  document.getElementsByTagName('head')[0].appendChild(stylesheetLink)
}

const createStylesheetLink = stylesheet => {
  let stylesheetLink = document.createElement('link')
  stylesheetLink.type = 'text/css'
  stylesheetLink.href = stylesheet
  stylesheetLink.rel = 'stylesheet'
  return stylesheetLink
}

const stylesheetIncluded = stylesheet =>
  Boolean(document.querySelector(`link[href='${stylesheet}']`))

const createSpinner = alt => {
  let spinner = document.createElement('img')
  spinner.src =
    'https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif'
  spinner.style = 'display: block; margin: auto;'
  spinner.alt = alt
  return spinner
}

const parseData = jsonData => ({
  stylesheet: jsonData.stylesheet,
  gistNode: createGistNode(jsonData.div)
})

const getProperties = block => {
  let {
    gistId,
    gistFile,
    gistHighlight,
    gistLines,
    gistNoFooter,
    gistNoGutter
  } = block.dataset

  return {
    id: gistId,
    options: {
      file: gistFile,
      highlight: gistHighlight,
      lines: gistLines,
      noFooter: gistNoFooter,
      noGutter: gistNoGutter
    }
  }
}

class GistEmbedder {
  constructor() {
    this.cacheStorage = {}
  }

  embedAll() {
    let gistBlocks = document.querySelectorAll('[data-gist-id]')
    gistBlocks.forEach(gistBlock => this.embed(gistBlock))
  }

  embed(gistBlock) {
    let { id, options } = getProperties(gistBlock)
    let url = `https://gist.github.com/${id}.json`

    let loadingIndicator = createSpinner(`Loading Gist: ${url}`)
    gistBlock.appendChild(loadingIndicator)

    let jsonDataPromise = getData.call(this, url)

    jsonDataPromise
      .then(parseData)
      .then(data => {
        if (!stylesheetIncluded(data.stylesheet))
          includeStylesheet(createStylesheetLink(data.stylesheet))

        gistBlock.replaceChild(
          processGistNode(data.gistNode, options),
          loadingIndicator
        )
      })
      .catch(error => {
        console.error(error)

        let message = document.createElement('p')
        message.style.textAlign = 'center'
        message.innerHTML = `Error loading Gist!`
        gistBlock.replaceChild(message, loadingIndicator)
      })
  }
}

function getData(url) {
  let jsonDataPromise =
    this.cacheStorage[url] ||
    jsonp(url, {
      prefix: '__gist'
    }).promise
  this.cacheStorage[url] = jsonDataPromise
  return jsonDataPromise
}

module.exports = GistEmbedder
