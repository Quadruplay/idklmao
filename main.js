String.prototype.multiply = function (num) {
    return Array(num + 1).join(this);
};
Array.prototype.shuffle = function () {
    this.map((a) => [Math.random(), a]).sort().map((a) => a[1]).forEach((a, i) => this[i] = a);
    return this;
};
Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};
let divs = [];
const main = document.getElementById('main');
console.log(document.body)
for (let i = 0; i < 60; i++) {
    divs.push(document.body.appendChild(document.createElement('div')));
}
let lines = [];
divs.forEach((div, i) => {
    let columns = []
    for (let j=0; j<240; j++) {
        columns.push(div.appendChild(document.createElement('span')));
    }
    lines.push(columns);
});
const nbsp = '\xa0';
lines.forEach((line, i) => {
    line.forEach((span, j) => {
        span.textContent = nbsp;
    });
});

let line = 0;
let column = 0
let colors = {
    'red': '#ff0000',
    'green': '#00ff00',
    'blue': '#0000ff',
    'yellow': '#ffff00',
    'cyan': '#00ffff',
    'magenta': '#ff00ff',
    'white': '#ffffff',
    'black': '#000000',
    'darkred': '#800000',
    'darkgreen': '#008000',
    'darkblue': '#000080',
    'darkyellow': '#808000',
    'darkcyan': '#008080',
    'darkmagenta': '#800080',
    'gray': '#808080',
    'lightgray': '#c0c0c0',
    'darkgray': '#404040',
}
let lastColor = 'white';
let lastBackground = 'black';

function print(text, color = lastColor, background = lastBackground) {
    lastColor = colors[color] || color;
    lastBackground = colors[background] || background;
    text.split('').forEach((char, i) => {
        lines[line][column].style.color = lastColor;
        lines[line][column].style.backgroundColor = lastBackground;
        lines[line][column].textContent = char === ' ' ? nbsp : char;
        column++;
    });
    line++;
    column = 0;
}

function moveTo(x, y) {
    line = y;
    column = x;
}

function clearLine(line = line) {
    lines[line].forEach((span, i) => {
        span.textContent = nbsp;
        span.style.color = colors['white'];
        span.style.backgroundColor = colors['black'];
    });
}

function clearScreen() {
    lines.forEach((line, i) => {
        line.forEach((span, j) => {
            span.textContent = nbsp;
            span.style.color = colors['white'];
            span.style.backgroundColor = colors['black'];
        });
    });
    line = 0;
    column = 0;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class specialText {
    constructor(text, color, background) {
        this.text = typeof text === 'string' ? [text] : text;
        this.color = typeof color === 'string' ? [color] : color;
        this.background = typeof background === 'string' ? [background] : background;
        this.isSpecialText = true;
    }
    replace(char, newChar, newColor, newBackground) {
        let temp = JSON.parse(JSON.stringify(this));
        let newTextArr = [];
        let newColorArr = [];
        let newBackgroundArr = [];
        temp.text.forEach((string, i) => {
            let flag = true;
            string.split('').forEach((c, j) => {
                if (c === char) {
                    newTextArr.push(newChar);
                    newColorArr.push(newColor);
                    newBackgroundArr.push(newBackground);
                    flag = true;
                } else if (flag) {
                    newTextArr.push(c);
                    newColorArr.push(temp.color[i]);
                    newBackgroundArr.push(temp.background[i]);
                    flag = false;
                } else {
                    newTextArr[newTextArr.length-1] += c;
                }
            });
        });
        this.color = newColorArr;
        this.background = newBackgroundArr;
        this.text = newTextArr;
        return this;
    }
    join(text) {
        this.text = this.text.concat(text.text);
        this.color = this.color.concat(text.color);
        this.background = this.background.concat(text.background);
        return this;
    }
}

function printSpecial(text) {
    text.text.forEach((string, i) => {
        string.split('').forEach((char, j) => {
            lines[line][column].style.color = colors[text.color[i]] || text.color[i];
            lines[line][column].style.backgroundColor = colors[text.background[i]] || text.background[i];
            lines[line][column].textContent = char === ' ' ? nbsp : char;
            column++;
        });
    });
    line++;
    column = 0;
}

let playerCastle = [
    new specialText(["╔════════════════╗"], ['white'], ['black']),
    new specialText(["║ABCDEFGHIJ      ║"], ['white'], ['black']),
    new specialText(["║XYZ             ║"], ['white'], ['black']),
    new specialText(["║                ║"], ['white'], ['black']),
    new specialText(["║                ║"], ['white'], ['black']),
    new specialText(["║                ║"], ['white'], ['black']),
    new specialText(["║          ","█████"," ║"], ['white',"blue","white"], ['black','black','black']),
    new specialText(["║              │ ║"], ['white'], ['black']),
    new specialText(["║              │ ║"], ['white'], ['black']),
    new specialText(["║              │ ║"], ['white'], ['black']),
    new specialText(["║█","█","█","█","█    ","█ █","█","█","█","█","║"], ['white',"gray","white","gray","white","gray","white","gray","white","gray","white"], ['black','black','black','black','black','black','black','black','black','black','black']),
    new specialText(["║█████    ","███","████║"], ['white',"gray","white"], ['black','black','black']),
    new specialText(["║","█","███      ","███","███║"], ['white',"gray","white","gray","white"], ['black','black','black','black','black']),
    new specialText(["║","█","███","█","█","█","█","█","█","█","█","█","███║"], ['white',"gray","white","darkgray","lightgray","darkgray","lightgray","darkgray","lightgray","darkgray","lightgray","gray","white"], ['black','black','black','black','black','black','black','black','black','black','black','black','black']),
    new specialText(["║","█","███","████████","█","███║"], ['white',"gray","white",'lightgray',"gray","white"], ['black','black','black','black','black','black']),
    new specialText(["║","█","███","█    ","█","██","█","███║"], ['white',"gray","white",'lightgray',"darkgray",'lightgray',"gray","white"], ['black','black','black','black','black','black','black','black']),
    new specialText(["║","█","███","      █","█","█","███║"], ['white',"gray","white","darkgray",'lightgray',"gray","white"], ['black','black','black','black','black','black','black']),
    new specialText(["╚════════════════╝"], ['white'], ['black']),
]

let opponentCastle = [
    new specialText(["╔════════════════╗"], ['white'], ['black']),
    new specialText(["║XY/44           ║"], ['white'], ['black']),
    new specialText(["║                ║"], ['white'], ['black']),
    new specialText(["║                ║"], ['white'], ['black']),
    new specialText(["║                ║"], ['white'], ['black']),
    new specialText(["║                ║"], ['white'], ['black']),
    new specialText(["║          ","█████"," ║"], ['white',"red","white"], ['black','black','black']),
    new specialText(["║              │ ║"], ['white'], ['black']),
    new specialText(["║              │ ║"], ['white'], ['black']),
    new specialText(["║              │ ║"], ['white'], ['black']),
    new specialText(["║█","█","█","█","█    ","█ █","█","█","█","█","║"], ['white',"gray","white","gray","white","gray","white","gray","white","gray","white"], ['black','black','black','black','black','black','black','black','black','black','black']),
    new specialText(["║█████    ","███","████║"], ['white',"gray","white"], ['black','black','black']),
    new specialText(["║","█","███      ","███","███║"], ['white',"gray","white","gray","white"], ['black','black','black','black','black']),
    new specialText(["║","█","███","█","█","█","█","█","█","█","█","█","███║"], ['white',"gray","white","darkgray","lightgray","darkgray","lightgray","darkgray","lightgray","darkgray","lightgray","gray","white"], ['black','black','black','black','black','black','black','black','black','black','black','black','black']),
    new specialText(["║","█","███","████████","█","███║"], ['white',"gray","white",'lightgray',"gray","white"], ['black','black','black','black','black','black']),
    new specialText(["║","█","███","█    ","█","██","█","███║"], ['white',"gray","white",'lightgray',"darkgray",'lightgray',"gray","white"], ['black','black','black','black','black','black','black','black']),
    new specialText(["║","█","███","      █","█","█","███║"], ['white',"gray","white","darkgray",'lightgray',"gray","white"], ['black','black','black','black','black','black','black']),
    new specialText(["╚════════════════╝"], ['white'], ['black']),
]

const king = [
    new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    new specialText(["§XK.    /\\    . X§"], ['black'], ['white']),
    new specialText(["║  │\\/\\/  \\/\\/│  ║"], ['black'], ['white']),
    new specialText(["│  ! \\/({})\\/ !  │"], ['black'], ['white']),
    new specialText([':  │"========"│  :'], ['black'], ['white']),
    new specialText(["│  │'--,  ,--'│  │"], ['black'], ['white']),
    new specialText(["║  ↓ (○>| <○) ↓  ║"], ['black'], ['white']),
    new specialText(["§  ¥_   / ,  _¥  §"], ['black'], ['white']),
    new specialText(["∩ _ ¥░,_  _,░¥   ∩"], ['black'], ['white']),
    new specialText(["Ü| \\`¥▒░░░░░¥)≥=¬Ü"], ['black'], ['white']),
    new specialText(["§ \\\\\\`¥▒▒░░¥)    §"], ['black'], ['white']),
    new specialText(["║  \\\\\\`(▒¥)'     ║"], ['black'], ['white']),
    new specialText(["│   \\\\\\'╓║)      │"], ['black'], ['white']),
    new specialText([":    \\\\\\╙║)      :"], ['black'], ['white']),
    new specialText(["│     \\\\\\║___    │"], ['black'], ['white']),
    new specialText(['║     ,'+"'"+'¤ """    ║'], ['black'], ['white']),
    new specialText(["§X   //  \\\\    KX§"], ['black'], ['white']),
    new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
]

const queen = [
    new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    new specialText(["§XQ     /\\      X§"], ['black'], ['white']),
    new specialText(["║  . . //\\\\ . .  ║"], ['black'], ['white']),
    new specialText(["│  |\\|\\'\\/'/|/|  │"], ['black'], ['white']),
    new specialText([":  |="+'""""""""'+"=|  :"], ['black'], ['white']),
    new specialText(["│  //-._  _.-\\\\  │"], ['black'], ['white']),
    new specialText(['║ ||"\\ʘ), (ʘ/"│| ║'], ['black'], ['white']),
    new specialText(["§ ||    │,    │| §"], ['black'], ['white']),
    new specialText(["∩ │|\\  .==.  /|│ ∩"], ['black'], ['white']),
    new specialText(["Ü │|.-"+'"===="'+"-.|│ Ü"], ['black'], ['white']),
    new specialText(["§ |│ \\\\≡≡≡≡// _' §"], ['black'], ['white']),
    new specialText(["║ |│  \\\\##/ / °.\\║"], ['black'], ['white']),
    new specialText(["│ ||   ├≡≡┤ \\_  /│"], ['black'], ['white']),
    new specialText([": │|   ╞##╡  «↔» :"], ['black'], ['white']),
    new specialText(["│ │'   ├≡≡┤   §  │"], ['black'], ['white']),
    new specialText(["║      ╞##╡   §  ║"], ['black'], ['white']),
    new specialText(["§X     ├≡≡┤   §QX§"], ['black'], ['white']),
    new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
]

const knight = [
    new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    new specialText(["§XN  _.-¡¡-._   X§"], ['black'], ['white']),
    new specialText(["║  ¡"+'" | ││ | "'+"¡  ║"], ['black'], ['white']),
    new specialText(["│  │ || ││ || │  │"], ['black'], ['white']),
    new specialText([":  │ || ││ ||/\\  :"], ['black'], ['white']),
    new specialText(["│  │ || ││ |/  \\ │"], ['black'], ['white']),
    new specialText(['║  │  | ││ |│\\/│ ║'], ['black'], ['white']),
    new specialText(["§__/"+'"'+"-._||_.│▐ │_§"], ['black'], ['white']),
    new specialText(["∩__\\___ ''  │▐ │ ∩"], ['black'], ['white']),
    new specialText(["Ü═════╗│__,.│▐ │ Ü"], ['black'], ['white']),
    new specialText(["§ /   ║│    │▐ │ §"], ['black'], ['white']),
    new specialText(["║     ║│    │▐ │ ║"], ['black'], ['white']),
    new specialText(["│   / ║│    │▐ │ │"], ['black'], ['white']),
    new specialText([":/    ║│    │▐ │ :"], ['black'], ['white']),
    new specialText(["│     ║│┌┐__│▐_│_│"], ['black'], ['white']),
    new specialText(["║  / ,‼'|≡≡≡[ΦΦ]≡║"], ['black'], ['white']),
    new specialText(["§X   ║│      ╠╣NX§"], ['black'], ['white']),
    new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
]

const page = [
    new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    new specialText(["§XP             X§"], ['black'], ['white']),
    new specialText(["║,.↔«ºº"+'""""'+"ºº»↔.,║"], ['black'], ['white']),
    new specialText(["│ \\↔«ºº"+'""""'+"ºº»↔/ │"], ['black'], ['white']),
    new specialText([":  \\,..----..,/  :"], ['black'], ['white']),
    new specialText(["│  / =»~  ~«= \\  │"], ['black'], ['white']),
    new specialText(['║ || (҉}/ {҉) ||.║'], ['black'], ['white']),
    new specialText(["§ |\\  , `  ,  //|§"], ['black'], ['white']),
    new specialText(["∩ _\\\\\\_"+'"══"'+"_/'/ |∩"], ['black'], ['white']),
    new specialText(["Ü(_///═ /## \\/  |Ü"], ['black'], ['white']),
    new specialText(["§    \\ |#    '  |§"], ['black'], ['white']),
    new specialText(["║      \\#    . / ║"], ['black'], ['white']),
    new specialText(["│      ,\\#,-/ |  │"], ['black'], ['white']),
    new specialText([":      │♦,¡ ▐▌'  :"], ['black'], ['white']),
    new specialText(["│      │♦││ ▓    │"], ['black'], ['white']),
    new specialText(["║      │♦││▐▌    ║"], ['black'], ['white']),
    new specialText(["§X     │♦│'▓   PX§"], ['black'], ['white']),
    new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
]

const blank = [
    new specialText([".................."], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([':                :'], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([":                :"], ['white'], ['black']),
    new specialText([".................."], ['white'], ['black']),
]

const cards = [
    undefined,
    [
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
        new specialText(["§ A              §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":                :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(['║                ║'], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["∩       X        ∩"], ['black'], ['white']),
        new specialText(["Ü                Ü"], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":                :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["§              A §"], ['black'], ['white']),
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    ],
    [
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
        new specialText(["§ 2              §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":        X       :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(['║                ║'], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["∩                ∩"], ['black'], ['white']),
        new specialText(["Ü                Ü"], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":       X        :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["§              2 §"], ['black'], ['white']),
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    ],
    [
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
        new specialText(["§ 3              §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":        X       :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(['║                ║'], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["∩       X        ∩"], ['black'], ['white']),
        new specialText(["Ü                Ü"], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":       X        :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["§              3 §"], ['black'], ['white']),
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    ],
    [
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
        new specialText(["§ 4              §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":   X        X   :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(['║                ║'], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["∩                ∩"], ['black'], ['white']),
        new specialText(["Ü                Ü"], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":   X        X   :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["§              4 §"], ['black'], ['white']),
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    ],
    [
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
        new specialText(["§ 5              §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":   X        X   :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(['║                ║'], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["∩       X        ∩"], ['black'], ['white']),
        new specialText(["Ü                Ü"], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":   X        X   :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["§              5 §"], ['black'], ['white']),
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    ],
    [
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
        new specialText(["§ 6              §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":   X        X   :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(['║                ║'], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["∩   X        X   ∩"], ['black'], ['white']),
        new specialText(["Ü                Ü"], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":   X        X   :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["§              6 §"], ['black'], ['white']),
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    ],
    [
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
        new specialText(["§ 7              §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":   X        X   :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(['║       X        ║'], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["∩   X        X   ∩"], ['black'], ['white']),
        new specialText(["Ü                Ü"], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":   X        X   :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["§              7 §"], ['black'], ['white']),
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    ],
    [
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
        new specialText(["§ 8              §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":   X        X   :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(['║       X        ║'], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["∩   X        X   ∩"], ['black'], ['white']),
        new specialText(["Ü                Ü"], ['black'], ['white']),
        new specialText(["§       X        §"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":   X        X   :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(["║                ║"], ['black'], ['white']),
        new specialText(["§              8 §"], ['black'], ['white']),
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    ],
    [
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
        new specialText(["§ 9              §"], ['black'], ['white']),
        new specialText(["║   X        X   ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":                :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(['║   X        X   ║'], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["∩       X        ∩"], ['black'], ['white']),
        new specialText(["Ü                Ü"], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["║   X        X   ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":                :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(["║   X        X   ║"], ['black'], ['white']),
        new specialText(["§              9 §"], ['black'], ['white']),
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    ],
    [
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
        new specialText(["§ 10             §"], ['black'], ['white']),
        new specialText(["║   X        X   ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":        X       :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(['║   X        X   ║'], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["∩                ∩"], ['black'], ['white']),
        new specialText(["Ü                Ü"], ['black'], ['white']),
        new specialText(["§                §"], ['black'], ['white']),
        new specialText(["║   X        X   ║"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText([":       X        :"], ['black'], ['white']),
        new specialText(["│                │"], ['black'], ['white']),
        new specialText(["║   X        X   ║"], ['black'], ['white']),
        new specialText(["§             10 §"], ['black'], ['white']),
        new specialText(["█≡=⁃-⁃=≡{}≡=⁃-⁃=≡█"], ['black'], ['white']),
    ]
]

const heart = ["♥", "red", "white"];
const spade = ["♠", "black", "white"];
const diamond = ["♦", "red", "white"];
const club = ["♣", "black", "white"];
const shield = ["♡", "red", "white"];
const cup = ["♢", "black", "white"];

let deck = [];
async function getInput() {
    return new Promise(resolve => {
        document.addEventListener('keydown', function listener(e) {
            document.removeEventListener('keydown', listener);
            resolve(e.key.toLowerCase());
        });
    });
}

async function pause() {
    print("Press any key to continue...");
    return getInput();
}

(async () => {

async function menu() {
clearScreen();
printSpecial(new specialText([" ABF DESCENT XYZ "], ["black"], ["white"]).replace("A", ...heart).replace("B", ...spade).replace("F", ...diamond).replace("X", ...club).replace("Y", ...shield).replace("Z", ...cup));
print("");
print("[S]tart");
print("[I]nstructions");
print("[C]redits");
print("[Q]uit");

let input = '';
while (input !== 's' && input !== 'i' && input !== 'c' && input !== 'q') {
    input = await getInput();
}
switch (input) {
    case 's':
        chooseDifficulty();
        break;
    case 'i':
        instructions();
        break;
    case 'c':
        credits();
        break;
    case 'q':
        // window.close();
        break;
}
};

async function credits() {
clearScreen();
print("Made by Quadruplay");
print("Idea by https://youtu.be/O3bXsD7r0g8");
await pause();
menu();
}

async function instructions() {
clearScreen();
print("Instructions go here");
await pause();
menu();
}

async function chooseDifficulty() {
clearScreen();
print("Choose difficulty:");
print("[E]asy");
print("[M]edium");
print("[H]ard");
print("[B]ack");
let input = '';
while (input !== 'e' && input !== 'm' && input !== 'h' && input !== 'b') {
    input = await getInput();
}
switch (input) {
    case 'b':
        menu();
        break;
    default:
        chooseHeroes(input);
        break;
}
}

async function chooseHeroes(level) {
clearScreen();
let heroPool = [];
switch (level) {
    case 'h':
        heroPool.push("Necromancer");
        heroPool.push("Knight");
    case 'm':
        heroPool.push("Warhammer Wielder");
        heroPool.push("Crossbowman");
    case 'e':
        heroPool.push("Fire Mage");
        heroPool.push("Archer");
        break;
}
}

menu();
})()