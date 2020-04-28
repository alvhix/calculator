var operacion = "";
var resultado = "";
const VACIO = "";
console.log('*** Calculadora hecha por: Alvhix ***\n  -> En proceso de mejora');

function pulsarTecla(tecla) {
    if (esVacio()) {
        operacion = tecla;
        if (!acabaOperador()) {
            calcular();
        }
    } else {
        operacion += tecla;
        if (!acabaOperador()) {
            calcular();
        }
    }
    imprimir('pantalla');
}

function acabaOperador() {
    var acaba;
    if (operacion.endsWith('+') || operacion.endsWith('-') || operacion.endsWith('*') || operacion.endsWith('/') || operacion.endsWith('.')) {
        acaba = true;
    } else {
        acaba = false;
    }
    return acaba;
}

function esVacio() {
    var esVacio;
    if (operacion == VACIO) {
        esVacio = true;
    } else {
        esVacio = false;
    }
    return esVacio;
}

function pulsarIgual() {
    resultado = eval(operacion);
    operacion = resultado;
    imprimir('completo');
}

function calcular() {
    resultado = eval(operacion);
    imprimir('completo');
}

function retroceder() {
    operacion = operacion.slice(0, -1);
    imprimir('pantalla');
}

function restablecer() {
    operacion = VACIO;
    document.getElementById("pantalla").value = VACIO;
    document.getElementById("resultado").value = VACIO;
}

function imprimir(caso) {
    switch (caso) {
        case 'pantalla':
            document.getElementById("pantalla").value = operacion;
            break;
        case 'completo':
            document.getElementById("pantalla").value = VACIO;
            document.getElementById("resultado").value = resultado;
            break;
        default:
            console.log('Error de parámetros');
    }

}