import {
  Column,
  ERenderMode,
  ICellRenderer,
  ICellRendererFactory,
  IDataRow,
} from "lineupjs";

export class ImageRenderer implements ICellRendererFactory {
  title = 'Image';
  groupTitle = 'None';
  summaryTitle = 'None';
  canRender(col: Column, mode: ERenderMode): boolean {
    return mode === ERenderMode.CELL;
  }
  create(col: Column): ICellRenderer {
    return {
      template: `<div> </div>`,
      update: (n: HTMLDivElement, d: IDataRow) => {
        n.innerHTML = `<img src="${col.getValue(d)}" alt="Image" style="width: 40px; height: 40px;">`;
      },
    };
  }
}
