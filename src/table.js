import LineUp, {
  buildRanking,
  buildStringColumn,
  buildNumberColumn,
  builder,
  buildColumn,
} from "lineupjs";
import * as d3 from "d3";


export function buildLineup(data) {
  const dataBuilder = builder(data);
  dataBuilder.column(buildStringColumn("name"));
  dataBuilder.column(
    buildStringColumn("image_url")
      .pattern("${value}")
      .label("Cover")
      .renderer("image")
      .width(70)
  );
  dataBuilder.column(
    buildStringColumn("artist")
      .pattern("${value}")
      .label("Artist")
      .renderer("image")
      .width(70)
  );
  const colorScale = d3
    .scaleLinear()
    .domain([0, 1]) // Input range
    .range(["#E90aa", "#1E90FF"]);
  dataBuilder.column(
    buildNumberColumn("popularity")
      .width(150)
      .renderer("brightness")
      .colorMapping((numValue) => colorScale(numValue))
  );

  const ranking = buildRanking()
    .supportTypes()
    .allColumns()
    .sortBy("popularity", "desc");
  dataBuilder.ranking(ranking);
  dataBuilder.rowHeight(50).livePreviews(true).animated(true).sidePanel(false);
  const lineUp = dataBuilder.build(document.body.querySelector(".table-view"));
  return lineUp;
}
