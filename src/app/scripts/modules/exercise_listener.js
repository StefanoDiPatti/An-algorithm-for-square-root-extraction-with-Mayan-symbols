import {
    clearNumber,
    setNumber,
    getColumnNumber,
    // Constants
    CANVAS,
    setApprox,
} from './canvas';


let xM = 0;
let yM = 0;
let triangleColumn;
let triangleRow;
let triangleIndex = 0;
const InseredValues = [];
let mousex = 0;
let mousey = 0;
let rock = false;
let mais = false;
let wood = false;
let remove = false;
let approx = {};

let lastInsered = 0;

function getStartPosition(canvas) {
    const LeftPos = canvas.offsetLeft;
    const TopPos = canvas.offsetTop;
    return { X: LeftPos, Y: TopPos };
}

export function calculateWorkingColumn(num) {
    return Math.ceil(((Math.floor(Math.log10(num))) + 1) / 2) - 1;
}

export function getValueinRow(trRow) {
    let valueInRow = 0;
    for (let m = 0; m < InseredValues.length; m++) {
        if (InseredValues[m].row === trRow) {
            valueInRow += Math.pow(10, InseredValues[m].index) * InseredValues[m].value;
        }
    }
    return valueInRow;
}

function checkPosition() {
    const column = getColumnNumber();
    triangleColumn = 0;
    triangleRow = 0;
    xM = mousex - getStartPosition(CANVAS).X;
    yM = mousey - getStartPosition(CANVAS).Y;
    const widthSquare = parseInt((CANVAS.width / column), 10);
    const heightSquare = parseInt((CANVAS.height / 3), 10);

    triangleColumn = Math.floor(xM / widthSquare);
    triangleRow = Math.floor(yM / heightSquare);

    if (triangleRow === 2) {
        triangleIndex = column - 1 - triangleColumn;
    } else {
        xM -= widthSquare * triangleColumn;
        yM -= heightSquare * triangleRow;

        const checkerTriangle = widthSquare * yM + heightSquare * xM;
        // const checkerTriangle = xI * Math.abs(yM - j) + yI * Math.abs(xM - i);
        if (checkerTriangle <= (widthSquare * heightSquare)) {
            triangleIndex = (column * 2) - 1;
        } else {
            triangleIndex = (column * 2) - 2;
        }
        // for (let ind = 0; ind < triangleColumn; ind++) triangleIndex -= 2;
        triangleIndex -= triangleColumn * 2;
    }
}


function insert(num) {
    for (let m = 0; m < InseredValues.length; m++) {
        if (InseredValues[m].row === triangleRow && InseredValues[m].index === triangleIndex) {
            if ((InseredValues[m].value + num) < 10) {
                if (triangleRow !== 2) {
                    clearNumber(triangleRow, triangleIndex, InseredValues[m].value);
                    setNumber(triangleRow, triangleIndex, InseredValues[m].value + num);
                    InseredValues[m] = { row: triangleRow, index: triangleIndex, value: InseredValues[m].value + num };
                } else {
                    clearNumber(triangleRow, triangleIndex, InseredValues[m].value);
                    if (InseredValues[m].value + num === 0) setNumber(triangleRow, triangleIndex, InseredValues[m].value + num);
                    else setApprox(triangleRow, triangleIndex, InseredValues[m].value + num);
                    approx = { row: triangleRow, index: triangleIndex, value: InseredValues[m].value + num };
                }
            }
            return;
        }
    }
    if (triangleRow !== 2) {
        setNumber(triangleRow, triangleIndex, num);
        InseredValues.push({ row: triangleRow, index: triangleIndex, value: num });
    } else {
        if (num === 0) setNumber(triangleRow, triangleIndex, num);
        else setApprox(triangleRow, triangleIndex, num);
        approx = { row: triangleRow, index: triangleIndex, value: num };
    }
}

function reduxValue() {
    for (let m = 0; m < InseredValues.length; m++) {
        if (InseredValues[m].row === triangleRow && InseredValues[m].index === triangleIndex) {
            clearNumber(triangleRow, triangleIndex, InseredValues[m].value);
            if (InseredValues[m].value === 0) return;
            InseredValues[m].value -= 1;
            if (InseredValues[m].value !== 0) setNumber(triangleRow, triangleIndex, InseredValues[m].value);
            return;
        }
    }
}

function reduxApprox() {
    clearNumber(approx.row, approx.index, approx.value);
    if (approx.value >= 5) setApprox(approx.row, approx.index, (approx.value - 4));
    approx.value -= 4;
}

export function getMousePosition(event) {
    event = event || window.event;
    event.preventDefault();
    mousex = event.pageX;
    mousey = event.pageY;
    $('html,body').css('cursor', 'default');
    checkPosition();
    if (rock) insert(0);
    if (mais) {
        insert(1);
        if (triangleRow === 2) lastInsered = 1;
    }
    if (wood) {
        insert(5);
        if (triangleRow === 2) lastInsered = 5;
    }
    if (remove) {
        if (triangleRow === 2) reduxApprox();
        else reduxValue();
    }
    rock = false;
    mais = false;
    wood = false;
    remove = false;
}

export function insertRock() {
    $('html,body').css('cursor', 'url(./images/zero.png), auto');
    rock = true;
    mais = false;
    wood = false;
    remove = false;
}

export function insertMais() {
    $('html,body').css('cursor', 'url(./images/one.png), auto');
    rock = false;
    mais = true;
    wood = false;
    remove = false;
}


export function insertWood() {
    $('html,body').css('cursor', 'url(./images/five.png), auto');
    rock = false;
    mais = false;
    wood = true;
    remove = false;
}

export function deleteValue() {
    $('html,body').css('cursor', 'url(./images/cancella.png), auto');
    rock = false;
    mais = false;
    wood = false;
    remove = true;
}

export function insertRadicando(num) {
    const len = Math.ceil(Math.log10(num + 1));
    for (let i = 0; i < len - 1; i++) {
        const digit = Math.floor((num / Math.pow(10, i)) % 10);
        InseredValues.push({ row: 0, index: i, value: digit });
    }
}

export function updateApprox() {
    clearNumber(approx.row, approx.index, approx.index);
    setNumber(approx.row, approx.index, approx.value);
    for (let m = 0; m < InseredValues.length; m++) {
        if (InseredValues[m].row === approx.row && InseredValues[m].index === approx.index) {
            InseredValues[m] = { row: approx.row, index: approx.index, value: approx.value };
            return;
        }
    }
    InseredValues.push({ row: approx.row, index: approx.index, value: approx.value });
}

export function getApprox() { return lastInsered; }

export function insertApprox(sottraendo, j) {
    let digit = 0;
    let hereiam = false;
    const len = Math.ceil(Math.log10(sottraendo + 1));
    for (let i = len - 1; i >= 0 - 1; i--) {
        hereiam = false;
        digit = Math.floor((sottraendo / Math.pow(10, i)) % 10);
        if (digit !== 0) {
            setNumber(1, (j * 2) + i, digit);
            for (let m = 0; m < InseredValues.length; m++) {
                if (InseredValues[m].row === 1 && InseredValues[m].index === (j * 2) + i) {
                    InseredValues[m] = { row: 1, index: (j * 2) + i, value: digit };
                    hereiam = true;
                }
            }
            if (!hereiam) InseredValues.push({ row: 1, index: (j * 2) + i, value: digit });
        }
    }
}

/*
export function getValueInLastRow() {
    let value = 0;
    for (let m = 0; m < InseredValues.length; m++)
        if (InseredValues[m].row === 2)
            value += InseredValues[m].value * Math.pow(10, getColumnNumber() - 1 - InseredValues[m].index);
    return value;
}


export function getValueInColumn(trRow, trCol) {
    let value = 0;
    for (let m = 0; m < InseredValues.length; m++) {
        if ((InseredValues[m].row === trRow) && (InseredValues[m].index === trCol * 2 || InseredValues[m].index === trCol * 2 + 1)) {
            if (InseredValues[m].row === trRow && InseredValues[m].index === trCol * 2 + 1) {
                value += 10 * InseredValues[m].value;
            } else value += InseredValues[m].value;
        }
    }
    return value;
} */
