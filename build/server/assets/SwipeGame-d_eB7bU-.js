import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { A as AppContent, C as Card, a as AppFooter, f as fetchAllItemsFromCategory, b as fetchGroupData } from "./server-build-B7Qybszt.js";
import "node:stream";
import "@react-router/node";
import "isbot";
import "react-dom/server";
import "lucide-react";
function useSwipeGame(items, cardCount) {
  const [gameState, setGameState] = useState("loading");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [displayCards, setDisplayCards] = useState([]);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    mistakes: []
  });
  useEffect(() => {
    if (!items || items.length === 0) {
      setGameState("error");
      return;
    }
    const count = cardCount === "all" ? items.length : parseInt(cardCount);
    let deck = [];
    while (deck.length < count) {
      const remaining = count - deck.length;
      const itemsToAdd = [...items].sort(() => Math.random() - 0.5).slice(0, remaining);
      deck = [...deck, ...itemsToAdd];
    }
    const answers = {};
    const display = [];
    deck.forEach((card, idx) => {
      const isCorrectMeaning = Math.random() > 0.5;
      if (isCorrectMeaning) {
        display.push(card);
      } else {
        let wrongCard;
        do {
          wrongCard = items[Math.floor(Math.random() * items.length)];
        } while (wrongCard.romaji === card.romaji);
        display.push({
          ...card,
          romaji: wrongCard.romaji
        });
      }
      answers[`${idx}-${card.id}`] = isCorrectMeaning;
    });
    setCards(deck);
    setDisplayCards(display);
    setCorrectAnswers(answers);
    setGameState("playing");
  }, [items, cardCount]);
  const handleSwipe = useCallback((isCorrect, swipeDirection) => {
    const nextIndex = currentIndex + 1;
    if (!isCorrect) {
      setStats((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        mistakes: [...prev.mistakes, {
          realCard: cards[currentIndex],
          // The actual character
          displayedCard: displayCards[currentIndex],
          // What was shown (with possibly wrong meaning)
          userAction: swipeDirection,
          // 'left' or 'right'
          wasCorrectPairing: correctAnswers[`${currentIndex}-${cards[currentIndex].id}`]
        }]
      }));
    } else {
      setStats((prev) => ({
        ...prev,
        correct: prev.correct + 1
      }));
    }
    if (nextIndex >= cards.length) {
      setGameState("finished");
    } else {
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, cards]);
  const getCardStack = useCallback(() => {
    return displayCards.slice(currentIndex, currentIndex + 4);
  }, [displayCards, currentIndex]);
  return {
    gameState,
    currentCard: displayCards[currentIndex],
    // Show what user sees
    realCard: cards[currentIndex],
    // The actual card for tracking
    cardStack: getCardStack(),
    currentIndex,
    totalCards: cards.length,
    stats,
    handleSwipe,
    correctAnswer: cards[currentIndex] ? correctAnswers[`${currentIndex}-${cards[currentIndex].id}`] : null
  };
}
function SwipeCard({ card, index, isActive, onSwipe, correctAnswer }) {
  const [swipeState, setSwipeState] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [flashOpacity, setFlashOpacity] = useState(0);
  if (!card) return null;
  const handleTouchStart = (e) => {
    if (!isActive) return;
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchMove = (e) => {
    if (!isActive || swipeState) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStart;
    const maxDiff = 150;
    if (Math.abs(diff) > 20) {
      setRotateZ(diff / maxDiff * 15);
      setTranslateX(diff);
    }
  };
  const handleTouchEnd = async () => {
    if (!isActive) return;
    const threshold = 80;
    const isSwipedLeft = translateX < -threshold;
    const isSwipedRight = translateX > threshold;
    if (isSwipedLeft || isSwipedRight) {
      const userThinkCorrect = isSwipedRight;
      const isCorrect = userThinkCorrect === correctAnswer;
      setSwipeState(isCorrect ? "correct" : "incorrect");
      setFlashOpacity(1);
      await new Promise((resolve) => {
        setTimeout(() => {
          setFlashOpacity(0);
        }, 200);
        setTimeout(resolve, 300);
      });
      setTranslateX(isSwipedLeft ? -500 : 500);
      setRotateZ(isSwipedLeft ? -45 : 45);
      setOpacity(0);
      await new Promise((resolve) => setTimeout(resolve, 300));
      onSwipe(isCorrect, isSwipedRight ? "right" : "left");
    } else {
      setRotateZ(0);
      setTranslateX(0);
    }
  };
  const getBackgroundColor = () => {
    return "var(--color-surface)";
  };
  const getFlashColor = () => {
    if (swipeState === "correct") return "rgba(16, 185, 129, 0.8)";
    if (swipeState === "incorrect") return "rgba(239, 68, 68, 0.8)";
    return "transparent";
  };
  const getZIndex = () => {
    return 100 - index;
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      style: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `
          translateX(calc(-50% + ${translateX}px))
          translateY(-50%)
          rotateZ(${rotateZ}deg)
        `,
        width: "90%",
        maxWidth: "380px",
        height: "520px",
        backgroundColor: getBackgroundColor(),
        borderRadius: "24px",
        border: "2px solid var(--color-surface-light)",
        zIndex: getZIndex(),
        cursor: isActive ? "grab" : "default",
        transition: "transform 0.05s ease-out",
        padding: "var(--spacing-8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        color: "var(--color-text-primary)",
        opacity,
        userSelect: "none",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
      },
      children: [
        swipeState && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              backgroundColor: getFlashColor(),
              opacity: flashOpacity,
              transition: "opacity 0.3s ease",
              pointerEvents: "none",
              zIndex: 10,
              borderRadius: "24px"
            }
          }
        ),
        /* @__PURE__ */ jsx("div", { style: {
          fontSize: "18px",
          color: "var(--color-text-secondary)",
          textAlign: "center",
          fontWeight: "600",
          letterSpacing: "0.3px",
          marginBottom: "var(--spacing-6)"
        }, children: "Ist das Zeichen richtig zugeordnet?" }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--spacing-4)" }, children: [
          card.character && /* @__PURE__ */ jsx("div", { style: { fontSize: "160px", fontWeight: "700", lineHeight: 0.9 }, children: card.character }),
          card.word && /* @__PURE__ */ jsx("div", { style: { fontSize: "56px", fontWeight: "700", textAlign: "center", lineHeight: 1 }, children: card.word })
        ] }),
        card.romaji && /* @__PURE__ */ jsx("div", { style: {
          fontSize: "32px",
          color: "#ec4899",
          fontWeight: "700",
          letterSpacing: "1px",
          fontStyle: "italic",
          marginBottom: "var(--spacing-6)",
          padding: "0 var(--spacing-4)",
          textAlign: "center"
        }, children: card.romaji }),
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "300px",
          gap: "var(--spacing-6)",
          opacity: swipeState ? 0 : 1,
          transition: "opacity 0.2s ease"
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            padding: "var(--spacing-4)",
            borderRadius: "18px",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            color: "#ef4444",
            fontSize: "32px",
            fontWeight: "bold",
            transition: "all 0.2s ease"
          }, children: [
            "←",
            /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: "700", letterSpacing: "0.5px" }, children: "Falsch" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            padding: "var(--spacing-4)",
            borderRadius: "18px",
            backgroundColor: "rgba(236, 72, 153, 0.2)",
            color: "#ec4899",
            fontSize: "32px",
            fontWeight: "bold",
            transition: "all 0.2s ease"
          }, children: [
            "→",
            /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: "700", letterSpacing: "0.5px" }, children: "Richtig" })
          ] })
        ] })
      ]
    }
  );
}
function SwipeGame({ contentType, groupId, cardCount }) {
  useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const game = useSwipeGame(items, cardCount);
  useEffect(() => {
    const loadData = async () => {
      try {
        let data;
        if (groupId === "all") {
          data = await fetchAllItemsFromCategory(contentType);
        } else {
          data = await fetchGroupData(contentType, groupId);
        }
        setItems(data.items || []);
      } catch (err) {
        setError(err.message);
        console.error("Failed to load game data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [contentType, groupId]);
  if (loading) {
    return /* @__PURE__ */ jsx(AppContent, { children: /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }, children: /* @__PURE__ */ jsx("p", { style: { color: "var(--color-text-tertiary)" }, children: "Spiel wird vorbereitet..." }) }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx(AppContent, { children: /* @__PURE__ */ jsxs("div", { style: { padding: "var(--spacing-4)", backgroundColor: "#fee2e2", borderRadius: "var(--radius-md)", color: "#991b1b" }, children: [
      "Fehler: ",
      error
    ] }) });
  }
  if (game.gameState === "finished") {
    const total = game.stats.correct + game.stats.incorrect;
    const percentage = total > 0 ? Math.round(game.stats.correct / total * 100) : 0;
    return /* @__PURE__ */ jsx(AppContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { style: { textAlign: "center" }, children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", style: { color: "var(--color-text-primary)", margin: "0 0 var(--spacing-4) 0" }, children: "Spiel beendet! 🎉" }),
        /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-tertiary", style: { margin: 0 }, children: "Richtig" }),
            /* @__PURE__ */ jsxs("p", { className: "text-3xl font-bold", style: { color: "#10b981", margin: "0" }, children: [
              game.stats.correct,
              "/",
              total
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-tertiary", style: { margin: 0 }, children: "Prozentsatz" }),
            /* @__PURE__ */ jsxs("p", { className: "text-3xl font-bold", style: { color: "var(--color-primary)", margin: "0" }, children: [
              percentage,
              "%"
            ] })
          ] })
        ] })
      ] }) }),
      game.stats.mistakes.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-base font-medium text-primary", style: { marginBottom: "var(--spacing-3)" }, children: [
          "Fehler (",
          game.stats.mistakes.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: game.stats.mistakes.map((mistake, idx) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", style: { color: "var(--color-text-primary)", margin: 0 }, children: mistake.realCard?.character || mistake.realCard?.word || "?" }),
            /* @__PURE__ */ jsx("span", { style: { fontSize: "24px" }, children: "❌" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { padding: "var(--spacing-2) var(--spacing-3)", backgroundColor: "var(--color-surface-light)", borderRadius: "var(--radius-md)" }, children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-tertiary", style: { margin: "0 0 var(--spacing-1) 0" }, children: "Gezeigt:" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", style: { color: "var(--color-text-primary)", margin: 0 }, children: mistake.displayedCard?.romaji || "?" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { padding: "var(--spacing-2) var(--spacing-3)", backgroundColor: "rgba(16, 185, 129, 0.1)", borderRadius: "var(--radius-md)", border: "1px solid #10b981" }, children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-tertiary", style: { margin: "0 0 var(--spacing-1) 0" }, children: "Korrekt:" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", style: { color: "#10b981", margin: 0 }, children: mistake.realCard?.romaji || "?" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--spacing-2)", fontSize: "12px", color: "var(--color-text-tertiary)" }, children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Du: ",
              mistake.userAction === "right" ? "➡️ Richtig" : "⬅️ Falsch"
            ] }),
            /* @__PURE__ */ jsx("span", { children: "•" }),
            /* @__PURE__ */ jsx("span", { children: mistake.wasCorrectPairing ? "War korrekt" : "War falsch" })
          ] })
        ] }) }, idx)) })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs(AppContent, { children: [
    /* @__PURE__ */ jsx("div", { style: { position: "relative", height: "600px", marginBottom: "var(--spacing-6)" }, children: game.cardStack.map((card, idx) => /* @__PURE__ */ jsx(
      SwipeCard,
      {
        card,
        index: idx,
        isActive: idx === 0,
        onSwipe: game.handleSwipe,
        correctAnswer: idx === 0 ? game.correctAnswer : void 0
      },
      `${game.currentIndex + idx}`
    )) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-primary", children: [
          "Karte ",
          game.currentIndex + 1,
          " / ",
          game.totalCards
        ] }),
        /* @__PURE__ */ jsxs("span", { style: { fontSize: "14px", fontWeight: "600", color: "var(--color-primary)" }, children: [
          Math.round((game.currentIndex + 1) / game.totalCards * 100),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { style: { width: "100%", backgroundColor: "var(--color-surface-light)", borderRadius: "9999px", height: "8px" }, children: /* @__PURE__ */ jsx("div", { style: {
        background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
        height: "8px",
        borderRadius: "9999px",
        transition: "width 0.3s ease",
        width: `${(game.currentIndex + 1) / game.totalCards * 100}%`
      } }) })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "grid-2", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-tertiary", style: { margin: 0 }, children: "Richtig" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", style: { color: "#10b981", margin: 0 }, children: game.stats.correct })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-tertiary", style: { margin: 0 }, children: "Falsch" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", style: { color: "#ef4444", margin: 0 }, children: game.stats.incorrect })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AppFooter, { children: /* @__PURE__ */ jsx("p", { className: "text-sm text-tertiary", style: { width: "100%", textAlign: "center", margin: 0 }, children: "Wische ➡️ richtig | Wische ⬅️ falsch" }) })
  ] });
}
export {
  SwipeGame as default
};
