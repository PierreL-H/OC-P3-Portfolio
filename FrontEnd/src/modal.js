import sharedData from './shared-data.js'
import { appendWork, deleteWork } from './works.js'

// handle form's file input's change event
const handleImageInputChangeEvent = (event) => {
  const file = event.target.files[0]
  const titleInput = document.querySelector('input[name="title"]')
  const submitButton = document.querySelector('#submit-button')
  // check if image format is valid
  if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
    event.target.value = ''
    event.target.setCustomValidity("L'image doit être au format jpeg ou png")
    event.target.reportValidity()
    return
  }

  // read image and display it
  const reader = new FileReader()
  const img = document.querySelector('.form-image')
  const innerContainer = document.querySelector('.inner-container')
  reader.onload = e => {
    img.src = e.target.result
    innerContainer.style.display = 'none'
  }
  reader.readAsDataURL(file)

  // check if title input is not empty
  titleInput.value && submitButton.classList.remove('invalid')
}

// handle dropzone's drop event
const handleDropzoneDropEvent = (event) => {
  event.preventDefault()
  const fileInput = document.getElementById('image-upload')
  fileInput.files = event.dataTransfer.files
  fileInput.dispatchEvent(new Event('change'))
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

// handle form's submit event
const handleFormSubmitEvent = async (event) => {
  event.preventDefault()
  const messageElement = event.target.lastChild
  let response
  // get form data from the form
  const formData = new FormData(event.target)

  try {
    response = await fetch('http://localhost:5678/api/works', {
      method: 'post',
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem('access_token')}`
      },
      body: formData
    })
  } catch (error) {
  }

  if (response?.ok) {
    // do stuff with the response here
    const json = await response.json()
    // get category that matches the selected category from list of categories
    const category = sharedData.categories.find(obj => obj.id === parseInt(formData.get('category')))
    // get category's name
    const categoryName = category.name
    // create category object and append it to the response json
    const categoryObj = {
      id: parseInt(json.categoryId),
      name: categoryName
    }
    json.category = categoryObj
    json.categoryId = parseInt(json.categoryId)
    sharedData.works.push(json)

    // check which filter is active
    if (document.querySelector('.filter-button-all').classList.contains('active')) {
      // if 'all' is selected, append the new work
      appendWork(json)
    } else {
      // else, check which filter is selected and add work if it matches
      const buttons = document.querySelectorAll('.filter-button-category')
      let filterCategory = ''
      // iterate through button list
      for (const button of buttons) {
        // if button is active, get the category and break out of the loop
        if (button.classList.contains('active')) {
          filterCategory = button.dataset.filter
          break
        }
      }
      if (categoryName === filterCategory) {
        appendWork(json)
      }
    }

    // return to the previous screen
    drawGallery()
    return
  }

  // reset form if upload was not successful
  event.target.reset()
  switch (response?.status) {
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

// handle inputs' change events and check if input is valid
const handleInputInputEvent = e => {
  const imageInput = document.querySelector('#image-upload')
  if (!imageInput.value) return

  const submitButtonClasses = document.querySelector('#submit-button').classList
  e.target.value ? submitButtonClasses.remove('invalid') : submitButtonClasses.add('invalid')
}

// create category drop down list
const createCategorySelect = () => {
  const select = document.createElement('select')
  select.name = 'category'
  for (const category of sharedData.categories) {
    const option = document.createElement('option')
    option.value = category.id
    option.textContent = category.name
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
  // hide back button
  document.querySelector('#back').style.display = 'none'

  // create container for works
  const worksContainer = document.createElement('div')
  worksContainer.classList = 'modal-works-container'

  // append works in container
  for (const work of sharedData.works) {
    const modalWork = document.createElement('div')
    modalWork.classList = 'modal-work'
    const img = document.createElement('img')
    img.src = work.imageUrl
    const edit = document.createElement('p')
    edit.textContent = 'éditer'
    const deleteButton = document.createElement('div')
    deleteButton.classList = 'delete-button'
    deleteButton.dataset.id = work.id
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
  heading.textContent = 'Ajout photo'
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
  <input type="file" id="image-upload" name="image" accept="image/png,image/jpeg"></input>
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
  submitButton.classList = 'modal-button invalid'
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
  fileInput.addEventListener('change', handleImageInputChangeEvent)

  // add event listener to drop zone to update input with image
  dropzone.addEventListener('dragover', e => {
    e.preventDefault()
  })
  dropzone.addEventListener('drop', handleDropzoneDropEvent)

  // add form button event listener to get form data
  form.addEventListener('submit', handleFormSubmitEvent)

  // form event listener to change button's style on change
  titleInput.addEventListener('input', handleInputInputEvent)
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
  })
}
