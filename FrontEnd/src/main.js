import { getWorks } from './works.js'
import { getFilterCategories, appendFilterButtons, addFilterEventListeners } from './filter.js'
import { logout } from './logout.js'

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
}

checkAuth()
const works = await getWorks()
// const categorySet = new Set()
// for (const work of works) {
//   const category = work.category
//   categorySet.add(category.name)
// }
const categories = getFilterCategories(works)
appendFilterButtons(categories)
addFilterEventListeners(works)
console.log('token storage: ' ,window.sessionStorage.getItem('access_token'))
