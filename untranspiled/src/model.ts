import { Subject } from "./observer";
import { Memento, UndoManager } from "./undo";
import { I18nWord, generateRandomWords } from "./i18nWords";

type Game = {
    id: number;
    fontSize: number;
    numWords: number;
    randomWords: I18nWord[];
    currentWord: number;
    completed: boolean[];
    completedCount: number;
    userFocus: boolean;
}

export class Model extends Subject {
    private undoManagers: UndoManager<Game>[] = [];
    undo(){
        // spread syntax on RHS to copy object contents to Game object (avoid referencing same object)
        this.games[this.gameInFocus] = {...this.undoManagers[this.gameInFocus].undo()};
        this.notifyObservers();
    }
    redo(){
        this.games[this.gameInFocus] = {...this.undoManagers[this.gameInFocus].redo()};
        this.notifyObservers();
    }
    get canUndo(){
        return this.undoManagers[this.gameInFocus].canUndo;
    }
    get canRedo(){
        return this.undoManagers[this.gameInFocus].canRedo;
    }

    private games: Game[] = [];
    private uniqueId = 0;
    private lang = "en-CA";
    private gameInFocus = -1;
    private wordCompleted: boolean = false;

    get numGames(){
        return this.games.length;
    }
    get gameList(){
        return this.games;
    }
    get focusedGame(){
        return this.gameInFocus;
    }
    get getLang(){
        return this.lang;
    }
    get getWordCompleted(){
        return this.wordCompleted;
    }

    // business logic
    // create new game
    create(): void {
        const id = this.uniqueId++;
        const base: Game = {id: id, fontSize: 16, numWords: 20, randomWords: generateRandomWords(20),
            currentWord: 0, completed: Array(20).fill(false), completedCount: 0, userFocus: false};
        this.games = [...this.games, base];
        const state: Memento<Game> = {...{state: {...base}}}; // base is only shallow copied
        // need to copy the completed word array field to state
        state.state.completed = [...base.completed];
        this.undoManagers = [...this.undoManagers, new UndoManager<Game>(state)];
        this.notifyObservers();
    }

    delete(): void {
        if(this.gameInFocus !== -1){
            this.games.splice(this.gameInFocus, 1);
            this.undoManagers.splice(this.gameInFocus, 1);
        } else {
            this.games.pop();
            this.undoManagers.pop();
        }
        this.gameInFocus = -1;
        this.notifyObservers();
    }

    clear(): void {
        this.games = [];
        this.undoManagers = [];
        this.gameInFocus = -1;
        this.notifyObservers();
    }

    gameFocus(index: number): void {
        this.gameInFocus = index;
        this.notifyObservers();
    }

    wordFocus(index: number): void {
        if(this.games[this.gameInFocus].completed[index]){
            this.games[this.gameInFocus].completed[index] = false;
            this.games[this.gameInFocus].completedCount--;
        }
        if(this.games[this.gameInFocus].userFocus){
            if(index === this.games[this.gameInFocus].currentWord){
                this.games[this.gameInFocus].currentWord = this.games[this.gameInFocus].completed.indexOf(false);
                this.games[this.gameInFocus].userFocus = false;
            } else {
                this.games[this.gameInFocus].currentWord = index;
            }
        } else {
            this.games[this.gameInFocus].userFocus = true;
            this.games[this.gameInFocus].currentWord = index;
        }
        const state: Memento<Game> = {state: {...this.games[this.gameInFocus]}};
        state.state.completed = [...this.games[this.gameInFocus].completed];
        this.undoManagers[this.gameInFocus].execute(state);
        this.notifyObservers();
    }

    changeFontSize(size: number, mouseRelease: boolean): void {
        this.games[this.gameInFocus].fontSize = size;
        if(mouseRelease){
            const state: Memento<Game> = {state: {...this.games[this.gameInFocus]}};
            state.state.completed = [...this.games[this.gameInFocus].completed];
            this.undoManagers[this.gameInFocus].execute(state);
        }
        this.notifyObservers();
    }

    resetGame(requestCount: number): void {
        if(isNaN(requestCount)){
            requestCount = 0;
        }
        if(requestCount >= 0 && requestCount <= 9999){
            this.games[this.gameInFocus].randomWords = generateRandomWords(requestCount);
            this.games[this.gameInFocus].completed = Array(requestCount).fill(false);
        } else {
            this.games[this.gameInFocus].randomWords = [];
            this.games[this.gameInFocus].completed = [];
        }
        this.games[this.gameInFocus].completedCount = 0;
        this.games[this.gameInFocus].numWords = requestCount;
        this.games[this.gameInFocus].currentWord = 0;
        this.games[this.gameInFocus].userFocus = false;
        const state: Memento<Game> = {state: {...this.games[this.gameInFocus]}};
        state.state.completed = [...this.games[this.gameInFocus].completed];
        this.undoManagers[this.gameInFocus].execute(state);
        this.notifyObservers();
    }

    checkMatch(textInput: string): void {
        if(textInput === this.games[this.gameInFocus].randomWords[this.games[this.gameInFocus].currentWord][this.lang]){
            this.games[this.gameInFocus].completed[this.games[this.gameInFocus].currentWord] = true;
            this.games[this.gameInFocus].completedCount++;
            this.games[this.gameInFocus].currentWord = this.games[this.gameInFocus].completed.indexOf(false);
            this.wordCompleted = true;
            this.games[this.gameInFocus].userFocus = false;
            const state: Memento<Game> = {state: {...this.games[this.gameInFocus]}};
            state.state.completed = [...this.games[this.gameInFocus].completed];
            this.undoManagers[this.gameInFocus].execute(state);
        }
        this.notifyObservers();
    }

    wordCompleteTextCleared(): void {
        this.wordCompleted = false;
    }

    changeLang(lang: string): void {
        this.lang = lang;
        this.notifyObservers();
    }
}
