import { createProjector } from 'maquette'
import { homeHeading, linkToAbout } from './home';
import { albumList } from './home/album_list';
import { signInButton } from './home/account_info';
import { languageSelect } from './home/language_select';
import { newAlbum } from './home/new_album';
import { mainView } from './main_view';
import { tuneList } from './tune_list';
import { menubar } from './menubar';
import { mob_tabList } from './tab_list';
import { toast } from './commons/toast';

export const projector = createProjector()

const $id = (id: string) => document.getElementById(id)

projector.merge($id('home_heading'), homeHeading)
projector.merge($id('container_albums'), albumList)
const elem_home = $id('home')
projector.append(elem_home, signInButton)
projector.append(elem_home, languageSelect)
projector.append(elem_home, newAlbum)
projector.append(elem_home, linkToAbout)
projector.append(document.body, mainView)
projector.append(document.body, tuneList)
projector.append(document.body, menubar)
projector.append(document.body, mob_tabList)
projector.append(document.body, toast)

// const app = new App()

// projector.merge(document.body, app.render.bind(app))