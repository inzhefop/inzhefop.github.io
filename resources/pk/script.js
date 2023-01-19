//-- Variablen --
var mode = 1; //Setzt Rechtecksregel
var results = []; //Ergebnis-Array
setmode();
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

//-- Symbol-Knoepfe --
function sin() {setTextToCurrentPos("Math.sin()")}
function cos() {setTextToCurrentPos("Math.cos()")}
function sqrt() {setTextToCurrentPos("Math.sqrt()")}
function tan() {setTextToCurrentPos("Math.tan()")}
function pi() {setTextToCurrentPos("Math.PI")}
function exp() {setTextToCurrentPos("Math.pow(,)")}
function e() {setTextToCurrentPos("Math.E")}

function setTextToCurrentPos(symb) {
    var curPos = document.getElementById("formel-input").selectionStart;
    console.log(curPos);
    var content = document.getElementById("formel-input").value.toString();
    document.getElementById("formel-input").value = content.slice(0, curPos) + symb + content.slice(curPos, content.length);
}

function modezurück() {
    if(mode >= 2) {
        mode -= 1;
    }
    setmode();
}

function formelcursorpos() {
    document.getElementById('formel-input').addEventListener('keyup', e => {
        console.log('Caret at: ', e.target.selectionStart)
      })
}

function modevor() {
    if(mode < 4) {
        mode += 1;
    }
    setmode();
}

//-- Anzeige von Funktionen --
function setmode() {
    if(mode == 1) {
        document.getElementById("mode").innerHTML = "Rechtecks-Regel";
        document.getElementById("regel-container1").style.display = "flex";
        document.getElementById("regel-container2").style.display = "none";
        document.getElementById("regel-container3").style.display = "none";
        document.getElementById("regel-container4").style.display = "none";
        document.getElementById("regel-container5").style.display = "none";
    } else if (mode == 2) {
        document.getElementById("mode").innerHTML = "Trapez-Regel";
        document.getElementById("regel-container1").style.display = "none";
        document.getElementById("regel-container2").style.display = "flex";
        document.getElementById("regel-container3").style.display = "none";
        document.getElementById("regel-container4").style.display = "none";
        document.getElementById("regel-container5").style.display = "none";
    } else if (mode == 3) {
        document.getElementById("mode").innerHTML = "Simpson-Regel";
        document.getElementById("regel-container1").style.display = "none";
        document.getElementById("regel-container2").style.display = "none";
        document.getElementById("regel-container3").style.display = "flex";
        document.getElementById("regel-container4").style.display = "none";
        document.getElementById("regel-container5").style.display = "none";
    } else if (mode == 4) {
        document.getElementById("mode").innerHTML = "Unlösbare Integrale";
        document.getElementById("regel-container1").style.display = "none";
        document.getElementById("regel-container2").style.display = "none";
        document.getElementById("regel-container3").style.display = "none";
        document.getElementById("regel-container4").style.display = "flex";
        document.getElementById("regel-container5").style.display = "none";
    } else if (mode == 5) {
        document.getElementById("mode").innerHTML = "Analytisch";
        document.getElementById("regel-container1").style.display = "none";
        document.getElementById("regel-container2").style.display = "none";
        document.getElementById("regel-container3").style.display = "none";
        document.getElementById("regel-container4").style.display = "none";
        document.getElementById("regel-container5").style.display = "flex";
    }
}

function unsov1() {
    document.getElementById("formel-input").value = "(Math.pow(Math.E,x))/x"
}

function unsov2() {
    document.getElementById("formel-input").value = "Math.pow(Math.E,Math.pow(-x,2))"
}

function unsov3() {
    document.getElementById("formel-input").value = "Math.sin(x)/x"
}

//-- Ausrechnen --
function calc() {
    if (mode == 1) {
        results.push(shortnumber(calcrechteck()));
        showresults();
        drawChart();
    } //Rechtecksregel

    if (mode == 2) {
        results.push(shortnumber(calctrapez()));
        showresults();
        drawChart();
    } //Trapezregel

    if (mode == 3) {
        results.push(shortnumber(calcsimpson()));
        showresults();
        drawChart();
    } //Trapezregel

    if (mode == 4) {
        results.push(shortnumber(calcsimpson()));
        showresults();
        drawChart();
    } //Simpsonregel (Unlösbare Integrale)
}


// -- Graph (mithilfe der Google-Chart Bibliothek)  --
function drawChart() {
    //Definition von für den Graph wichtigen Daten
    const formel = document.getElementById("formel-input").value;
    const low = eval(document.getElementById("unteregrenze").value);
    const high = eval(document.getElementById("oberegrenze").value);
    const funcarray = [];

    //Erstelung von den Daten-Array für die jeweilige Funktion
    funcarray.push(["x", "y"])
    for (var i = low; i < high + 1; i++) {
        const x = i;
        funcarray.push([i.toString(), eval(formel)]);
    }

    var data = google.visualization.arrayToDataTable(funcarray);

    //Weitere Einstellungen
    var options = {
      title: document.getElementById("formel-input").value + " | Integral von " + low + " bis " + high,
      curveType: 'function',
      legend: { position: 'middle' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    //Graph zeichen
    chart.draw(data, options);
}

//-- Ergebisse anzeigen --
function showresults() {
    arrlengh = results.length;
    for (i = 1; i < 13; i++) {
        const name = "result" + i.toString();
        if ((arrlengh - i + 1) > 0) {
            document.getElementById(name).innerHTML = (arrlengh - i + 1).toString() + ") " + results[arrlengh - i] + " ~" + (Math.floor((Math.round((results[arrlengh - i])/(results[arrlengh - 1])*100000))/1000)) + "%";
        }
        
    }
}

//--Rechtecksregel: Integral --
function calcrechteck() {
    //Wichtige Daten von der Eingabe
    const formel = document.getElementById("formel-input").value;
    const low = eval(document.getElementById("unteregrenze").value);
    const high = eval(document.getElementById("oberegrenze").value);
    const unterteilungen = eval(document.getElementById("n").value);
    //"parse float" für die umwandlung des Strings in eine Zahl

    if (checkinput(low, high) == true) {
        const rechteckweite = (high - low)/unterteilungen; //Rechnet aus, wie weit ein Rechteck ist
        //const funktionsweite = high - low; Rechnet den Betrag des zu integrierenden X-Bereiches aus
        var integral = 0; //Inegral-Fläche
        for (var i = low; i < high; i++) {
            const xnumber = (i + (0.5*rechteckweite)); //Berechnung der x-Koordinate (Mitte in dem Rechteck)
            const x = xnumber;
            integral += (eval(formel))*rechteckweite; //Rechnet die Fläche eines Rechtecks mit dim Funktionsbetrag an der Stelle x und der Rechtecksweite aus
            i = i-1+rechteckweite;
        }
        return(integral); //Gibt den gesamte Integralwert zurück

    } else {
        alert("Eingabe Falsch")
    }
}

function calctrapez() {
    //Wichtige Daten von der Eingabe
    const formel = document.getElementById("formel-input").value;
    const low = eval(document.getElementById("unteregrenze").value);
    const high = eval(document.getElementById("oberegrenze").value);
    const unterteilungen = eval(document.getElementById("n").value);

    if (checkinput(low, high) == true) {
        const rechteckweite = (high - low)/unterteilungen;
        const funktionsweite = high - low;
        var integral = 0;
        for (var i = low; i < high; i++) {
            var x = i;
            const quadrat = (eval(formel))*rechteckweite; //Rechnet die Fläche des Rechtecks aus
            const untererwert = eval(formel); //Rechnet den unteren X-Wert des Dreicks aus
            x += rechteckweite; 
            const dreieck = 0.5*((eval(formel)-untererwert)*rechteckweite); //Rechnet den die Fläche des Dreiecks aus
            const flaeche = quadrat + dreieck; //Rechnet die Fläche des Trapezes aus
            integral += flaeche;
            i = i-1+rechteckweite;
        }
        return(integral);

    } else {
        alert("Eingabe Falsch")
    }
}

function calcsimpson() {
    //Wichtige Daten von der Eingabe
    const formel = document.getElementById("formel-input").value;
    const low = eval(document.getElementById("unteregrenze").value);
    const high = eval(document.getElementById("oberegrenze").value);
    const unterteilungen = eval(document.getElementById("n").value);

    if (checkinput(low, high) == true) {
        const rechteckweite = (high - low)/unterteilungen;
        var integral = 0;
        for (var i = low; i < high; i++) {
            var x = i;
            const a = eval(formel); //Berechnung vom Punkt a
            x = i + rechteckweite*0.5;
            const m = eval(formel); //Berechnung vom Mittelpunkt zwischen a und b
            x = i + rechteckweite;
            const b = eval(formel); //Berechnung vom Punkt b
            const flaeche = ((high-low)/6)*(a + 4*m + b); //Berechnung der Fläche mit der Simpson-Formel
            integral += flaeche;
            i = i-1+rechteckweite;
        }
        return(integral/unterteilungen);

    } else {
        alert("Eingabe Falsch")
    }
}

//-- Input-Check (Guckt ob die Eingaben richtig sind)--
function checkinput(low, high, n) {
    if ((high >= low) && (eval(document.getElementById("n").value) != "")) {
        return true;
    } 
    return false;
}

//Leert die Ergebnisse
function clear1() {
    results = [];
    for (i = 1; i < 13; i++) {
        const name = "result" + i.toString();
            document.getElementById(name).innerHTML = "";
    }
}

function shortnumber(zahl) {
    zahl = zahl * 100000;
    zahl = Math.round(zahl);
    zahl = zahl/100000;
    return zahl;
} //Kuerzt zahl auf 6 Nachkommastellen

