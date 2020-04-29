import { state } from "../scripts/store";
import { h } from "maquette";
import { tabbar } from "./tabbar";
import { scores } from "./score";
import { BaseProperty } from "hojoki";

export const isTabListOpen = new BaseProperty(false)

export function mainView() {
    return h("div#mainview", { classes: { hidden: state.value !== "Score" }}, [
            tabbar(),
            h("div#main_contents", [
                scores()
            ])
    ])
}