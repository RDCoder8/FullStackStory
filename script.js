//FullStackStory
/* 
I want to make a turn-based, story battle that displays text in a box, has two actors on field, and changes the ending of the story based on whether the player has defeated the opposing actor or not through the choices they made. 

First I will need classes for the player (New Software Engineer) and CodeBeast (Opposing Actor). They will need properties such as HP and Attack. Also because it is a story, there will be dialogue or lines said between each attack cycle/round. 

I will need a way to store the text lines and show them on the screen. Also I will likely need a way to clear them based on the player pushing a key or clicking.

Win-lose conditions will determine the ending of the story but the player can select different methods from a menu to attack the CodeBeast.

Player Attack Methods include Attack, Research, Summon, and Procrasinate.
CodeBeast Attack Methods will be Attack and Deadline Charge

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
            return `${this.name} has ${this.lifePoints} life points left!`
        }
    }
    attack(opponent) {
        `${this.name} has attacked ${opponent.name} for ${this.attackPower}`
        opponent.lifePoints -= this.attackPower
        opponent.checkLP()
    }
}

class SoftwareEngineer extends Actor {
    constructor(name, attackPower, lifePoints, hasPartner = false, partner = {}) {
        super(name, attackPower, lifePoints)
        this.summonsArray = [
            {
                name: 'Instructor',
                banter: `Cool. Cool. Cool. - ${this.name}`,
                message: `The ${this.name}'s rapid cooling technique has chilled the code beast!`,
                attackPower: 3,
                specialEffect(opponent) {
                    opponent.chilled = true
                }
            },
            {
                name: 'Assistant Instructor',
                banter: `Sorry, the cats are outta my control - ${this.name}`,
                message: `The ${this.name}s' feline minions have assaulted the code beast!`,
                attackPower: 3,
                specialEffect(opponent) {
                    opponent.afraid = true
                }
            },
            {
                name: 'RTT-25 Squad',
                banter: `Discord Chat is now open`,
                message: `Random members of the ${this.name} ganged up on the code beast in Discord Chat`

            }]
        this.hasPartner = hasPartner
        this.partner = partner 
        banterArray = [`Your real name is Clarence? And you live with your parents? - ${this.name}`,
        `It says here you lost a fight to a... cat? Seriously? - ${this.name}`,
        `Hmm. So that's your weakpoint? I can fight you better now. - ${this.name}`
        ]
    }
    summonAttack(opponent) {
        this.attack(opponent)
        if (this.hasPartner) {
            opponent.lifePoints -= this.partner.attackPower
            `${this.partner.name} attacked ${opponent.name} for ${this.partner.attackPower}`
            if (this.partner.specialEffect(opponent)) {
                this.partner.specialEffect(opponent)
            }
            this.partner.banter
            this.partner.message
            `${this.partner.name} leaves to fight their own code beasts.`
            this.partner = {}
            this.hasPartner = false
            opponent.checkLP()
        }
    }
    procrastinate() {
        this.lifePoints += 5
    }
    research(opponent) {
        this.attackPower += 2
        return `${this.name}'s has done some research about ${opponent.name}. Their attack power has increased by 2!`
    }
    summon(opponent) {
        if (!this.hasPartner) {
            this.hasPartner = true
            this.partner = this.summonsArray[Math.floor(Math.random() * 3)]
            `${this.name} has summoned ${this.partner.name} to combat the code beast!`
        } else {
            `You've already got an ally! So you attacked with them instead!`
            this.summonAttack(opponent)
        }
    }
}

class FrontendFiend extends Actor {
    constructor(name, attackPower, lifePoints, chilled = false) {
        super(name, attackPower, lifePoints)
        this.chilled = chilled
        banterArray = [`T-t-that d-doesn't matter! I'll show you! - ${this.name}`,]
    }
}


let gameOver = false