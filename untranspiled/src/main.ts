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

const body = document.createElement("div");
body.id = "body";

root.appendChild(new ToolbarView(model).root);
body.appendChild(left);
body.appendChild(new RightView(model).root);
root.appendChild(body);
