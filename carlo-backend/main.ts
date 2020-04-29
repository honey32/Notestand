import { startApp } from "./exec_carlo";
import { ServerRequest, ServerResponse } from "http";
import { AlbumIdStore, TempolaryIdStore } from "./albumid";

export type ServerAction<Req extends ServerRequest = ServerRequest> = (req: Req, res: ServerResponse) => any

export interface Persistence {
    albums: AlbumIdStore
    tunes: TempolaryIdStore
}

startApp().catch(e => console.log(e))