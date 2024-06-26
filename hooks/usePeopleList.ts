import { useState } from "react";

export default () => {
  const [people, setPeople] = useState(require("@/public/songs/songs.json"));

  return {
    getPeople: () => {
      return people;
    },
    setPeople,
  };
};
