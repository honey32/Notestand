import { launch } from 'carlo';
import { AlbumIdStore, TempolaryIdStore } from "./albumid";
import { fileServer } from "./file_server";
import { frontend_server } from "./frontend_server";
import { default as micro } from "micro";

export const startApp = async () => {
    const albums = new AlbumIdStore()
    const tunes = new TempolaryIdStore()
    const frontend = frontend_server
    const server = micro(fileServer({ albums, tunes }, frontend)).listen(3000)

    // Launch the browser.
    const app = await launch();

    // Terminate Node.js process on app window closing.
    app.on('exit', () => process.exit());

    app.serveOrigin(`http://localhost:${server.address().port}`)

    // Navigate to the main page of your app.
    await app.load(`/app/index.html`);
}