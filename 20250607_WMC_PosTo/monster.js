// Nur laden, wenn auf der monster.html
if (document.location.pathname.includes("Monster.html")) {
  fetch('https://mhw-db.com/monsters')
    .then(response => response.json())
    .then(data => {
      const monsterListe = document.getElementById('monster-liste');
      data.forEach((monster, idx) => {
        const monsterCard = document.createElement('div');
        const usesElements = monster.elements?.join(', ') || 'Keine';
        const resistances = monster.resistances?.map(r => r.element).join(', ') || 'Keine';
        const weaknesses = monster.weaknesses
        ?.map(w => `${w.element} (${w.stars}★${w.condition ? ' – ' + w.condition : ''})`)
        .join(', ') || 'Keine Daten';
        monsterCard.className = 'monster-card';


       // Einzigartige ID für das Detail-Element
        const detailsId = `monster-details-${idx}`;

        monsterCard.innerHTML = `
          <div class="card h-100 shadow">
            <div class="card-body">
              <h5 class="card-title" style="cursor:pointer;" data-toggle="collapse" data-target="#${detailsId}">
                ${monster.name}
              </h5>
              <div id="${detailsId}" class="collapse">
                <p class="card-text"><strong>Spezies:</strong> ${monster.species}</p>
                <p class="card-text"><strong>Nutzt Elemente:</strong> ${usesElements}</p>
                <p class="card-text"><strong>Resistenzen:</strong> ${resistances}</p>
                <p class="card-text"><strong>Schwächen:</strong> ${weaknesses}</p>
                <p class="card-text"><strong>Standorte:</strong> ${monster.locations?.map(loc => loc.name).join(', ') || 'Keine Daten'}</p>
                <p class="card-text"><strong>Beschreibung:</strong> ${monster.description}</p>
              </div>
            </div>
          </div>
        `;

        // Toggle-Logik für das Einklappen/Ausklappen
        monsterCard.querySelector('.card-title').addEventListener('click', function() {
          const details = monsterCard.querySelector('.collapse');
          details.classList.toggle('show');
        });

        monsterListe.appendChild(monsterCard);
      });
    })
    .catch(error => {
      console.error("Fehler beim Laden der Monster:", error);
    });
    }
