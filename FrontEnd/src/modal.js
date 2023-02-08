export const createModalListeners = () => {
  const modal = document.querySelector('.modal')
  const editButton = document.querySelector('.gallery-edit-container')
  const closeButton = document.getElementById('close')
  // listener on the edit button to open the modal
  editButton.addEventListener('click', e => {
    e.preventDefault()
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
