var fs = require('fs');
var readEachLineSync = require('read-each-line-sync')

var colonne = []
var positivi = 0
var negativi = 0
var totali = 0
intestazione = true

/*
l'array genotipi contiene tutti i genotipi trovati
gli array singola e multi sono bidimensionali: ogni riga contiene: 
    posizione   0: positivi tipo    AGUS
                1                   ASCUS
                2                   HSIL
                3                   INAD.
                4                   INFIAM
                5                   LSIL
                6                   NORM
                7                   indefinito
                8                   totali
*/

const tipologie = ["AGUS", "ASCUS", "HSIL", "INAD.", "INFIAM", "LSIL", "NORM", "indefinito", "Tot"]
var genotipi = []
var singola = []
var multi = []
var transito = []

function contaPositivi(dati) {
    var indice
    if (dati[7] == "Pos") {
        positivi++
        for (i = 8; i <= 16; i++) {
            if (dati[i] != "") {
                indice = caricaGenotipo(dati[i])
                if (dati[9] == "") {
                    transito = singola[indice]
                    implementaTipo(dati[6])
                    singola[indice] = transito
                }
                else {
                    transito = multi[indice]
                    implementaTipo(dati[6])
                    multi[indice] = transito
                }
            }
            else {
                i = 16
            }
        }

    }
}
function caricaGenotipo(genotipo) {
    var indice = genotipi.indexOf(genotipo)
    if (indice < 0) {
        genotipi.push(genotipo)
        singola.push([0, 0, 0, 0, 0, 0, 0, 0, 0])
        multi.push([0, 0, 0, 0, 0, 0, 0, 0, 0])
        indice = genotipi.length - 1
    }
    return indice
}
function implementaTipo(tipo) {
    transito[8]++
    switch (tipo) {
        case "AGUS":
            transito[0]++
            break;
        case "ASCUS":
            transito[1]++
            break;
        case "HSIL":
            transito[2]++
            break;
        case "INAD.":
            transito[3]++
            break;
        case "INFIAM":
            transito[4]++
            break;
        case "LSIL":
            transito[5]++
            break;
        case "NORM":
            transito[6]++
            break;
        default:
            transito[7]++
            break;
    }

}

console.log("Inizio elaborazione dati")

readEachLineSync('dati.csv', function (line) {
    if (!intestazione) {
        totali++
        colonne = line.split(";")
        contaPositivi(colonne)
    }
    intestazione = false
})

var percPos = positivi * 100 / totali
negativi = totali - positivi
console.log("Risultati:")
console.log("Campioni elaborati " + totali + ", positivi " + positivi + " (" + percPos + " %), negativi " + negativi)
for (i = 0; i < genotipi.length; i++) {
    console.log()
    console.log("Genotipo " + genotipi[i] + " Infezioni singole: " + singola[i][8] + ", multiple: " + multi[i][8])
    if (singola[i][8] > 0) {
        var messaggio = "Singole: "
        for (j = 0; j < 8; j++) {
            if (singola[i][j] > 0) {
                messaggio = messaggio + " " + tipologie[j] + " " + singola[i][j] + "; "
            }
        }
        console.log(messaggio)
    }
    if (multi[i][8] > 0) {
        var messaggio = "Multiple: "
        for (j = 0; j < 8; j++) {
            if (multi[i][j] > 0) {
                messaggio = messaggio + " " + tipologie[j] + " " + multi[i][j] + "; "
            }
        }
        console.log(messaggio)
    }
}
