export class Frage
{
    constructor(frage, optionen, antwort)
    {
        if (typeof frage !== "string") {
            throw new Error("frage muss ein String sein");
        }
        if (!Array.isArray(optionen)) {
            throw new Error("optionen muss ein Array sein");
        }
        if (typeof antwort !== "string") {
            throw new Error("antwort muss ein String sein");
        }
        if (!optionen.includes(antwort)) {
            throw new Error("antwort ist nicht in den optionen enthalten");
        }
        this.frage = frage;
        this.optionen = optionen;
        this.antwort = antwort;
    }
}

export class Quiz
{
    constructor(fragen)
    {
        if (!Array.isArray(fragen)) {
            throw new Error("fragen muss ein Array sein");
        }
        this.fragen = fragen;
        this.aktuelleFrage = 0;
        this.punkte = 0;
    }

    naechsteFrage()
    {
        if (this.aktuelleFrage >= this.fragen.length) {
            return null;
        }
        return this.fragen[this.aktuelleFrage++];
    }

    antworten(antwort)
    {
        if (this.aktuelleFrage === 0) {
            throw new Error("Quiz noch nicht gestartet");
        }
        const frage = this.fragen[this.aktuelleFrage - 1];
        if (frage.antwort === antwort) {
            this.punkte++;
            return true;
        }
        return false;
    }
    
}