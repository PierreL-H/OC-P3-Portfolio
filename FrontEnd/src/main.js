import { getWorks } from './works.js'
import { getFilterCategories, appendFilterButtons, addFilterEventListeners } from './filter.js'
import { logout } from './logout.js'
import { createModalListeners } from './modal.js'
import sharedData from './shared-data.js'

console.log('test')

// check if user is authed, and adjust interface as needed
const checkAuth = () => {
  // check if token exists, exit function if it does not
  if (!window.sessionStorage.getItem('access_token')) {
    console.log('exited')
    return
  }

  // call logout function
  logout()

  // add edit button next to the heading
  const heading = document.querySelector('.heading-container h2')
  const divElement = document.createElement('div')
  const linkElement = document.createElement('a')
  linkElement.href = '#'
  divElement.appendChild(linkElement)
  linkElement.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>'
  const spanElement = document.createElement('span')
  spanElement.textContent = 'modifier'
  linkElement.appendChild(spanElement)
  divElement.classList = 'gallery-edit-container'
  heading.appendChild(divElement)

  // append modal divs to #portfolio
  const portfolioElement = document.querySelector('#portfolio')
  portfolioElement.innerHTML += `<div class="modal"><div class="modal-content">
  <div class="modal-controls-container">
  <span id="back">&leftarrow;</span>
  <span id="close">&times;</span>
  </div>
  <div class="modal-content-container"></div>
  </div></div>`

  // add event listeners to display modal
  createModalListeners()
}

const works = await getWorks()
sharedData.works = works
checkAuth()
// const categorySet = new Set()
// for (const work of works) {
//   const category = work.category
//   categorySet.add(category.name)
// }
const categories = await getFilterCategories()
appendFilterButtons(categories)
addFilterEventListeners(works)
