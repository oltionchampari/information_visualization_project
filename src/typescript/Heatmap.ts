import Plotly from "plotly.js-dist-min";
import * as ss from "simple-statistics";
import * as d3 from "d3";

export function Heatmap() {
  // Generate some random data
  const numColumns = 7;
  const numRows = 50;
  const data = Array.from({ length: numRows }, () =>
    Array.from({ length: numColumns }, () => Math.random())
  );

  // Compute the correlations
  const correlations = data[0].map((_, i) =>
    data[0].map((_, j) =>
      i === j
        ? 1
        : ss.sampleCorrelation(
            data.map((row) => row[i]),
            data.map((row) => row[j])
          )
    )
  );

  console.log(d3.select(".detail-view"));

  // Create the SVG and set its size
  const svg = d3
    .select(".detail-view")
    .append("svg")
    .attr("position", "relative")
    .attr("width", 500)
    .attr("height", 500);

  // Create a color scale
  const color = d3
    .scaleSequential()
    .domain([-1, 1])
    .interpolator(d3.interpolateRdBu);

  // Create the heatmap
  const cellSize = 60;
  const cells = svg
    .selectAll("rect")
    .data(d3.merge(correlations))
    .join("rect")
    .attr("x", (d, i) => (i % numColumns) * cellSize)
    .attr("y", (d, i) => Math.floor(i / numColumns) * cellSize)
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("fill", (d) => color(d as any));

  cells
    .on("mouseover", function (event, d) {
      const cell = (d3.select(this).node() as any).getBoundingClientRect();
      const popoverHeight = parseFloat(d3.select("#popover").style("height"));
      // Show the popover
      d3.select("#popover")
        .style("opacity", 1)
        .style(
          "left",
          cell.x +
            cell.width / 2 -
            parseFloat(d3.select("#popover").style("width")) / 2 +
            "px"
        )
        .style("top", cell.y - popoverHeight - 5 + "px")
        .text((d as any).toFixed(2));
    })
    .on("mouseout", function () {
      // Hide the popover
      d3.select("#popover").style("opacity", 0);
    });
}
