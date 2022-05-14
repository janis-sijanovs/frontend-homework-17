export type CharacterType = {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: CharacterOrigin;
    location: CharacterLocation;
    image: string;
    episode: string[];
    url: string;
    created: string;
  }

type CharacterOrigin = {
    name: string;
    url: string;
  }

type CharacterLocation = {
    name: string;
    url: string;
  }
