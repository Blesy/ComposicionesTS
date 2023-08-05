import { Heroes } from './Heroes.interface';

function simulatedAnnealing(objects: Heroes[], maxLen: number, comparator, fixed: number, currentSolution = [], weight = 200, espatulas = []) {
    const initialTemperature = 1000;
    const MAXMULTIPLIER = Object.keys(LISTA).length - 1;
    const coolingRate = 0.995;
    const CHAMPSPASSED = currentSolution.length
    let temperature = initialTemperature;
    // Genera una solución inicial aleatoria
    for (let i = 0; i < maxLen - CHAMPSPASSED; i++) {
        let randomNumber = generateRandomNumber(MAXMULTIPLIER, currentSolution, objects)
        currentSolution.push(objects[randomNumber]);
    }

    let bestSolution = [...currentSolution];
    let bestScore = objectiveFunction(bestSolution, comparator, weight, espatulas);
    console.log(bestScore);
    
    while (temperature > 1) {
        // Genera una solución vecina
        let neighborSolution;
        neighborSolution = generateNeighbor(currentSolution, objects, fixed, MAXMULTIPLIER);

        let currentScore = objectiveFunction(currentSolution, comparator, weight, espatulas);
        let neighborScore = objectiveFunction(neighborSolution, comparator, weight, espatulas);

        // Si el vecino es mejor o se acepta según el criterio de Metropolis
        if (neighborScore > currentScore) {// || Math.random() < Math.exp((currentScore - neighborScore) / temperature)) {
            currentSolution = [...neighborSolution];
            currentScore = neighborScore;
        }

        // Actualiza la mejor solución encontrada
        if (currentScore > bestScore) {
            bestSolution = [...currentSolution];
            bestScore = currentScore;
        }

        // Enfriar el sistema
        temperature *= coolingRate;
    }
    console.log(bestScore)
    return bestSolution;
}

function objectiveFunction(solution, comparator, weight: number, espatulas: string[]) {
    // Convertir valores de las propiedades a números y contar su frecuencia
    let frequency = {};
    let peso = 0;
    solution.forEach(obj => {
        ['Rasgo1', 'Rasgo2', 'Rasgo3'].forEach(rasgo => {
            let value = obj[rasgo];
            frequency[value] = (frequency[value] || 0) + 1;
        });
        peso += obj.Peso
    });
    espatulas.forEach(obj => {
        frequency[obj] = (frequency[obj] || 0) + 1;
    })
    delete frequency['cero']

    // Calcular la diferencia con respecto a los objetivos
    let totalDifference = 0;
    for (let key in frequency) {
        let mappedComparator = [...comparator[key].map(target => {
            let filter = frequency[key] - target
            return filter >= 0 ? filter : filter * -1 + 1.1
        })]
        let minDifference = Math.min(...mappedComparator);
        let index = mappedComparator.indexOf(minDifference)
        totalDifference += frequency[key] >= comparator[key].slice(-1)[0] ? comparator[key][index] : 0
    }
    totalDifference *= weight ? peso/weight+1 : 1
    return totalDifference;  // Queremos maximizar esta diferencia
}

function generateNeighbor(solution, objects, fixed, MAXMULTIPLIER: number) {
    let neighbor = [...solution];

    // Reemplazar un objeto aleatorio
    let random1 = Math.floor(Math.random() * (neighbor.length - fixed)) + fixed
    //let test = [...neighborNumbers] //test
    let random2 = generateRandomNumber(MAXMULTIPLIER, neighbor, objects)
    neighbor[random1] = objects[random2];
    if (hasDuplicates(neighbor)) {
        console.log(3, random1, random2, (new Set(neighbor)).size, neighbor.length)
    } //testing
    // }

    return neighbor
}

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

function generateRandomNumber(MAXMULTIPLIER: number, arr: Heroes[], objects) {
    let num: number
    do {
        num = Math.floor(Math.random() * MAXMULTIPLIER)
    }   while (arr.includes(objects[num]))
    return num
}


// Ejemplo de uso:
const LISTA: Heroes[] = {...require('./datos/lista.json')};
const RASGOS = {...require('./datos/rasgosAleanning.json')};

let comparator = {
    ...RASGOS
    //5: [3, 6],  // Quieres que el valor '5' aparezca 3 o 6 veces
    //10: [2, 4], // Quieres que el valor '10' aparezca 2 o 4 veces
    // ... y así sucesivamente para otros valores
};

// Valores parametrizados **********************************************************
let size = 10
let campeones = [
    LISTA[6], LISTA[9], LISTA[18], LISTA[30], LISTA[35], LISTA[48], LISTA[53]
]
let weight = 100 //valores alrededor de 100 serian optimos
let espatulas = ['Shurima', 'Shurima']
let fijos = 7
// Fin de valores parametrizados ***************************************************

//let comparator = 100;  // Tu valor comparador para la propiedad 1
let result = simulatedAnnealing(LISTA, size, comparator, fijos, campeones, weight, espatulas);

let frequency = {}
let nombres = ''
result.forEach(obj => {
    nombres += obj.Nombre + ', ';
    ['Rasgo1', 'Rasgo2', 'Rasgo3'].forEach(rasgo => {
        let value = obj[rasgo];
        frequency[value] = (frequency[value] || 0) + 1;
    });
})
espatulas.forEach(obj => {
    frequency[obj] = (frequency[obj] || 0) + 1;
});
delete frequency['cero']
console.log(nombres, frequency);
