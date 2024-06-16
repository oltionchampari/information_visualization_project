import Plotly, { PlotData } from "plotly.js-dist-min";
import * as ss from "simple-statistics";

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function Scatter(
  songFeatureData: any,
  filter: string[],
  columnSelection: { x: string; y: string; value: number }[],
  selection,
  onSelectionChanged
) {
  if (columnSelection.length === 0) {
    document.getElementById(
      "detail-view-2"
    ).innerHTML = `<div class="h5 text-muted h-100 d-flex justify-content-center align-items-center"><span>Please select a cell in the heatmap to view the scatter plot.</span></div>`;
    return;
  }
  document.getElementById("detail-view-2").innerHTML = ``;
  const xColumn = columnSelection[0].x;
  const yColumn = columnSelection[0].y;
  const filterMap = new Map();
  filter.forEach((f) => {
    filterMap.set(f, true);
  });
  const filteredData = filter.length
    ? songFeatureData.filter((d) => !filterMap.get(d.song_id))
    : songFeatureData;

  const xData = filteredData.map((row) => row[xColumn]);
  const yData = filteredData.map((row) => row[yColumn]);
  const ids = filteredData.map((row) => row.song_id);
  const names = filteredData.map((row) => row.song_name);
  // Calculate the linear regression
  var regression = ss.linearRegression(
    xData.map((val, idx) => [val, yData[idx]])
  );

  // Create the regression line function
  var regressionLine = ss.linearRegressionLine(regression);

  // Generate y values for the regression line
  var regressionY = xData.map(regressionLine);
  var trace1 = {
    x: xData,
    y: yData,
    ids,
    hoverinfo: "text",
    hoverlabel: {
      bgcolor: "black",
      padding: 4,
    },
    selectedpoints: selection.map((s) => ids.indexOf(s.song_id)),
    text: names,
    hovertext: names,
    showlegend: false,
    mode: "markers",
    type: "scattergl",
    selected: {
      marker: { size: 10, color: "#ffcf76", opacity: 0.6 },
    },
    marker: { size: 10, color: "rgb(176, 176, 176)", opacity: 0.3 },
  } as any;
  // Regression line trace
  var trace2 = {
    x: xData,
    y: regressionY,
    showlegend: false,
    mode: "lines",
    line: { color: "rgb(31, 119, 180)", width: 2 },
    type: "scattergl",
  };
  var data = [trace1, trace2];

  var layout = {
    dragmode: "lasso",
    xaxis: {
      title: capitalizeFirstLetter(xColumn),
      color: "#212529",
      titlefont: {
        size: 14,
        color: "#212529",
      },
    },
    yaxis: {
      title: capitalizeFirstLetter(yColumn),
      color: "#212529",
      titlefont: {
        size: 14,
        color: "#212529",
      },
    },
    margin: { t: 0 },
  } as Plotly.Layout;

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      "select2d",
      "zoomIn2d",
      "zoomOut2d",
      "autoScale2d",
      "resetScale2d",
      "hoverClosestCartesian",
      "hoverCompareCartesian",
      "toggleSpikelines",
      "toImage",
      "zoomInMapbox",
      "zoom3d",
      "zoom2d",
    ],
    modeBarButtonsToAdd: ["lasso2d", "select2d", "pan2d"],
  } as Plotly.Config;

  const plotDiv = await Plotly.newPlot(
    "detail-view-2",
    data as any,
    layout,
    config
  );

  plotDiv.on("plotly_selected", function (eventData) {
    const selectedIds = eventData.points.map((p) => (p as any).id);
    const selected = songFeatureData.filter(
      (d) => d.song_id && selectedIds.includes(d.song_id)
    );
    onSelectionChanged(selected);
  });
  const plotElement = document.getElementById("detail-view-2");
  let observer = new ResizeObserver((entries) => {
    Plotly.Plots.resize(plotElement);
  });
  observer.observe(plotElement);
}
