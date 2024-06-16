import LineUp, {
  buildRanking,
  buildStringColumn,
  buildNumberColumn,
  buildCategoricalColumn,
  builder,
  Ranking,
  buildColumn,
} from "lineupjs";
import _ from "lodash";
import * as d3 from "d3";
import { PreviewRenderer } from "./views/renderers.js";

const additionalColors = [
  "#6C3483",
  "#B03A2E",
  "#7D3C98",
  "#2E4053",
  "#1F618D",
  "#515A5A",
  "#F39C12",
  "#E67E22",
  "#D35400",
  "#A04000",
];
const myColors = [
  "#FF5733",
  "#C70039",
  "#900C3F",
  "#581845",
  "#154360",
  "#1B4F72",
  "#21618C",
  "#2874A6",
  "#2E86C1",
  "#3498DB",
];
const colors = d3
  .scaleOrdinal()
  .domain([0, 30])
  .range([...d3.schemeCategory10, ...myColors, ...additionalColors]);
let lineUp = null;
let previousSelection = null;
export function buildLineup(
  data,
  selection,
  onSelectionChanged,
  onFilterChanged
) {

  const indexMap = data.reduce((acc, cur, i) => {
    acc.set(cur, i);
    return acc;
  }, new Map());

  if (selection.length && !_.isEqual(previousSelection, selection)) {
    const selectedIndices = selection
      ?.map((s) => indexMap.get(s))
      .filter((i) => i != null);

    if (selectedIndices) {
      previousSelection = selection;
      lineUp.data.setSelection(selectedIndices);
    }
    return;
  }

  if (lineUp) {
    return;
  }

  const genreCategories = data.map((d) => d.main_genre);
  const genreCounts = genreCategories.reduce((counts, genre) => {
    counts[genre] = (counts[genre] || 0) + 1;
    return counts;
  }, {});

  const sortedGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([genre, count], i) => count > 50 && genre !== "-")
    .map(([genre, count], i) => {
      return { name: genre, label: genre, color: colors(i) };
    });
  data = data.map((d) => ({
    ...d,
    main_genre:
      genreCounts[d.main_genre] > 50
        ? d.main_genre === "-"
          ? null
          : d.main_genre
        : "other",
  }));
  const dataBuilder = builder(data);
  dataBuilder.column(buildStringColumn("song_name").label("Song name"));

  dataBuilder.column(buildStringColumn("name").label("Artist name"));
  dataBuilder.column(
    buildStringColumn("image_url")
      .pattern("${value}")
      .label("Image")
      .renderer("image")
      .width(70)
  );
  dataBuilder.column(
    buildStringColumn("song_id")
      .label("Preview")
      .renderer("preview", "preview", "preview")
      .width(50)
  );

  dataBuilder.column(
    buildCategoricalColumn("main_genre").label("Genre").categories(sortedGenres)
  );
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
  dataBuilder
    .ranking(ranking)
    .registerRenderer("preview", new PreviewRenderer())
    .rowHeight(50)
    .scheduledTaskExecutor(true)
    .livePreviews({})
    .animated(true)
    .sidePanel(false);

  lineUp = dataBuilder.build(document.body.querySelector(".table-view"));
  lineUp.node.style.height = "400px";
  let clicked = false;
  lineUp.on(LineUp.EVENT_SELECTION_CHANGED, function () {
    if (_.isEqual(previousSelection, selection)) {
      return;
    }

    const select = lineUp.data.view(lineUp.data.getSelection());
    previousSelection = select;
    onSelectionChanged(select);
  });

  const provider = lineUp.data;
  const rankingInstance = provider.getFirstRanking();
  rankingInstance.on(Ranking.EVENT_FILTER_CHANGED, (event, filter, b) => {
    const filteredOut = [];
    for (let i = 0; i < provider.data.length; i++) {
      const isRowFilteredOut = !rankingInstance.filter(provider.getRow(i));
      if (isRowFilteredOut) {
        filteredOut.push(provider.data[i].id);
      }
    }
    onFilterChanged(filteredOut);
  });
}
