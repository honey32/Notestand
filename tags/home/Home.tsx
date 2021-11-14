import { h } from "maquette";
import { useLocale } from "../../scripts/i18n";
import { AccountInfo, SignInButton } from "./AccountInfo";
import { LanguageSelect } from "./LanguageSelect";
import { NewAlbum } from "./NewAlbum";
import { AlbumList } from "./AlbumList";
import * as React from "react";

function HomeHeading() {
  const [i18n] = useLocale();
  return (
    <div id="home_heading">
      <div id="home_heading_text">{i18n.home.albumList}</div>
      <AccountInfo />
    </div>
  );
}

function LinkToAbout() {
  const [i18n] = useLocale();
  return (
    <div id="link_to_about_wrapper">
      <a href="/" id="link_to_about">
        {i18n.home.about}
      </a>
    </div>
  );
}

const Home: React.FC = () => {
  return (
    <div>
      <HomeHeading />
      <AlbumList />
      <SignInButton />
      <LanguageSelect />
      <NewAlbum />
      <LinkToAbout />
    </div>
  );
};

export default Home;
