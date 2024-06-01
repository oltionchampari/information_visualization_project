---
theme: dashboard
toc: false
---
<link href="https://unpkg.com/lineupjs/build/LineUpJS.css" rel="stylesheet" />

<style>

::-webkit-scrollbar {
  width: 10px;
  height:10px
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #b0b0b0; 
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0; 
}

#observablehq-center {
  height: 100vh;
  background: white;
    margin: 0;
}

#observablehq-main {
  background: white;
  margin: 0;
}

#content {
  padding:1rem
}

footer {
  display: none!important;
}

#content.lu{
  font-size: 14px
}


</style>


```js
import {Runtime, Inspector} from "@observablehq/runtime";
import * as  LineUpJs from "lineupjs"


```

<div id="content"></div>

```js
const albums = FileAttachment("data/music_metadata/albums.csv").tsv({delimiter: " "});
console.log(albums)

```

```js
const lineup = LineUpJs.asLineUp(document.body.querySelector('#content'), albums)
lineup.node.style.height='400px'

```
