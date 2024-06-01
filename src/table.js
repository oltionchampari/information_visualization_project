import {
  buildRanking,
  buildStringColumn,
  buildNumberColumn,
  builder,
  buildColumn
} from "lineupjs";



export function buildLineup(data) {
  const dataBuilder = builder(data);
  dataBuilder.column(buildStringColumn("name"));
  dataBuilder.column(buildStringColumn("image_url").pattern("${value}").label("Cover").renderer("image"));
  dataBuilder.column(buildNumberColumn("popularity"));
  dataBuilder.rowHeight(70);
  dataBuilder.livePreviews(true);
  const ranking = buildRanking().supportTypes().allColumns();
  dataBuilder.ranking(ranking);
  return dataBuilder.build(document.body.querySelector("#content"));
}
