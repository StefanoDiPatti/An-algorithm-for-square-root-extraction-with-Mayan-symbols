import {
    setErrorText,
    setInfoText,
} from './graphics_utils';

import {
    drawTable,
    clearRow,
    clearRowLinearly,
    setNumberOnRow,
    setNumberOnRowLinearly,
} from './canvas';

import {
    getValueinRow,
    insertRadicando,
    calculateWorkingColumn,
    updateApprox,
    getApprox,
    insertApprox,
} from './exercise_listener';

import {
    calculateStepsOnNumber,
    calculateSquareLength,
} from './calculus';


let INPUT = 0;

let STEPS = {};
let CURRENT_STEP = 0;
let CURRENT_STEP_DATA = 0;

let HALF_STEP = true;

let SUB = false;
let RAD = true;

let diff = 0;
let j = -1;

function drawTableOnStep(stepData) {
    setNumberOnRow(0, stepData.firstRow);
    setNumberOnRow(1, stepData.secondRow);
    setNumberOnRowLinearly(2, stepData.thirdRow);
}

function clearTableOnStep(stepData) {
    clearRow(0, stepData.firstRow);
    clearRow(1, stepData.secondRow);
    clearRowLinearly(2, stepData.thirdRow);
}

export const nextStep = function nextStep() {
    if (CURRENT_STEP < STEPS.length - 1) {
        if (HALF_STEP) {
            if (isNaN(CURRENT_STEP_DATA)) clearTableOnStep(CURRENT_STEP_DATA);
            CURRENT_STEP_DATA = STEPS[++CURRENT_STEP];

            setNumberOnRow(0, CURRENT_STEP_DATA.firstRow);
            setNumberOnRowLinearly(2, CURRENT_STEP_DATA.thirdRow);

            HALF_STEP = false;
            setInfoText(`Calcolo la radice quadrata di ${INPUT}... Step ${CURRENT_STEP + 1} su ${STEPS.length - 1}... approssimo la radice`);
        } else {
            setNumberOnRow(1, CURRENT_STEP_DATA.secondRow);

            HALF_STEP = true;
            setInfoText(`Calcolo la radice quadrata di ${INPUT}... Step ${CURRENT_STEP + 1} su ${STEPS.length - 1}... eseguo la sottrazione`);
        }
    }

    if (CURRENT_STEP + 1 === STEPS.length && !HALF_STEP) {
        setInfoText(`Terminato! il risultato è ${STEPS[CURRENT_STEP].thirdRow}, resto: ${STEPS[CURRENT_STEP].firstRow}`);
    }
};

export const previousStep = function previousStep() {
    if (CURRENT_STEP > 0 || HALF_STEP) {
        if (!HALF_STEP) {
            clearTableOnStep(CURRENT_STEP_DATA);

            CURRENT_STEP_DATA = STEPS[--CURRENT_STEP];
            drawTableOnStep(CURRENT_STEP_DATA);

            HALF_STEP = true;

            setInfoText(`Calcolo la radice quadrata di ${INPUT}... Step ${CURRENT_STEP + 1} su ${STEPS.length - 1}... eseguo la sottrazione`);
        } else {
            clearRow(1, CURRENT_STEP_DATA.secondRow);

            setNumberOnRow(0, CURRENT_STEP_DATA.firstRow);
            setNumberOnRowLinearly(2, CURRENT_STEP_DATA.thirdRow);

            HALF_STEP = false;
            setInfoText(`Calcolo la radice quadrata di ${INPUT}... Step ${CURRENT_STEP + 1} su ${STEPS.length - 1}... approssimo la radice`);
        }
    }
};

export const nextCheck = function nextCheck() {
    if (CURRENT_STEP === -1) {
        if (isNaN(CURRENT_STEP_DATA)) clearTableOnStep(CURRENT_STEP_DATA);
        CURRENT_STEP_DATA = STEPS[++CURRENT_STEP];
        setNumberOnRow(0, CURRENT_STEP_DATA.firstRow);
    }
    setInfoText(`Calcola la radice quadrata di ${INPUT}... approssima la radice`);
    const appr = parseInt(getValueinRow(2) / Math.pow(10, j), 10);
    const prova = parseInt(getValueinRow(0) / Math.pow(10, j * 2), 10);
    if (j === 0 && ((2 * appr + 1) > prova || prova === 0) && RAD === true) setInfoText('Terminato! Complimenti');
    if (j > 0 && (2 * appr + 1) > prova) j -= 1;
    if (RAD && SUB) {
        CURRENT_STEP_DATA = STEPS[++CURRENT_STEP];
        setInfoText(`Calcola la radice quadrata di ${INPUT}... esegui la sottrazione`);
        RAD = false;
        SUB = false;
    }
};

export function checkRadicand() {
    if (diff === getValueinRow(0)) {
        RAD = true;
    } else {
        window.alert('Radicando errato, riprova :)');
        RAD = false;
    }
    nextCheck();
}

export function checkSubtracting() {
    const sottraendo = parseInt(getValueinRow(1) / Math.pow(10, j * 2), 10);
    const radiceAttuale = parseInt(getValueinRow(0) / Math.pow(10, j * 2), 10);
    const approssimazione = parseInt(getValueinRow(2) / Math.pow(10, j), 10);
    let partial = 0;
    if (getApprox() !== 5) {
        partial = 2 * approssimazione + 1;
        if (sottraendo === partial && sottraendo <= radiceAttuale) {
            SUB = true;
            diff = getValueinRow(0) - getValueinRow(1);
            updateApprox();
        } else {
            window.alert('Sottraendo errato, riprova :)');
            SUB = false;
        }
    } else {
        partial = 10 * approssimazione + 25;
        if (sottraendo === partial && sottraendo <= radiceAttuale) {
            SUB = true;
            diff = getValueinRow(0) - getValueinRow(1);
            updateApprox();
        } else {
            window.alert('Sottraendo errato, riprova :)');
            SUB = false;
        }
    }
    nextCheck();
}

export function help() {
    const approssimazione = parseInt(getValueinRow(2) / Math.pow(10, j), 10);
    let partial = 0;
    partial = 10 * approssimazione + 25;
    if (partial > parseInt(getValueinRow(0) / Math.pow(10, j * 2), 10)) partial = 2 * approssimazione + 1;
    insertApprox(partial, j);
}

export const elaborateInput = function elaborateInput() {
    INPUT = $('#input_textfield').val();

    let irregularInput = false;
    if (isNaN(INPUT)) {
        setErrorText("L'input non è un numero e per tanto non esiste la sua radice quadrata.");
        return;
    } if (INPUT === '0') {
        INPUT = 4;

        setErrorText("L'input è nullo (metti l'algoritmo alla prova con qualcosa di più complesso...)");
        return;
    }

    if (INPUT < 0) {
        INPUT = -INPUT;

        setErrorText("L'input è un numero negativo e per tanto non esiste una sua radice quadrata intera.");
        return;
    }

    if (Math.abs(INPUT) > Number.MAX_SAFE_INTEGER) {
        INPUT = Number.MAX_SAFE_INTEGER;

        irregularInput = true;
        setErrorText("L'input superava la soglia massima e per tanto i risultati potrebbero non essere quelli previsti.");
    }

    if (!irregularInput) {
        setErrorText('');
    }

    drawTable(3, calculateSquareLength(INPUT), true);

    // setNumberOnRow(0, INPUT);

    STEPS = calculateStepsOnNumber(INPUT);

    /* console.log('Steps: ');
    for (let i = 0; i < STEPS.length; i++) {
        console.log(`${i} = ${STEPS[i].firstRow}, ${STEPS[i].secondRow}, ${STEPS[i].thirdRow}`);
    } */

    CURRENT_STEP = -1;
    HALF_STEP = true;

    nextStep();
};

export const elaborateCheck = function elaborateCheck() {
    INPUT = $('#input_textfield').val();

    let irregularInput = false;
    if (isNaN(INPUT)) {
        setErrorText("L'input non è un numero e per tanto non esiste la sua radice quadrata.");
        return;
    } if (INPUT === '0') {
        INPUT = 4;

        setErrorText("L'input è nullo (metti l'algoritmo alla prova con qualcosa di più complesso...)");
        return;
    }

    if (INPUT < 0) {
        INPUT = -INPUT;

        setErrorText("L'input è un numero negativo e per tanto non esiste una sua radice quadrata intera.");
        return;
    }

    if (Math.abs(INPUT) > Number.MAX_SAFE_INTEGER) {
        INPUT = Number.MAX_SAFE_INTEGER;

        irregularInput = true;
        setErrorText("L'input superava la soglia massima e per tanto i risultati potrebbero non essere quelli previsti.");
    }

    if (!irregularInput) {
        setErrorText('');
    }

    drawTable(3, calculateSquareLength(INPUT), true);

    // setNumberOnRow(0, INPUT);

    STEPS = calculateStepsOnNumber(INPUT);

    /* console.log('Steps: ');
    for (let i = 0; i < STEPS.length; i++) {
        console.log(`${i} = ${STEPS[i].firstRow}, ${STEPS[i].secondRow}, ${STEPS[i].thirdRow}`);
    } */

    CURRENT_STEP = -1;
    HALF_STEP = true;

    insertRadicando(INPUT);
    j = calculateWorkingColumn(INPUT);
    diff = INPUT;
    nextCheck();
};

