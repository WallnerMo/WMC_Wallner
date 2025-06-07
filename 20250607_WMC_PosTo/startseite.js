// Funktion zeigt 4 Platzhalter an, die beim Klick die Dekorationen laden
function zeigePlatzhalterDekorationen() {
    const output = document.getElementById("dekoOutput");
    if (output) {
        output.innerHTML = `
            <div class="deko-ausgabe-wrapper">
                <div id="dekoPlatzhalterRow" class="deko-karten-row">
                    ${[1,2,3,4].map(i =>
                        `<span class="deko-platzhalter">?</span>`
                    ).join("")}
                </div>
            </div>
        `;
        // Füge EventListener für die Platzhalter hinzu
        document.querySelectorAll('.deko-platzhalter').forEach(el => {
            el.addEventListener('click', zeigeZufaelligeDekorationen, { once: true });
        });
    }
}

async function zeigeZufaelligeDekorationen() {
    const url = "https://mhw-db.com/decorations";
    const response = await fetch(url);
    const dekos = await response.json();

    // Gewichtete Liste: Je höher die rarity, desto seltener kommt die Deko vor
    // Gewicht = 1 / rarity^2 (Quadratisch, damit hohe rarity wirklich selten ist)
    let gewichteteDekos = [];
    dekos.forEach(d => {
        const rarity = d.rarity || 1;
        // Je höher die rarity, desto kleiner das Gewicht
        const gewicht = 1 / (rarity * rarity);
        // Multipliziere das Gewicht mit 100 und runde, damit es ganzzahlige Einträge gibt
        const anzahl = Math.max(1, Math.round(gewicht * 100));
        for (let i = 0; i < anzahl; i++) {
            gewichteteDekos.push(d);
        }
    });

    // 4 zufällige Dekorationen auswählen
    const zufaelligeDekos = [];
    const used = new Set();
    while (zufaelligeDekos.length < 4 && dekos.length > 0) {
        const idx = Math.floor(Math.random() * dekos.length);
        if (!used.has(idx)) {
            zufaelligeDekos.push(dekos[idx]);
            used.add(idx);
        }
    }

    // Ausgabe im HTML 
    const output = document.getElementById("dekoOutput");
    if (output) {
        output.innerHTML = `
            <div class="deko-ausgabe-wrapper">
                <div class="deko-karten-row">
                    ${zufaelligeDekos.map(d => `
                        <span class="deko-karte">
                            <div class="deko-name">${d.name}</div>
                            <div>
                                ${d.skills && d.skills.length > 0 ? `
                                    <div class="deko-skills">
                                        ${d.skills.map(s => `<div>${s.skillName || s.name}</div>`).join("")}
                                    </div>
                                    <div class="deko-skilldesc">
                                        ${d.skills.map(s => s.description).join("<br>")}
                                    </div>
                                ` : `<div class="deko-keine-skills">Keine Skills</div>`}
                            </div>
                            <div class="deko-rarity">Seltenheit: ${d.rarity ?? "-"}</div>
                        </span>
                    `).join("")}
                </div>
            </div>
        `;
    }
}

// Beim Laden der Seite Platzhalter anzeigen
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("dekoBtn");
    if (btn) {
        btn.addEventListener("click", zeigePlatzhalterDekorationen);
    }
});