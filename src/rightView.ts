import View from "./view";
import { Model } from "./model";

import "./rightView.css";

export class RightView implements View {
  update(): void {
    this.container.replaceChildren();
    [...this.model.gameList].forEach((game, i) => {
      const div = document.createElement("div");
      div.id = "game";
      if(i === this.model.focusedGame){
        div.style.border = "2px solid crimson";
      }
      div.addEventListener("click", () => {
        if(i === this.model.focusedGame){
          this.model.gameFocus(-1);
        } else {
          this.model.gameFocus(i);
        }
      });
      const id = document.createElement("label");
      id.id = "gameId";
      id.innerText = `Game ${game.id}`;
      const progress = document.createElement("div");
      progress.id = "progressBar";
      if(game.numWords !== 0){
        progress.style.width = `calc(${game.completedCount / game.numWords} * (100% - 80px))`;
      }
      div.appendChild(id);
      div.appendChild(progress);
      this.container.appendChild(div);
    });
  }

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model){
    this.container = document.createElement("div");
    this.container.id = "right";

    this.model.addObserver(this);
  }
}
