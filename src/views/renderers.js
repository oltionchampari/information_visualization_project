import { ERenderMode, } from "lineupjs";
export class ImageRenderer {
    constructor() {
        this.title = 'Image';
        this.groupTitle = 'None';
        this.summaryTitle = 'None';
    }
    canRender(col, mode) {
        return mode === ERenderMode.CELL;
    }
    create(col) {
        return {
            template: `<div> </div>`,
            update: (n, d) => {
                n.innerHTML = `<img src="${col.getValue(d)}" alt="Image" style="width: 40px; height: 40px;">`;
            },
        };
    }
}
