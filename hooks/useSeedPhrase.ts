import { useEffect, useState } from "react";

const mock = new Array<string>(24).fill("test");

export default function useSeedPhrase() {
  const [phrase, setPhrase] = useState<string[]>(mock);
  // useEffect(() => {
  //   Seed.generate().then(setPhrase);
  // }, []);

  return phrase;
}
