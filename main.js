String.prototype.multiply = function (num) {
    return Array(num + 1).join(this);
};
Array.prototype.multiply = function (num) {
    return num === 0 ? [] : num === 1 ? this : this.concat(this).multiply(num - 1);
};
Array.prototype.shuffle = function () {
    [...(this.map((a) => [Math.random(), a]).sort().map((a) => a[1]))].forEach((a, i) => this[i] = a);
    return this;
};
Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};
String.prototype.replaceAll = function (search, replacement) {
    return this.split(search).join(replacement);
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

let currency = {
    'heart': 0,
    'diamond': 0,
    'club': 0,
    'spade': 0,
    'cup': 0,
    'shield': 0
}
if (localStorage.getItem('currency')) {
    currency = JSON.parse(localStorage.getItem('currency'));
} else {
    localStorage.setItem('currency', JSON.stringify(currency));
}

let unlocks = {
    'medium': false,
    'hard': false,
    'health': 0,
    'shields': 0,
    'fool': 0
}
if (localStorage.getItem('unlocks')) {
    unlocks = JSON.parse(localStorage.getItem('unlocks'));
} else {
    localStorage.setItem('unlocks', JSON.stringify(unlocks));
}

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
        this.color = typeof color === 'string' ? [color] : color || lastColor;
        this.background = typeof background === 'string' ? [background] : background || lastBackground;
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
                    newColorArr.push(newColor || temp.color[i]);
                    newBackgroundArr.push(newBackground || temp.background[i]);
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
        if (this.text === undefined) {
            this.text = text?.text || text;
            this.color = text.color;
            this.background = text.background;
            return this;
        }
        if (typeof text === 'string') {
            text = new specialText(text, lastColor, lastBackground);
        }
        this.text = this.text.concat(text.text);
        this.color = this.color.concat(text.color);
        this.background = this.background.concat(text.background);
        return this;
    }
    clone() {
        return new specialText(JSON.parse(JSON.stringify(this.text)), JSON.parse(JSON.stringify(this.color)), JSON.parse(JSON.stringify(this.background)));
    }
    recolor(newColor, newBackground) {
        if (newColor) this.color = [newColor].multiply(this.text.length);
        if (newBackground) this.background = [newBackground].multiply(this.text.length);
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

let ammoBlank = [
    new specialText(["..."], ['white'], ['black']),
    new specialText([": :"], ['white'], ['black']),
    new specialText([": :"], ['white'], ['black']),
    new specialText(["..."], ['white'], ['black']),
]

let ammoCard = [
    new specialText(["┌─┐"], ['black'], ['white']),
    new specialText(["│X│"], ['black'], ['white']),
    new specialText(["│Y│"], ['black'], ['white']),
    new specialText(["└─┘"], ['black'], ['white']),
]

let playerCastle = [
    new specialText(["╔════════════════╗"], ['white'], ['black']),
    new specialText(["║ABCDEFGH        ║"], ['white'], ['black']),
    new specialText(["║WXYZ            ║"], ['white'], ['black']),
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
    new specialText(["║WX/YZ           ║"], ['white'], ['black']),
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

const cardsSpecial = {page, knight, queen, king, blank};

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

const hp1 = ["♥", "red", "black"];
const hp0 = ["♥", "gray", "black"];
const hpShield = ["♡", "yellow", "black"];
const hpNo = [" ", "black", "black"];

let suits = {heart, spade, diamond, club, shield, cup};

let deck = [];
async function getInput() {
    return new Promise(resolve => {
        document.addEventListener('keydown', function listener(e) {
            document.removeEventListener('keydown', listener);
            resolve(e.key.toLowerCase());
        });
    });
}

async function isLineEmpty(line) {
    return lines[line].reduce((a, b) => a + +(b.textContent == nbsp), 0) == lines[line].length;
}

async function pause() {
    let line = 0;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (!isLineEmpty(i) && line == 0) {
            line = i+1;
        }
    }
    if (line) {
        moveTo(0, line);
    }
    print("Press any key to continue...");
    return getInput();
}

function clearLines(start, end) {
    for (let i = start; i < end; i++) {
        clearLine(i);
    }
}

descent = async () => {

async function menu() {
    clearScreen();
    printSpecial(new specialText([" ABF DESCENT XYZ "], ["black"], ["white"]).replace("A", ...heart).replace("B", ...spade).replace("F", ...diamond).replace("X", ...club).replace("Y", ...shield).replace("Z", ...cup));
    print("▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀");
    print("[S]tart");
    print("[U]nlocks");
    print("[I]nstructions");
    print("[C]redits");
    print("[Q]uit");

    let input = '';
    let inputs = ['s', 'u', 'i', 'c', 'q'];
    while (!inputs.includes(input)) {
        input = await getInput();
    }
    switch (input) {
        case 's':
            chooseDifficulty();
            break;
        case 'u':
            shop();
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

async function shop() {
    localStorage.setItem("currency", JSON.stringify(currency));
    localStorage.setItem("unlocks", JSON.stringify(unlocks));
    clearScreen();
    printSpecial(new specialText(["Resources: "+currency.heart+" A  "+currency.spade+" B "+currency.diamond+" C  "+currency.club+" D  "+currency.shield+" E  "+currency.cup+" F"], ["white"], ["black"]).replace("A", ...heart).replace("B", ...spade).replace("C", ...diamond).replace("D", ...club).replace("E", ...shield).replace("F", ...cup));
    let inputs = ['b'];
    if (!unlocks.medium) {
        print("");
        printSpecial(new specialText(["[M]: Unlock medium difficulty.                         2 A  +  2 B"], ["white"], ["black"]).replace("A", ...heart).replace("B", ...spade));
        inputs.push('m');
    }
    if (!unlocks.hard) {
        print("");
        printSpecial(new specialText(["[H]: Unlock hard difficulty.                           2 A  +  2 B  +  2 C  +  2 D"], ["white"], ["black"]).replace("A", ...heart).replace("B", ...spade).replace("C", ...diamond).replace("D", ...club));
        inputs.push('h');
    }
    if (unlocks.fool !== 2) {
        print("");
        switch (unlocks.fool) {
            case 0:
                printSpecial(new specialText(["[F]: Have the first hero start with the Fool arcana.   1 A  +  1 B  +  1 C"], ["white"], ["black"]).replace("A", ...heart).replace("B", ...diamond).replace("C", ...shield));
                break;
            case 1:
                printSpecial(new specialText(["[F]: Have the second hero start with the Fool arcana.  1 A  +  1 B  +  1 C"], ["white"], ["black"]).replace("A", ...spade).replace("B", ...club).replace("C", ...cup));
                break;
        }
        inputs.push('f');
    }
    if (unlocks.health !== 4) {
        print("");
        switch (unlocks.health) {
            case 0:
                printSpecial(new specialText(["[D]: Start with 5 health.                              1 A"], ["white"], ["black"]).replace("A", ...heart));
                break;
            case 1:
                printSpecial(new specialText(["[D]: Start with 6 health.                              1 A"], ["white"], ["black"]).replace("A", ...spade));
                break;
            case 2:
                printSpecial(new specialText(["[D]: Start with 7 health.                              1 A"], ["white"], ["black"]).replace("A", ...diamond));
                break;
            case 3:
                printSpecial(new specialText(["[D]: Start with 8 health.                              1 A"], ["white"], ["black"]).replace("A", ...club));
                break;
        }
        inputs.push('d');
    } else if (unlocks.shields !== 2) {
        print("");
        switch (unlocks.shields) {
            case 0:
                printSpecial(new specialText(["[D]: Start with 1 shield.                              1 A"], ["white"], ["black"]).replace("A", ...shield));
                break;
            case 1:
                printSpecial(new specialText(["[D]: Start with 2 shields.                             1 A"], ["white"], ["black"]).replace("A", ...cup));
                break;
        }
        inputs.push('d');
    }
    if (inputs.length === 1) {
        print("");
        print("Nothing left to unlock.");
        await pause();
        menu();
    } else {
        print("");
        print("[B]ack");
        let input = '';
        while (!inputs.includes(input)) {
            input = await getInput();
        }
        switch (input) {
            case 'b':
                menu();
                break;
            case 'm':
                if (currency.heart >= 2 && currency.spade >= 2) {
                    currency.heart -= 2;
                    currency.spade -= 2;
                    unlocks.medium = true;
                }
                shop();
                break;
            case 'h':
                if (currency.heart >= 2 && currency.spade >= 2 && currency.diamond >= 2 && currency.club >= 2) {
                    currency.heart -= 2;
                    currency.spade -= 2;
                    currency.diamond -= 2;
                    currency.club -= 2;
                    unlocks.hard = true;
                }
                shop();
                break;
            case 'f':
                if (unlocks.fool === 0) {
                    if (currency.heart >= 1 && currency.diamond >= 1 && currency.shield >= 1) {
                        currency.heart -= 1;
                        currency.diamond -= 1;
                        currency.shield -= 1;
                        unlocks.fool = 1;
                    }
                } else {
                    if (currency.spade >= 1 && currency.club >= 1 && currency.cup >= 1) {
                        currency.spade -= 1;
                        currency.club -= 1;
                        currency.cup -= 1;
                        unlocks.fool = 2;
                    }
                }
                shop();
                break;
            case 'd':
                if (unlocks.health !== 4) {
                    switch (unlocks.health) {
                        case 0:
                            if (currency.heart >= 1) {
                                currency.heart -= 1;
                                unlocks.health++;
                            }
                            break;
                        case 1:
                            if (currency.spade >= 1) {
                                currency.spade -= 1;
                                unlocks.health++;
                            }
                            break;
                        case 2:
                            if (currency.diamond >= 1) {
                                currency.diamond -= 1;
                                unlocks.health++;
                            }
                            break;
                        case 3:
                            if (currency.club >= 1) {
                                currency.club -= 1;
                                unlocks.health++;
                            }
                            break;
                    }
                } else {
                    switch (unlocks.shields) {
                        case 0:
                            if (currency.shield >= 1) {
                                currency.shield -= 1;
                                unlocks.shields++;
                            }
                            break;
                        case 1:
                            if (currency.cup >= 1) {
                                currency.cup -= 1;
                                unlocks.shields++;
                            }
                            break;
                        }
                }
                shop();
                break;
        }
    }
}

async function credits() {
    clearScreen();
    print("Made by Quadruplay");
    print("Idea by https://youtu.be/O3bXsD7r0g8");
    await pause();
    menu();
}

async function instructions() {
    clearScreen();
    print("The goal of the game is to survive the onslaught of enemies.");
    print("You start with 4 health and 0 shields, but can gain more through the shop or through arcanas.");
    print("You can choose between 3 difficulties, each unlocking more enemies, bosses, and heroes.");
    print("You get to choose 2 heroes, each with their own unique abilities.");
    print("Every 11 cards, you will face a boss.");
    print("After defeating the boss, you will get to choose between 3 arcanas.");
    print("Arcanas are powerful, one-use abilities that can turn the tide of battle if used correctly.");
    print("Additionally after defeating a boss of a certain suit, you gain 1 token of that suit to be spent in the shop.");
    print("The game ends when you run out of health or when you defeat all the enemies.");
    print("Good luck!");
    await pause();
    menu();
}

let difficulty = '';
let deck = [];
async function chooseDifficulty() {
    difficulty = '';
    deck = [];
    clearScreen();
    print("Choose difficulty:");
    print("[E]asy");
    if (unlocks.medium) print("[M]edium");
    if (unlocks.hard) print("[H]ard");
    print("[B]ack");
    let input = '';
    let inputs = ['e', 'b'];
    if (unlocks.medium) inputs.push('m');
    if (unlocks.hard) inputs.push('h');
    while (!inputs.includes(input)) {
        input = await getInput();
    }
    switch (input) {
        case 'b':
            menu();
            break;
        default:
            difficulty = input;
            let faceDeck = [];
            let valueDeck = [];
            let kingDeck = [];
            switch (difficulty) {
                case 'h':
                    for (let j of ["cup", "shield"]) {
                        for (let i of [4, 5, 6, 7, 8, 9, 10]) {
                            valueDeck.push({value: i, suit: j, tapped: false});
                        }
                        for (let i of ["page", "knight", "queen"]) {
                            faceDeck.push({value: i, suit: j, tapped: false});
                        }
                        for (let i of ["king"]) {
                            kingDeck.push({value: i, suit: j, tapped: false});
                        }
                    }
                case 'm':
                    for (let j of ["club", "diamond"]) {
                        for (let i of [4, 5, 6, 7, 8, 9, 10]) {
                            valueDeck.push({value: i, suit: j, tapped: false});
                        }
                        for (let i of ["page", "knight", "queen"]) {
                            faceDeck.push({value: i, suit: j, tapped: false});
                        }
                        for (let i of ["king"]) {
                            kingDeck.push({value: i, suit: j, tapped: false});
                        }
                    }
                case 'e':
                    for (let j of ["heart", "spade"]) {
                        for (let i of [4, 5, 6, 7, 8, 9, 10]) {
                            valueDeck.push({value: i, suit: j, tapped: false});
                        }
                        for (let i of ["page", "knight", "queen"]) {
                            faceDeck.push({value: i, suit: j, tapped: false});
                        }
                        for (let i of ["king"]) {
                            kingDeck.push({value: i, suit: j, tapped: false});
                        }
                    }
                    valueDeck.shuffle();
                    kingDeck.shuffle();
                    faceDeck.shuffle();
                    while (valueDeck.length > 0) {
                        deck.push(valueDeck.pop());
                        deck.push(kingDeck.pop());
                        deck.push(valueDeck.pop());
                        deck.push(valueDeck.pop());
                        deck.push(faceDeck.pop());
                        deck.push(valueDeck.pop());
                        deck.push(valueDeck.pop());
                        deck.push(faceDeck.pop());
                        deck.push(valueDeck.pop());
                        deck.push(valueDeck.pop());
                        deck.push(faceDeck.pop());
                    }
                    break;
            }
            chooseHeroes();
            break;
    }
}

let hero1 = '';
let hero2 = '';
async function chooseHeroes() {
    clearScreen();
    let heroPool = [];
    let choices = [];
    switch (difficulty) {
        case 'h':
            heroPool.push(new specialText(...cup).join("[N]ecromancer"));
            heroPool.push(new specialText(...shield).join("[K]night"));
            choices.push("n", "k");
        case 'm':
            heroPool.push(new specialText(...club).join("[W]arhammer Wielder"));
            heroPool.push(new specialText(...diamond).join("[C]rossbowman"));
            choices.push("w", "c");
        case 'e':
            heroPool.push(new specialText(...heart).join("[F]ire Mage"));
            heroPool.push(new specialText(...spade).join("[A]rcher"));
            choices.push("f", "a");
            break;
    }
    print("Choose the 1st hero:");
    print("");
    heroPool.forEach((hero, i) => {
        printSpecial(hero);
    });
    let input = '';
    while (!choices.includes(input)) {
        input = await getInput();
    }
    switch (input) {
        case 'f':
            hero1 = "Fire Mage";
            break;
        case 'a':
            hero1 = "Archer";
            break;
        case 'w':
            hero1 = "Warhammer Wielder";
            break;
        case 'c':
            hero1 = "Crossbowman";
            break;
        case 'n':
            hero1 = "Necromancer";
            break;
        case 'k':
            hero1 = "Knight";
            break;
    }
    heroPool = heroPool.filter((_hero, index) => index !== choices.indexOf(input));
    choices = choices.filter(choice => choice !== input);
    clearScreen();
    print("Your 1st hero is " + hero1);
    print("Choose the 2nd hero:");
    print("");
    heroPool.forEach((hero, i) => {
        printSpecial(hero);
    });
    input = '';
    while (!choices.includes(input)) {
        input = await getInput();
    }
    switch (input) {
        case 'f':
            hero2 = "Fire Mage";
            break;
        case 'a':
            hero2 = "Archer";
            break;
        case 'w':
            hero2 = "Warhammer Wielder";
            break;
        case 'c':
            hero2 = "Crossbowman";
            break;
        case 'n':
            hero2 = "Necromancer";
            break;
        case 'k':
            hero2 = "Knight";
            break;
    }
    clearScreen();
    print("Your 1st hero is " + hero1);
    print("Your 2nd hero is " + hero2);
    await pause();
    game();
}

let health;
let maxHealth;
let shields;
let deckSize;
let board = [undefined].multiply(10);
let discard = [];
let ammo1 = {
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    page: false,
    knight: false,
    queen: false,
    king: false,
};
let ammo2 = {
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    page: false,
    knight: false,
    queen: false,
    king: false,
};
let ammoMap = {
    1: "A",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "T",
    page: "P",
    knight: "N",
    queen: "Q",
    king: "K",
    priest: "Ω"
}
let invAmmoMap = {
    "A": 1,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "T": 10,
    "P": "page",
    "N": "knight",
    "Q": "queen",
    "K": "king",
    "Ω": "priest",
    "0": "priest"
}
let symbolMap = {
    "Fire Mage": heart,
    "Archer": spade,
    "Warhammer Wielder": club,
    "Crossbowman": diamond,
    "Necromancer": cup,
    "Knight": shield,
}
let suitNameMap = {
    "Fire Mage": "heart",
    "Archer": "spade",
    "Warhammer Wielder": "club",
    "Crossbowman": "diamond",
    "Necromancer": "cup",
    "Knight": "shield",
}

let valueMap = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    page: 10,
    knight: 11,
    queen: 12,
    king: 13,
    priest: 0
}

const classAbilityDesc = {
    "Fire Mage": "Discard 1 ammo card to tap frontmost card in every column",
    "Archer": "Discard 1 ammo card to deal its value + 1d6 to frontmost enemy in chosen column and neighboring columns",
    "Warhammer Wielder": "Discard up to 2 ammo cards to deal their value to chosen enemy. If the enemy is killed, deal same damage to adjacent cards",
    "Crossbowman": "Discard 1 ammo card to deal its value + 2d6 to all enemies in chosen column",
    "Necromancer": "Discard 3 ammo cards to swap your hand with them",
    "Knight": "Discard any number of ammo cards to deal their value split freely among up to 3 chosen enemies",
}
const arcanaNames = {
    0: "The Fool",
    1: "The Magician",
    2: "The High Priestess",
    3: "The Empress",
    4: "The Emperor",
    5: "The Hierophant",
    6: "The Lovers",
    7: "The Chariot",
    8: "Strength",
    9: "The Hermit",
    10: "Wheel of Fortune",
    11: "Justice",
    12: "The Hanged Man",
    13: "Death",
    14: "Temperance",
    15: "The Devil",
    16: "The Tower",
    17: "The Star",
    18: "The Moon",
    19: "The Sun",
    20: "Judgement",
    21: "The World"
}
const arcanaDesc = {
    0: "Draw a random Arcana",
    1: "Change all enemies on the board to the chosen suit",
    2: "Fill hand with Aces",
    3: "Draw a Queen to your hand",
    4: "Draw a King to your hand",
    5: "Draw a Priest to your hand",
    6: "Heal 2 health up to a maximum of 8",
    7: "Push all enemies 4 spaces back",
    8: "Fill hand with 3s",
    9: "Kill all enemies on board and lose all ammo cards",
    10: "Deal 2d6 damage rolled individually to all enemies",
    11: "Kill the amount of weakest enemies equal to the amount of lost health",
    12: "Flip the board",
    13: "Kill 1 chosen enemy",
    14: "Gain 1 shield up to a maximum of 4",
    15: "Gain 2 shields up to a maximum of 4 at the cost of 1 health",
    16: "Kill 2 random enemies",
    17: "Tap all enemies",
    18: "Stop enemies spawning for 2 turns",
    19: "Tap untapped, and kill tapped enemies in a chosen column",
    20: "Kill all tapped enemies",
    21: "Draw a chosen Arcana"
}

async function game() {
    health = 4 + unlocks.health;
    maxHealth = health;
    shields = unlocks.shields;
    deckSize = deck.length;
    board = [undefined].multiply(10);
    discard = [];
    Object.keys(ammo1).forEach(key => {
        ammo1[key] = false;
        ammo2[key] = false;
    });
    let turn = 1;
    let hero1Deck = [1,2,3];
    let hero2Deck = [1,2,3];
    let arcana1 = unlocks.fool > 0 ? 1 : 0;
    let arcana2 = unlocks.fool > 1 ? 1 : 0;
    let kingKilled = false;
    let arcanaUsed = false;
    while (!(health <= 0) && !(deck.length === 0 && board.every(card => card === undefined))) {
        if (!arcanaUsed) {
            drawCard();
            kingKilled = false;
            await sleep(600);
            if (board.some(card => card?.value === "king" && card?.suit === "heart")) {
                board.forEach(card => {
                    if (card && card.value !== "king") {
                        card.tapped = false;
                    }
                });
                renderGame();
                print("The King of War is healing all the enemies through their anger");
                await pause();
            }
            if (board.some(card => card?.value === "king" && card?.suit === "spade")) {
                renderGame();
                print("The King of Conquest is empowering all the enemies making them deal more damage to your castle");
                await pause();
            }
            if (board.some(card => card?.value === "king" && card?.suit === "diamond")) {
                renderGame();
                print("The King of Famine is making ammo cards harder to come by");
                await pause();
            }
            if (board.some(card => card?.value === "king" && card?.suit === "club")) {
                let cardRemoved = false;
                Object.keys(ammo1).forEach(key => {
                    if (cardRemoved) return;
                    if (ammo1[key]) {
                        ammo1[key] = false;
                        discard.push({value: key, suit: suitNameMap[hero1], tapped: true});
                        cardRemoved = true;
                    } else if (ammo2[key]) {
                        ammo2[key] = false;
                        discard.push({value: key, suit: suitNameMap[hero2], tapped: true});
                        cardRemoved = true;
                    }
                });
                renderGame();
                print("The King of Pestilence is making ammo cards break more easily");
                await pause();
            }
            if (board.some(card => card?.value === "king" && card?.suit === "shield")) {
                renderGame();
                print("The King of Madness is making it harder to get control of the board");
                await pause();
            }
            if (board.some(card => card?.value === "king" && card?.suit === "cup")) {
                renderGame();
                print("The King of Death is making already dead enemies come back to life");
                await pause();
            }
        } else {
            arcanaUsed = false;
            turn = 3 - turn;
        }
        await heroTurn();
    }
    if (health <= 0) {
        clearScreen();
        print("You have lost");
        await pause();
    } else {
        clearScreen();
        print("You have won");
        await pause();
    }
    menu();
    function renderGame() {
        clearLines(0, 37);
        moveTo(0, 0);
        opponentCastle.forEach((text, index) => {
            let row = text.clone()
            .replace("W", String(Math.floor(deck.length / 10)))
            .replace("X", String(deck.length % 10))
            .replace("Y", String(Math.floor(deckSize / 10)))
            .replace("Z", String(deckSize % 10));
            for (let i = 0; i < 5; i++) {
                if (index === 9) {
                    row.join("-->");
                } else {
                    row.join("   ");
                }
                if (board[i]) {
                    switch (typeof board[i].value) {
                        case 'number':
                            row
                            .join(cards[board[i].value][index].clone().recolor("black", board[i].tapped ? "lightgray" : "white"))
                            .replace("X", ...(suits[board[i].suit]));
                            break;
                        case 'string':
                            row
                            .join(cardsSpecial[board[i].value][index].clone().recolor("black", board[i].tapped ? "lightgray" : "white"))
                            .replace("X", ...(suits[board[i].suit]));
                            break;
                    }
                } else {
                    row.join(blank[index]);
                }
            }
            //cup = death
            //spade = conquest
            //heart = war
            //shield = madness
            //diamond = famine
            //club = pestilence
            switch (index) {
                case 0:
                    row.join("┌──────────────────────────────────────────┐");
                    break;
                case 1:
                    row
                    .join("│X")
                    .replace("X", ...heart)
                    .join(board.some(card => (card?.value === "king" && card?.suit === "heart"))
                    ? new specialText(["The King of War effect is active","  "], ['white','black'], ['red','black'])
                    : new specialText(["The King of War effect is inactive"], ['white'], ['black']))
                    .join("       │");
                    break;
                case 2:
                    row.join("│X")
                    .replace("X", ...spade)
                    .join(board.some(card => (card?.value === "king" && card?.suit === "spade"))
                    ? new specialText(["The King of Conquest effect is active","  "], ['yellow','black'], ['black','black'])
                    : new specialText(["The King of Conquest effect is inactive"], ['white'], ['black']))
                    .join("  │");
                    break;
                case 3:
                    row.join("│X")
                    .replace("X", ...diamond)
                    .join(board.some(card => (card?.value === "king" && card?.suit === "diamond"))
                    ? new specialText(["The King of Famine effect is active","  "], ['white','black'], ['gray','black'])
                    : new specialText(["The King of Famine effect is inactive"], ['white'], ['black']))
                    .join("    │");
                    break;
                case 4:
                    row.join("│X")
                    .replace("X", ...club)
                    .join(board.some(card => (card?.value === "king" && card?.suit === "club"))
                    ? new specialText(["The King of Pestilence effect is active","  "], ['white','black'], ['green','black'])
                    : new specialText(["The King of Pestilence effect is inactive"], ['white'], ['black']))
                    .join("│");
                    break;
                case 5:
                    row.join("│X")
                    .replace("X", ...shield)
                    .join(board.some(card => (card?.value === "king" && card?.suit === "shield"))
                    ? new specialText(["The King of Madness effect is active","  "], ['black','black'], ['red','black'])
                    : new specialText(["The King of Madness effect is inactive"], ['white'], ['black']))
                    .join("   │");
                    break;
                case 6:
                    row.join("│X")
                    .replace("X", ...cup)
                    .join(board.some(card => (card?.value === "king" && card?.suit === "cup"))
                    ? new specialText(["The King of Death effect is active","  "], ['black','black'], ['white','black'])
                    : new specialText(["The King of Death effect is inactive"], ['white'], ['black']))
                    .join("     │");
                    break;
                case 7:
                    row.join("└──────────────────────────────────────────┘");
                    break;
                case 8:
                    row.join(" Hero 1 hand:");
                    break;
                case 9:
                    row
                    .join("  ")
                    .join(hero1Deck[0]
                        ? new specialText([ammoMap[hero1Deck[0]]], ['black'], ['white'])
                        : new specialText(["_"], ['white'], ['black']))
                    .join(hero1Deck[1]
                        ? new specialText([ammoMap[hero1Deck[1]]], ['black'], ['white'])
                        : new specialText(["_"], ['white'], ['black']))
                    .join(hero1Deck[2]
                        ? new specialText([ammoMap[hero1Deck[2]]], ['black'], ['white'])
                        : new specialText(["_"], ['white'], ['black']))
                    .join(" ")
                    .join(arcana1
                        ? new specialText([String(arcana1 - 1)], ['yellow'], ['black'])
                        : new specialText(["_"], ['white'], ['black']));
                    break;
                case 11:
                    row.join(" Hero 2 hand:");
                    break;
                case 12:
                    row
                    .join("  ")
                    .join(hero2Deck[0]
                        ? new specialText([ammoMap[hero2Deck[0]]], ['black'], ['white'])
                        : new specialText(["_"], ['white'], ['black']))
                    .join(hero2Deck[1]
                        ? new specialText([ammoMap[hero2Deck[1]]], ['black'], ['white'])
                        : new specialText(["_"], ['white'], ['black']))
                    .join(hero2Deck[2]
                        ? new specialText([ammoMap[hero2Deck[2]]], ['black'], ['white'])
                        : new specialText(["_"], ['white'], ['black']))
                    .join(" ")
                    .join(arcana2
                        ? new specialText([String(arcana2 - 1)], ['yellow'], ['black'])
                        : new specialText(["_"], ['white'], ['black']));
                    break;
                case 14:
                    row.join(" Next card:");
                    break;
                case 15:
                    row
                    .join("  ")
                    .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)
                    ? ammoCard[0].clone()
                    : ammoBlank[0])
                    break;
                case 16:
                    row
                    .join("  ")
                    .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)
                    ? ammoCard[1].clone().replace("X", ammoMap[(board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1).value])
                    : ammoBlank[1])
                    break;
                case 17:
                    row
                    .join("  ")
                    .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)
                    ? ammoCard[2].clone().replace("Y", ...(suits[(board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1).suit]))
                    : ammoBlank[2])
                    break;
            }
            printSpecial(row);
        });
        printSpecial( new specialText([" ".multiply(114)+"|"+" ".multiply(10)], ["white"], ["black"])
        .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)
        ? ammoCard[3].clone()
        : ammoBlank[3]));
        print(" ".multiply(114)+"V");
        playerCastle.forEach((text, index) => {
            let row = text.clone()
            .replace("A", ...(health > 0 ? hp1 : hp0))
            .replace("B", ...(health > 1 ? hp1 : hp0))
            .replace("C", ...(health > 2 ? hp1 : hp0))
            .replace("D", ...(health > 3 ? hp1 : hp0))
            .replace("E", ...(health > 4 ? hp1 : maxHealth > 4 ? hp0 : hpNo))
            .replace("F", ...(health > 5 ? hp1 : maxHealth > 5 ? hp0 : hpNo))
            .replace("G", ...(health > 6 ? hp1 : maxHealth > 6 ? hp0 : hpNo))
            .replace("H", ...(health > 7 ? hp1 : maxHealth > 7 ? hp0 : hpNo))
            .replace("W", ...(shields > 0 ? hpShield : hpNo))
            .replace("X", ...(shields > 1 ? hpShield : hpNo))
            .replace("Y", ...(shields > 2 ? hpShield : hpNo))
            .replace("Z", ...(shields > 3 ? hpShield : hpNo));
            for (let i = 0; i < 5; i++) {
                if (index === 9) {
                    row.join("<--");
                } else {
                    row.join("   ");
                }
                if (board[9 - i]) {
                    switch (typeof board[9 - i].value) {
                        case 'number':
                            row
                            .join(cards[board[9 - i].value][index].clone().recolor("black", board[9 - i].tapped ? "lightgray" : "white"))
                            .replace("X", ...(suits[board[9 - i].suit]));
                            break;
                        case 'string':
                            row
                            .join(cardsSpecial[board[9 - i].value][index].clone().recolor("black", board[9 - i].tapped ? "lightgray" : "white"))
                            .replace("X", ...(suits[board[9 - i].suit]));
                            break;
                    }
                } else {
                    row.join(blank[index]);
                }
            }
            switch (index) {
                case 0:
                    row.join(" Card Values:");
                    break;
                case 1:
                    row.join("  A (Ace)    - 1");
                    break;
                case 2:
                    row.join("  2          - 2");
                    break;
                case 3:
                    row.join("  3          - 3");
                    break;
                case 4:
                    row.join("  4          - 4");
                    break;
                case 5:
                    row.join("  5          - 5");
                    break;
                case 6:
                    row.join("  6          - 6");
                    break;
                case 7:
                    row.join("  7          - 7");
                    break;
                case 8:
                    row.join("  8          - 8");
                    break;
                case 9:
                    row.join("  9          - 9");
                    break;
                case 10:
                    row.join("  T (10)     - 10");
                    break;
                case 11:
                    row.join("  P (Page)   - 10");
                    break;
                case 12:
                    row.join("  N (Knight) - 11");
                    break;
                case 13:
                    row.join("  Q (Queen)  - 12");
                    break;
                case 14:
                    row.join("  K (King)   - 13");
                    break;
                case 15:
                    row.join("  Ω (Priest) - amount of ammo cards");
                    break;
            }
            printSpecial(row);
        });
        renderAmmo();
    }
    async function drawCard() {
        let card = (board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).pop();
        board.unshift(card);
        while (board.length > 10) {
            let card = board.pop();
            if (card) {
                if (shields > 0) {
                    shields--;
                } else {
                    switch (typeof card.value) {
                        case 'string':
                            health--;
                        case 'number':
                            health--;
                            break;
                    }
                    if (board.some(card => (card?.value === "king" && card?.suit === "spade"))) {
                        health--;
                    }
                }
                discard.push(card);
            }
        }
        renderGame();
        await sleep(500);
        if (typeof card.value === 'string') {
            card = (board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).pop();
            board.unshift(card);
            while (board.length > 10) {
                let card = board.pop();
                if (card) {
                    if (shields > 0) {
                        shields--;
                    } else {
                        switch (typeof card.value) {
                            case 'string':
                                health--;
                            case 'number':
                                health--;
                                break;
                        }
                        if (board.some(card => (card?.value === "king" && card?.suit === "spade"))) {
                            health--;
                        }
                    }
                    discard.push(card);
                }
            }
            renderGame();
        }
    }
    function renderAmmo() {
        moveTo(0, 38);
        print("Ammo:");
        for (let i = 0; i < 4; i++) {
            let row = new specialText();
            for (let [key, value] of Object.entries(ammo1)) {
                row.join(value ? ammoCard[i].clone().replace("X", ammoMap[key]).replace("Y", ...(symbolMap[hero1])) : ammoBlank[i]);
                row.join(" ");
            }
            row.join(" ");
            for (let [key, value] of Object.entries(ammo2)) {
                row.join(value ? ammoCard[i].clone().replace("X", ammoMap[key]).replace("Y", ...(symbolMap[hero2])) : ammoBlank[i]);
                row.join(" ");
            }
            printSpecial(row);
        }
    }
    function heroTurn() {
        return new Promise(async resolve => {
            moveTo(0, 44);
            clearLines(43, 60);
            print(turn === 1 ? hero1 + "'s turn!" : hero2 + "'s turn!");
            for (let i = 0; i < 4; i++) {
                let row = new specialText();
                for (let item of (turn === 1 ? hero1Deck : hero2Deck)) {
                    row.join(item ? ammoCard[i].clone().replace("X", ammoMap[item]).replace("Y", ...(symbolMap[turn === 1 ? hero1 : hero2])) : ammoBlank[i]);
                    row.join(" ");
                }
                row.join("  ");
                row.join((turn === 1 ? arcana1 : arcana2) ? ammoCard[i].clone().recolor("yellow", "black").replace("X", String(Math.floor(((turn === 1 ? arcana1 : arcana2) - 1) / 10))).replace("Y", String(((turn === 1 ? arcana1 : arcana2) - 1) % 10)) : ammoBlank[i].clone().recolor("yellow", "black"));
                printSpecial(row);
            }
            let choices = [];
            (turn === 1 ? hero1Deck : hero2Deck).forEach((item, i) => {
                if (item) {
                    choices.push(ammoMap[item].toLowerCase());
                    if (item === 1) {
                        if ((turn === 1 ? hero1 : hero2) === "Necromancer") {
                            if (Object.values(ammo1).reduce((acc, val) => acc + val, 0) + Object.values(ammo2).reduce((acc, val) => acc + val, 0) < 3) {
                                choices.pop();
                            }
                        } else {
                            if (Object.values(ammo1).reduce((acc, val) => acc + val, 0) + Object.values(ammo2).reduce((acc, val) => acc + val, 0) < 1) {
                                choices.pop();
                            }
                        }
                        if (board.some(card => card?.value === "king" && card?.suit === "shield")) {
                            if (choices.at(-1) === "a") {
                                choices.pop();
                            }
                        }
                        choices.push("1");
                    }
                }
            });
            choices = choices.map(choice => choice === "Ω".toLowerCase() ? "0" : choice);
            (turn === 1 ? arcana1 : arcana2) > 0 && choices.push("s");
            choices.forEach(choice => {
                choice === "a"
                ?print("["+choice.toUpperCase()+"]: " + classAbilityDesc[turn === 1 ? hero1 : hero2])
                :choice === "s"
                ?print("["+choice.toUpperCase()+"]: " + String((turn === 1 ? arcana1 : arcana2) - 1) + "-" + arcanaNames[(turn === 1 ? arcana1 : arcana2) - 1] + " - " + arcanaDesc[(turn === 1 ? arcana1 : arcana2) - 1])
                :choice === "0"
                ?print("["+choice.toUpperCase()+"]: " + "Attack for " + Object.values(ammo1).reduce((p, c) => p + c, Object.values(ammo2).reduce((p, c) => p + c, 0)) + " + 1d6 damage")
                :print("["+choice.toUpperCase()+"]: " + "Attack for " + valueMap[invAmmoMap[choice.toUpperCase()]] + " + 1d6 damage");
            });
            let input = '';
                while (!choices.includes(input)) {
                    input = await getInput();
                }
                switch (input) {
                    case 'a':
                        with(turn === 1 ? hero1Deck : hero2Deck) {
                            multiply(1)[indexOf(1)] = false;
                        }
                        await specialAttack(turn === 1 ? hero1 : hero2);
                        renderGame();
                        break;
                    case 's':
                        await useArcana(arcanaNames[(turn === 1 ? arcana1 : arcana2) - 1]);
                        break;
                    default:
                        with(turn === 1 ? hero1Deck : hero2Deck) {
                            multiply(1)[indexOf(invAmmoMap[input.toUpperCase()])] = false;
                        }
                        let damage = valueMap[invAmmoMap[input.toUpperCase()]];
                        if (input === "0") {
                            with(turn === 1 ? hero1Deck : hero2Deck) {
                                multiply(1)[indexOf(0)] = false;
                            }
                            damage = Object.values(ammo1).reduce((p, c) => p + c, Object.values(ammo2).reduce((p, c) => p + c, 0));
                        }
                        let roll = Math.floor(Math.random() * 6) + 1;
                        let target = await chooseTarget("Choose a target to attack for " + damage + " + " + roll + " damage", "single");
                        attack(target, damage + roll);
                        break;
                }
                await pause();
                if (kingKilled) {
                    currency[kingKilled]++;
                    localStorage.setItem("currency", JSON.stringify(currency));
                    await chooseArcana();
                }
            if ((turn === 1 ? hero1Deck : hero2Deck).reduce((acc, val) => acc + val, 0) === 0) {
                if (turn === 1) {
                    hero1Deck = [1,2,3];
                } else {
                    hero2Deck = [1,2,3];
                }
            }
            turn = 3 - turn;
            resolve();
        });
    }
    function chooseTarget(message, mode) {
        return new Promise(async resolve => {
            moveTo(0, 44);
            clearLines(43, 54);
            print(message);
            print("┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐");
            print("│1│>│2│>│3│>│4│>│5│");
            print("└─┘ └─┘ └─┘ └─┘ └─┘");
            let choices = ["1", "2", "3", "4", "5"];
            if (mode === "single") {
                print("                 V ");
                print("┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐");
                print("│0│<│9│<│8│<│7│<│6│");
                print("└─┘ └─┘ └─┘ └─┘ └─┘");
                choices.push("0", "9", "8", "7", "6");
            }
            let input = '';
            while (!choices.includes(input)) {
                input = await getInput();
                if (choices.includes(input) 
                 && mode === "single"
                 && !(board[(parseInt(input) + 9) % 10])) {
                    input = '';
                }
            }
            input = (parseInt(input) + 9) % 10;
            resolve(input);
        });
    }
    function attack(target, damage, special = false) {
        let kill = false;
        if (board[target]) {
            let health = valueMap[board[target].value];
            if (board[target].tapped) {
                if (damage >= Math.ceil(health / 2)) {
                    print("You killed the " + board[target].value + " of " + board[target].suit + "s!");
                    if (!special && !(board.some(card => card?.value === "king" && card?.suit === "diamond"))) {
                        if (symbolMap[hero1] == suits[board[target].suit]) {
                            ammo1[board[target].value] = true;
                        } else if (symbolMap[hero2] == suits[board[target].suit]) {
                            ammo2[board[target].value] = true;
                        }
                    } else {
                        discard.push({value: board[target].value, suit: board[target].suit, tapped: true});
                    }
                    if (board[target].value === "king") {
                        kingKilled = board[target].suit;
                    }
                    kill = true;
                    board[target] = undefined;
                }
            } else {
                if (damage >= health) {
                    print("You killed the " + board[target].value + " of " + board[target].suit + "s!");
                    if (!special && !(board.some(card => card?.value === "king" && card?.suit === "diamond"))) {
                        if (symbolMap[hero1] == suits[board[target].suit]) {
                            ammo1[board[target].value] = true;
                        } else if (symbolMap[hero2] == suits[board[target].suit]) {
                            ammo2[board[target].value] = true;
                        }
                    } else {
                        discard.push({value: board[target].value, suit: board[target].suit, tapped: true});
                    }
                    if (board[target].value === "king") {
                        kingKilled = board[target].suit;
                    }
                    kill = true;
                    board[target] = undefined;
                } else if (damage >= Math.ceil(health / 2)) {
                    print("You tapped the " + board[target].value + " of " + board[target].suit + "s!");
                    board[target].tapped = true;
                }
            }
        }
        return kill;
    }
    function specialAttack(hero) {
        return new Promise(async resolve => {
            let ammoMin, ammoMax;
            switch (hero) {
                case "Fire Mage":
                case "Archer":
                case "Crossbowman":
                    ammoMin = 1;
                    ammoMax = 1;
                    break;
                case "Warhammer Wielder":
                    ammoMin = 1;
                    ammoMax = 2;
                    break;
                case "Necromancer":
                    ammoMin = 3;
                    ammoMax = 3;
                    break;
                case "Knight":
                    ammoMin = 1;
                    ammoMax = Infinity;
                    break;
            }
            let ammo = await chooseAmmo(ammoMin, ammoMax);
            switch (hero) {
                case "Fire Mage":
                    for (let i = 0; i < 5; i++) {
                        if (board[9 - i]) {
                            board[9 - i].tapped = true;
                        } else if (board[i]) {
                            board[i].tapped = true;
                        }
                    }
                    break;
                case "Archer":
                    {
                        let roll = Math.floor(Math.random() * 6) + 1;
                        let target = await chooseTarget("Choose a column to shoot with a triple arrow for " + valueMap[ammo[0]] + " + " + roll + " damage", "row");
                        if (target !== 0) {
                            if (board[10 - target]) {
                                attack(10 - target, valueMap[ammo[0]] + roll, true);
                            } else if (board[target - 1]) {
                                attack(target - 1, valueMap[ammo[0]] + roll, true);
                            }
                        }
                        if (board[9 - target]) {
                            attack(9 - target, valueMap[ammo[0]] + roll, true);
                        } else if (board[target]) {
                            attack(target, valueMap[ammo[0]] + roll, true);
                        }
                        if (target !== 4) {
                            if (board[8 - target]) {
                                attack(8 - target, valueMap[ammo[0]] + roll, true);
                            } else if (board[target + 1]) {
                                attack(target + 1, valueMap[ammo[0]] + roll, true);
                            }
                        }
                    }
                    break;
                case "Crossbowman":
                    {
                        let roll1 = Math.floor(Math.random() * 6) + 1;
                        let roll2 = Math.floor(Math.random() * 6) + 1;
                        let target = await chooseTarget("Choose a column to shoot with a piercing bolt for " + valueMap[ammo[0]] + " + " + roll1 + " + " + roll2 + " damage", "row");
                        if (board[9 - target]) {
                            attack(9 - target, valueMap[ammo[0]] + roll1 + roll2, true);
                        }
                        if (board[target]) {
                            attack(target, valueMap[ammo[0]] + roll1 + roll2, true);
                        }
                    }
                    break;
                case "Warhammer Wielder":
                    {
                        let damage = ammo.reduce((acc, val) => acc + valueMap[val], 0);
                        let target = await chooseTarget("Choose an enemy to attack for " + damage + " splash damage", "single");
                        let kill = attack(target, damage, true);
                        if (kill) {
                            let list = [];
                            if (target !== 0) {
                                list.push(target - 1);
                            }
                            if (target !== 9) {
                                list.push(target + 1);
                            }
                            if (!list.includes(9 - target)) {
                                list.push(9 - target);
                            }
                            list.forEach(target => {
                                attack(target, damage, true);
                            });
                        }
                    }
                    break;
                case "Necromancer":
                    {
                        if (turn === 1) {
                            hero1Deck = ammo;
                        } else {
                            hero2Deck = ammo;
                        }
                    }
                    break;
                case "Knight":
                    {
                        let damage = ammo.reduce((acc, val) => acc + valueMap[val], 0);
                        await knightSpecial(damage);
                    }
            }
            resolve();
        });
    }
    function chooseAmmo(min, max) {
        return new Promise(async resolve => {
            moveTo(0, 44);
            clearLines(43, 54);
            min !== max
            ? print("Choose " + min + " to " + max + " ammo cards:")
            : min === 1
            ? print("Choose 1 ammo card:")
            : print("Choose " + min + " ammo cards:");
            let chosen = [];
            while (chosen.length < max && (Object.values(ammo1).some(card => card) || Object.values(ammo2).some(card => card))) {
                renderAmmo();
                clearLines(line, line + 2);
                print("Chosen: " + chosen.map(card => invAmmoMap[card.toUpperCase()]).join(", ").replaceAll('"', ""));
                let input = '';
                let inputs = [];
                Object.keys(ammo1).forEach((key) => {
                    if (ammo1[key] || ammo2[key]) {
                        inputs.push(ammoMap[key]);
                    }
                });
                print(JSON.stringify(inputs).replaceAll('"', "") + ": Choose an ammo card");
                if (chosen.length >= min) {
                    inputs.push('s');
                    print("[S]: Stop");
                }
                inputs = inputs.map(input => input.toLowerCase());
                while (!inputs.includes(input)) {
                    input = await getInput();
                }
                if (input === 's') {
                    break;
                } else {
                    chosen.push(input);
                    if (ammo1[invAmmoMap[input.toUpperCase()]]) {
                        ammo1[invAmmoMap[input.toUpperCase()]] = false;
                        discard.push({value: invAmmoMap[input.toUpperCase()], suit: symbolMap[hero1], tapped: true});
                    } else {
                        ammo2[invAmmoMap[input.toUpperCase()]] = false;
                        discard.push({value: invAmmoMap[input.toUpperCase()], suit: symbolMap[hero2], tapped: true});
                    }
                }
            }
            renderAmmo();
            clearLines(line, line + 2);
            resolve(chosen.map(card => invAmmoMap[card.toUpperCase()]));
        });
    }
    function chooseArcana() {
        return new Promise(async resolve => {
            let choice1 = Math.floor(Math.random() * 22);
            let choice2 = Math.floor(Math.random() * 22);
            let choice3 = Math.floor(Math.random() * 22);
            moveTo(0, 44);
            clearLines(43, 60);
            print("Choose an Arcana:");
            print("[A]: " + choice1 + "-" + arcanaNames[choice1]);
            print("[B]: " + choice2 + "-" + arcanaNames[choice2]);
            print("[C]: " + choice3 + "-" + arcanaNames[choice3]);
            let input = '';
            while (!['a', 'b', 'c'].includes(input)) {
                input = await getInput();
            }
            if (turn === 1) {
                arcana1 = [choice1, choice2, choice3][['a', 'b', 'c'].indexOf(input)] + 1;
            } else {
                arcana2 = [choice1, choice2, choice3][['a', 'b', 'c'].indexOf(input)] + 1;
            }
            resolve();
        })
    }
    function useArcana(arcana) {
        return new Promise(async resolve => {
            arcanaUsed = true;
            if (turn === 1) {
                arcana1 = 0;
            } else {
                arcana2 = 0;
            }
            switch (arcana) {
                case "The Fool":
                    {
                        let choice = Math.floor(Math.random() * 22);
                        if (turn === 1) {
                            arcana1 = choice + 1;
                        } else {
                            arcana2 = choice + 1;
                        }
                    }
                    break;
                case "The Magician":
                    {
                        let suit = await chooseSuit();
                        for (let i = 0; i < 10; i++) {
                            if (board[i]) {
                                board[i].suit = suit;
                            }
                        }
                    }
                    break;
                case "The High Priestess":
                    {
                        if (turn === 1) {
                            hero1Deck = [1,1,1];
                        } else {
                            hero2Deck = [1,1,1];
                        }
                    }
                    break;
                case "The Empress":
                    {
                        if (turn === 1) {
                            hero1Deck[0] = ["queen"];
                        } else {
                            hero2Deck[0] = ["queen"];
                        }
                    }
                    break;
                case "The Emperor":
                    {
                        if (turn === 1) {
                            hero1Deck[0] = ["king"];
                        } else {
                            hero2Deck[0] = ["king"];
                        }
                    }
                    break;
                case "The Hierophant":
                    {
                        if (turn === 1) {
                            hero1Deck[0] = ["priest"];
                        } else {
                            hero2Deck[0] = ["priest"];
                        }
                    }
                    break;
                case "The Lovers":
                    {
                        health += 2;
                        health = Math.min(health, 8);
                    }
                    break;
                case "The Chariot":
                    {
                        deck.push(board.shift());
                        await sleep(250);
                        renderGame();
                        deck.push(board.shift());
                        await sleep(250);
                        renderGame();
                        deck.push(board.shift());
                        await sleep(250);
                        renderGame();
                        deck.push(board.shift());
                        await sleep(250);
                        renderGame();
                    }
                    break;
                case "Strength":
                    {
                        if (turn === 1) {
                            hero1Deck = [3,3,3];
                        } else {
                            hero2Deck = [3,3,3];
                        }
                    }
                    break;
                case "The Hermit":
                    {
                        board.forEach((card, i) => {
                            if (card) {
                                attack(i, valueMap[card.value]);
                            }
                        });
                        Object.keys(ammo1).forEach(key => {
                            ammo1[key] = false;
                            ammo2[key] = false;
                        });
                    }
                    break;
                case "Wheel of Fortune":
                    {
                        for (let i = 0; i < 10; i++) {
                            if (board[i]) {
                                let roll1 = Math.floor(Math.random() * 6) + 1;
                                let roll2 = Math.floor(Math.random() * 6) + 1;
                                attack(i, roll1 + roll2);
                            }
                        }
                    }
                    break;
                case "Justice":
                    {
                        let healthLost = maxHealth - health;
                        let killCount = 0;
                        while (killCount < healthLost) {
                            let weakest = board.reduce((acc, val, index) => {
                                if (val) {
                                    if (acc === undefined) {
                                        return index;
                                    } else if (valueMap[val.value] < valueMap[board[acc].value]) {
                                        return index;
                                    }
                                }
                                return acc;
                            }, undefined);
                            if (weakest === undefined) {
                                break;
                            }
                            killCount++;
                            attack(weakest, valueMap[board[weakest].value]);
                        }
                    }
                    break;
                case "The Hanged Man":
                    {
                        while (board.length < 10) {
                            board.push(undefined);
                        }
                        board = board.reverse();
                    }
                    break;
                case "Death":
                    {
                        let target = await chooseTarget("Choose an enemy to kill", "single");
                        attack(target, valueMap[board[target].value]);
                    }
                    break;
                case "Temperance":
                    {
                        shields++;
                        shields = Math.min(shields, 4);
                    }
                    break;
                case "The Devil":
                    {
                        shields += 2;
                        shields = Math.min(shields, 4);
                        health--;
                    }
                    break;
                case "The Tower":
                    {
                        let killCount = 0;
                        while (killCount < 2 && board.some(card => card)) {
                            let indeces = [];
                            for (let i = 0; i < 10; i++) {
                                if (board[i]) {
                                    indeces.push(i);
                                }
                            }
                            let target = indeces.shuffle()[0];
                            attack(target, valueMap[board[target].value]);
                            killCount++;
                        }
                    }
                    break;
                case "The Star":
                    {
                        for (let i = 0; i < 10; i++) {
                            if (board[i]) {
                                board[i].tapped = true;
                            }
                        }
                    }
                    break;
                case "The Moon":
                    {
                        deck.push(undefined);
                        deck.push(undefined);
                    }
                    break;
                case "The Sun":
                    {
                        let column = await chooseTarget("Choose a column to burn all enemies in", "row");
                        if (board[9 - column]) {
                            attack(i, Math.ceil(valueMap[board[9 - column].value] / 2));
                        }
                        if (board[column]) {
                            attack(i, Math.ceil(valueMap[board[column].value] / 2));
                        }
                    }
                    break;
                case "Judgement":
                    {
                        for (let i = 0; i < 10; i++) {
                            if (board[i]?.tapped) {
                                attack(i, valueMap[board[i].value]);
                            }
                        }
                    }
                    break;
                case "The World":
                    {
                        await chooseAnyArcana();
                    }
                    break;
            }
            await sleep(250);
            renderGame();
            resolve();
        });
    }
    function chooseAnyArcana() {
        return new Promise(async resolve => {
            let choice = 0;
            moveTo(0, 44);
            clearLines(43, 60);
            print("Choose an Arcana:");
            print("[A]: " + choice + "-" + arcanaNames[choice]);
            print("[B]: Choose a different Arcana");
            let input = '';
            while (!['a'].includes(input)) {
                input = await getInput();
                if (input === 'b') {
                    choice = (choice + 1) % 22;
                    moveTo(0, 44);
                    clearLines(43, 60);
                    print("Choose an Arcana:");
                    print("[A]: " + choice + "-" + arcanaNames[choice]);
                    print("[B]: Choose a different Arcana");
                }
            }
            if (turn === 1) {
                arcana1 = choice + 1;
            } else {
                arcana2 = choice + 1;
            }
            resolve();
        })
    }
    function chooseSuit() {
        return new Promise(async resolve => {
            moveTo(0, 44);
            clearLines(43, 60);
            print("Choose a suit:");
            print("[A]: Heart");
            print("[B]: Spade");
            print("[C]: Diamond");
            print("[D]: Club");
            print("[E]: Shield");
            print("[F]: Cup");
            let input = '';
            while (!['a', 'b', 'c', 'd', 'e', 'f'].includes(input)) {
                input = await getInput();
            }
            let suits = ["heart", "spade", "diamond", "club", "shield", "cup"];
            let suit = suits[['a', 'b', 'c', 'd', 'e', 'f'].indexOf(input)];
            resolve(suit);
        });
    }
    function knightSpecial(damage) {
        return new Promise(async resolve => {
            let killCount = 0;
            while (killCount < 3 && board.some(card => card) && damage > 0) {
                let target = await chooseTarget("Choose an enemy to target. Remaining damage: " + damage, "single");
                moveTo(0, 44);
                clearLines(43, 60);
                print("Choose how much damage to deal to the " + board[target].value + " of " + board[target].suit + "s:");
                let inputs = [];
                if (!board[target].tapped) {
                    if (damage >= valueMap[board[target].value]) {
                        inputs.push('k');
                        print("[K]: Kill the target by dealing " + valueMap[board[target].value] + " damage");
                    }
                    if (damage >= Math.ceil(valueMap[board[target].value] / 2)) {
                        inputs.push('t');
                        print("[T]: Tap the target by dealing " + Math.ceil(valueMap[board[target].value] / 2) + " damage");
                    }
                } else {
                    if (damage >= Math.ceil(valueMap[board[target].value] / 2)) {
                        inputs.push('k');
                        print("[K]: Kill the target by dealing " + Math.ceil(valueMap[board[target].value] / 2) + " damage");
                    }
                }
                inputs.push('r');
                print("[R]: Deal all the remaining damage to the target");
                let input = '';
                while (!inputs.includes(input)) {
                    input = await getInput();
                }
                switch (input) {
                    case 'k':
                        if (board[target].tapped) {
                            attack(target, Math.ceil(valueMap[board[target].value] / 2));
                            damage -= Math.ceil(valueMap[board[target].value] / 2);
                            killCount++;
                        } else {
                            attack(target, valueMap[board[target].value]);
                            damage -= valueMap[board[target].value];
                            killCount++;
                        }
                        break;
                    case 't':
                        attack(target, Math.ceil(valueMap[board[target].value] / 2));
                        damage -= Math.ceil(valueMap[board[target].value] / 2);
                        killCount++;
                        break;
                    case 'r':
                        attack(target, damage);
                        damage = 0;
                        killCount++;
                        break;
                }
            }
            resolve();
        });
    }
}

menu();
};

// let command = '';
// let input = '';
// while (input !== 'enter') {
//     input = await getInput();
//     command += input;
// }
descent();