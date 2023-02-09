import sharedData from './shared-data.js'
import { deleteWork } from './works.js'

// handle form's file input's change event
const handleInputChangeEvent = (event) => {
  console.log(event)
  const file = event.target.files[0]
  const reader = new FileReader()
  const img = document.querySelector('.form-image')
  const innerContainer = document.querySelector('.inner-container')
  reader.onload = e => {
    console.log('reader: ', e)
    img.src = e.target.result
    console.log('img: ', img)
    innerContainer.style.display = 'none'
  }
  reader.readAsDataURL(file)
}

// handle dropzone's drop event
const handleDropzoneDropEvent = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  const fileInput = document.getElementById('image-upload')
  if (file.type === 'image/jpeg' || file.type === 'image/png') {
    console.log('file: ', file)
    fileInput.files = event.dataTransfer.files
    fileInput.dispatchEvent(new Event('change'))
  }
}

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
    // console.log(work)
    const modalWork = document.createElement('div')
    modalWork.classList = 'modal-work'
    const img = document.createElement('img')
    img.src = work.imageUrl
    const edit = document.createElement('p')
    edit.textContent = 'éditer'
    const deleteButton = document.createElement('div')
    deleteButton.classList = 'delete-button'
    deleteButton.dataset.id = work.id
    // console.log('id: ', work.id)
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
  addButton.addEventListener('click', e => {
    e.preventDefault()
    drawAddWindow()
  })
}

// draw add photo window
const drawAddWindow = () => {
  const backButton = document.getElementById('back')
  backButton.style.display = 'inline'
  const container = document.querySelector('.modal-content-container')
  container.innerHTML = ''
  const heading = document.createElement('h2')
  heading.textContent = 'Galerie photo'
  container.appendChild(heading)

  const form = document.createElement('form')
  form.name = 'photo'
  form.classList = 'photo-form'
  const dropzone = document.createElement('div')
  dropzone.classList = 'dropzone'
  const innerContainer = document.createElement('div')
  innerContainer.classList = 'inner-container'
  const img = document.createElement('img')
  img.classList = 'form-image'
  innerContainer.innerHTML =
  `<i class="fa-regular fa-image"></i>
  <label for="image-upload" class="custom-file-upload">
  + Ajouter photo
  </label>
  <input type="file" id="image-upload" name="image" accept="image/png,image/jpeg"></input>
  <p>jpg, png: 4mo max</p>`
  dropzone.appendChild(innerContainer)
  dropzone.appendChild(img)
  form.appendChild(dropzone)

  const titleLabel = document.createElement('label')
  titleLabel.for = 'title'
  titleLabel.textContent = 'Titre'
  const titleInput = document.createElement('input')
  titleInput.name = 'title'
  const categoryLabel = document.createElement('label')
  categoryLabel.for = 'category'
  categoryLabel.textContent = 'Catégories'
  const categoryInput = document.createElement('input')
  categoryInput.name = 'category'
  const separator = document.createElement('div')
  separator.classList = 'separator'
  const submitButton = document.createElement('button')
  submitButton.classList = 'modal-button'
  submitButton.id = 'submit-button'
  submitButton.textContent = 'Valider'

  form.appendChild(titleLabel)
  form.appendChild(titleInput)
  form.appendChild(categoryLabel)
  form.appendChild(categoryInput)
  separator.appendChild(submitButton)
  form.appendChild(separator)
  container.appendChild(form)

  // add event listener to input to read file on change
  const fileInput = document.querySelector('#image-upload')
  fileInput.addEventListener('change', handleInputChangeEvent)

  // add event listener to drop zone to update input with image
  dropzone.addEventListener('dragover', e => {
    e.preventDefault()
  })

  dropzone.addEventListener('drop', handleDropzoneDropEvent)
  // {
  //   e.preventDefault()
  //   const file = e.dataTransfer.files[0]
  //   if (file.type === 'image/jpeg' || file.type === 'image/png') {
  //     console.log('file: ', file)
  //     fileInput.files = e.dataTransfer.files
  //     fileInput.dispatchEvent(new Event('change'))
  //   }
  // })

  // add form button event listener to get form data
  submitButton.addEventListener('click', async e => {
    e.preventDefault()
    const formData = new FormData(form)
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1])
    }
    console.log('image: ', formData.get('image'))
    console.log('title: ', formData.get('title'))
    const fileString = formData.get('image').name + ';' + formData.get('image').type
    console.log(fileString)
    // formData.set('image', fileString)
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'post',
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`
      },
      body: formData
    })
    console.log(response)
    const parsedResponse = await response.json()
    console.log(parsedResponse)
  })
}

// add event listeners to display the modal
export const createModalListeners = () => {
  const modal = document.querySelector('.modal')
  const editButton = document.querySelector('.gallery-edit-container')
  const closeButton = document.getElementById('close')
  const backButton = document.getElementById('back')
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

  backButton.addEventListener('click', () => {
    drawGallery()
    backButton.style.display = 'none'
  })
}
