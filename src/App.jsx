import { useState } from "react";
import QuoteCard from "./components/QuoteCard";
import quotes from "./data/quotes";
import "./App.css";

function App() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  const [favorites, setFavorites] = useState([]);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);

    setCurrentQuote(quotes[randomIndex]);
  };

  const copyQuote = async () => {
    const textToCopy = `"${currentQuote.text}" — ${currentQuote.author}`;

    await navigator.clipboard.writeText(textToCopy);

    alert("Quote copied!");
  };

  const toggleFavorite = () => {
    const alreadyFavorite = favorites.some(
      (quote) => quote.id === currentQuote.id
    );

    if (alreadyFavorite) {
      setFavorites(
        favorites.filter(
          (quote) => quote.id !== currentQuote.id
        )
      );
    } else {
      setFavorites([...favorites, currentQuote]);
    }
  };

  const shareQuote = async () => {
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;

    if (navigator.share) {
      await navigator.share({
        title: "Random Quote",
        text: text
      });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Quote copied! You can share it anywhere.");
    }
  };

  const isFavorite = favorites.some(
    (quote) => quote.id === currentQuote.id
  );

  return (
    <div className="app">

      <header className="header">
        <h1>Random Quote Generator</h1>

        <p>
          Get inspired with a new quote every time.
        </p>
      </header>

      <main>

        <QuoteCard
          quote={currentQuote}
          onNewQuote={getRandomQuote}
          onCopy={copyQuote}
          onFavorite={toggleFavorite}
          onShare={shareQuote}
          isFavorite={isFavorite}
        />

      </main>

      <footer>
        <p>
          Built with React.js ❤️
        </p>
      </footer>

    </div>
  );
}

export default App;