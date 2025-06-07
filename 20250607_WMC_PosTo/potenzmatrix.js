// Funktion zum Einlesen einer CSV-Datei und Umwandeln in eine Matrix (mit verschiedenen Trennzeichen)
function csvToMatrix(csvText) {
    // Erkenne das Trennzeichen automatisch: Komma, Semikolon, Tab, Pipe
    const lines = csvText.trim().split(/\r?\n/);
    // Finde das Trennzeichen in der ersten Zeile
    const firstLine = lines[0];
    let delimiter = ",";
    if (firstLine.includes(";")) delimiter = ";";
    else if (firstLine.includes("\t")) delimiter = "\t";
    else if (firstLine.includes("|")) delimiter = "|";

    return lines.map(line =>
        line.split(delimiter).map(val => Number(val.trim()))
    );
}
// Funktion zum Anzeigen der Matrix in einem HTML-Div
function printMatrixToDiv(matrix) {
    const output = document.getElementById("matrixOutput");
    if (!output) return;
    output.innerHTML = "<b>Eingelesene Matrix:</b><br>" +
        "<pre style='font-family:monospace;'>" +
        matrix.map(row => row.join(" ")).join("\n") +
        "</pre>";
}

function multiplyMatrices(a, b) {
    const n = a.length;
    const m = b[0].length;
    const result = Array.from({ length: n }, () => Array(m).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            for (let k = 0; k < b.length; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}

// Matrix potenzieren
function matrixPower(matrix, n) {
    if (n === 1) return matrix;
    let result = matrix;
    for (let i = 1; i < n; i++) {
        result = multiplyMatrices(result, matrix);
    }
    return result;
}

// Alle Potenzen bis zur Knotenzahl berechnen
function printAllPowers(matrix) {
    const output = document.getElementById("matrixOutput");
    if (!output) return;
    output.innerHTML = "<b>Eingelesene Matrix:</b><br>" +
        "<pre style='font-family:monospace;'>" +
        matrix.map(row => row.join(" ")).join("\n") +
        "</pre>";

    for (let n = 2; n <= matrix.length; n++) {
        const potenz = matrixPower(matrix, n);
        output.innerHTML += `<br><b>Potenzmatrix (n=${n}):</b><br>
            <pre style='font-family:monospace;'>${potenz.map(row => row.join(" ")).join("\n")}</pre>`;
    }
}

let lastMatrix = null; // Speichert die zuletzt eingelesene Matrix
let lastLabels = null; // Speichert die Knotennamen

// Hilfsfunktion: Matrix als Tabelle mit ausgerichteten Spalten und Labels ausgeben
function matrixToAlignedText(matrix, labels) {
    const n = matrix.length;
    // Spaltenbreite bestimmen: max(Länge von Label, max Länge aller Zahlen in der Spalte)
    let colWidths = Array(n).fill(1);
    for (let j = 0; j < n; j++) {
        let maxLen = 1;
        for (let i = 0; i < n; i++) {
            maxLen = Math.max(maxLen, String(matrix[i][j]).length);
        }
        // Die Spaltenbreite ist die maximale Breite von Zahl oder Label
        if (labels && labels[j]) {
            maxLen = Math.max(maxLen, labels[j].length);
        }
        colWidths[j] = maxLen;
    }
}
   // Neue Funktion: Matrix als HTML-Tabelle mit Gitter
function matrixToGridHTML(matrix, labels) {
    const n = matrix.length;
    let html = `<div class="matrix-pre"><div class="matrix-grid" style="grid-template-columns: repeat(${n + 1}, auto);">`;

    // Kopfzeile
    html += `<div class="matrix-cell matrix-label"></div>`;
    for (let j = 0; j < n; j++) {
        html += `<div class="matrix-cell matrix-label">${labels && labels[j] ? labels[j] : ""}</div>`;
    }

    // Matrixzeilen
    for (let i = 0; i < n; i++) {
        html += `<div class="matrix-cell matrix-label">${labels && labels[i] ? labels[i] : ""}</div>`;
        for (let j = 0; j < n; j++) {
            html += `<div class="matrix-cell">${matrix[i][j]}</div>`;
        }
    }
    html += `</div></div>`;
    return html;
}

// Funktion zum Anzeigen der Matrix mit Labels
function printMatrixToDiv(matrix, labels) {
    const output = document.getElementById("matrixOutput");
    if (!output) return;
    let html = "<b>Eingelesene Matrix:</b><br>";
    html += matrixToGridHTML(matrix, labels);
    output.innerHTML = html;
}

// Funktion zum Anzeigen aller Potenzen mit Labels
function printAllPowers(matrix, labels) {
    const output = document.getElementById("matrixOutput");
    if (!output) return;
    printMatrixToDiv(matrix, labels);

    const maxPotenz = Math.min(10, matrix.length);
    let stop = false;

    for (let n = 2; n <= maxPotenz && !stop; n++) {
        const potenz = matrixPower(matrix, n);

        // Prüfe, ob es noch eine 0 außerhalb der Diagonalen (AA bis TT) gibt
        let hasZero = false;
        for (let i = 0; i < potenz.length; i++) {
            for (let j = 0; j < potenz.length; j++) {
                // Diagonale: Label[i] === Label[j] (z.B. AA, BB, ..., TT)
                if (i !== j && potenz[i][j] === 0) {
                    hasZero = true;
                    break;
                }
            }
            if (hasZero) break;
        }

        let html = `<br><b>Potenzmatrix (n=${n}):</b><br>`;
        html += matrixToGridHTML(potenz, labels);
        output.innerHTML += html;

        if (!hasZero) {
            stop = true;
        }
    }
}

// Hilfsfunktion: Automatische Knotennamen-Generierung (A, B, ..., Z, A1, B1, ...)
function generateAutoLabels(n) {
    const labels = [];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < n; i++) {
        if (i < 26) {
            labels.push(alphabet[i]);
        } else {
            // Nach Z kommt A1, B1, ...
            const letter = alphabet[i % 26];
            const num = Math.floor(i / 26);
            labels.push(letter + num);
        }
    }
    return labels;
}

// Funktion zur Berechnung der Exzentrizität, Durchmesser, Radius und Zentrum
function berechneExzentrizitaet(matrix, labels) {
    const n = matrix.length;
    let reach = matrix.map(row => row.slice());
    let exz = Array(n).fill(-1);

    // Exzentrizität berechnen
    for (let k = 1; k <= n; k++) {
        for (let i = 0; i < n; i++) {
            if (exz[i] !== -1) continue;
            let erreichbar = true;
            for (let j = 0; j < n; j++) {
                if (i !== j && reach[i][j] === 0) {
                    erreichbar = false;
                    break;
                }
            }
            if (erreichbar) exz[i] = k;
        }
        if (exz.every(e => e !== -1)) break;
        reach = multiplyMatrices(reach, matrix);
    }

    // Durchmesser, Radius, Zentrum berechnen
    const erreichbareExz = exz.filter(e => e !== -1);
    const durchmesser = erreichbareExz.length > 0 ? Math.max(...erreichbareExz) : "nicht definiert";
    const radius = erreichbareExz.length > 0 ? Math.min(...erreichbareExz) : "nicht definiert";
    const zentrum = [];
    for (let i = 0; i < n; i++) {
        if (exz[i] === radius) zentrum.push(labels[i]);
    }

    // Ausgabe als Grid (mehrspaltig)
    let html = `<div style="margin-top:16px;"><b>Exzentrizität der Knoten:</b><br>`;
    html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; margin-top: 8px;">`;
    for (let i = 0; i < n; i++) {
        html += `<div><b>${labels[i]}</b>: ${exz[i] !== -1 ? exz[i] : "nicht erreichbar"}</div>`;
    }
    html += "</div></div>";

    // Durchmesser, Radius, Zentrum ausgeben
    html += `<div style="margin-top:16px;"><b>Durchmesser:</b> ${durchmesser}</div>`;
    html += `<div><b>Radius:</b> ${radius}</div>`;
    html += `<div><b>Zentrums Knoten:</b> ${zentrum.length > 0 ? zentrum.join(", ") : "kein Zentrum"}</div>`;

    document.getElementById("matrixOutput").innerHTML += html;
}

// Funktion zur Berechnung der Wegmatrix (Erreichbarkeitsmatrix)
function berechneWegmatrix(matrix, labels) {
    const n = matrix.length;
    // Kopie der Matrix für die Potenzierung
    let reach = matrix.map(row => row.slice());
    // Wegmatrix initialisieren (0/1)
    let wegmatrix = matrix.map(row => row.map(val => val ? 1 : 0));

    // Potenziere bis zur n-ten Potenz und merke, ob ein Weg existiert
    for (let k = 2; k <= n; k++) {
        reach = multiplyMatrices(reach, matrix);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (reach[i][j] > 0) wegmatrix[i][j] = 1;
            }
        }
    }
      // Ausgabe als Gitter
    let html = `<div style="margin-top:16px;"><b>Wegmatrix (Erreichbarkeitsmatrix):</b><br>`;
    html += matrixToGridHTML(wegmatrix, labels);
    html += "</div>";
    document.getElementById("matrixOutput").innerHTML += html;
}

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("csvInput");
    if (fileInput) {
        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                const csvText = e.target.result;
                const matrix = csvToMatrix(csvText);
                lastMatrix = matrix; // Matrix speichern

                // Automatische Labels generieren
                const n = matrix.length;
                lastLabels = generateAutoLabels(n);

                printMatrixToDiv(matrix, lastLabels); // Matrix mit Labels anzeigen
            };
            reader.readAsText(file);
        });
    }

    // Button-Event für Berechnen
    const berechnenBtn = document.querySelector("button[onclick='rechnen()']");
    if (berechnenBtn) {
        berechnenBtn.addEventListener("click", function() {
            if (lastMatrix) {
                printAllPowers(lastMatrix, lastLabels);
                berechneWegmatrix(lastMatrix, lastLabels);
                berechneExzentrizitaet(lastMatrix, lastLabels);
            }
        });
    }
});

// Dummy-Funktion, damit kein Fehler im HTML entsteht
function rechnen() {}