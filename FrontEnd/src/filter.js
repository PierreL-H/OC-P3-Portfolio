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
}

// Add event listener for each filter button
export const addFilterEventListeners = (works) => {
  const resetButton = document.querySelector('.filter-button-all')
  const buttons = document.querySelectorAll('.filter-button-category')
  const gallery = document.querySelector('.gallery')

  resetButton.addEventListener('click', () => {
    gallery.innerHTML = ''
    for (const work of sharedData.works) {
      appendWork(work)
    }
  })

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const filteredList = sharedData.works.filter((work) => work.category.name === button.dataset.filter)
      gallery.innerHTML = ''
      for (const work of filteredList) {
        appendWork(work)
      }
    })
  }
}
