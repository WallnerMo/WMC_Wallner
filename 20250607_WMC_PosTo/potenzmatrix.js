const potenz = [
    [0, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 0, 0],
];

function printPotenz(matrix) {  // gibt die Matrix aus
    for (let z = 0; z < matrix.length; z++) 
    {
        console.log(`Zeile: ${z} + ${matrix[z].join(" ")}`);
    }
}

function quadrat(a, b) {    // multipliziert zwei Matrizen
    const n = a.length;
    const result = [];
    for (let i = 0; i < n; i++) {
        result[i] = [];
        for (let j = 0; j < n; j++) {
            let sum = 0;
            for (let k = 0; k < n; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

const potenz2 = quadrat(potenz, potenz);
printPotenz(potenz);
console.log(""); //lehrzeile
printPotenz(potenz2);
console.log("");
const potenz3 = quadrat(potenz2, potenz);
printPotenz(potenz3);