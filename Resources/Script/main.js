/*
  Couple-maker is a simple web app that makes couples out of a list of persons and,
  at every new call, makes a new list of couples avoiding previous pairments
  Copyright (C) 2020 Yuuki Gaudiuso

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// Grab infos from page
const nameField = document.getElementById('name-field')
const nameButton = document.getElementById('name-submit')
const personsContainer = document.getElementById('persons-container')
const turnButton = document.getElementById('turn-button')
const generateButton = document.getElementById('generate-button')
const personCount = document.getElementById('person-count')
const cardContainer = document.getElementById('card-container')
const personSection = document.getElementById('person-section')
const turnContainer = document.getElementById('turn-container')

// new classes
class Party {
  constructor () {
    this.persons = []
  }

  addPerson (name) {
    if (name) {
      const newPerson = new Person(nameField.value)
      this.persons.push(newPerson)
    }
  }

  renderPersons () {
    const names = this.persons.map(person => {
      return person.name
    })
    const namesStr = names.join(', ')
    personsContainer.innerHTML = namesStr
  }

  generateAvailablePairments () {
    // populate availablePairments of each person instance in party with all possible combination
    // this is achieved iterating two times on persons array
    // in first run a person istance is selected
    // in second run the person first selected is matched with every other person in the array, then the algorithm select next person to pair
    // couples are stored has array
    this.persons.forEach(person => {
      const others = this.persons.slice()
      const personIdx = this.persons.indexOf(person)
      others.splice(personIdx, 1)
      others.forEach(other => {
        person.availablePairments.push([person, other])
      })
    })
  }

  resetAvailability () {
    this.persons.forEach(person => { person.isAvailable = true })
  }

  makeTurn () {
    // the function makes an array of couple it starts selecting the first available person in party.persons
    const available = this.persons.slice()
    const turn = []
    while (available.length) {
      const firstPerson = available[0]
      const choices = firstPerson.availablePairments
      if (choices.length) {
        // if there are still any pairment not had before, choose a random pairment
        const coupleIdx = Math.floor(Math.random() * choices.length)
        const couple = choices[coupleIdx]
        if (couple[1].isAvailable) {
          // if the other person selected is not already in another couple
          // remove the couples from availablePairements
          choices.splice(coupleIdx, 1)
          couple[1].removeSymmetrical(couple[0])
          // mark the persons not available for other couples during this turn
          couple[0].markBusy()
          couple[1].markBusy()
          // collect couple and remove persons from available person
          available.shift()
          const otherIdx = available.indexOf(couple[1])
          available.splice(otherIdx, 1)
          turn.push(couple)
        }
      } else {
        // prompt user that there are no more possible pairments without repetitions
        window.alert('Non sono più possibili accoppiamenti senza ripetizioni. Se desideri continuare, clicca sul bottone "Rigenera Coppie"')
        return
      }
    }
    return turn
  }
}

class Person {
  constructor (name) {
    this.name = name
    this.availablePairments = []
    this.isAvailable = true
  }

  removeSymmetrical (person) {
    for (let i = 0; i < this.availablePairments.length; i++) {
      if (this.availablePairments[i][1].name === person.name) {
        this.availablePairments.splice(i, 1)
      }
    }
  }

  markBusy () {
    this.isAvailable = false
  }
}

// Global variables
const party = new Party()
let turnCount = 1
const colors = {
  blue: {
    background: '#9FCDF7',
    border: '#143858'
  },

  green: {
    background: '#95E189',
    border: '#1C5E12'
  },

  yellow: {
    background: '#FBF998',
    border: '#82801A'
  },

  orange: {
    background: '#FFC974',
    border: '#7E5B23'
  },

  red: {
    background: '#F07575',
    border: '#872323'
  }
}

// Functions
const clearField = field => {
  field.value = ''
}

function stringify (couple) {
  return `${couple[0].name} chiama ${couple[1].name}.`
}

function renderTurn (turnCount, turn) {
  const card = document.createElement('div')
  const title = document.createElement('h3')
  title.innerHTML = 'Turno ' + turnCount
  card.appendChild(title)
  turn.forEach(couple => {
    const p = document.createElement('p')
    p.innerHTML = stringify(couple)
    card.appendChild(p)
  })
  styleCard(card)
  cardContainer.appendChild(card)
}

function styleCard (card) {
  const colorsArr = Object.keys(colors)
  const idx = Math.floor(Math.random() * colorsArr.length)
  const color = colorsArr[idx]
  card.classList.add('card')
  card.style.backgroundColor = colors[color].background
  card.children[0].style.color = colors[color].border
  card.style.boxShadow = '2px 2px 5px' + colors[color].border
  card.style.borderColor = colors[color].border
}

// Event Handlers
nameButton.onclick = (e) => {
  e.preventDefault()
  party.addPerson(nameField.value)
  clearField(nameField)
  party.renderPersons()
  personCount.innerHTML = party.persons.length
}

generateButton.onclick = (e) => {
  e.preventDefault()
  party.generateAvailablePairments()
  // trigger transitions
  personSection.classList.add('hide')
  turnContainer.classList.add('show')
  e.target.innerHTML = 'Rigenera Coppie'
}

turnButton.onclick = (e) => {
  e.preventDefault()
  party.resetAvailability()
  const turn = party.makeTurn()
  renderTurn(turnCount, turn)
  turnCount++
}
