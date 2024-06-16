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
  height: 100vh;
  background: #F5F5F7
}

.table-view.lu{
  border-radius: 5px;
  background: white;
  font-size: 14px;

}

.detail-view {
    border-radius: 5px;
    background: white;
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

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
      background-position: center;
  background-repeat: no-repeat;
     cursor: col-resize;
}

  .gutter.gutter-vertical {
    cursor: row-resize;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');

  background-position: center;
  background-repeat: no-repeat;
}



#popover {
  z-index:100;
  position: absolute;
  border-radius:5px;
  padding: 10px;
  background: white;
  height: 350px;
  width: 500px;
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
import {Scatter} from './views/ScatterPlot.js'
import jsesc from 'jsesc'

```


```js
// metadata
const albums = FileAttachment("data/music_metadata/albums.csv").tsv({delimiter: " ", typed: true});
const artists = FileAttachment("data/music_metadata/artists.csv").tsv({delimiter: " ",typed: true});
const releases = FileAttachment("data/music_metadata/releases.csv").tsv({delimiter: " ",typed: true});
const songs = FileAttachment("data/music_metadata/songs.csv").tsv({delimiter: " ", typed: true});
const tracks = FileAttachment("data/music_metadata/tracks.csv").tsv({delimiter: " ", typed: true});

// features
const acousticFeatures = FileAttachment("data/music_songfeatures/acoustic_features.csv").tsv({delimiter: " ", typed: true});
```
```js

const artistsDataMap = artists.reduce((acc,cur)=>{
  acc[cur.artist_id] = cur
  return acc
},{})

const featuresDataMap = acousticFeatures.reduce((acc,cur)=>{
  acc[cur.song_id] = cur
  return acc
},{})


const fullData = songs.map((row)=>{
let str = row.artists
let match = str.match(/'([^']+)'/);
let id = match ? match[1] : null;
return {...row,id:row.song_id, ...artistsDataMap[id],...featuresDataMap[row.song_id]}
})
```
```js
// Shared props
const selection = Mutable([]);
const groupColumn= Mutable(null);
const filter = Mutable([]);
const columnSelection = Mutable([]);


// handlers
const onSelectionChanged = (sel)=>  selection.value=sel;
const onFilterChanged = (newFilter)=>filter.value = newFilter;
const onColumnSelectionChanged = (columns) =>columnSelection.value=columns;
```





```js
AppShell()
```



```js
await visibility();
const lineUp = buildLineup(fullData,selection,onSelectionChanged,onFilterChanged)

```


```js
await visibility()
Heatmap(fullData, filter,onColumnSelectionChanged);

```

```js
await visibility()
Scatter(fullData, filter,columnSelection,selection,onSelectionChanged);

```

