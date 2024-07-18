import { Observer } from "./observer";

export default interface View extends Observer {
  root: HTMLElement;
}
