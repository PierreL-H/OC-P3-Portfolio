// Turn login link into logout if token is present
// export const logout = () => {
//   const linkElement = document.querySelector('nav a')
//   console.log(linkElement)
// }
import { logout } from './logout.js'

// Send login request to the api
const sendLoginRequest = async (formData) => {
  const errorMessage = document.querySelector('.error')
  const response = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(formData))
  })

  const data = await response?.json()

  // If token exists, save it to local storage and redirect to index.html
  switch (response.status) {
    case 200:
      window.sessionStorage.setItem('access_token', data.token)
      window.location.replace('./index.html')
      break
    case 404:
      errorMessage.textContent = "L'utilisateur n'existe pas"
      errorMessage.style.visibility = 'visible'
      break
    default:
      errorMessage.textContent = "Une erreur s'est produite"
      errorMessage.style.visibility = 'visible'
      break
  }
}

// check if user is authed, call logout if they are
if (window.sessionStorage.getItem('access_token')) {
  logout()
}

// Make event listener to get login credentials from form
/** @type {HTMLFormElement} */
const form = document.querySelector('#login form')
form.addEventListener('submit', (event) => {
  event.preventDefault()
  const errorMessage = document.querySelector('.error')
  errorMessage.textContent = ''
  errorMessage.style.visibility = 'hidden'
  const formData = new FormData(form)
  sendLoginRequest(formData)
})
