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

let special = {
    "Fire Mage": [
        new specialText(["┌─┐"], ['black'], ['white']),
        new specialText(["│ │"], ['black'], ['white']),
        new specialText(["│","█","│"], ['black',"cyan","black"], ['white']),
        new specialText(["└─┘"], ['black'], ['white']),
    ],
    "Archer": [
        new specialText(["┌─┐"], ['black'], ['white']),
        new specialText(["│ │"], ['black'], ['white']),
        new specialText(["│","█","│"], ['black',"cyan","black"], ['white']),
        new specialText(["└─┘"], ['black'], ['white']),
    ],
    "Warhammer Wielder": [
        new specialText(["┌─┐"], ['black'], ['white']),
        new specialText(["│ │"], ['black'], ['white']),
        new specialText(["│","█","│"], ['black',"cyan","black"], ['white']),
        new specialText(["└─┘"], ['black'], ['white']),
    ],
    "Crossbowman": [
        new specialText(["┌─┐"], ['black'], ['white']),
        new specialText(["│ │"], ['black'], ['white']),
        new specialText(["│","█","│"], ['black',"cyan","black"], ['white']),
        new specialText(["└─┘"], ['black'], ['white']),
    ],
    "Necromancer": [
        new specialText(["┌─┐"], ['black'], ['white']),
        new specialText(["│ │"], ['black'], ['white']),
        new specialText(["│","█","│"], ['black',"cyan","black"], ['white']),
        new specialText(["└─┘"], ['black'], ['white']),
    ],
    "Knight": [
        new specialText(["┌─┐"], ['black'], ['white']),
        new specialText(["│ │"], ['black'], ['white']),
        new specialText(["│","█","│"], ['black',"cyan","black"], ['white']),
        new specialText(["└─┘"], ['black'], ['white']),
    ],
}

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

let difficulty = '';
let deck = [];
async function chooseDifficulty() {
    difficulty = '';
    deck = [];
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
let board = [];
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
}
let symbolMap = {
    "Fire Mage": heart,
    "Archer": spade,
    "Warhammer Wielder": club,
    "Crossbowman": diamond,
    "Necromancer": cup,
    "Knight": shield,
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
    5: "Draw an Angel to your hand",
    6: "Heal 2 health",
    7: "Push all enemies 4 spaces back",
    8: "Fill hand with 3s",
    9: "Kill all enemies on board and lose all ammo cards",
    10: "Deal 2d6 damage rolled individually to all enemies",
    11: "Kill the amount of weakest enemies equal to the amount of lost health",
    12: "Flip the board",
    13: "Kill 1 chosen enemy",
    14: "Gain 1 shield",
    15: "Gain 2 shields at the cost of 1 health",
    16: "Kill 2 random enemies",
    17: "Tap all enemies",
    18: "Stop enemies spawning for 2 turns",
    19: "Tap untapped, and kill tapped enemies in a chosen column",
    20: "Kill all tapped enemies",
    21: "Draw a chosen Arcana"
}

async function game() {
    health = difficulty === 'e' ? 4 : 8;
    maxHealth = health;
    shields = difficulty === 'h' ? 2 : 0;
    deckSize = deck.length;
    let turn = 1;
    let hero1Deck = [1,2,3];
    let hero2Deck = [1,2,3];
    let arcana1 = 0;
    let arcana2 = 0;
    while (!(health <= 0) && !(deck.length === 0 && board.every(card => card === undefined))) {
        drawCard();
        await sleep(600);
        await heroTurn();
    }
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
                case 10:
                    row.join(" Hero 2 hand:");
                    break;
                case 11:
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
                case 12:
                    row.join(" Next card:");
                    break;
                case 13:
                    row
                    .join("  ")
                    .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)
                    ? ammoCard[0].clone()
                    : ammoBlank[0])
                    break;
                case 14:
                    row
                    .join("  ")
                    .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)
                    ? ammoCard[1].clone().replace("X", ammoMap[(board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1).value])
                    : ammoBlank[1])
                    break;
                case 15:
                    row
                    .join("  ")
                    .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)
                    ? ammoCard[2].clone().replace("Y", ...(suits[(board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1).suit]))
                    : ammoBlank[2])
                    break;
                case 16:
                    row
                    .join("  ")
                    .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)
                    ? ammoCard[3].clone()
                    : ammoBlank[3])
                    break;
            }
            printSpecial(row);
        });
        print(" ".multiply(114)+"|");
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
            printSpecial(row);
        });
        renderAmmo();
    }
    async function drawCard() {
        let card = (board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).pop();
        board.unshift(card);
        if (board.length > 10) {
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
            if (board.length > 10) {
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
            clearLines(44, 60);
            print(turn === 1 ? hero1 + "'s turn!" : hero2 + "'s turn!");
            for (let i = 0; i < 4; i++) {
                let row = new specialText();
                for (let item of (turn === 1 ? hero1Deck : hero2Deck)) {
                    row.join(item ? ammoCard[i].clone().replace("X", ammoMap[item]).replace("Y", ...(symbolMap[turn === 1 ? hero1 : hero2])) : ammoBlank[i]);
                    row.join(" ");
                }
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
                        choices.push("1");
                    }
                }
            });
            (turn === 1 ? arcana1 : arcana2) > 0 && choices.push("s");
            choices.forEach(choice => {
                choice === "a"
                ?print("["+choice.toUpperCase()+"]: " + classAbilityDesc[turn === 1 ? hero1 : hero2])
                :choice === "s"
                ?print("["+choice.toUpperCase()+"]: " + String((turn === 1 ? arcana1 : arcana2) - 1) + "-" + arcanaNames[(turn === 1 ? arcana1 : arcana2) - 1] + " - " + arcanaDesc[(turn === 1 ? arcana1 : arcana2) - 1])
                :print("["+choice.toUpperCase()+"]: " + "Attack for " + valueMap[choice] + " + 1d6 damage");
            });
            let input = '';
            while (!choices.includes(input)) {
                input = await getInput();
            }
            switch (input) {
                case 'a':
                    await specialAttack(turn === 1 ? hero1 : hero2);
                    renderGame();
                    break;
                case 's':
                    break;
                default:
                    with(turn === 1 ? hero1Deck : hero2Deck) {
                        multiply(1)[indexOf(invAmmoMap[input.toUpperCase()])] = false;
                    }
                    let damage = valueMap[invAmmoMap[input.toUpperCase()]];
                    let roll = Math.floor(Math.random() * 6) + 1;
                    let target = await chooseTarget("Choose a target to attack for " + damage + " + " + roll + " damage", "single");
                    attack(target, damage + roll);
                    break;
            }
            await pause();
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
            clearLines(44, 54);
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
        if (board[target]) {
            let health = valueMap[board[target].value];
            if (board[target].tapped) {
                if (damage >= Math.ceil(health / 2)) {
                    print("You killed the " + board[target].value + " of " + board[target].suit + "s!");
                    if (!special) {
                        if (symbolMap[hero1] == suits[board[target].suit]) {
                            ammo1[board[target].value] = true;
                        } else if (symbolMap[hero2] == suits[board[target].suit]) {
                            ammo2[board[target].value] = true;
                        }
                    }
                    board[target] = undefined;
                }
            } else {
                if (damage >= health) {
                    print("You killed the " + board[target].value + " of " + board[target].suit + "s!");
                    if (!special) {
                        if (symbolMap[hero1] == suits[board[target].suit]) {
                            ammo1[board[target].value] = true;
                        } else if (symbolMap[hero2] == suits[board[target].suit]) {
                            ammo2[board[target].value] = true;
                        }
                    }
                    board[target] = undefined;
                } else if (damage >= Math.ceil(health / 2)) {
                    print("You tapped the " + board[target].value + " of " + board[target].suit + "s!");
                    board[target].tapped = true;
                }
            }
        }
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
                        let target = await chooseTarget("Choose a row to shoot with a triple arrow for " + valueMap[ammo[0]] + " + " + roll + " damage", "row");
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

            }
            resolve();
        });
    }
    function chooseAmmo(min, max) {
        return new Promise(async resolve => {
            moveTo(0, 44);
            clearLines(44, 54);
            min !== max
            ? print("Choose " + min + " to " + max + " ammo cards:")
            : min === 1
            ? print("Choose 1 ammo card:")
            : print("Choose " + min + " ammo cards:");
            let chosen = [];
            while (chosen.length < max && (Object.values(ammo1).some(card => card) || Object.values(ammo2).some(card => card))) {
                renderAmmo();
                print("Chosen: " + chosen.map(card => ammoMap[card]).join(", "));
                let input = '';
                let inputs = [];
                Object.keys(ammo1).forEach((key) => {
                    if (ammo1[key] || ammo2[key]) {
                        inputs.push(ammoMap[key]);
                    }
                });
                print(JSON.stringify(inputs) + ": Choose an ammo card");
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
                    if (ammo1[input]) {
                        ammo1[input] = false;
                    } else {
                        ammo2[input] = false;
                    }
                }
            }
            resolve(chosen);
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