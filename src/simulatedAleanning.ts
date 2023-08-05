import { Heroes } from './Heroes.interface';

function simulatedAnnealing(objects: Heroes[], maxLen: number, comparator, fixed: number, currentSolution = [], weight = 200) {
    const initialTemperature = 1000;
    const MAXMULTIPLIER = Object.keys(LISTA).length - 1;
    const coolingRate = 0.995;
    let temperature = initialTemperature;
    const CHAMPSPASSED = currentSolution.length
    // Genera una solución inicial aleatoria
    for (let i = 0; i < maxLen - CHAMPSPASSED; i++) {
        let randomNumber = generateRandomNumber(MAXMULTIPLIER, currentSolution, objects)
        currentSolution.push(objects[randomNumber]);
    }

    let bestSolution = [...currentSolution];
    let bestScore = objectiveFunction(bestSolution, comparator, weight);
    console.log(bestScore);
    
    while (temperature > 1) {
        // Genera una solución vecina
        let neighborSolution;
        neighborSolution = generateNeighbor(currentSolution, objects, fixed, MAXMULTIPLIER);

        let currentScore = objectiveFunction(currentSolution, comparator, weight);
        let neighborScore = objectiveFunction(neighborSolution, comparator, weight);

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

function objectiveFunction(solution, comparator, weight: number) {
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
    delete frequency['cero']

    // Calcular la diferencia con respecto a los objetivos
    let totalDifference = 0;
    for (let key in frequency) {
        //if (frequency[key]) {
        let mappedComparator = [...comparator[key].map(target => {
            let filter = frequency[key] - target
            return filter >= 0 ? filter : filter * -1 + 1.1
        })]
        let minDifference = Math.min(...mappedComparator);
        let index = mappedComparator.indexOf(minDifference)
        totalDifference += frequency[key] >= comparator[key].slice(-1)[0] ? comparator[key][index] : 0
        //}
        //  else {
        //     Si la llave no existe en la solución, la diferencia es el objetivo mínimo
        //     totalDifference += Math.min(...comparator[key]);
        // }
    }
    totalDifference *= weight ? peso/weight+1 : 1
    return totalDifference;  // Queremos minimizar esta diferencia
}

function generateNeighbor(solution, objects, fixed, MAXMULTIPLIER: number) {
    let neighbor = [...solution];
    //let randomAction = Math.random();
    // if (randomAction < 0.33 && neighbor.length < maxLen) {
    //     // Añadir un objeto aleatorio
    //     let randomNumber = generateRandomNumber(MAXMULTIPLIER, currentNumbers)
    //     neighborNumbers.push(randomNumber)
    //     neighbor.push(objects[randomNumber]);
    //     if (hasDuplicates(neighbor)) console.log(1) //testing
    // } else if (randomAction < 0.66 && neighbor.length > 0) {
    //     // Eliminar un objeto aleatorio
    //     let numeroRandom = Math.floor(Math.random() * neighbor.length)
    //     neighborNumbers.splice(numeroRandom)
    //     neighbor.splice(numeroRandom, 1);
    //     if (hasDuplicates(neighbor)) console.log(2) //testing
    // } else {

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

// Valores parametrizados
let size = 10
let campeones = [
    LISTA[1], LISTA[2]
]
let weight = 0
// Fin de valores parametrizados

let fijos = 2
//let comparator = 100;  // Tu valor comparador para la propiedad 1
let result = simulatedAnnealing(LISTA, size, comparator, fijos, campeones, weight);

let frequency = {}
let nombres = ''
result.forEach(obj => {
    nombres += obj.Nombre + ', ';
    ['Rasgo1', 'Rasgo2', 'Rasgo3'].forEach(rasgo => {
        let value = obj[rasgo];
        frequency[value] = (frequency[value] || 0) + 1;
    });
})
console.log(nombres, frequency);
