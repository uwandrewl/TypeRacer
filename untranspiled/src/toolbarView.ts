import View from "./view";
import { Model } from "./model";

import "./toolbarView.css";

export class ToolbarView implements View {
    update(): void {
        this.addButton.disabled = this.model.numGames >= 20;
        this.deleteButton.disabled = this.model.numGames === 0;
        this.clearButton.disabled = this.model.numGames === 0;
        
        this.undoButton.disabled = this.model.focusedGame === -1 || !this.model.canUndo;
        this.redoButton.disabled = this.model.focusedGame === -1 || !this.model.canRedo;
    }

    private container: HTMLDivElement;
    get root(): HTMLDivElement {
        return this.container;
    }

    private addButton: HTMLButtonElement;
    private deleteButton: HTMLButtonElement;
    private clearButton: HTMLButtonElement;
    private undoButton: HTMLButtonElement;
    private redoButton: HTMLButtonElement;
    private langSelect: HTMLSelectElement;

    constructor(private model: Model){
        this.container = document.createElement("div");
        this.container.id = "toolbar";

        const leftSide = document.createElement("div");
        leftSide.id = "leftSide";
        const rightSide = document.createElement("div");
        rightSide.id = "rightSide";

        // add game button
        this.addButton = document.createElement("button");
        this.addButton.innerText = "Add Game";
        this.addButton.addEventListener("click", () => {
            model.create();
        });
        leftSide.appendChild(this.addButton);
        
        // delete game button
        this.deleteButton = document.createElement("button");
        this.deleteButton.innerText = "Delete Game";
        this.deleteButton.disabled = true;
        this.deleteButton.addEventListener("click", () => {
            if(model.numGames !== 0){
                model.delete();
            }
        });
        leftSide.appendChild(this.deleteButton);

        // clear games button
        this.clearButton = document.createElement("button");
        this.clearButton.innerText = "Clear Games";
        this.clearButton.disabled = true;
        this.clearButton.addEventListener("click", () => {
            model.clear();
        });
        leftSide.appendChild(this.clearButton);

        // undo button
        this.undoButton = document.createElement("button");
        this.undoButton.innerText = "Undo";
        this.undoButton.disabled = true;
        this.undoButton.addEventListener("click", () => {
            model.undo();
        });
        rightSide.appendChild(this.undoButton);

        // redo button
        this.redoButton = document.createElement("button");
        this.redoButton.innerText = "Redo";
        this.redoButton.disabled = true;
        this.redoButton.addEventListener("click", () => {
            model.redo();
        });
        rightSide.appendChild(this.redoButton);

        // language select dropdown
        this.langSelect = document.createElement("select");
        const optEn = document.createElement("option");
        optEn.value = "en-CA";
        optEn.text = "English";
        this.langSelect.add(optEn);
        const optFr = document.createElement("option");
        optFr.value = "fr-CA";
        optFr.text = "Français";
        this.langSelect.add(optFr);
        this.langSelect.addEventListener("change", () => {
            model.changeLang(this.langSelect.value);
        });
        rightSide.appendChild(this.langSelect);

        this.container.appendChild(leftSide);
        this.container.appendChild(rightSide);

        this.model.addObserver(this);
    }
}
