import View from "./view";
import { Model } from "./model";

import "./gameAreaView.css";

export class GameAreaView implements View {
  update(): void {
    this.container.replaceChildren();
    const gameArea = document.getElementById("gameArea") as HTMLDivElement;
    if(this.model.focusedGame !== -1){
      gameArea.style.flexDirection = "row";
      gameArea.style.justifyContent = "";
      if(this.model.gameList[this.model.focusedGame].numWords < 0 ||
          this.model.gameList[this.model.focusedGame].numWords > 9999){
        gameArea.style.backgroundColor = "rgb(255, 210, 210)";
        gameArea.innerText = "INVALID GAME PARAMETERS!";
        gameArea.style.flexDirection = "column";
        gameArea.style.fontSize = "5vw";
        gameArea.style.textAlign = "center";
        gameArea.style.justifyContent = "center";
      } else if (gameArea && this.model.gameList[this.model.focusedGame].completedCount ===
          this.model.gameList[this.model.focusedGame].randomWords.length){
        gameArea.style.backgroundColor = "rgb(236, 255, 220)";
      } else {
        gameArea.style.backgroundColor = "white";
      }

      const fragment = document.createDocumentFragment();
      [...this.model.gameList[this.model.focusedGame].randomWords].forEach((wordLabel, i) => {
        const word = document.createElement("label");
        word.id = "word";
        word.addEventListener("click", () => {
          if(this.model.gameList[this.model.focusedGame].completedCount !==
              this.model.gameList[this.model.focusedGame].completed.length){
            this.model.wordFocus(i);
          }
        });
        word.addEventListener("mouseenter", () => {
          if(this.model.gameList[this.model.focusedGame].completedCount !==
              this.model.gameList[this.model.focusedGame].completed.length){
            word.style.backgroundColor = "rgb(255, 255, 224)";
            word.style.border = "2px solid lightpink";
            word.style.padding = "8.596px";
          }
        });
        word.addEventListener("mouseleave", () => {
          word.style.border = "";
          word.style.padding = "10px";
          if(i === this.model.gameList[this.model.focusedGame].currentWord){
            word.style.backgroundColor = "yellow";
            if(this.model.gameList[this.model.focusedGame].userFocus){
              word.style.border = "2px solid red";
              word.style.padding = "8.596px";
            }
          } else if (this.model.gameList[this.model.focusedGame].completed[i]){
            word.style.backgroundColor = "lime";
          } else {
            word.style.backgroundColor = "";
          }
        });
        word.innerText = `${wordLabel[this.model.getLang]}`;
        word.style.fontSize = `${this.model.gameList[this.model.focusedGame].fontSize}px`;
        if(i === this.model.gameList[this.model.focusedGame].currentWord){ // focused label
          word.style.backgroundColor = "yellow";
          if(this.model.gameList[this.model.focusedGame].userFocus){
            word.style.border = "2px solid red";
            word.style.padding = "8.596px";
          }
        } else if (this.model.gameList[this.model.focusedGame].completed[i]){
          word.style.backgroundColor = "lime";
        }
        fragment.appendChild(word);
      });
      this.container.appendChild(fragment);
    } else {
      if(gameArea){
        gameArea.style.backgroundColor = "white";
      }
    }
  }

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model){
    this.container = document.createElement("div");
    this.container.id = "gameArea";

    this.model.addObserver(this);
  }
}
