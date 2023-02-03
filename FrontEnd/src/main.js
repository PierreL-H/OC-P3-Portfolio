import { getWorks } from './works.js'
import { getFilterCategories, appendFilterButtons, addFilterEventListeners } from './filter.js'
console.log('test')

const works = await getWorks()
// const categorySet = new Set()
// for (const work of works) {
//   const category = work.category
//   categorySet.add(category.name)
// }
const categories = getFilterCategories(works)
appendFilterButtons(categories)
addFilterEventListeners(works)
