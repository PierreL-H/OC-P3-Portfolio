import sharedData from './shared-data.js'
import { appendWork } from './works.js'

// Get category names from works and put them in a Set
export const getFilterCategories = async () => {
  const categories = new Set()
  // for (const work of works) {
  //   const category = work.category
  //   categories.add(category.name)
  // }
  const response = await fetch('http://localhost:5678/api/categories')
  const json = await response.json()
  console.log('categories: ', json)
  for (const category of json) {
    categories.add(category.name)
  }
  sharedData.categoryNames = categories
  sharedData.categories = json
  console.log('set: ', categories)
  console.log('category array: ', sharedData.categories)
  return categories
}

// Append filter buttons
export const appendFilterButtons = (categories) => {
  const filtersDiv = document.querySelector('.filters')
  for (const category of categories) {
    const button = document.createElement('button')
    button.dataset.filter = category
    button.className = 'filter-button-category'
    button.textContent = category
    filtersDiv.appendChild(button)
  }
  // add active class to reset button
  document.querySelectorAll('.filters > button')[0].classList.add('active')
}

// Add event listener for each filter button
export const addFilterEventListeners = (works) => {
  const resetButton = document.querySelector('.filter-button-all')
  const buttons = document.querySelectorAll('.filter-button-category')
  const gallery = document.querySelector('.gallery')

  resetButton.addEventListener('click', e => {
    // if already active, do nothing
    if (e.target.classList.contains('active')) {
      return
    }

    // remove active class from other buttons and add it to reset button
    for (const button of buttons) {
      button.classList.remove('active')
    }
    e.target.classList.add('active')

    // display all ways
    gallery.innerHTML = ''
    for (const work of sharedData.works) {
      appendWork(work)
    }
  })

  for (const button of buttons) {
    button.addEventListener('click', e => {
      // check if clicked button is already active, return if true
      if (e.target.classList.contains('active')) {
        return
      }

      // remove active class from all buttons and set clicked button to active
      resetButton.classList.remove('active')
      for (const button of buttons) {
        button.classList.remove('active')
      }
      e.target.classList.add('active')

      // filter the list of works, store it in filteredList and display it
      const filteredList = sharedData.works.filter((work) => work.category.name === button.dataset.filter)
      gallery.innerHTML = ''
      for (const work of filteredList) {
        appendWork(work)
      }
    })
  }
}
