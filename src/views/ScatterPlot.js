import Plotly from "plotly.js-dist-min";
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function Scatter(songFeatureData) {
    const xColumn = "danceability";
    const yColumn = "energy";
    const xData = songFeatureData.map((row) => row[xColumn]);
    const yData = songFeatureData.map((row) => row[yColumn]);
    var trace1 = {
        x: xData,
        y: yData,
        mode: "markers",
        type: "scattergl",
        marker: { size: 8, color: "rgb(176, 176, 176)", opacity: 0.3 },
    };
    var data = [trace1];
    var layout = {
        xaxis: {
            title: capitalizeFirstLetter(xColumn),
            color: "#212529",
            titlefont: {
                size: 14,
                color: "#212529",
            }
        },
        yaxis: {
            title: capitalizeFirstLetter(yColumn),
            color: "#212529",
            titlefont: {
                size: 14,
                color: "#212529",
            }
        },
        margin: { t: 0 },
    };
    Plotly.newPlot("detail-view-2", data, layout);
}
export function ScatterMatrix(songFeatureData) {
    const corr = {};
    const ignoreColumns = [
        "song_id",
        "duration_ms",
        "mode",
        "key",
        "time_signature",
    ];
    const corrValues = Object.keys(corr).map((key) => {
        return Object.keys(corr).map((key2) => {
            if (key === key2) {
                return { x: key, y: key2, value: 1 };
            }
            return {
                x: key,
                y: key2,
                value: Math.abs(corr[key][key2]),
            };
        });
    });
    const numColumns = Object.keys(corr).length;
    Scatter(songFeatureData);
}
