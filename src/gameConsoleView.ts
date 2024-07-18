import View from "./view";
import { Model } from "./model";

import "./gameConsoleView.css";

export class GameConsoleView implements View {
  update(): void {
    if(this.model.focusedGame !== -1){
      if(this.model.gameList[this.model.focusedGame].completedCount ===
          this.model.gameList[this.model.focusedGame].completed.length ||
          this.model.gameList[this.model.focusedGame].numWords < 0 ||
          this.model.gameList[this.model.focusedGame].numWords > 9999){
        this.textInput.disabled = true;
        this.textInput.value = "";
      } else {
        this.textInput.disabled = false;
        if(this.model.getWordCompleted){
          this.textInput.value = "";
          this.model.wordCompleteTextCleared();
        }
      }
    } else {
      this.textInput.disabled = true;
      this.textInput.value = "";
    }
    
    if(this.model.focusedGame !== -1){
      this.fontSize.value = `${this.model.gameList[this.model.focusedGame].fontSize}`;
      if(this.model.gameList[this.model.focusedGame].completedCount ===
          this.model.gameList[this.model.focusedGame].completed.length ||
          this.model.gameList[this.model.focusedGame].numWords < 0 ||
          this.model.gameList[this.model.focusedGame].numWords > 9999){
        this.fontSize.disabled = true;
      } else {
        this.fontSize.disabled = false;
      }
    } else {
      this.fontSize.disabled = true;
    }

    if(this.model.focusedGame !== -1){
      this.numWords.disabled = false;
      this.numWords.value = `${this.model.gameList[this.model.focusedGame].numWords}`;
      if(this.model.gameList[this.model.focusedGame].numWords < 0 ||
          this.model.gameList[this.model.focusedGame].numWords > 9999){
        this.numWords.style.backgroundColor = "rgb(255, 125, 125)";
        this.numWords.style.border = "2px solid red";
      } else {
        this.numWords.style.backgroundColor = "whitesmoke";
        this.numWords.style.border = "1px solid black";
      }
    } else {
      this.numWords.disabled = true;
    }
    
    if(this.model.focusedGame !== -1){
      if(this.model.gameList[this.model.focusedGame].numWords < 0 ||
          this.model.gameList[this.model.focusedGame].numWords > 9999){
        this.resetButton.disabled = true;
      } else {
        this.resetButton.disabled = false;
      }
    } else {
      this.resetButton.disabled = true;
    }

    if(this.model.focusedGame === -1){
      this.gameProgress.innerText = "Select / Add a game to Start!";
    } else {
      if(this.model.gameList[this.model.focusedGame].numWords < 0 ||
          this.model.gameList[this.model.focusedGame].numWords > 9999){
        this.gameProgress.innerText = "Invalid Num Words! Should be in 0 - 9999";
      } else if (this.model.gameList[this.model.focusedGame].completedCount ===
          this.model.gameList[this.model.focusedGame].randomWords.length){
        this.gameProgress.innerText = "Game Completed!";
      } else {
        this.gameProgress.innerText = `${this.model.gameList[this.model.focusedGame].completedCount} / ` +
          `${this.model.gameList[this.model.focusedGame].randomWords.length} Words Matched`;
      }
    }
  }

  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  private textInput: HTMLInputElement;
  private resetButton: HTMLButtonElement;
  private gameProgress: HTMLSpanElement;

  private fontSize: HTMLInputElement;
  private numWords: HTMLInputElement;

  constructor(private model: Model){
    this.container = document.createElement("div");
    this.container.id = "gameConsole";

    this.textInput = document.createElement("input");
    this.textInput.type = "text";
    this.textInput.disabled = true;
    this.textInput.addEventListener("input", () => {
      model.checkMatch(this.textInput.value.toLowerCase());
    });
    this.container.appendChild(this.textInput);

    const gamePropertiesInput = document.createElement("div");
    gamePropertiesInput.id = "inputContainer";

    const gamePropertiesInput1 = document.createElement("div");
    gamePropertiesInput1.id = "gamePropertiesInput1";
    const gamePropertiesInput2 = document.createElement("div");
    gamePropertiesInput2.id = "gamePropertiesInput2";

    this.fontSize = document.createElement("input");
    this.fontSize.type = "range";
    this.fontSize.disabled = true;
    this.fontSize.min = "0";
    this.fontSize.max = "100";
    this.fontSize.addEventListener("input", () => {
      model.changeFontSize(parseInt(this.fontSize.value), false);
    });
    this.fontSize.addEventListener("change", () => {
      model.changeFontSize(parseInt(this.fontSize.value), true);
    })
    
    const fontSizeLabel = document.createElement("label");
    fontSizeLabel.innerText = "Font Size:";
    gamePropertiesInput1.appendChild(fontSizeLabel);
    gamePropertiesInput1.appendChild(this.fontSize);
    gamePropertiesInput.appendChild(gamePropertiesInput1);

    this.numWords = document.createElement("input");
    this.numWords.type = "number";
    this.numWords.disabled = true;
    this.numWords.addEventListener("input", () => {
      model.resetGame(parseInt(this.numWords.value));
    });
    
    const numWordsLabel = document.createElement("label");
    numWordsLabel.innerText = "Num Words:";
    gamePropertiesInput2.appendChild(numWordsLabel);
    gamePropertiesInput2.appendChild(this.numWords);
    gamePropertiesInput.appendChild(gamePropertiesInput2);

    this.container.appendChild(gamePropertiesInput);

    this.resetButton = document.createElement("button");
    this.resetButton.disabled = true;
    this.resetButton.innerText = "Reset Game";
    this.resetButton.addEventListener("click", () => {
      model.resetGame(parseInt(this.numWords.value));
    });
    this.container.appendChild(this.resetButton);

    this.gameProgress = document.createElement("label");
    this.gameProgress.innerText = "Select / Add a game to Start!";
    this.container.appendChild(this.gameProgress);

    this.model.addObserver(this);
  }
}
