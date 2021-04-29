import Discord from "discord.js";

export const DEFAULT_CATEGORIES = [
    "Nourriture",
    "Ville",
    "Pays",
    "Personnage"
];

const LETTERS = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
    "Y", "Z"
];

type State = (
    "WAITING_FOR_PLAYERS"
    | "IN_GAME"
    | "RESULTS"
);

type PlayerAnswers = Record<string, string>;
type CategoryAnswers = Record<string, PlayerAnswers>; 
type Answers = Record<string, CategoryAnswers>;

class PetitBac {
    private readonly _message: Discord.Message;
    private readonly _players: Array<Discord.User>;
    private readonly _categories: Array<string>;
    private readonly _letters: Array<string>;
    private readonly _ready: Array<string>;
    private _state: State;
    private _currentLetter: string | null;
    private _answers: Answers;
    private _lastMessages: Record<string, Discord.Message>;

    constructor (
        message: Discord.Message, 
        players: Record<string, Discord.User>,
        categories: Array<string>    
    ) {
        this._message = message;
        this._players = Object.values(players);
        this._categories = categories;
        this._letters = [];
        this._ready = [];
        this._state = "WAITING_FOR_PLAYERS";
        this._currentLetter = null;
        this._answers = {};

        for (let i = 0; i < 5; i++) {
            let nextLetter;
            do {
                nextLetter = LETTERS[Math.round(Math.random() * (LETTERS.length - 1))];
            } while (this._letters.includes(nextLetter));

            this._letters.push(nextLetter);
        }

        for (const letter of this._letters) {
            this._answers[letter] = {};

            for (let cat of this._categories) {
                this._answers[letter][cat] = {};

                for (let player of this._players) {
                    this._answers[letter][cat][player.id] = letter;
                }
            }
        }

        this._lastMessages = {};
        
        this.startGame();
    }

    async handleMessage(message: Discord.Message) {
        if (!message.content.match(/^[0-9]+\s+/)) {
            message.reply("Votre réponse doit démarrer par le chiffre correspondant à la catégorie !");
            return;
        }

        const splittedMessage = message.content.split(' ');
        const categoryIdx = parseInt(splittedMessage[0], 10) - 1;

        if (categoryIdx < 0 || categoryIdx >= this._categories.length) {
            message.reply("Le numéro de catégorie ne correspond à aucune catégorie !");
            return;
        }

        const value = splittedMessage.slice(1).join(' ').trim();
        if (!value.toUpperCase().startsWith(this._currentLetter)) {
            message.reply(`Votre réponse doit démarrer par \`${this._currentLetter}\``);
            return;
        }

        const category = this._categories[categoryIdx];

        this._answers[this._currentLetter][category][message.author.id] = value;
        if (this._lastMessages[message.author.id]) {
            this._lastMessages[message.author.id].edit(this.generateEmbedForAnswer(this._currentLetter, message.author.id));
        }
        
        console.log(`[debug] [petitbac] [${message.author.username}] received value "${value}" for category ${category}`);
    }

    private generateEmbedForAnswer(letter: string, playerId: string) {
        const playerAnswer: Array<string> = [];
        this._categories.forEach((category, i) => {
            const answer = this._answers[letter][category][playerId];
            const v = answer.length === 1 ? `${answer} _ _ _ _ _ _` : answer;
            
            playerAnswer.push(`${i + 1}. ${category}: ${v}`);
        });
        
        return new Discord.MessageEmbed({
            "title": "Le Petit Bac",
            "description": `Tour ${5 - this._letters.length}/5`,
            "color": 646655,
            "fields": [
                {
                    "name": "Lettre Actuelle",
                    "value": `La lettre actuelle est le \`${this._currentLetter}\``
                },
                {
                    "name": "Vos réponses",
                    "value": `\`\`\`${playerAnswer.join('\n')} \`\`\``
                }
            ]
        });
    }

    async startRound() {
        this._currentLetter = this._letters.shift();
        for (const player of this._players) {
            const embed = this.generateEmbedForAnswer(this._currentLetter, player.id);
            const message = await player.send(embed);

            this._lastMessages[player.id] = message;
        }
    }

    async verifyEveryPlayerReady () {
        if (this._ready.length === this._players.length) {
            this._state = "IN_GAME";

            for (const player of this._players) {
                player.send("Tout le monde est prêt. La partie va démarrer dans 5 secondes.");
            }

            setTimeout(this.startRound.bind(this), 5000);
        }
    };

    async startGame () {
        const themesMessage = this._categories.map(c => `- ${c} `).join('\n');
        const lettersMessage = this._letters.join(', ');

        const embed = new Discord.MessageEmbed({
            "title": "Le Petit Bac",
            "description": "Le petit bac va bientôt démarrer.",
            "color": 646655,
            "fields": [
                {
                    "name": "Comment démarrer ?",
                    "value": "Quand vous serez prêt, cliquez sur la réaction 🏁 . La partie va démarrer quand tout le monde aura cliqué dessus."
                },
                {
                    "name": "Quels sont les thèmes ?",
                    "value": `Les thèmes sont les suivants:\n\`\`\`${themesMessage}\`\`\`.`
                },
                {
                    "name": "Quelles sont les lettres ?",
                    "value": `Les lettres sont les suivantes:\n\`\`\`${lettersMessage}\`\`\`A chaque tour, je rappellerai la lettre actuelle.`
                },
                {
                    "name": "Comment valider une réponse ?",
                    "value": "Je vais te fournir un schéma qu'il faudra compléter. Par exemple:\n```1. Animal \n2. Nourriture ```Pour envoyer une réponse, il faudra m'écrire `1 Ours` ou `2 Fraise` par exemple. A chaque message envoyé, je mettrai à jour tes réponses. Quand tu penses avoir fini, tu peux valider, il faudra cliquer sur la réaction 🏁 que j'ajouterai à ton récap de réponse. Ca terminera le tour pour tout le monde. Si tu as fais une erreur, pas de panique ! Tu peux me renvoyer autant de message que tu veux, seul le plus ancien de chaque catégorie sera sauvegardé !"
                },
                {
                    "name": "Bonne chance !",
                    "value": "Que le meilleur gagne !"
                }
            ]
        });

        for (const player of this._players) {
            const sentMessage = await player.send(embed);
            await sentMessage.react("🏁");

            const filter = (reac) => reac.emoji.name === "🏁";
            sentMessage.awaitReactions(filter, { max: 1 }).then((collected) => {
                console.log(`[debug] [petitbac] ${player.username} is ready.`);
                this._ready.push(player.id);
                this.verifyEveryPlayerReady();
            });
        }
    }
}

export default PetitBac;
