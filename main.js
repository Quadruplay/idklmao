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
for (let i = 0; i < 60; i++) {
    divs.push(main.appendChild(document.createElement('div')));
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

// window.onerror = function(message, source, lineno, colno, error) {
//     // Construct an error message
//     const errorMessage = `
//         Error: ${message}
//         Source: ${source}
//         Line: ${lineno}
//         Column: ${colno}
//         Stack Trace: ${error ? error.stack : 'N/A'}
//     `;
    
//     // Display the error using an alert
//     alert("PLEASE COPY THIS AND SEND TO ME\n\n" + errorMessage);
// };

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
    'fool': 0,
    'arcana': 0,
    'secret': false
}
if (localStorage.getItem('unlocks')) {
    let unlocksLoaded = JSON.parse(localStorage.getItem('unlocks'));
    for (let key in unlocksLoaded) {
        unlocks[key] = unlocksLoaded[key];
    }
    if (Object.keys(unlocks).length !== Object.keys(unlocksLoaded).length) {
        localStorage.setItem('unlocks', JSON.stringify(unlocks));
    }
} else {
    localStorage.setItem('unlocks', JSON.stringify(unlocks));
}

let achievementNames = {
    'piece of cake': 'Piece of Cake',
    'half-baked hero': 'Half-Baked Hero',
    'hard cookie to crack': 'Hard Cookie to Crack',
    'magnificent seven': 'Magnificent Seven',
    'bad deal': 'Bad Deal',
    'true hermit': 'True Hermit',
    'fool': 'Fool',
    'new beginning': 'New Beginning',
    'hope': 'Hope',
    'bitter aftertaste': 'Bitter Aftertaste'
}

let achievementDesc = {
    'piece of cake': 'Complete the game on easy mode', //V
    'half-baked hero': 'Complete the game on medium mode', //V
    'hard cookie to crack': 'Complete the game on hard mode', //V
    'magnificent seven': 'Defeat the Dark Magician', //V
    'bad deal': 'Die by making a deal with the Devil', //V
    'true hermit': 'Clear the board using the Hermit arcana', //V
    'fool': 'Draw the Fool arcana using the Fool arcana', //V
    'new beginning': 'Heal to 8 health using the Genesis arcana', //V
    'hope': 'Attack a King with an attack of power 1', //V
    'bitter aftertaste': 'Die after defeating all six bosses' //V
}

let achievementRewards = {
    'piece of cake': 'Change the die rolled to a d7 and unlock medium mode at the shop', //V
    'half-baked hero': 'Change the die rolled to a d8 and unlock hard mode at the shop', //V
    'hard cookie to crack': 'Unlock the Dark Magician at the shop', //V
    'magnificent seven': 'Unlock infinite mode', //V?
    'bad deal': 'Changes the reward of the "New Beggining" achievement to "+2 starting health"', //V
    'true hermit': "Unlock a friend", //V
    'fool': 'Make the Fool arcana unable to draw itself, doubling the chance for drawin the World arcana', //V
    'new beginning': '+2 health limit', //V
    'hope': 'Unlock the Bishop hero',
    'bitter aftertaste': 'Enable the quit button in the menu' //V?
}

function getDie() {
    return 6 + achievements['piece of cake'] + achievements['half-baked hero'];
}

let achievementsGranted = [];
function grantAchievement(achievement) {
    if (achievements[achievement]) return false;
    achievements[achievement] = true;
    achievementsGranted.push(achievement);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    return true;
}

const hitCard = new Audio('hitCard.wav'); //V?
const hitCastle = new Audio('hitCastle.wav'); //V?
const moveCard = new Audio('moveCard.wav'); //V?
const gainArcana = new Audio('gainArcana.wav'); //V?
const lose = new Audio('lose.wav'); //V?
const win = new Audio('win.mp3'); //V?

let achievements = {
    'piece of cake': false, //easy mode
    'half-baked hero': false, //medium mode
    'hard cookie to crack': false, //hard mode
    'magnificent seven': false, //secret boss
    'bad deal': false, //die from devil
    'true hermit': false, //clear board using hermit
    'fool': false, //get fool from fool
    'new beginning': false, //heal to full health using genesis
    'hope': false, //attack king with 0+1
    'bitter aftertaste': false, //die after defeating all six bosses
}
if (localStorage.getItem('achievements')) {
    let achievementsLoaded = JSON.parse(localStorage.getItem('achievements'));
    for (let key in achievementsLoaded) {
        achievements[key] = achievementsLoaded[key];
    }
    if (Object.keys(achievements).length !== Object.keys(achievementsLoaded).length) {
        localStorage.setItem('achievements', JSON.stringify(achievements));
    }
} else {
    localStorage.setItem('achievements', JSON.stringify(achievements));
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
    new specialText(["║ABCDEFGHIJ      ║"], ['white'], ['black']),
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
    new specialText(["║","█","███      ","█","█","█","███║"], ['white',"gray","white","darkgray",'lightgray',"gray","white"], ['black','black','black','black','black','black','black']),
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
    new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
    new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
]

const queen = [
    new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
    new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
]

const knight = [
    new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
    new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
]

const page = [
    new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
    new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
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

const joker = [
    new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
    new specialText(["§ J              §"], ['black'], ['white']),
    new specialText(["║ O              ║"], ['black'], ['white']),
    new specialText(["│ K              │"], ['black'], ['white']),
    new specialText([": E              :"], ['black'], ['white']),
    new specialText(["│ R              │"], ['black'], ['white']),
    new specialText(['║                ║'], ['black'], ['white']),
    new specialText(["§                §"], ['black'], ['white']),
    new specialText(["∩                ∩"], ['black'], ['white']),
    new specialText(["Ü                Ü"], ['black'], ['white']),
    new specialText(["§                §"], ['black'], ['white']),
    new specialText(["║                ║"], ['black'], ['white']),
    new specialText(["│              J │"], ['black'], ['white']),
    new specialText([":              O :"], ['black'], ['white']),
    new specialText(["│              K │"], ['black'], ['white']),
    new specialText(["║              E ║"], ['black'], ['white']),
    new specialText(["§              R §"], ['black'], ['white']),
    new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
]

const cardsSpecial = {page, knight, queen, king, blank, joker};

const cards = [
    undefined,
    [
        new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
        new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
    ],
    [
        new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
        new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
    ],
    [
        new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
        new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
    ],
    [
        new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
        new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
    ],
    [
        new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
        new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
    ],
    [
        new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
        new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
    ],
    [
        new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
        new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
    ],
    [
        new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
        new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
    ],
    [
        new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
        new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
    ],
    [
        new specialText(["◤≡=⁃-⁃=≡{}≡=⁃-⁃=≡◥"], ['black'], ['white']),
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
        new specialText(["◣≡=⁃-⁃=≡{}≡=⁃-⁃=≡◢"], ['black'], ['white']),
    ]
]

const heart = ["♥", "red", "white"];
const spade = ["♠", "black", "white"];
const diamond = ["♦", "red", "white"];
const club = ["♣", "black", "white"];
const shield = ["♡", "red", "white"];
const cup = ["♢", "black", "white"];
const none = [" ", "black", "white"];

const hp1 = ["♥", "red", "black"];
const hp0 = ["♥", "gray", "black"];
const hpShield = ["♡", "yellow", "black"];
const hpNo = [" ", "black", "black"];

let suits = {heart, spade, diamond, club, shield, cup, none};

let suitsGray = {
    heart: ["♥", "red", "lightgray"],
    spade: ["♠", "black", "lightgray"],
    diamond: ["♦", "red", "lightgray"],
    club: ["♣", "black", "lightgray"],
    shield: ["♡", "red", "lightgray"],
    cup: ["♢", "black", "lightgray"],
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

async function isLineEmpty(line) {
    return lines[line].every(char => char.textContent === nbsp);
}

async function pause() {
    let presumed = 0;
    for (let i = 0; i < lines.length; i++) {
        if (await isLineEmpty(i)) {
            presumed = presumed || i;
        } else {
            presumed = 0;
        }
    }
    if (presumed) {
        moveTo(0, presumed);
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
    print("[A]chievements");
    print("[I]nstructions");
    print("[C]redits");
    print("[Q]uit");

    let input = '';
    let inputs = ['s', 'u', 'a', 'i', 'c', 'q'];
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
        case 'a':
            achievementScreen();
            break;
        case 'i':
            instructions();
            break;
        case 'c':
            credits();
            break;
        case 'q':
            if (achievements['bitter aftertaste']) window.close();
            else menu();
            break;
    }
};

async function achievementScreen() {
    clearScreen();
    let no = ["X", "red", "black"];
    let yes = ["V", "green", "black"];
    print("Achievements:");
    print("");
    Object.keys(achievements).forEach(achievement => {
        printSpecial(new specialText("[A] ")
            .replace("A", ...(achievements[achievement] ? yes : no))
            .join(achievementNames[achievement])
            .join(" - ")
            .join(achievementDesc[achievement])
        );
        print("    Reward: " + achievementRewards[achievement]);
        print("");
    });
    print("");
    await pause();
    menu();
}

async function shop() {
    localStorage.setItem("currency", JSON.stringify(currency));
    localStorage.setItem("unlocks", JSON.stringify(unlocks));
    clearScreen();
    printSpecial(new specialText(["Gems: "+currency.heart+" A  "+currency.spade+" B "+currency.diamond+" C  "+currency.club+" D  "+currency.shield+" E  "+currency.cup+" F"], ["white"], ["black"]).replace("A", ...heart).replace("B", ...spade).replace("C", ...diamond).replace("D", ...club).replace("E", ...shield).replace("F", ...cup));
    let inputs = ['b'];
    if (!unlocks.medium && achievements['piece of cake']) {
        print("");
        printSpecial(new specialText(["[M]: Unlock medium difficulty.                         2 A  +  2 B"], ["white"], ["black"]).replace("A", ...heart).replace("B", ...spade));
        inputs.push('m');
    }
    if (!unlocks.hard && achievements['half-baked hero']) {
        print("");
        printSpecial(new specialText(["[H]: Unlock hard difficulty.                           2 A  +  2 B  +  2 C  +  2 D"], ["white"], ["black"]).replace("A", ...heart).replace("B", ...spade).replace("C", ...diamond).replace("D", ...club));
        inputs.push('h');
    }
    if (!unlocks.secret && achievements['hard cookie to crack']) {
        print("");
        printSpecial(new specialText(["[S]: Unlock ??? on hard difficulty.                         2 A  +  2 B  +  2 C  +  2 D  +  2 E  +  2 F"], ["white"], ["black"]).replace("A", ...heart).replace("B", ...spade).replace("C", ...diamond).replace("D", ...club).replace("E", ...shield).replace("F", ...cup));
        inputs.push('s');
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
    if (unlocks.arcana !== 8) {
        print("");
        switch (unlocks.arcana) {
            case 0:
                printSpecial(new specialText(["[A]: Unlock the Dragon arcana.                         1 B"], ["white"], ["black"]).replace("B", ...heart));
                break;
            case 1:
                printSpecial(new specialText(["[A]: Unlock the Hydra arcana.                          1 B"], ["white"], ["black"]).replace("B", ...spade));
                break;
            case 2:
                printSpecial(new specialText(["[A]: Unlock the Eagle arcana.                          1 B"], ["white"], ["black"]).replace("B", ...diamond));
                break;
            case 3:
                printSpecial(new specialText(["[A]: Unlock the Ox arcana.                             1 B"], ["white"], ["black"]).replace("B", ...club));
                break;
            case 4:
                printSpecial(new specialText(["[A]: Unlock the Lion arcana.                           1 B"], ["white"], ["black"]).replace("B", ...shield));
                break;
            case 5:
                printSpecial(new specialText(["[A]: Unlock the Serpent arcana.                        1 B"], ["white"], ["black"]).replace("B", ...cup));
                break;
            case 6:
                printSpecial(new specialText(["[A]: Unlock the Angel arcana.                          1 B  +  1 C  +  1 D  +  1 E  +  1 F  +  1 G"], ["white"], ["black"]).replace("B", ...heart).replace("C", ...spade).replace("D", ...diamond).replace("E", ...club).replace("F", ...shield).replace("G", ...cup));
                break;
            case 7:
                printSpecial(new specialText(["[A]: Unlock the Genesis arcana.                        1 B  +  1 C  +  1 D  +  1 E  +  1 F  +  1 H"], ["white"], ["black"]).replace("B", ...heart).replace("C", ...spade).replace("D", ...diamond).replace("E", ...club).replace("F", ...shield).replace("H", ...cup));
                break;
        }
        inputs.push('a');
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
                localStorage.setItem("currency", JSON.stringify(currency));
                localStorage.setItem("unlocks", JSON.stringify(unlocks));
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
            case 's':
                if (currency.heart >= 2 && currency.spade >= 2 && currency.diamond >= 2 && currency.club >= 2 && currency.shield >= 2 && currency.cup >= 2) {
                    currency.heart -= 2;
                    currency.spade -= 2;
                    currency.diamond -= 2;
                    currency.club -= 2;
                    currency.shield -= 2;
                    currency.cup -= 2;
                    unlocks.secret = true;
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
            case 'a':
                switch (unlocks.arcana) {
                    case 0:
                        if (currency.heart >= 1) {
                            currency.heart -= 1;
                            unlocks.arcana++;
                        }
                        break;
                    case 1:
                        if (currency.spade >= 1) {
                            currency.spade -= 1;
                            unlocks.arcana++;
                        }
                        break;
                    case 2:
                        if (currency.diamond >= 1) {
                            currency.diamond -= 1;
                            unlocks.arcana++;
                        }
                        break;
                    case 3:
                        if (currency.club >= 1) {
                            currency.club -= 1;
                            unlocks.arcana++;
                        }
                        break;
                    case 4:
                        if (currency.shield >= 1) {
                            currency.shield -= 1;
                            unlocks.arcana++;
                        }
                        break;
                    case 5:
                        if (currency.cup >= 1) {
                            currency.cup -= 1;
                            unlocks.arcana++;
                        }
                        break;
                    case 6:
                        if (currency.heart >= 1 && currency.spade >= 1 && currency.diamond >= 1 && currency.club >= 1 && currency.shield >= 1 && currency.cup >= 1) {
                            currency.heart -= 1;
                            currency.spade -= 1;
                            currency.diamond -= 1;
                            currency.club -= 1;
                            currency.shield -= 1;
                            currency.cup -= 1;
                            unlocks.arcana++;
                        }
                        break;
                    case 7:
                        if (currency.heart >= 1 && currency.spade >= 1 && currency.diamond >= 1 && currency.club >= 1 && currency.shield >= 1 && currency.cup >= 1) {
                            currency.heart -= 1;
                            currency.spade -= 1;
                            currency.diamond -= 1;
                            currency.club -= 1;
                            currency.shield -= 1;
                            currency.cup -= 1;
                            unlocks.arcana++;
                        }
                        break;
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
    print("You are a great wizard tasked by the king in overseeing and aiding");
    print("brave heroes in their quest to defeat the dark magician.");
    print("To do so you must guide them using your deck of cards.");
    print("Each enemy card has a value and a suit. The value represents the amount");
    print("of damage needed to tap or kill the enemy. To kill an enemy, you must deal");
    print("damage equal to or greater than their value. To tap an enemy, you must deal");
    print("damage equal to at least half their value rounded up. Tapped enemies require");
    print("half the damage to kill. The suit represents the potential spoils in the form of ammo cards.");
    print("Killing an enemy of a suit matching one of your heroes without using a class ability");
    print("will grant you an ammo card of value equal to the enemy's value. Ammo cards can be spent");
    print("to use class abilities using aces. Additionally kings from the neighboring kingdoms, corrupted");
    print("by the dark magician will join the battle. Defeating them will grant you a powerful artifact");
    print("in the form of an arcana card. Arcana cards can be used to turn the tide of battle if used wisely.");
    print("Using an arcana card does not consume a turn. Kings like some other enemies are considered face cards.");
    print("Face cards represent powerful opponents which never arrive to the battlefield alone. They are always");
    print("accompanied by a second, less powerful card. It is highly unlikely that you will be able to defeat them,");
    print("but fortunately, you hold a rare artifact, the Crystal of Time, which allows you to turn back time and");
    print("try again. The kings, twisted with dark magic will yield magical gems, which may be spent after each battle.");
    print("Only using these, may you hope to finally reach the dark magician.");
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
    if (unlocks.secret) print("[D]ark Magician");
    if (achievements['magnificent seven']) print("[I]nfinite");
    print("[B]ack");
    let input = '';
    let inputs = ['e', 'b'];
    if (unlocks.medium) inputs.push('m');
    if (unlocks.hard) inputs.push('h');
    if (unlocks.secret) inputs.push('d');
    if (achievements['magnificent seven']) inputs.push('i');
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
                case 'i':
                case 'd':
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
    if (difficulty !== 'i' && achievements['hope']) {
        heroPool.push(new specialText(...none).join("[B]ishop"));
        choices.push("b");
    }
    switch (difficulty) {
        case 'i':
        case 'd':
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
        case 'b':
            hero1 = "Bishop";
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
        case 'b':
            hero2 = "Bishop";
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
    "Bishop": none,
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
    priest: 0,
    joker: 15
}

const classAbilityDesc = {
    "Fire Mage": "Discard 1 ammo card to tap frontmost card in every column",
    "Archer": "Discard 1 ammo card to deal its value + 1d"+getDie()+" to frontmost enemy in chosen column and neighboring columns",
    "Warhammer Wielder": "Discard up to 2 ammo cards to deal their value to chosen enemy. If the enemy is killed, deal same damage to adjacent cards",
    "Crossbowman": "Discard 1 ammo card to deal its value + 2d"+getDie()+" to all enemies in chosen column",
    "Necromancer": "Discard up to 3 ammo cards to swap your hand with them",
    "Knight": "Discard any number of ammo cards to deal their value split freely among up to 3 chosen enemies",
    "Bishop": "Discard 1 ammo card to heal 1 health"
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
    21: "The World",
    22: "The Dragon",
    23: "The Hydra",
    24: "The Eagle",
    25: "The Ox",
    26: "The Lion",
    27: "The Serpent",
    28: "The Angel",
    29: "Genesis",
}
const arcanaDesc = {
    0: "Draw a random Arcana",
    1: "Change all enemies on the board to the chosen suit",
    2: "Fill hand with Aces",
    3: "Draw a Queen to your hand",
    4: "Draw a King to your hand",
    5: "Draw a Priest to your hand",
    6: "Heal 2 health up to a maximum of starting health",
    7: "Push all enemies 4 spaces back",
    8: "Fill hand with 3s",
    9: "Discard all your ammo cards and kill that many weakest enemies",
    10: "Deal 2d"+getDie()+" damage rolled individually to all enemies",
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
    21: "Draw a chosen Arcana",
    22: "Use Fire Mage's ability",
    23: "Use Archer's ability",
    24: "Use Crossbowman's ability",
    25: "Use Warhammer Wielder's ability",
    26: "Use Knight's ability",
    27: "Use Necromancer's ability",
    28: "Upgrade all the ammo cards",
    29: "Discard all your ammo cards and heal that much health up to a maximum of starting health",
}

async function game() {
    achievementsGranted = [];
    health = 4 + unlocks.health;
    maxHealth = health;
    if (achievements["new beginning"]) maxHealth += 2;
    if (achievements["bad deal"] && achievements["new beginning"]) health += 2;
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
    if (hero1 === "Bishop") hero1Deck = ["priest", "priest", "priest"];
    let hero2Deck = [1,2,3];
    if (hero2 === "Bishop") hero2Deck = ["priest", "priest", "priest"];
    let arcana1 = unlocks.fool > 0 ? 1 : 0;
    let arcana2 = unlocks.fool > 1 ? 1 : 0;
    let kingKilled = false;
    let arcanaUsed = false;
    let jokerSpawned = false;
    let enemiesKilled = 0;
    let faceCardsKilled = 0;
    let bossesKilled = 0;
    while (!(health <= 0) && !(deck.length === 0 && board.every(card => card === undefined))) {
        if (!arcanaUsed) {
            drawCard();
            await sleep(600);
            if (health <= 0) break;
            if (board.some(card => card?.value === "king" && card?.suit === "heart")) {
                board.forEach(card => {
                    if (card && card.value !== "king") {
                        card.tapped = false;
                    }
                });
                renderGame();
                moveTo(0, 44);
                clearLines(43, 60);
                print("The King of War is healing all the enemies through their anger");
                await pause();
            }
            if (board.some(card => card?.value === "king" && card?.suit === "spade")) {
                renderGame();
                moveTo(0, 44);
                clearLines(43, 60);
                print("The King of Conquest is empowering all the enemies making them deal more damage to your castle");
                await pause();
            }
            if (board.some(card => card?.value === "king" && card?.suit === "diamond")) {
                renderGame();
                moveTo(0, 44);
                clearLines(43, 60);
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
                moveTo(0, 44);
                clearLines(43, 60);
                print("The King of Pestilence is making ammo cards break more easily");
                await pause();
            }
            if (board.some(card => card?.value === "king" && card?.suit === "shield")) {
                renderGame();
                moveTo(0, 44);
                clearLines(43, 60);
                print("The King of Madness is making it harder to get control of the board");
                await pause();
            }
            if (board.some(card => card?.value === "king" && card?.suit === "cup")) {
                renderGame();
                moveTo(0, 44);
                clearLines(43, 60);
                print("The King of Death is making already dead enemies come back to life");
                await pause();
            }
            if (board.some(card => card?.value === "joker")) {
                arcana1 = 0;
                arcana2 = 0;
                Object.keys(ammo1).forEach(key => {
                    ammo1[key] = false;
                    ammo2[key] = false;
                });
                renderGame();
                moveTo(0, 44);
                clearLines(43, 60);
                print("The Dark Magician is removing all sources of power from the heroes");
                await pause();
            }
        } else {
            arcanaUsed = false;
            turn = 3 - turn;
        }
        if (board.some(card => card)) await heroTurn();
        if (health <= 0) break;
        if (deck.length === 0 && board.every(card => card === undefined) && difficulty === 'd' && unlocks.secret && !jokerSpawned) {
            jokerSpawned = true;
            deck.push({value: "joker", suit: "heart", tapped: false});
        }
        if (deck.length === 0 && board.every(card => card === undefined) && difficulty === 'i') {
            let faceDeck = [];
            let valueDeck = [];
            let kingDeck = [];
            switch (difficulty) {
                case 'i':
                case 'd':
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
        }
    }
    if (health <= 0) {
        clearScreen();
        lose.play();
        print("You have lost");
        if (difficulty === 'i') {
            print("You have defeated " + enemiesKilled + " enemies");
            print(faceCardsKilled + " of which were face cards");
            print(bossesKilled + " of which were kings");
        }
        if (difficulty === 'h') {
            if (!deck.some(card => card?.value === "king") && !board.some(card => card?.value === "king") && discard.at(-1)?.value !== "king") {
                grantAchievement('bitter aftertaste');
            }
        }
        if (achievementsGranted.length > 0) {
            print("");
            print("Achievements:");
            print("");
            achievementsGranted.forEach(achievement => {
                print(achievementNames[achievement]);
            });
        }
        await pause();
    } else {
        clearScreen();
        win.play();
        print("You have won");
        if (difficulty === 'e') {
            grantAchievement('piece of cake');
        } else if (difficulty === 'm') {
            grantAchievement('half-baked hero');
        } else if (difficulty === 'h') {
            grantAchievement('hard cookie to crack');
            if (unlocks.secret) {
                grantAchievement('magnificent seven');
            }
        }
        if (achievementsGranted.length > 0) {
            print("");
            print("Achievements:");
            print("");
            achievementsGranted.forEach(achievement => {
                print(achievementNames[achievement]);
            });
        }
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
                            .replace("X", ...((board[i].tapped ? suitsGray : suits)[board[i].suit]));
                            break;
                        case 'string':
                            row
                            .join(cardsSpecial[board[i].value][index].clone().recolor("black", board[i].tapped ? "lightgray" : "white"))
                            .replace("X", ...((board[i].tapped ? suitsGray : suits)[board[i].suit]));
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
                    .join(" ")
                    .join(new specialText(...symbolMap[hero1]))
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
                    .join(" ")
                    .join(new specialText(...symbolMap[hero2]))
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
                    row.join(" Next up:");
                    break;
                case 15:
                    row
                    .join("  ")
                    .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)
                    ? ammoCard[0].clone()
                    : ammoBlank[0])
                    if (typeof (board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)?.value === "string") {
                        row
                        .join(" ")
                        .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && (discard.length > 1) ? discard : deck).at(-2)
                        ? ammoCard[0].clone()
                        : ammoBlank[0])
                    }
                    break;
                case 16:
                    row
                    .join("  ")
                    .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)
                    ? ammoCard[1].clone().replace("X", ammoMap[(board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1).value])
                    : ammoBlank[1])
                    if (typeof (board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)?.value === "string") {
                        row
                        .join("+")
                        .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && (discard.length > 1) ? discard : deck).at(-2)
                        ? ammoCard[1].clone().replace("X", ammoMap[(board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-2).value])
                        : ammoBlank[1])
                    }
                    break;
                case 17:
                    row
                    .join("  ")
                    .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)
                    ? ammoCard[2].clone().replace("Y", ...(suits[(board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1).suit]))
                    : ammoBlank[2])
                    if (typeof (board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)?.value === "string") {
                        row
                        .join(" ")
                        .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && (discard.length > 1) ? discard : deck).at(-2)
                        ? ammoCard[2].clone().replace("Y", ...(suits[(board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-2).suit]))
                        : ammoBlank[2])
                    }
                    break;
            }
            printSpecial(row);
        });
        printSpecial( new specialText([" ".multiply(114)+"|"+" ".multiply(10)], ["white"], ["black"])
        .join((board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)
        ? ammoCard[3].clone()
        : ammoBlank[3])
        .join(" ")
        .join(typeof (board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).at(-1)?.value === "string"
        ?((board.some(card => (card?.value === "king" && card?.suit === "cup")) && (discard.length > 1) ? discard : deck).at(-2)
        ? ammoCard[3].clone()
        : ammoBlank[3])
        : ""));
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
            .replace("I", ...(health > 8 ? hp1 : maxHealth > 8 ? hp0 : hpNo))
            .replace("J", ...(health > 9 ? hp1 : maxHealth > 9 ? hp0 : hpNo))
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
                            .replace("X", ...((board[9 - i].tapped ? suitsGray : suits)[board[9 - i].suit]));
                            break;
                        case 'string':
                            row
                            .join(cardsSpecial[board[9 - i].value][index].clone().recolor("black", board[9 - i].tapped ? "lightgray" : "white"))
                            .replace("X", ...((board[9 - i].tapped ? suitsGray : suits)[board[9 - i].suit]));
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
                hitCastle.play();
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
                    if (card?.value === "joker") {
                        health = 0;
                    }
                }
                discard.push(card);
            }
        }
        moveCard.play();
        renderGame();
        await sleep(500);
        if (typeof card?.value === 'string' || board.some(card => card?.value === "joker")) {
            card = (board.some(card => (card?.value === "king" && card?.suit === "cup")) && discard.length ? discard : deck).pop();
            board.unshift(card);
            while (board.length > 10) {
                let card = board.pop();
                if (card) {
                    hitCastle.play();
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
                        if (card?.value === "joker") {
                            health = 0;
                        }
                    }
                    discard.push(card);
                }
            }
            moveCard.play();
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
            if (achievements['true hermit']) {
                if (i === 2) row.join("  i believe in you!")
                if (i === 3) row.join("☺");
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
            let specialError = false;
            let arcanaError = false;
            (turn === 1 ? hero1Deck : hero2Deck).forEach((item, i) => {
                if (item) {
                    choices.push(ammoMap[item].toLowerCase());
                    if (item === 1) {
                        if (Object.values(ammo1).reduce((acc, val) => acc + val, 0) + Object.values(ammo2).reduce((acc, val) => acc + val, 0) < 1) {
                            choices.pop();
                            specialError = "[X]: Not enough ammo cards to use special ability";
                        }
                        if (board.some(card => card?.value === "king" && card?.suit === "shield")) {
                            if (choices.at(-1) === "a") {
                                choices.pop();
                                specialError = "[X]: Cannot use special ability while King of Madness is present on board";
                            }
                        }
                        choices.push("1");
                    }
                }
            });
            choices = choices.map(choice => choice === "Ω".toLowerCase() ? "0" : choice);
            if ((turn === 1 ? arcana1 : arcana2) > 0) {
                choices.push("s")
                if ([23,24,25,26,27,28].includes(turn === 1 ? arcana1 : arcana2)) {
                    if (Object.values(ammo1).reduce((acc, val) => acc + val, 0) + Object.values(ammo2).reduce((acc, val) => acc + val, 0) < 1) {
                        choices.pop();
                        arcanaError = "[X]: Not enough ammo cards to use this Arcana";
                    }
                }
            }
            if (specialError) {
                print(specialError);
            }
            choices.forEach(choice => {
                choice === "a"
                ?print("["+choice.toUpperCase()+"]: " + classAbilityDesc[turn === 1 ? hero1 : hero2])
                :choice === "s"
                ?print("["+choice.toUpperCase()+"]: " + String((turn === 1 ? arcana1 : arcana2) - 1) + "-" + arcanaNames[(turn === 1 ? arcana1 : arcana2) - 1] + " - " + arcanaDesc[(turn === 1 ? arcana1 : arcana2) - 1])
                :choice === "0"
                ?print("["+choice.toUpperCase()+"]: " + "Attack for " + Object.values(ammo1).reduce((p, c) => p + c, Object.values(ammo2).reduce((p, c) => p + c, 0)) + " + 1d"+getDie()+" damage")
                :print("["+choice.toUpperCase()+"]: " + "Attack for " + valueMap[invAmmoMap[choice.toUpperCase()]] + " + 1d"+getDie()+" damage");
            });
            if (arcanaError) {
                print(arcanaError);
            }
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
                        let roll = Math.floor(Math.random() * getDie()) + 1;
                        let target = await chooseTarget("Choose a target to attack for " + damage + " + " + roll + " damage", "single");
                        attack(target, damage + roll);
                        break;
                }
                await pause();
                if (kingKilled) {
                    currency[kingKilled]++;
                    kingKilled = false;
                    localStorage.setItem("currency", JSON.stringify(currency));
                    await chooseArcana();
                }
            if ((turn === 1 ? hero1Deck : hero2Deck).reduce((acc, val) => acc + val, 0) === 0) {
                if (turn === 1) {
                    hero1Deck = [1,2,3];
                    if (hero1 === "Bishop") hero1Deck = ["priest", "priest", "priest"];
                } else {
                    hero2Deck = [1,2,3];
                    if (hero2 === "Bishop") hero2Deck = ["priest", "priest", "priest"];
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
        hitCard.play();
        let kill = false;
        let face = false;
        let king = false;
        if (board[target].value === "king") king = true;
        if (typeof board[target].value === 'string') face = true;
        if (board[target].value === "king" && damage === 1) {
            grantAchievement('hope');
        }
        if (board[target]) {
            let health = valueMap[board[target].value];
            if (board[target].tapped) {
                if (damage >= Math.ceil(health / 2)) {
                    print("You killed the " + (board[target].value === "joker" ? "Dark Magician" : board[target].value) + (board[target].value === "joker" ? "" : (" of " + board[target].suit + "s!")));
                    if (!special && !(board.some(card => card?.value === "king" && card?.suit === "diamond")) && !(board[target].value === "joker")) {
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
                    print("You killed the " + (board[target].value === "joker" ? "Dark Magician" : board[target].value) + (board[target].value === "joker" ? "" : (" of " + board[target].suit + "s!")));
                    if (!special && !(board.some(card => card?.value === "king" && card?.suit === "diamond")) && !(board[target].value === "joker")) {
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
                    print("You tapped the " + (board[target].value === "joker" ? "Dark Magician" : board[target].value) + (board[target].value === "joker" ? "" : (" of " + board[target].suit + "s!")));
                    board[target].tapped = true;
                }
            }
        }
        if (kill) {
            enemiesKilled++;
            if (king) bossesKilled++;
            if (face) faceCardsKilled++;
        }
        return kill;
    }
    function specialAttack(hero) {
        return new Promise(async resolve => {
            let ammoMin = 1;
            let ammoMax;
            switch (hero) {
                case "Bishop":
                case "Fire Mage":
                case "Archer":
                case "Crossbowman":
                    ammoMax = 1;
                    break;
                case "Warhammer Wielder":
                    ammoMax = 2;
                    break;
                case "Necromancer":
                    ammoMax = 3;
                    break;
                case "Knight":
                    ammoMax = Infinity;
                    break;
            }
            let ammo = await chooseAmmo(ammoMin, ammoMax);
            switch (hero) {
                case "Bishop":
                    health++;
                    health = Math.min(health, maxHealth);
                    break;
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
                        let roll = Math.floor(Math.random() * getDie()) + 1;
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
                        let roll1 = Math.floor(Math.random() * getDie()) + 1;
                        let roll2 = Math.floor(Math.random() * getDie()) + 1;
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
                        while (ammo.length < 3) {
                            ammo.push(false);
                        }
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
            clearLines(43, 60);
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
            gainArcana.play();
            let choice1 = Math.floor(Math.random() * (22 + unlocks.arcana));
            let choice2 = Math.floor(Math.random() * (22 + unlocks.arcana));
            let choice3 = Math.floor(Math.random() * (22 + unlocks.arcana));
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
                        let choice = Math.floor(Math.random() * (22 + unlocks.arcana));
                        if (choice === 0) {
                            if (achievements['fool']) {
                                choice = 21;
                            } else {
                                grantAchievement('fool');
                            }
                        }
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
                        health = Math.min(health, maxHealth);
                    }
                    break;
                case "The Chariot":
                    {
                        deck.push(board.shift());
                        await sleep(250);
                        moveCard.play();
                        renderGame();
                        deck.push(board.shift());
                        await sleep(250);
                        moveCard.play();
                        renderGame();
                        deck.push(board.shift());
                        await sleep(250);
                        moveCard.play();
                        renderGame();
                        deck.push(board.shift());
                        await sleep(250);
                        moveCard.play();
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
                        let lostAmmo = 0;
                        Object.keys(ammo1).forEach(key => {
                            if (ammo1[key]) {
                                lostAmmo++;
                            }
                            ammo1[key] = false;
                            if (ammo2[key]){
                                lostAmmo++;
                            }
                            ammo2[key] = false;
                        });
                        let killCount = 0;
                        while (killCount < lostAmmo) {
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
                            attack(weakest, valueMap[board[weakest].value], true);
                        }
                        if (killCount && !board.reduce((acc, val, index) => {
                            if (val) {
                                if (acc === undefined) {
                                    return index;
                                } else if (valueMap[val.value] < valueMap[board[acc].value]) {
                                    return index;
                                }
                            }
                            return acc;
                        }, 0)) {
                            grantAchievement('true hermit')
                        }
                    }
                    break;
                case "Wheel of Fortune":
                    {
                        for (let i = 0; i < 10; i++) {
                            if (board[i]) {
                                let roll1 = Math.floor(Math.random() * getDie()) + 1;
                                let roll2 = Math.floor(Math.random() * getDie()) + 1;
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
                        if (health <= 0) {
                            grantAchievement('bad deal');
                        }
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
                        let column = await chooseTarget("Choose a column to burn all the enemies in", "row");
                        if (board[9 - column]) {
                            attack(9 - column, Math.ceil(valueMap[board[9 - column].value] / 2));
                        }
                        if (board[column]) {
                            attack(column, Math.ceil(valueMap[board[column].value] / 2));
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
                case "The Dragon":
                    {
                        await specialAttack("Fire Mage");
                    }
                    break;
                case "The Hydra":
                    {
                        await specialAttack("Archer");
                    }
                    break;
                case "The Eagle":
                    {
                        await specialAttack("Crossbowman");
                    }
                    break;
                case "The Ox":
                    {
                        await specialAttack("Warhammer Wielder");
                    }
                    break;
                case "The Lion":
                    {
                        await specialAttack("Knight");
                    }
                    break;
                case "The Serpent":
                    {
                        await specialAttack("Necromancer");
                    }
                    break;
                case "The Angel":
                    {
                        const angelKeys = {
                            4: 5,
                            5: 6,
                            6: 7,
                            7: 8,
                            8: 9,
                            9: 10,
                            10: "page",
                            "page": "knight",
                            "knight": "queen",
                            "queen": "king",
                            "king": 4
                        }
                        let ammoTemp = {};
                        for (let key in ammo1) {
                            ammoTemp[angelKeys[key]] = ammo1[key];
                        }
                        for (let key in ammoTemp) {
                            ammo1[key] = ammoTemp[key];
                        }
                        ammoTemp = {};
                        for (let key in ammo2) {
                            ammoTemp[angelKeys[key]] = ammo2[key];
                        }
                        for (let key in ammoTemp) {
                            ammo2[key] = ammoTemp[key];
                        }
                    }
                    break;
                case "Genesis":
                    {
                        let lostAmmo = 0;
                        Object.keys(ammo1).forEach(key => {
                            if (ammo1[key]) {
                                lostAmmo++;
                            }
                            ammo1[key] = false;
                            if (ammo2[key]){
                                lostAmmo++;
                            }
                            ammo2[key] = false;
                        });
                        if (health+lostAmmo >= 8 && health < 8) {
                            grantAchievement("new beginning");
                        }
                        health += lostAmmo;
                        health = Math.min(health, maxHealth);
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
                    choice = (choice + 1) % (22 + unlocks.arcana);
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
                print("Remaining damage: " + damage);
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
                            damage -= Math.ceil(valueMap[board[target].value] / 2);
                            attack(target, Math.ceil(valueMap[board[target].value] / 2));
                            killCount++;
                        } else {
                            damage -= valueMap[board[target].value];
                            attack(target, valueMap[board[target].value]);
                            killCount++;
                        }
                        break;
                    case 't':
                        damage -= Math.ceil(valueMap[board[target].value] / 2);
                        attack(target, Math.ceil(valueMap[board[target].value] / 2));
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