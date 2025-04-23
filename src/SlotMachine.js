import React, { useState } from "react";
import "./SlotMachine.css";

const SlotMachine = () => {
  const allaSymboler = ["🍎", "🍒", "🍋", "🍉", "🍌", "🍇", "🍊", "🍓", "🍍", "🥝", "🥭", "🍑"];
  
  // Hjul med 12 symboler per hjul
  const [hjul, setHjul] = useState([
    Array(12).fill(null).map(() => allaSymboler[Math.floor(Math.random() * allaSymboler.length)]),
    Array(12).fill(null).map(() => allaSymboler[Math.floor(Math.random() * allaSymboler.length)]),
    Array(12).fill(null).map(() => allaSymboler[Math.floor(Math.random() * allaSymboler.length)]),
  ]);

  const [poäng, setPoäng] = useState(100); // Startpoäng för spelaren
  const [insats, setInsats] = useState(0); // Aktuell insats
  const [meddelande, setMeddelande] = useState("");
  const [bästaPoäng, setBästaPoäng] = useState(0);

  const snurraLjud = new Audio("/spin.mp3");
  const vinstLjud = new Audio("/win.mp3");

  // Justera insatsen
  const ökaInsats = () => {
    if (poäng > insats) {
      setInsats(insats + 10); // Öka insatsen med 10 poäng
    } else {
      setMeddelande("Du har inte tillräckligt med poäng!");
    }
  };

  const maxInsats = () => {
    setInsats(poäng); // Sätt insatsen till alla tillgängliga poäng
  };

  const snurraHjul = () => {
    if (insats === 0) {
      setMeddelande("Sätt en insats innan du snurrar!");
      return;
    }

    snurraLjud.play();

    // Generera nya symboler för hjul med "scroll"-effekt
    const nyaHjul = hjul.map((hjul) =>
      [...hjul.slice(1), hjul[0]] // Flytta första elementet till slutet för att simulera snurr
    );
    setHjul(nyaHjul);

    // Kontrollera om central linje har en vinstkombination
    const centralSymboler = nyaHjul.map((hjul) => hjul[6]); // Symboler från central linje (index 6)

    if (
      centralSymboler[0] === centralSymboler[1] && 
      centralSymboler[1] === centralSymboler[2]
    ) {
      vinstLjud.play();
      const vinst = insats * 2; // Multiplicera insatsen vid vinst
      setPoäng(poäng + vinst);
      setMeddelande(`🎉 Grattis! Du vann ${vinst} poäng! 🎉`);
    } else {
      setPoäng(poäng - insats); // Dra av insatsen vid förlust
      setMeddelande("😢 Försök igen!");
    }

    // Nollställ insatsen efter snurr
    setInsats(0);

    if (poäng > bästaPoäng) {
      setBästaPoäng(poäng);
    }
  };

  const återställPoäng = () => {
    setPoäng(100); // Återställ till startpoängen
    setInsats(0);
    setMeddelande("");
  };

  return (
    <div className="slot-spel">
      <h2>🎰 Slotmaskin 🎰</h2>
      <p>Poäng: {poäng}</p>
      <p>Insats: {insats}</p>
      <div className="hjul">
        {hjul.map((kolumn, indexKolumn) => (
          <div key={indexKolumn} className="slot-kolumn">
            {/* Visa endast 3 synliga symboler per kolumn */}
            {kolumn.slice(5, 8).map((symbol, indexSymbol) => (
              <span key={indexSymbol} className="slot">
                {symbol}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="knappar">
        <button onClick={ökaInsats}>Satsa +10</button>
        <button onClick={maxInsats}>Max Satsa</button>
        <button onClick={snurraHjul}>Snurra</button>
        <button onClick={återställPoäng}>Återställ</button>
      </div>
      <p>{meddelande}</p>
    </div>
  );
};

export default SlotMachine;
