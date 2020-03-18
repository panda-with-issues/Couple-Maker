/* 
  Couple-maker is a simple web app that makes couple out of a list of persons and,
  at every new call, make a new list of couples avoiding previous pairments
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

// new classes
class Party {
  constructor () {
    this.persons = []
  }

  addPerson (nameField) {
    const newPerson = new Person(nameField.value)
    this.persons.push(newPerson)
  }

  renderPersons () {
    const names = this.persons.map(person => {
      return person.name
    })
    const namesStr = names.join(', ')
    personsContainer.innerHTML = namesStr
  }
}

class Person {
  constructor (name) {
    this.name = name
  }
}

// Global variables
const party = new Party

// Functions
const clearField = field => {
  field.value = ''
}

// Event Handlers
nameButton.onclick = (e) => {
  e.preventDefault()
  party.addPerson(nameField)
  clearField(nameField)
  party.renderPersons()
}

