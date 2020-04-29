import { h } from "maquette/dist/h";

export function nend_ad(){
    return h('div#nend_ad_wrapper', { afterCreate })
}

function afterCreate(elem: HTMLElement) {
    elem.innerHTML = `
        <script type="text/javascript">
        var nend_params = {"media":52807,"site":289529,"spot":845236,"type":10,"oriented":1};
        </script>
        <script type="text/javascript" src="https://js1.nend.net/js/nendAdLoader.js"></script>    
    `
}