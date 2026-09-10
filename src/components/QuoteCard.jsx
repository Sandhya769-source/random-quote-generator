import {
  FaCopy,
  FaHeart,
  FaShareAlt,
  FaSyncAlt
} from "react-icons/fa";

function QuoteCard({
  quote,
  onNewQuote,
  onCopy,
  onFavorite,
  onShare,
  isFavorite
}) {
  return (
    <div className="quote-card">

      <div className="quote-mark">
        “
      </div>

      <p className="quote-text">
        {quote.text}
      </p>

      <p className="quote-author">
        — {quote.author}
      </p>

      <span className="quote-category">
        {quote.category}
      </span>

      <div className="quote-actions">

        <button
          className="action-button"
          onClick={onCopy}
          title="Copy quote"
        >
          <FaCopy />
          Copy
        </button>

        <button
          className={`action-button ${isFavorite ? "favorite-active" : ""}`}
          onClick={onFavorite}
          title="Favorite quote"
        >
          <FaHeart />
          {isFavorite ? "Favorited" : "Favorite"}
        </button>

        <button
          className="action-button"
          onClick={onShare}
          title="Share quote"
        >
          <FaShareAlt />
          Share
        </button>

      </div>

      <button
        className="new-quote-button"
        onClick={onNewQuote}
      >
        <FaSyncAlt />
        New Quote
      </button>

    </div>
  );
}

export default QuoteCard;