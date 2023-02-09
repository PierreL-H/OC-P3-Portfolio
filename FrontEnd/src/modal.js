import sharedData from './shared-data.js'
import { deleteWork } from './works.js'

// draw gallery window
export const drawGallery = () => {
  const container = document.querySelector('.modal-content-container')
  container.innerHTML = ''
  const heading = document.createElement('h2')
  heading.textContent = 'Galerie photo'
  container.appendChild(heading)

  // create container for works
  const worksContainer = document.createElement('div')
  worksContainer.classList = 'modal-works-container'

  // append works in container
  for (const work of sharedData.works) {
    console.log(work)
    const modalWork = document.createElement('div')
    modalWork.classList = 'modal-work'
    const img = document.createElement('img')
    img.src = work.imageUrl
    const edit = document.createElement('p')
    edit.textContent = 'éditer'
    const deleteButton = document.createElement('div')
    deleteButton.classList = 'delete-button'
    deleteButton.dataset.id = work.id
    console.log('id: ', work.id)
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can fa-2xs"></i>'
    modalWork.appendChild(img)
    modalWork.appendChild(edit)
    modalWork.appendChild(deleteButton)
    worksContainer.appendChild(modalWork)

    // add event listener on delete button and retrieve work id
    deleteButton.addEventListener('click', async e => {
      const dataString = e.target.closest('div').dataset.id
      const dataId = parseInt(dataString)
      if (confirm(`Voulez-vous vraiment supprimer le travail ${dataId}`)) {
        const response = await deleteWork(dataId)

        // if successful, remove work from dom
        if (response.status === 204) {
          e.target.closest('.modal-work').remove()
          const figure = document.querySelectorAll('[data-id~="' + dataId + '"]')
          figure[0].remove()
          sharedData.works = sharedData.works.filter(item => item.id !== dataId)
        }
      }
    })
  }
  container.appendChild(worksContainer)
  const separator = document.createElement('div')
  separator.classList = 'separator'
  container.appendChild(separator)
  const addButton = document.createElement('button')
  addButton.classList = 'modal-button'
  addButton.textContent = 'Ajouter une photo'
  separator.appendChild(addButton)
}

export const createModalListeners = () => {
  const modal = document.querySelector('.modal')
  const editButton = document.querySelector('.gallery-edit-container')
  const closeButton = document.getElementById('close')
  // listener on the edit button to open the modal
  editButton.addEventListener('click', e => {
    e.preventDefault()
    drawGallery()
    console.log('inside button')
    modal.style.display = 'block'
  })

  // listener on window to close the modal
  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none'
    }
  })

  // listener on the close button to close the modal
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none'
  })
}
