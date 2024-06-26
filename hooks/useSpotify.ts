import { useState } from "react";
import axios from "axios";
import qs from "qs";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
global.Buffer = require("buffer").Buffer;

export default () => {
  const [token, setToken] = useState(null);
  const [song, setSong] = useState(null);
  const [songList, setSongList] = useState([]);

  //  const client_id = "d99c18fbd8354e78b92d5d46b09c103e";
  //  const client_secret = "17a84693860e4e5790443a25d089b737";

  const refreshToken = async (client_id: string, client_secret: string) => {
    axios
      .post(
        "https://accounts.spotify.com/api/token",
        qs.stringify({
          grant_type: "client_credentials",
          json: true,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(client_id + ":" + client_secret).toString("base64"),
          },
        }
      )
      .then(function (response) {
        setToken(response.data.access_token);
      })
      .catch(function (err) {
        "err:%o", err;
      });
  };

  const getSongForName = async (songName) => {
    axios
      .get(
        `https://api.spotify.com/v1/search?q=track:${encodeURIComponent(
          songName
        )}&type=track&limit=10`,
        {
          params: {
            fields:
              "items(track(name, external_urls(spotify), artists(name),album(images)))",
          },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(function (response) {
        setSongList(response.data.tracks.items);

        return;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const setSpotifySong = async (songId: string) => {
    axios
      .get(`https://api.spotify.com/v1/tracks/${songId}/`, {
        params: {
          fields: "items(track(name,preview_url, artists(name),album(images)))",
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        setSong(response.data);

        return;
      })
      .catch(function (error) {
        console.log("token", token);
        console.log(error);
      });
  };

  return {
    refreshToken,
    setSpotifySong,
    song,
    getSongForName,
    songList,
  };
};
