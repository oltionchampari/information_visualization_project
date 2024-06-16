import * as Split from "split.js";
export function AppShell() {
    const root = document.createElement("div");
    root.id = "app-root";
    root.innerHTML = `
  <div id="popover" style="position:absolute; z-index:0"></div>
  <div class="h-100 m-0 w-100 p-2">
  <div class="h-100 w-100">
    <div class=" h-100 w-100  d-flex flex-column">
      <div class="table-view card d-block m-1 border border-light flex-grow-1" style="height:40%">
      </div>
      <div class="bottom-view d-flex justify-content-stretch" style="height:60%">
      <div class="detail-view flex-fill card border m-1 border-light  h-100" >
      </div>
      <div id="detail-view-2" class="detail-view-2 flex-fill card border m-1 border-light  h-100" >
      </div>
      </div>
    </div>
  </div>
</div>
    `;
    Split.default([
        root.querySelector(".table-view"),
        root.querySelector(".bottom-view"),
    ], {
        sizes: [40, 60],
        minSize: 100,
        gutterSize: 4,
        snapOffset: 30,
        direction: "vertical",
        cursor: "row-resize",
        onDragEnd: function (sizes) {
        },
    });
    Split.default([
        root.querySelector(".detail-view"),
        root.querySelector(".detail-view-2"),
    ], {
        sizes: [40, 60],
        minSize: 100,
        gutterSize: 4,
        snapOffset: 30,
        direction: "horizontal",
        cursor: "col-resize",
        onDragEnd: function (sizes) {
        },
    });
    return root;
}
