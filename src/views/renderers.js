import { ERenderMode, } from "lineupjs";
const imgLinkPlay = "https://img.icons8.com/ios/50/play--v1.png";
const imgLinkPause = "https://img.icons8.com/ios/50/pause--v1.png";
function noop() {
    // no op
}
let playingId = null;
export const noRenderer = {
    template: `<div></div>`,
    update: noop,
};
export class PreviewRenderer {
    constructor() {
        this.title = "preview";
    }
    canRender(col, mode) {
        return mode === ERenderMode.CELL && col.desc.type === "string";
    }
    create(col) {
        let playingId = null;
        const audio = new Audio("https://p.scdn.co/mp3-preview/4e30857a3c7da3f8891483643e310bb233afadd2?cid=cfe923b2d660439caf2b557b21f31221");
        return {
            template: `<div class="d-flex align-items-center play-button"><img width="20" height="20"src="${imgLinkPlay}" alt="play" /></div>`,
            update: (n, d) => {
                n.onclick = (event) => {
                    event.stopPropagation();
                    if (playingId === d.v.id) {
                        n.innerHTML = `<img width="20" height="20" src="${imgLinkPlay}" alt="play" />`;
                        audio.pause();
                        playingId = null;
                    }
                    else {
                        document.querySelectorAll(".play-button").forEach((el) => {
                            el.innerHTML = `<img width="20" height="20" src="${imgLinkPlay}" alt="play" />`;
                        });
                        n.innerHTML = `<img width="20" height="20" src="${imgLinkPause}" alt="play" />`;
                        // dummy for now
                        audio.src = `https://p.scdn.co/mp3-preview/4e30857a3c7da3f8891483643e310bb233afadd2?cid=cfe923b2d660439caf2b557b21f31221`;
                        audio.play();
                        playingId = d.v.id;
                    }
                };
            },
        };
    }
    createGroup(col, context, imposer) {
        return noRenderer;
    }
    createSummary(col, context, interactive, imposer) {
        return noRenderer;
    }
}
