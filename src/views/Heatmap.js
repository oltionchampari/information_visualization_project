import * as ss from "simple-statistics";
import * as d3 from "d3";
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function renderCellPopover(cells) {
    cells
        .on("mouseover", function (event, d) {
        const cell = d3.select(this).node().getBoundingClientRect();
        const popoverHeight = parseFloat(d3.select("#popover").style("height"));
        // Show the popover
        d3.select("#popover")
            .style("opacity", 1)
            .style("left", cell.x +
            cell.width / 2 -
            parseFloat(d3.select("#popover").style("width")) / 2 +
            "px")
            .style("top", cell.y - popoverHeight - 5 + "px")
            .append("svg")
            .classed("histogram", true)
            .attr("width", 500)
            .attr("height", 300);
        const svg = d3.select(".histogram");
        var data = d3.range(10000).map(d3.randomBates(10));
        // Define the histogram generator
        var histogram = d3.bin().domain([0, 1]).thresholds(50);
        var bins = histogram(data);
        var x = d3.scaleLinear().domain([0, 1]).range([0, 500]);
        // Define the y scale
        var y = d3
            .scaleLinear()
            .domain([0, d3.max(bins, (d) => d.length)])
            .range([300, 0]);
        // Draw the bars
        svg
            .selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", (d) => x(d.x0))
            .attr("y", (d) => y(d.length))
            .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
            .attr("height", (d) => 300 - y(d.length))
            .attr("fill", "steelblue");
    })
        .on("mouseout", function () {
        // Hide the popover
        d3.select("#popover").style("opacity", 0);
        d3.select(".histogram").remove();
    });
}
function renderLegend(height, width, padding, color, svg) {
    const numColumns = 10;
    const widthLeft = width - padding.left - padding.right;
    const heightLeft = height - padding.top - padding.bottom;
    const resizeMetric = Math.min(widthLeft, heightLeft);
    const cellSize = resizeMetric / numColumns;
    const legendWidth = cellSize / 2;
    const legendHeight = 10 * cellSize;
    const position = padding.left + 10 * cellSize + 20;
    // Create a group for the legend
    const legend = svg
        .append("g")
        .attr("transform", `translate(${position}, ${padding.top})`);
    // Create a defs element to define the linear gradient
    const defs = svg.append("defs");
    const linearGradient = defs
        .append("linearGradient")
        .attr("id", "linear-gradient")
        .attr("gradientTransform", "rotate(90)");
    // Define the gradient stops
    const n = 100; // Number of steps in the gradient
    const data = Array.from({ length: n }, (_, i) => ({
        offset: `${(100 * i) / n}%`,
        color: color((i / (n - 1)) * 2 - 1),
    })); // Map i/(n-1) to [-1, 1]
    linearGradient
        .selectAll("stop")
        .data(data)
        .join("stop")
        .attr("offset", (d) => d.offset)
        .attr("stop-color", (d) => d.color);
    console.log("Legend", legendWidth, legendHeight);
    // Create a rectangle and fill it with the gradient
    legend
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#linear-gradient)");
    // Add labels
    legend
        .append("text")
        .attr("class", "legend-label")
        .attr("x", legendWidth + 10)
        .attr("y", 0)
        .attr("alignment-baseline", "hanging")
        .attr("fill", "#212529") // A shade of gray
        .style("font-size", "14px")
        .text(d3.min(color.domain()));
    legend
        .append("text")
        .attr("class", "legend-label")
        .attr("x", legendWidth + 10)
        .attr("y", legendHeight)
        .attr("alignment-baseline", "baseline")
        .attr("fill", "#212529") // A shade of gray
        .style("font-size", "14px")
        .text(d3.max(color.domain()));
}
let selectedCells = new Map();
function updateSelection(svg, cells, getId, selectedCells, onColumnSelectionChanged) {
    svg.select("g").selectAll("text").attr("visibility", "hidden");
    svg
        .select("g")
        .selectAll("text")
        .filter((dd) => {
        console.log("DD", getId(dd), selectedCells, selectedCells.has(getId(dd)));
        if (selectedCells.has(getId(dd))) {
            console.log("DD", dd);
        }
        return selectedCells.has(getId(dd));
    })
        .attr("visibility", "visible"); // Show the text when cell is selected
    cells
        .attr("stroke", (d) => (selectedCells.has(getId(d)) ? "#ffcf76" : "none"))
        .attr("stroke-width", (d) => (selectedCells.has(getId(d)) ? "3" : 0));
    selectedCells.forEach((d) => {
        svg
            .selectAll("rect")
            .filter((dd) => dd === d)
            .raise();
        svg
            .selectAll("text")
            .filter((dd) => selectedCells.has(getId(dd)))
            .raise();
        svg.selectAll("g").raise();
    });
    onColumnSelectionChanged(Array.from(selectedCells.values()));
}
export function Heatmap(songFeatureData, filter, onColumnSelectionChanged) {
    // initialize filtermap from filter array
    const filterMap = new Map();
    filter.forEach((f) => {
        filterMap.set(f, true);
    });
    const filteredData = filter.length
        ? songFeatureData.filter((d) => !filterMap.get(d.song_id))
        : songFeatureData;
    const corr = {};
    const ignoreColumns = [
        "acousticness",
        "danceability",
        "energy",
        "instrumentalness",
        "loudness",
        "speechiness",
        "valence",
        "tempo",
        "popularity",
    ];
    filteredData.map((d) => {
        const keys = Object.keys(d).filter((key) => ignoreColumns.includes(key));
        keys.forEach((key) => {
            if (!corr[key]) {
                corr[key] = [];
            }
            corr[key].push(d[key]);
        });
    });
    const corrValues = Object.keys(corr).map((key) => {
        return Object.keys(corr).map((key2) => {
            if (key === key2) {
                return { x: key, y: key2, value: 1 };
            }
            return {
                x: key,
                y: key2,
                value: ss.sampleCorrelation(corr[key], corr[key2]),
            };
        });
    });
    const numColumns = Object.keys(corr).length;
    const columnNames = Object.keys(corr).map((key) => capitalizeFirstLetter(key));
    const detailView = d3.select(".detail-view");
    const rect = detailView.node().getBoundingClientRect();
    const initialWidth = rect.width;
    const initialHeight = rect.height - 30;
    const renderHeatmap = (width, height) => {
        const padding = {
            top: 20,
            right: 60,
            bottom: 45,
            left: 70,
        };
        const widthLeft = width - padding.left - padding.right;
        const heightLeft = height - padding.top - padding.bottom;
        const resizeMetric = Math.min(widthLeft, heightLeft);
        const cellSize = resizeMetric / numColumns;
        if (padding.left + numColumns * cellSize + padding.right < width) {
            padding.left = (width - numColumns * cellSize) / 2;
            padding.right = padding.left;
        }
        const svg = d3
            .select(".detail-view")
            .append("div")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("z-index", "10");
        // Create a color scale
        const color = d3
            .scaleSequential()
            .domain([-1, 1])
            .interpolator(d3.interpolateRdBu);
        const cells = svg
            .selectAll("rect")
            .data(d3.merge(corrValues))
            .join("rect")
            .attr("x", (d, i) => (i % numColumns) * cellSize + 1 + padding.left)
            .attr("y", (d, i) => Math.floor(i / numColumns) * cellSize + 1 + padding.top)
            .attr("width", cellSize - 1)
            .attr("height", cellSize - 1)
            .attr("fill", (d) => color(d.value))
            .on("click", (event, d) => {
            const getId = (c) => `${c?.x}-${c?.y}`;
            const id = getId(d);
            if (selectedCells.has(id)) {
                selectedCells.delete(id);
            }
            else {
                if (event.ctrlKey) {
                    selectedCells.set(id, d);
                }
                else {
                    selectedCells = new Map([[id, d]]);
                }
            }
            updateSelection(svg, cells, getId, selectedCells, onColumnSelectionChanged);
        });
        const text = svg
            .append("g")
            .selectAll("text")
            .data(d3.merge(corrValues))
            .join("text")
            .attr("x", (d, i) => (i % numColumns) * cellSize + 1 + padding.left + cellSize / 2)
            .attr("y", (d, i) => Math.floor(i / numColumns) * cellSize + 1 + padding.top + cellSize / 2)
            .text((d) => d.value.toFixed(2))
            .style("fill", function (d) {
            // Compute the brightness of the background color.
            const rgb = d3.rgb(color(d.value));
            const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
            // Return white text for dark backgrounds and black text for light backgrounds.
            return yiq >= 128 ? "#212529" : "white";
        })
            .attr("visibility", "hidden")
            .style("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("pointer-events", "none");
        // Show the text when the mouse hovers over the cell
        svg
            .selectAll("rect")
            .on("mouseover", function (event, d) {
            svg
                .selectAll("text")
                .filter((dd) => dd === d)
                .attr("visibility", "visible"); // Show the text
        })
            .on("mouseout", function (event, d) {
            const getId = (c) => `${c?.x}-${c?.y}`;
            svg
                .selectAll("text")
                .filter((dd) => dd === d && !selectedCells.has(getId(dd)))
                .attr("visibility", "hidden"); // Hide the text
        });
        svg
            .selectAll(".yLabel")
            .data(columnNames)
            .enter()
            .append("text")
            .text((d) => d)
            .attr("x", padding.left - 60)
            .attr("y", (d, i) => i * cellSize + padding.top + cellSize / 2 + 5)
            .style("font-size", "12px")
            .style("text-anchor", "start")
            .attr("fill", "#212529")
            .each(function (d, i) {
            var self = d3.select(this), text = self.text(), textLength = self.node().getComputedTextLength();
            if (textLength > 50) {
                text =
                    text.slice(0, Math.floor((50 * text.length) / textLength)) + "...";
                self.text(text);
            }
        });
        svg
            .selectAll(".xLabel")
            .data(columnNames)
            .enter()
            .append("text")
            .attr("fill", "#212529") // A shade of gray
            .text((d) => d)
            .attr("x", (d, i) => i * cellSize + padding.left - 15)
            .attr("y", Math.floor(corrValues.length + 1 / numColumns) * cellSize +
            padding.top +
            30)
            .style("font-size", "12px")
            .style("text-anchor", "start")
            .attr("transform", (d, i) => ` translate(${resizeMetric / 60 - 40}, 25) rotate(-45, ${i * cellSize + padding.left}, ${resizeMetric - padding.bottom + 20})`)
            .each(function (d, i) {
            var self = d3.select(this), text = self.text(), textLength = self.node().getComputedTextLength();
            if (textLength > 42) {
                text =
                    text.slice(0, Math.floor((42 * text.length) / textLength)) + "...";
                self.text(text);
            }
        });
        const getId = (c) => `${c?.x}-${c?.y}`;
        updateSelection(svg, cells, getId, selectedCells, () => null);
        renderLegend(height, width, padding, color, svg);
    };
    renderHeatmap(initialWidth, initialHeight);
    let observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
            detailView.selectAll("svg").remove();
            let width = entry.contentRect.width;
            let height = entry.contentRect.height;
            renderHeatmap(width, height);
        }
    });
    observer.observe(detailView.node());
}
