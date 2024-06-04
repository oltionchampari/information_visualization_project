---
theme: dashboard
toc: false
---
<link href="https://unpkg.com/lineupjs/build/LineUpJS.css" rel="stylesheet" />
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

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
  font-family: Roboto, sans-serif;
  /* height: 100vh; */
  background: white;
  margin: 0;
}

.observablehq--block{
  margin:0
}
#observablehq-main {
  
  display: block;
  height: 100vh;
  background: white;
  margin: 0;

}

#app-root {
  height: 99vh;
}

.table-view.lu{
  font-size: 14px;

  .le-th {
    border-bottom: 1px solid #e8e8e8
  }
}
.grid-container {
  display: grid;
  grid-template-columns: 2fr 12fr;
}

.grid-item {
  border: 1px solid black;
  padding: 10px;
}


.divider {
  height:4px;
  width: 100%;
  background: #e8e8e8;
}

#popover {
  z-index:100;
  position: absolute;
  border-radius:5px;
  padding: 10px;
  background: white;
  height: 200px;
  width: 300px;
  opacity: 0;
  transition: opacity 0.3s;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}

</style>


```js
import * as _ from './views/index.js'
import LineUp from "lineupjs"
import {ReactDom} from 'react-dom'
import {buildLineup} from "./table.js"
import {AppShell} from './views/AppShell.js'
import {Heatmap} from './views/Heatmap.js'
import jsesc from 'jsesc'

```


```js
const albums = FileAttachment("data/music_metadata/albums.csv").tsv({delimiter: " ", typed:true});
const artists = FileAttachment("data/music_metadata/artists.csv").tsv({delimiter: " "});
const releases = FileAttachment("data/music_metadata/releases.csv").tsv({delimiter: " "});
const songs = FileAttachment("data/music_metadata/songs.csv").tsv({delimiter: " "});
const tracks = FileAttachment("data/music_metadata/tracks.csv").tsv({delimiter: " "});
```
```js
const artistsMap = artists.reduce((acc,cur)=>{
  acc[cur.artist_id] = cur
  return acc
},{})
const artistData = albums.map((row)=>{
let str = row.artists
let match = str.match(/'([^']+)'/);
let id = match ? match[1] : null;
return {...row, artist: artistsMap[id]?.image_url }
})
```

```js
AppShell()
```



```js

const props = Mutable([{name:"No selection"}])
const setSelection = (sel)=>props.value=sel
```


```js
await visibility()
const lineUp = buildLineup(artistData)
lineUp.node.style.height = "400px";
lineUp.on(LineUp.EVENT_SELECTION_CHANGED, function() {
  const select= lineUp.data.view(lineUp.data.getSelection());
 setSelection(select)
});

```


```js
await visibility()
Heatmap()

```

