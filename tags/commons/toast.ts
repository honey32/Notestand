import { VNode, h } from "maquette";
import { _if } from "../utils";
import { toastShown } from "../../scripts/store";

export function toast(): VNode {
    return h("div.toast_wrapper", {}, [
        h("div.toast", { classes: { hidden: toastShown.value === null } } , [ toastShown.value || "　" ])
    ])
}