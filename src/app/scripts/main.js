import { } from './external/jquery';
// Import only bootstrap packages you need
// import {} from 'bootstrap-sass/assets/javascripts/bootstrap/affix';
// import {} from 'bootstrap-sass/assets/javascripts/bootstrap/alert';
// import {} from 'bootstrap-sass/assets/javascripts/bootstrap/button';
// import {} from 'bootstrap-sass/assets/javascripts/bootstrap/carousel';
// import {} from 'bootstrap-sass/assets/javascripts/bootstrap/collapse';
// import {} from 'bootstrap-sass/assets/javascripts/bootstrap/dropdown';
// import {} from 'bootstrap-sass/assets/javascripts/bootstrap/modal';
// import {} from 'bootstrap-sass/assets/javascripts/bootstrap/scrollspy';
// import {} from 'bootstrap-sass/assets/javascripts/bootstrap/tooltip';
// import {} from 'bootstrap-sass/assets/javascripts/bootstrap/tab';
// import {} from 'bootstrap-sass/assets/javascripts/bootstrap/transition';
// import {} from 'bootstrap-sass/assets/javascripts/bootstrap/popover';
// Or import everything
// import {} from 'bootstrap-sass'; // eslint-disable-line import/imports-first

/**
 * CANVAS IMPORTS
 */
import {
    // Constants
    CANVAS, CONTEXT,

    // Functions
    drawTable,
    setNumberOnRow,
    clearRow,
} from './modules/canvas';

import {
    elaborateInput,
    elaborateCheck,
    previousStep,
    nextStep,
    checkRadicand,
    checkSubtracting,
    help,
} from './modules/graphics_engine';

import {
    insertRock,
    insertMais,
    insertWood,
    deleteValue,
    getMousePosition,
} from './modules/exercise_listener';

function updateCanvasSize(canvas) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * 0.6;
    canvas.height = height * 0.6;
}

function init() {
    updateCanvasSize(CANVAS);

    CONTEXT.beginPath();
    CONTEXT.moveTo(0, 0);

    drawTable(3, 3, true);
    setNumberOnRow(0, 12345);
    setNumberOnRow(1, 67890);
    clearRow(2, 12345); // PRELOADS
    clearRow(2, 67890); // CLEAR MASKS

    $('#input_button').click(elaborateInput);
    $('#next_step_button').click(nextStep);
    $('#previous_step_button').click(previousStep);

    CANVAS.onmousedown = getMousePosition;
    document.getElementById('rock').onclick = insertRock;
    document.getElementById('mais').onclick = insertMais;
    document.getElementById('wood').onclick = insertWood;
    document.getElementById('rubber').onclick = deleteValue;

    $('#input_button_ex').click(elaborateCheck);
    $('#check_1').click(checkRadicand);
    $('#check_2').click(checkSubtracting);
    $('#help_button').click(help);
}

init();
