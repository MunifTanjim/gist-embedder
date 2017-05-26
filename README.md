# Gist Embedder

Library for Embedding GitHub Gist.

## Installation

**Using npm**

```sh
$ npm install gist-embedder
```

**Using CDN**

```html
<script src="https://unpkg.com/gist-embedder/dist/gist-embedder.min.js">
</script>
```

## Usage

Initialize Gist Embedder with the following script:

```javascript
var gistEmbedder = new GistEmbedder()
gistEmbedder.embedAll()
```

Now, you can embed gists by their ID:

```html
<code data-gist-id='<ID>'></code>
```

You can also supply additional options as data attributes (starting with `data-gist-`).

### Available Options

_**[Live Demo](https://muniftanjim.github.io/gist-embedder)**_

##### data-gist-id
_(required)_

ID of the Gist. Example: `9a6413b3ba584ae68330856ed19888cd`

##### data-gist-file
_(optional)_

Filename to embed from multi-file gist. Example: `main.js`

##### data-gist-lines
_(optional)_

Lines to display. Example: `1-5,7,9-13`

##### data-gist-highlight
_(optional)_

Lines to highlight. Example: `2-5,9-12`

##### data-gist-no-footer
_(optional)_

Hide the footer. Example: `true`

##### data-gist-no-gutter
_(optional)_

Hide the gutter (line numbers. Example: `true`

## License

Gist Embedder is licensed under the MIT License. Check the [LICENSE](https://github.com/MunifTanjim/gist-embedder/blob/master/LICENSE) file for details.
