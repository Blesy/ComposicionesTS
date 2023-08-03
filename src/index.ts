import { Heroes, Rasgos } from './Heroes.interface';
import * as fs from 'fs';

let lista: Heroes[] = {...require('./datos/lista.json')};
const rasgos: Rasgos = {...require('./datos/rasgos2.json')};
const TIER_LIST: String[] = require('./datos/tierList.json')
let largo = Object.keys(lista).length;
let contador: Rasgos = {...rasgos};
var oro: number = 0, plata: number = 0, bronce: number = 0, sumaRasgos: number = 0, id: number = 0, espatula: string = "";
var obj = {
    table: []
};
for (let i = 0; i < largo - 9; i++) 
{
    for (let j = i+1; j < largo - 8; j++) 
    {
        for (let k = j+1; k < largo - 7; k++) 
        {
            for (let l = k+1; l < largo - 6; l++) 
            {
                for (let m = l+1; m < largo - 5; m++) 
                {
                    for (let n = m+1; n < largo - 4; n++) 
                    {
                        for (let o = n+1; o < largo - 3; o++) 
                        {
                            for (let p = o+1; p < largo - 2; p++) 
                            {
                                for (let q = p + 1; q < largo - 1; q++) 
                                {
                                    for (let r = q + 1; r < largo; r++) {
                                        limpiar();
                                        let composicion: Heroes[] = componer(i, j, k, l, m, n, o, p, q, r);
                                        sumar(composicion);
                                        if (sumaRasgos > 21){
                                            impresion(composicion);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

let json = JSON.stringify(obj);
fs.writeFileSync('./salida/data.json', json, 'utf8');

function impresion(compo: Heroes[]){
    let cadena: string = "";
    if (espatula === ""){
        espatula = "vacio";
    }
    id++;
    for (let index = 0; index < compo.length; index++) {
        cadena += `${compo[index].Nombre}, `;
    }
    let principal: string = "", principalContador: number = 0;
    Object.keys(contador).forEach(function(key){
        if (contador[key].contador > principalContador){
            principalContador = contador[key].contador;
            principal = key;
        }
        else if (contador[key].contador === principalContador){
            principal = `${principal}, ${key}`;
        }
    })
    cadena += `oro= ${oro}, plata= ${plata}, bronce= ${bronce}, principal= (${principal}), espatula= ${espatula} suma= ${sumaRasgos}`;
    obj.table.push({id: id, 
        uno: compo[0].Nombre, 
        dos: compo[1].Nombre,
        tres: compo[2].Nombre,
        cuatro: compo[3].Nombre,
        cinco: compo[4].Nombre,
        seis: compo[5].Nombre,
        siete: compo[6].Nombre,
        ocho: compo[7].Nombre,
        nueve: compo[8].Nombre,
        diez: compo[9].Nombre,
        oro: oro,
        plata: plata,
        bronce: bronce,
        principal: principal,
        espatula: espatula,
        total: sumaRasgos
    });
    console.log(cadena);
}

function limpiar(){
    Object.keys(contador).forEach(function(key){
      contador[key].contador = 0;  
    });
    espatula = "";
    oro = 0;
    plata = 0;
    bronce = 0;
    sumaRasgos = 0;
}
function sumar(compo: Heroes[]) {
    const containTierS = compo.some(obj => TIER_LIST.includes(obj.Nombre))
    if (!containTierS) return
    let rasgo1: string, rasgo2: string, rasgo3: string;
    let summ: number, Acumoro: number, Acumplata: number, Acumbronce: number;
    for (let index = 0; index < compo.length; index++) {
        rasgo1 = compo[index].Rasgo1;
        rasgo2 = compo[index].Rasgo2;
        rasgo3 = compo[index].Rasgo3;
        contador[rasgo1].contador++;
        contador[rasgo2].contador++;
        if (compo[index].Rasgo3 != "cero"){
            contador[rasgo3].contador++;
        }
    };
    Object.keys(contador).forEach(function(key){
        summ = contador[key].contador;
        Acumoro = contador[key].oro;
        Acumplata = contador[key].plata;
        Acumbronce = contador[key].bronce;
        // if (contador[key].espatula === true && espatula === "" && (summ === Acumoro - 1 || summ === Acumplata - 1 || summ === Acumbronce - 1)){
        //     contador[key].contador++;
        //     summ++;
        //     espatula = key;
        // }
        if (summ >= Acumoro){
            oro++;
            sumaRasgos += summ;
        }
        else if (summ >= Acumplata && Acumplata > 0){
            plata++;
            sumaRasgos += summ;
        }
        else if (summ >= Acumbronce && Acumbronce > 0){
            bronce++;
            sumaRasgos += summ;
        }
    });
}

function componer(i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number) {
    let listaContador: number[] = [i, j, k, l, m, n, o, p, q, r];
    let composicion: Heroes[] = [null, null, null, null, null, null, null, null, null, null];
    for (let index = 0; index < listaContador.length; index++) {
        composicion[index] = lista[listaContador[index]];
    }
    return composicion;
}