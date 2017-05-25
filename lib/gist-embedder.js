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

  let gistFiles = node.querySelectorAll('.gist-file')

  if (file) {
    gistFiles.forEach(gistFile => {
      let filename = gistFile.querySelector('.gist-meta a:nth-child(2)')
        .innerHTML
      if (filename !== file) gistFile.parentNode.removeChild(gistFile)
    })
  }

  if (highlight) {
    let highlightLineNumbers = getLineNumbers(highlight)

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

const includeStylesheet = stylesheetLink => {
  document.getElementsByTagName('head')[0].appendChild(stylesheetLink)
}

const createStylesheetLink = stylesheet => {
  let styleLink = document.createElement('link')
  styleLink.type = 'text/css'
  styleLink.href = stylesheet
  styleLink.rel = 'stylesheet'
  return styleLink
}

const stylesheetIncluded = stylesheet =>
  Boolean(document.querySelector(`link[href='${stylesheet}']`))

const createGistDiv = htmlString => {
  let div = document.createElement('div')
  div.innerHTML = htmlString
  return div.firstChild
}

const parseGistJSON = gistJSON => {
  let data = {}
  data.stylesheet = gistJSON.stylesheet
  data.gistNode = createGistDiv(gistJSON.div)
  return data
}

const createSpinner = alt => {
  let spinner = document.createElement('img')
  spinner.src =
    'https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif'
  spinner.style = 'display: block; margin: auto;'
  spinner.alt = alt
  return spinner
}

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
  constructor(document) {
    this.document = document
    this.cacheStorage = {}
  }

  init() {
    let gistBlocks = this.document.querySelectorAll('[data-gist-id]')
    gistBlocks.forEach(gistBlock => this.embed(gistBlock))
  }

  embed(gistBlock) {
    let { id, options } = getProperties(gistBlock)
    let url = `https://gist.github.com/${id}.json`

    let loadingIndicator = createSpinner(`Loading Gist: ${url}`)
    gistBlock.appendChild(loadingIndicator)

    let jsonPromise = this.cacheStorage[id] || jsonp(url).promise
    this.cacheStorage[id] = jsonPromise

    jsonPromise
      .then(json => parseGistJSON(json))
      .then(data => {
        if (!stylesheetIncluded(data.stylesheet))
          includeStylesheet(createStylesheetLink(data.stylesheet))

        gistBlock.replaceChild(
          processGistNode(data.gistNode, options),
          loadingIndicator
        )
      })
      .catch(error => {
        let message = document.createElement('p')
        message.innerHTML = `Error loading Gist: ${error.message}!`

        gistBlock.replaceChild(message, loadingIndicator)
      })
  }
}

module.exports = GistEmbedder
