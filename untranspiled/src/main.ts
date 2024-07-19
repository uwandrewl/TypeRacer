import { Model } from "./model";
import { ToolbarView } from "./toolbarView";
import { GameAreaView } from "./gameAreaView";
import { GameConsoleView } from "./gameConsoleView";
import { RightView } from "./rightView";

import "./main.css";

const model = new Model();
const root = document.querySelector("div#app") as HTMLDivElement;

const left = document.createElement("div");
left.id = "left";

left.appendChild(new GameAreaView(model).root);
left.appendChild(new GameConsoleView(model).root);

root.appendChild(new ToolbarView(model).root);
root.appendChild(left);
root.appendChild(new RightView(model).root);
