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

// flash error message
const flashMessage = (messageElement, message) => {
  messageElement.textContent = message
  messageElement.style.display = 'block'
  setTimeout(() => {
    messageElement.style.display = 'none'
    messageElement.textContent = ''
  }, 5000)
}

// handle submit button click event
const handleFormSubmitEvent = async (event) => {
  const messageElement = event.target.lastChild
  let json
  event.preventDefault()
  let response
  const formData = new FormData(event.target)

  // get category Id from name
  const categoryName = formData.get('category')
  const category = sharedData.categories.find(obj => obj.name === categoryName)
  formData.set('category', category.id)
  formData.forEach((value, key) => {
    console.log('formdata content: ', key, value)
  })

  try {
    response = await fetch('http://localhost:5678/api/works', {
      method: 'post',
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`
      },
      body: formData
    })
    console.log(response)
  } catch (error) {
    console.log('error', error)
  }

  // if (response?.ok) {
  //   // do stuff with the response here
  //   console.log(response)
  //   const json = await response.json()
  //   console.log(json)
  // } else {
  //   console.log('HTTP response code: ', response.status)
  // }
  switch (response?.status) {
    case 201:
      // do stuff with response here
      console.log(response)
      json = await response.json()
      console.log(json)
      break
    case 400:
      flashMessage(messageElement, 'Requête invalide')
      break
    case 401:
      flashMessage(messageElement, 'Non authorisé')
      break
    case 500:
      flashMessage(messageElement, 'Erreur innatendue')
      break
    default:
      flashMessage(messageElement, 'Erreur inconnue')
      break
  }
}

// create category drop down list
const createCategorySelect = () => {
  const select = document.createElement('select')
  select.name = 'category'
  for (const category of sharedData.categoryNames) {
    const option = document.createElement('option')
    option.value = category
    option.textContent = category
    select.appendChild(option)
  }
  return select
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
          sharedData.works = sharedData.works.filter(item => item.id !== dataId)
          figure[0]?.remove()
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
  form.action = '#'
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
  <input type="file" id="image-upload" name="image" accept="image/png,image/jpeg" required></input>
  </label>
  <p>jpg, png: 4mo max</p>`
  dropzone.appendChild(innerContainer)
  dropzone.appendChild(img)
  form.appendChild(dropzone)

  const titleLabel = document.createElement('label')
  titleLabel.for = 'title'
  titleLabel.textContent = 'Titre'
  const titleInput = document.createElement('input')
  titleInput.name = 'title'
  titleInput.required = true
  const categoryLabel = document.createElement('label')
  categoryLabel.for = 'category'
  categoryLabel.textContent = 'Catégories'
  // const categoryInput = document.createElement('input')
  // categoryInput.name = 'category'
  // categoryInput.required = true
  const categoryInput = createCategorySelect()
  const separator = document.createElement('div')
  separator.classList = 'separator'
  const submitButton = document.createElement('button')
  submitButton.type = 'submit'
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
  const responseMessage = document.createElement('p')
  responseMessage.style.display = 'none'
  responseMessage.style.color = 'red'
  form.appendChild(responseMessage)

  // add event listener to input to read file on change
  const fileInput = document.querySelector('#image-upload')
  fileInput.addEventListener('change', handleInputChangeEvent)

  // add event listener to drop zone to update input with image
  dropzone.addEventListener('dragover', e => {
    e.preventDefault()
  })

  dropzone.addEventListener('drop', handleDropzoneDropEvent)

  // add form button event listener to get form data
  form.addEventListener('submit', handleFormSubmitEvent)
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
