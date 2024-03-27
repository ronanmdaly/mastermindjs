class Controller {
    constructor(game) {
        this.game = game;
    }

    processGuess(input_colors) {
        let correctionArray = this.game.createCorrectionArray(input_colors);
        this.game.board.show('right', correctionArray, this.game.checkTry);
        this.game.checkTry++;
        this.checkWin(correctionArray);
    }

    checkWin(correctionArray) {
        let correctCount = correctionArray.filter(color => color === 'red').length;
        if (correctCount === this.game.length) {
            alert('You won!');
            this.game.init();
        } else if (this.game.checkTry > this.game.trys) {
            alert('You lose!');
            this.game.init();
        }
    }
}

class Game {
    constructor() {
        this.main_display = document.querySelector('main');
        this.div_select_colors = document.getElementById('div-select-color');
        this.crack_button = document.getElementById('crack-btn');
        this.length = 4;
        this.trys = 8;
        this.colors = ['blue', 'yellow', 'orange', 'green', 'red', 'purple'];
        this.random_code = [];
        this.checkTry = 1;
        this.controller = new Controller(this);
        this.init();
        this.setupListeners();
    }

    init() {
        this.random_code = this.createRandomCode();
        this.checkTry = 1;
        this.main_display.innerHTML = '';
        this.div_select_colors.innerHTML = '';
        this.board = new Board(this.main_display, this.trys, this.length);
        this.board.createTries();
        this.createColorSelectors();
    }

    setupListeners() {
        this.crack_button.addEventListener('click', () => {
            let input_colors = Array.from(this.div_select_colors.querySelectorAll('select')).map(select => select.value);
            this.board.show('left', input_colors, this.checkTry);
            this.controller.processGuess(input_colors);
        });
    }


    createRandomCode() {
        let random_code = [];
        for (let i = 0; i < this.length; i++) {
            let random_color = this.colors[Math.floor(Math.random() * this.colors.length)];
            random_code.push(random_color);
        }
        console.log(random_code);
        return random_code;
    }

    createColorSelectors() {
        for (let i = 0; i < this.length; i++) {
            let div_select_wrapper = document.createElement('div');
            div_select_wrapper.className = 'select-wrapper';
            let select = document.createElement('select');

            this.colors.forEach(color => {
                let option = document.createElement('option');
                option.value = color;
                option.style.backgroundColor = color;
                select.appendChild(option);
            });

            select.style.backgroundColor = select.value;
            select.addEventListener('change', (e) => {
                e.target.style.backgroundColor = e.target.value;
            });

            div_select_wrapper.appendChild(select);
            this.div_select_colors.appendChild(div_select_wrapper);
        }
    }

    setupListeners() {
        this.crack_button.addEventListener('click', () => {
            let input_colors = Array.from(this.div_select_colors.querySelectorAll('select')).map(select => select.value);
            this.board.show('left', input_colors, this.checkTry);
            let correctionArray = this.createCorrectionArray(input_colors);
            this.board.show('right', correctionArray, this.checkTry);
            this.checkTry++;
            this.checkWin(correctionArray);
        });
    }

    createCorrectionArray(input_colors_arr) {
        let red_pegs = [];
        let white_pegs = [];
        let black_pegs = new Array(this.length).fill('black');
        let random_code_copy = [...this.random_code];

        for (let i = 0; i < this.length; i++) {
            if (input_colors_arr[i] === random_code_copy[i]) {
                red_pegs.push('red');
                input_colors_arr[i] = null;
                random_code_copy[i] = null;
            }
        }

        for (let i = 0; i < this.length; i++) {
            if (input_colors_arr[i] !== null) {
                const foundIndex = random_code_copy.findIndex(color => color === input_colors_arr[i]);
                if (foundIndex !== -1) {
                    white_pegs.push('white');
                    random_code_copy[foundIndex] = null;
                }
            }
        }

        let correction_Array = red_pegs.concat(white_pegs).concat(black_pegs.slice(0, this.length - red_pegs.length - white_pegs.length));
        return correction_Array;
    }

    checkWin(correctionArray) {
        let correctCount = correctionArray.filter(color => color === 'red').length;
        if (correctCount === this.length) {
            alert('You won!');
            this.init();
        } else if (this.checkTry > this.trys) {
            alert('You lose!');
            this.init();
        }
    }
}

class Board {
    constructor(main_display, trys, length) {
        this.main_display = main_display;
        this.trys = trys;
        this.length = length;
    }

    createTries() {
        for (let i = 1; i <= this.trys; i++) {
            let div_try = document.createElement('div');
            div_try.id = 'try-' + i;
            div_try.className = 'try';
            let div_left = document.createElement('div');
            div_left.className = 'left';
            let div_right = document.createElement('div');
            div_right.className = 'right';

            for (let j = 0; j < this.length; j++) {
                div_left.appendChild(document.createElement('div'));
                div_right.appendChild(document.createElement('div'));
            }

            div_try.appendChild(div_left);
            div_try.appendChild(div_right);
            this.main_display.appendChild(div_try);
        }
    }

    show(side, colors, checkTry) {
        const tryDiv = this.main_display.querySelector(`#try-${checkTry} .${side}`);
        const divs = tryDiv.querySelectorAll('div');

        divs.forEach(div => div.style.backgroundColor = '');

        colors.forEach((color, index) => {
            if (divs[index]) {
                divs[index].style.backgroundColor = color;
            }
        });
    }
}

const game = new Game();
