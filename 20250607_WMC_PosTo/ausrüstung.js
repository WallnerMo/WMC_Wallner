 
const API_URL = "https://mhw-db.com/weapons";

async function ladeWaffen() {
    try {
        const response = await fetch(API_URL);
        const daten = await response.json();
        zeigeWaffen(daten.slice(0, 50)); // nur die ersten 50 anzeigen
    } catch (error) {
        console.error("Fehler beim Laden der Waffen:", error);
    }
}

function zeigeWaffen(waffen) {
    const container = document.getElementById("waffen-liste");
    container.innerHTML = "";
    container.className = "row p-3";

    waffen.forEach(waffe => {
        let elementText = "Kein Element";
        if (waffe.elements && waffe.elements.length > 0) {
            elementText = waffe.elements.map(el => {
                const hidden = el.hidden ? " (versteckt)" : "";
                return \`\${el.type} \${el.damage}\${hidden}\`;
            }).join(", ");
        }

        const div = document.createElement("div");
        div.className = "col-md-4 mb-4";
        div.innerHTML = `
            <div class="card card-body">
                <h5 class="card-title">${waffe.name}</h5>
                <p><strong>Typ:</strong> ${waffe.type}</p>
                <p><strong>Angriff:</strong> ${waffe.attack?.display ?? 'Unbekannt'}</p>
                <p><strong>Elemente:</strong> ${elementText}</p>
                <p><strong>Seltenheit:</strong> ${waffe.rarity}</p>
            </div>
        `;
        container.appendChild(div);
    });
}

window.addEventListener("DOMContentLoaded", ladeWaffen);