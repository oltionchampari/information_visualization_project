import LineUp, {
  buildRanking,
  buildStringColumn,
  buildNumberColumn,
  buildCategoricalColumn,
  builder,
  Ranking,
  buildColumn,
} from "lineupjs";
import * as d3 from "d3";

export function buildLineup(data,onSelectionChanged, onFilterChanged) {
  const dataBuilder = builder(data);
  dataBuilder.column(buildStringColumn("song_name").label("Song name"));
  dataBuilder.column(buildStringColumn("name").label("Artist name"));
  dataBuilder.column(buildCategoricalColumn("main_genre").label("Genre"));
  dataBuilder.column(buildNumberColumn("acousticness").width(120));
  dataBuilder.column(buildNumberColumn("danceability").width(120));
  dataBuilder.column(buildNumberColumn("energy").width(120));
  dataBuilder.column(buildNumberColumn("instrumentalness").width(120));
  dataBuilder.column(buildNumberColumn("loudness"));
  dataBuilder.column(buildNumberColumn("speechiness").width(120));
  dataBuilder.column(buildNumberColumn("valence").width(120));
  dataBuilder.column(buildNumberColumn("tempo").width(120));
  dataBuilder.column(buildNumberColumn("popularity").width(120));
  const ranking = buildRanking()
    .supportTypes()
    .allColumns()
    .sortBy("popularity", "desc");
  dataBuilder.ranking(ranking);
  dataBuilder.rowHeight(50).livePreviews(true).animated(true).sidePanel(false);
  const lineUp = dataBuilder.build(document.body.querySelector(".table-view"));
  lineUp.node.style.height = "400px";
  lineUp.on(LineUp.EVENT_SELECTION_CHANGED, function() {
    const select= lineUp.data.view(lineUp.data.getSelection());
   onSelectionChanged(select);
  });

  const provider = lineUp.data;
  const rankingInstance = provider.getFirstRanking();
  rankingInstance.on(Ranking.EVENT_FILTER_CHANGED, (event, filter, b) => {
    console.log(event, filter);
    const filteredOut = [];
    for (let i = 0; i < provider.data.length; i++) {
      const isRowFilteredOut = !rankingInstance.filter(provider.getRow(i));
      if (isRowFilteredOut) {
        filteredOut.push(provider.data[i].id);
      }
    }
    onFilterChanged(filteredOut);
  });
  return lineUp;
}
