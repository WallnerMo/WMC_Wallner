// 🗓️ Datum des letzten Schultags (2025-06-26T18:40:00 )
const endDate = new Date("2025-06-26T18:40:00");

const countdownEl = document.getElementById("countdown");//Holt das HTML-Element, in dem der Countdown angezeigt werden soll.

function updateCountdown() {
  const now = new Date();
  const diff = endDate - now;

  if (diff <= 0) {
    countdownEl.innerText = "FERIEN! 🎉🎉🎉";
    party();
    clearInterval(timer);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownEl.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

const timer = setInterval(updateCountdown, 1000);
updateCountdown(); // direkt beim Laden starten

function party() { //Wenn der Countdown abgelaufen ist, wird jede Sekunde Konfetti ausgelöst (mit der externen Bibliothek confetti).
  setInterval(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, 1000);
}

// Funktion für Konfetti
function konfettiAbfeuern() {
    confetti({
        particleCount: 100,
        spread: 110,
        origin: { y: 0.6 }
    });
}

// Konfetti auslösen, wenn man mit der Maus über den Countdown fährt
const countdownE = document.getElementById("countdown");
if (countdownEl) {
    countdownEl.addEventListener("mouseenter", () => {
        const interval = setInterval(konfettiAbfeuern, 600);
        countdownEl.addEventListener("mouseleave", () => clearInterval(interval), { once: true });
    });
}