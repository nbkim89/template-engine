const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const answers = [];

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


function promptRole() {
    return inquirer.prompt([{
        type: "list",
        name: "employeeRole",
        message: "What is the role of the employee?",
        choices: ["Manager", "Engineer", "Intern"]
    }]);
};

function promptManager(role) {
    const prompts = {
        'Manager': [{
            type: "input",
            name: "name",
            message: "What is the manager's name?"
        },
        {
            type: "number",
            name: "id",
            message: "What is the manager's employee ID number?"
        },
        {
            type: "input",
            name: "office",
            message: "What is the manager's office number?"
        }
        ],
        'Engineer': [{
            type: "input",
            name: "name",
            message: "What is the name of the employee?"
        },
        {
            type: "number",
            name: "id",
            message: "What is the employee's ID number?"
        },
        {
            type: "input",
            name: "github",
            message: "What is their GitHub username?"
        },
        ],
        'Intern': [{
            type: "input",
            name: "name",
            message: "What is the name of the employee?"
        },
        {
            type: "number",
            name: "id",
            message: "What is the employee's ID number?"
        },
        {
            type: "input",
            name: "school",
            message: "What is the name of the school they attend?"
        },
        ]
    };
    return inquirer.prompt(prompts[role.employeeRole]);
};

function init() {
    promptRole().then(promptManager).then(handleAnswer).then(promptContinue);
};

function handleAnswer(answer) {
    answers.push(answer);
};

function promptContinue() {
    inquirer.prompt([{
        type: "list",
        name: "continue",
        message: "Would you like to add another team member?",
        choices: ["Yes", "No"]
    }]).then(addMore => {
        if (addMore.continue === "Yes") {
            init()
        } else {
            createTemplate()
        };
    });
};

function createTemplate() {
    const main = fs.readFileSync('./templates/main.html', {
        encoding: 'utf8'
    });

    let newArray = answers.map(answer => {
        switch (answer.role) {
            case "Engineer": {
                const engineer = fs.readFileSync('./templates/engineer.html', {
                    encoding: 'utf8'
                });

                let tempEng = engineer.replace('{{ name }}', answer.name)
                tempEng = tempEng.replace('{{ id }}', answer.id)
                tempEng = tempEng.replace('{{ email }}', answer.email)
                tempEng = tempEng.replace('{{ github }}', answer.github)
                return tempEng
                break;
            }
            case "Manager":
                const manager = fs.readFileSync('./templates/manager.html', {
                    encoding: 'utf8'
                });

                let tempMgr = manager.replace('{{ name }}', answer.name);
                tempMgr = tempMgr.replace('{{ id }}', answer.id);
                tempMgr = tempMgr.replace('{{ email }}', answer.email);
                tempMgr = tempMgr.replace('{{ officeNumber }}', answer.office);
                return tempMgr;
                break;

            case "Intern": {
                const intern = fs.readFileSync('./templates/intern.html', {
                    encoding: 'utf8'
                });

                let tempIntern = intern.replace('{{ name }}', answer.name)
                tempIntern = tempIntern.replace('{{ id }}', answer.id)
                tempIntern = tempIntern.replace('{{ email }}', answer.email)
                tempIntern = tempIntern.replace('{{ school }}', answer.school)
                return tempIntern
                break;
            }
            default:
                throw new Error('bad role');
        };
    });

    let tempFile = main.replace('<div> {{ cards }} </div>', Object.values(newArray))
    const teamIndex = answers.findIndex(element => element = 'manager')
    const teamName = answers[teamIndex].team
    console.log("the team name is: " + teamName);
    tempFile = tempFile.replace('{{ team }}', teamName);

    writeFileAsync("./output/index.html", tempFile);

}


init();