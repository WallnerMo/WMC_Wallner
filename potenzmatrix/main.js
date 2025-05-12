const adj = [
    [0,1,1],
    [1,0,1],
    [1,1,0],
];

function printAdj(matrix) {
    for (let z = 0; z < matrix.length; z++) 
    {
        console.log(`Zeile: ${z} + ${matrix[z].join(" ")}`);
    }
}

function quadrat(matrix) {
    const result = [];
    for (let z = 0; z < matrix.length; z++) 
    {
        const row = [];
        for (let s = 0; s < matrix[z].length; s++) 
        {
            row.push(0);
        }
        result.push(row);
    }
    return result;
}

printAdj(adj);
printAdj(quadrat(adj));