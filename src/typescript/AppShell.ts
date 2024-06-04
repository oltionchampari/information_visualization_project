export function AppShell() {

  const root = document.createElement("div");
  root.id = "app-root";
  root.innerHTML = `
  <div id="popover"></div>
  <div class=" h-100 m-0 w-100 py-1">
  <div class=" grid-container h-100 w-100">
    <div class=" grid-item filter-sidebar border border-info">
    sidebar
    </div>
    <div class=" grid-item flex-grow-5 border border-info d-flex flex-column">
      <div class="table-view border border-info flex-grow-1 h-50">
      </div>
      <div class="divider"> </div>
      <div class="detail-view border border-info h-50" >
      </div>
    </div>
  </div>
</div>
    `;
    return root;
}
