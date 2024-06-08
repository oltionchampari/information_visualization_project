import LineUp, {
  buildRanking,
  buildStringColumn,
  buildNumberColumn,
  buildCategoricalColumn,
  builder,
  buildColumn,
} from "lineupjs";
import * as d3 from "d3";

export function buildLineup(data) {
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
  return lineUp;
}
