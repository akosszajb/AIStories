import React, { useEffect, useState } from "react";

const GamePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Game</h2>

      <h3>Alap story - A Lebegő Torony</h3>
      <h4>
        Ide jön pár alap instrukció a játékról, és egy kezdeti szövegrészlet
        <br />
        <br />
        `Nagy kaland? Hah! Rettegés és lopakodás egy kriptában vagy valami
        rosszabb helyen, vérontás vagy próbálkozás arra, hogy leüss dolgokat,
        melyek nem véreznek már. Ha mágus vagy, akkor az egész csak addig tart,
        míg egy másik varázsló gyorsabb nem lesz nálad. Ne beszélj nekem “nagy
        kalandról"` <br />
        Theldaun “Tűzdobó" Ieirson: Egy Dühös, Öreg Mágus Tanításai
        <br />A Griff Évében
      </h4>
      <h5>
        Hideg, tiszta nap volt még Marpenoth kezdetén, a Több Sör Évében.
        Körös-körül a fák leveleit már megérintették az arany és tűz-narancs
        színek, amikor a Bátor Pengék elérték a helyet, mit oly sokáig kerestek.
        Céljuk sötéten és csendesen függött felettük: a Lebegő Torony, a rég
        halott Ondil élettelen erődje egy szakadék mélyén rejtőzve, valahol
        nyugatra a Szarv Domboktól. Ondil tornya türelmesen lebegett, ahogy
        tette ezt már századok óta egy rettegett varázsló védelmében.
        <br />A Pengék felnéztek, azután el, a távolba - kivéve az "játékos
        neve", aki egy harciasan felemelt "első item - fegyver" a kezében állt
        és a csendesen várakozó tornyot méregette "második item (pl. kalap)"
        alól.
      </h5>
    </div>
  );
};

export default ClassListPage;
