//FullStackStory
/* 
I want to make a turn-based, story battle that displays text in a box, has two actors on field, and changes the ending of the story based on whether the player has defeated the opposing actor or not through the choices they made. 

First I will need classes for the player (New Software Engineer) and CodeBeast (Opposing Actor). They will need properties such as HP and Attack. Also because it is a story, there will be dialogue or lines said between each attack cycle/round. 

I will need a way to store the text lines and show them on the screen. Also I will likely need a way to clear them based on the player pushing a key or clicking.

Win-lose conditions will determine the ending of the story but the player can select different methods from a menu to attack the CodeBeast.

Player Attack Methods include Attack, Research, Summon, and Procrasinate.
CodeBeast Attack Methods will be Attack and Deadline Charge

Losing conditions: Get knocked because the player never called for help or research, Get knocked out because the player procrasinated too much

Stretch Goals: Add animations. Give a score. 
*/

class Actor {
    constructor(name, attackPower, lifePoints) {
        this.name = name
        this.attackPower = attackPower
        this.lifePoints = lifePoints
    }
    checkLP() {
        if (this.lifePoints < 0) {
            gameOver = true
        } else {
            messageArray.push(`${this.name} has ${this.lifePoints} life points left!`)
        }
    }
    attack(opponent) {
        messageArray.push(`${this.name} has attacked ${opponent.name} for ${this.attackPower} damage`)
        opponent.lifePoints -= this.attackPower
        opponent.checkLP()
    }
}

/////////////////Player
class SoftwareEngineer extends Actor {
    constructor(name, attackPower, lifePoints, hasPartner = false, partner = {}) {
        super(name, attackPower, lifePoints)
        this.summonsArray = [
            {
                name: 'Instructor',
                banter: `"Cool. Cool. Cool." - Instructor`,
                message: `The Instructor's rapid cooling technique has chilled the code beast!`,
                attackPower: 3,
                specialEffect(opponent) {
                    opponent.chilled = true
                }
            },
            {
                name: 'Assistant Instructor',
                banter: `"Sorry, the cats are outta my control" - Assistant Instructor`,
                message: `The Assistant Instructors' feline minions have assaulted the code beast!`,
                attackPower: 3,
                specialEffect(opponent) {
                    opponent.afraid = true
                }
            },
            {
                name: 'RTT-25 Squad',
                banter: `"Discord Chat is now open!!!" - Problem Solver`,
                message: `Random members of RTT-25 ganged up on the code beast in Discord Chat. It was definitely bullying.`,
                attackPower: random()
            }]
        this.hasPartner = hasPartner
        this.partner = partner
        this.lazyCount = 0
        this.banterArray = [`Your real name is Clarence? And you live with your parents? - ${this.name}`,
        `It says here you lost a fight to a... cat? Seriously? - ${this.name}`,
        `Hmm. So that's your weakpoint? I can fight you better now. - ${this.name}`
        ]
    }
    summonAttack(opponent) {
        disableButtons = true
        this.attack(opponent)
        if (this.hasPartner) {
            opponent.lifePoints -= this.partner.attackPower
            if (this.partner.specialEffect) {
                this.partner.specialEffect(opponent)
            }
            messageArray.push(this.partner.banter, `${this.partner.name} attacked ${opponent.name} for ${this.partner.attackPower} damage`, this.partner.message, `${this.partner.name} leaves to fight their own code beasts.`)
            this.partner = {}
            this.hasPartner = false
            opponent.checkLP()
        }
    }
    procrastinate() {
        disableButtons = true
        messageArray.push(`${this.name} decided to rest. They gained 5 life points!`)
        this.lifePoints += 5
        this.lazyCount += 1
    }
    research(opponent) {
        disableButtons = true
        this.attackPower += 2
        messageArray.push(`${this.name} has done some research about ${opponent.name}. Your attack power has increased by 2!`)
    }
    summon(opponent) {
        disableButtons = true
        if (!this.hasPartner) {
            this.setPartner()
            this.hasPartner = true
            messageArray.push(`${this.name} has summoned ${this.partner.name} to help combat the code beast!`)
        } else {
            messageArray.push(`You've already got an ally! So you attacked with them instead!`)
            this.summonAttack(opponent)
        }
    }
    setPartner() {
        let newPartner = this.summonsArray[Math.floor(Math.random() * 3)]
        this.partner = newPartner
    }
}

////////Enemy
class FrontendFiend extends Actor {
    constructor(name, attackPower, lifePoints, chilled = false, afraid = false) {
        super(name, attackPower, lifePoints)
        this.chilled = chilled
        this.afraid = afraid
        this.poweredUp = false
        this.banterArray = [`T-t-that d-doesn't matter! I'll show you! - ${this.name}`, `S-shut up and code you loser! ${this.name}`, `Your research changes nothing! You still can't beat me. - ${this.name}` ]
    }
    monsterAttack() {
        if (chilled) {
            messageArray.push(`Brrr! It's so cold! - ${this.name}`, `${this.name} has to warm himself up to attack`)
            this.chilled = false
        }
        if (afraid) {
            messageArray.push(`No, no, no! Not the cats! Not again! - ${this.name}`, `${this.name} is too busy fighting his own fear to attack!`)
            this.afraid = false
        }
    }
    deadlineCharge() {
        this.attackPower = 999999999
        this.poweredUp = true
    }
    checkLazyCount(opponent) {
        if (opponent.lazyCount === 3 && !this.poweredUp) {
            this.deadlineCharge()
            messageArray.push(`You're mine now slacker!!!! - ${this.name}`, `${this.name}'s attack power has massively increased!`)
        }
    }
}

//DOM Elements
const textArea = document.getElementById('textarea')
const attackButton = document.getElementById('attack')
const researchButton = document.getElementById('research')
const summonButton = document.getElementById('summon')
const procrastinateButton = document.getElementById('procrastinate')

//Game variables
let gameOver = false //Game over variable
let disableButtons = true //Story variable to disable clicking on buttons
let messageArray = [] //An empty string
let num //A number to be assigned later
let playerName = 'Fresh Software Engineer'
let intro = true

const player = new SoftwareEngineer(playerName, 1, 20)
const codeBeast = new FrontendFiend('Frontend Fiend', 3, 30)


//Functions
function displayMessage() { //Used to display messages in textArea
    if (messageArray.length > 0) {
        let message = messageArray.shift()
        textArea.innerHTML = `<p>${message}</p>`
    }
}

function clearMessage() {
    textArea.innerHTML = ''
}

function random() {
    num = Math.floor(Math.random() * 6) + 3
    return num
}


//Event Listeners
attackButton.addEventListener('click', ()=> { //Attack button
    if (!disableButtons) {
        player.summonAttack(codeBeast)
        displayMessage()
        if (codeBeast.lifePoints > 0) {
            codeBeast.attack(player)
        }
    }
    if (gameOver) {
        disableButtons = true
    }
})

summonButton.addEventListener('click', ()=> { //Summon button
    if (!disableButtons) {
        player.summon(codeBeast)
        displayMessage()
        codeBeast.attack(player)
    }
    if (gameOver) {
        disableButtons = true
    }
})

researchButton.addEventListener('click', ()=> { //Research button
    if (!disableButtons) {
        player.research(codeBeast)
        displayMessage()
        codeBeast.attack(player)
    }
    if (gameOver) {
        disableButtons = true
    }
})

procrastinateButton.addEventListener('click', ()=> { //Procrasinate button
    if (!disableButtons) {
        player.procrastinate()
        displayMessage()
        codeBeast.attack(player)
    }
    if (gameOver) {
        disableButtons = true
    }
})

textArea.addEventListener('click', () => {
    clearMessage()
    if (disableButtons) {
        displayMessage()
    }
    if (messageArray.length === 0 && !gameOver) {
        disableButtons = false
    }
})


messageArray.push('Story Stuff')
messageArray.push('More Story Stuff')
messageArray.push('Even More Story Stuff')
displayMessage()
