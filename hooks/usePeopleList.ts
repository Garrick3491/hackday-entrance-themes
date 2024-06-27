import { useState } from "react";

export default () => {
  const [people, setPeople] = useState(require("@/public/songs/songs.json"));

  const getPersonForId = (id) => {
    return people.find((person) => person.id === id);
  };

  return {
    getPeople: () => {
      return people;
    },
    setPeople,
    getPersonForId,
  };
};
