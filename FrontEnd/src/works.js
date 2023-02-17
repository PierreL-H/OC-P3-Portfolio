import sharedData from './shared-data.js'
// create Work class
export class Work {
  constructor (jsonData) {
    jsonData && Object.assign(this, jsonData)
  }
}

// append a work to the .gallery div
export const appendWork = (work) => {
  const figureElement = document.createElement('figure')
  figureElement.dataset.id = work.id
  const galleryElement = document.querySelector('.gallery')
  const imgElement = document.createElement('img')
  const figcaptionElement = document.createElement('figcaption')
  imgElement.src = work.imageUrl
  imgElement.alt = work.title
  figcaptionElement.textContent = work.title
  figureElement.appendChild(imgElement)
  figureElement.appendChild(figcaptionElement)
  galleryElement.appendChild(figureElement)
}

// fetch works from API
export const getWorks = async () => {
  const response = await fetch('http://localhost:5678/api/works')
  const worksJson = await response.json()
  for (const workJson of worksJson) {
    const work = new Work(workJson)
    appendWork(work)
  }
  return worksJson
}

// delete work from DB
export const deleteWork = async (workID) => {
  const response = await fetch(`http://localhost:5678/api/works/${workID}`, {
    method: 'delete',
    headers: {
      Authorization: 'Bearer ' + window.sessionStorage.getItem('access_token')
    }
  })
  console.log(response)
  // if successful, remove work from dom
  if (response.status === 204) {
    // find all delete buttons, iterate through them to find the id, if it matches delete closest modal-work
    const deleteButtons = document.querySelectorAll('.delete-button')
    for (const deleteButton of deleteButtons) {
      if (parseInt(deleteButton.dataset.id) === workID) {
        deleteButton.closest('.modal-work').remove()
        break
      }
    }
    const figure = document.querySelectorAll('[data-id~="' + workID + '"]')
    sharedData.works = sharedData.works.filter(item => item.id !== workID)
    figure[0]?.remove()
    const gallery = document.querySelector('.gallery')
    !gallery.firstChild && (gallery.innerHTML = '<p style="text-align: center; grid-column-start: 2">Rien à afficher</p>')
  }
}
