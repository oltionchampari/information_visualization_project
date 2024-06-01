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
  font-size: 14px;

  .lu-side-panel {
    display:none
  }
}

.divider {
  height:4px;
  width: 100%;
  background: #e8e8e8;
}

</style>


```js
import {Runtime, Inspector} from "@observablehq/runtime";
import * as  LineUpJs from "lineupjs"


```

<div id="content"></div>
<div class="divider"></div>

```js
const albums = FileAttachment("data/music_metadata/albums.csv").tsv({delimiter: " "});
const artists = FileAttachment("data/music_metadata/artists.csv").tsv({delimiter: " "});
const releases = FileAttachment("data/music_metadata/releases.csv").tsv({delimiter: " "});
const songs = FileAttachment("data/music_metadata/songs.csv").tsv({delimiter: " "});
const tracks = FileAttachment("data/music_metadata/tracks.csv").tsv({delimiter: " "});

```

```js
const lineup = LineUpJs.asLineUp(document.body.querySelector('#content'), albums)
lineup.node.style.height='400px'

```
