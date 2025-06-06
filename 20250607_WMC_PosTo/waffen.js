const waffen = document.getElementById("waffenRegal");

let activeType = null; // Merkt sich den aktuell geöffneten Typ
let activeWeaponId = null; // Merkt sich die aktuell geöffnete Waffe

fetch("https://mhw-db.com/weapons")
    .then((response) => response.json())
    .then((data) => {
        const weaponGroups = {};
        data.forEach((weapon) => {
            if (!weaponGroups[weapon.type]) {
                weaponGroups[weapon.type] = [];
            }
            weaponGroups[weapon.type].push(weapon);
        });

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "waffen-button-container";
        const weaponListContainer = document.createElement("div");
        weaponListContainer.id = "waffenListe";

        Object.keys(weaponGroups).forEach((type) => {
            const btn = document.createElement("button");
            btn.textContent = type;
            btn.className = "waffen-type-btn btn btn-success m-2";
            btn.addEventListener("click", () => {
                if (activeType === type) {
                    weaponListContainer.innerHTML = "";
                    activeType = null;
                    activeWeaponId = null;
                } else {
                    weaponListContainer.innerHTML = "";
                    const ul = document.createElement("ul");
                    ul.className = "waffenListe";
                    weaponGroups[type].forEach((weapon) => {
                        const li = document.createElement("li");
                        li.className = "waffenart";
                        li.setAttribute("data-weapon-id", weapon.id);

                        const weaponName = document.createElement("h3");
                        weaponName.textContent = weapon.name;
                        weaponName.style.cursor = "pointer";
                        li.appendChild(weaponName);

                        // Detailbereich für die Waffe
                        const detailsDiv = document.createElement("div");
                        detailsDiv.className = "waffen-details";
                        detailsDiv.style.display = "none";
                        li.appendChild(detailsDiv);

                        weaponName.addEventListener("click", () => {
                            // Toggle-Logik für Details
                            if (activeWeaponId === weapon.id) {
                                detailsDiv.style.display = "none";
                                activeWeaponId = null;
                            } else {
                                // Alle anderen Details schließen
                                document.querySelectorAll(".waffen-details").forEach(div => div.style.display = "none");
                                // Details füllen
                                detailsDiv.innerHTML = `
                                    <div><strong>Attack:</strong> ${weapon.attack?.display || "?"}</div>
                                    <div><strong>Affinity:</strong> ${
                                        weapon.affinity != null
                                            ? weapon.affinity
                                            : (weapon.attributes && weapon.attributes.affinity != null
                                                ? weapon.attributes.affinity
                                                : 0)
                                    }%</div>                                    
                                    <div><strong>Damage Type:</strong> ${weapon.damageType || "?"}</div>
                                    <div><strong>Element:</strong> ${
                                        (weapon.elements && weapon.elements.length > 0)
                                            ? weapon.elements.map(e => {
                                                const name = e.element ? e.element : (e.type ? e.type : "Unbekannt");
                                                if (e.damage != null) {
                                                    if (e.hidden) {
                                                        return `${name} (${e.damage})`;
                                                    } else {
                                                        return `${name} ${e.damage}`;
                                                    }
                                                } else {
                                                    return name;
                                                }
                                            }).join(", ")
                                            : "Keine"
                                    }</div>  
                                    ${renderSharpnessBar(weapon.durability)}   
                                    ${weapon.assets && weapon.assets.image ? `<div style="display:flex;justify-content:center;"><img src="${weapon.assets.image}" alt="${weapon.name}" style="max-width:120px;max-height:80px;display:block;margin-top:12px;"></div>` : ""}`;
                                detailsDiv.style.display = "block";
                                activeWeaponId = weapon.id;
                            }
                        });

                        ul.appendChild(li);
                    });
                    weaponListContainer.appendChild(ul);
                    activeType = type;
                    activeWeaponId = null;
                }
            });
            buttonContainer.appendChild(btn);
        });

        waffen.appendChild(buttonContainer);
        waffen.appendChild(weaponListContainer);
    })
    .catch((error) => {
        console.error("Fehler beim Laden der Waffen:", error);
        waffen.textContent = "Fehler beim Laden der Waffen.";
    });

 function renderSharpnessBar(durabilityArr) {
    if (!Array.isArray(durabilityArr) || durabilityArr.length === 0) return "";
    // Nimm die Basis-Schärfe (meist durability[0])
    const sharpness = durabilityArr[0];
    // Die Farben und Reihenfolge wie in der API
    const colors = [
        { key: "red",    color: "#e74c3c" },
        { key: "orange", color: "#e67e22" },
        { key: "yellow", color: "#f1c40f" },
        { key: "green",  color: "#27ae60" },
        { key: "blue",   color: "#3498db" },
        { key: "white",  color: "#ecf0f1" },
        { key: "purple", color: "#9b59b6" }
    ];
    let total = 0;
    colors.forEach(c => total += sharpness[c.key] || 0);
    if (total === 0) return "";

    let bars = colors.map(c => {
        const val = sharpness[c.key] || 0;
        const percent = (val / total) * 100;
        return `<div style="display:inline-block;height:16px;width:${percent}%;background:${c.color};"></div>`;
    }).join("");
    return `<div style="margin:8px 0;"><strong>Sharpness:</strong><div style="width:100%;border:1px solid #aaa;height:16px;display:flex;">${bars}</div></div>`;
}   