// Send login request to the api
const sendLoginRequest = async (emailString, passwordString) => {
  const response = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: emailString,
      password: passwordString
    })
  })
  const data = await response.json()
  console.log(data)
  // If token exists, save it to local storage and redirect to index.html
  if (data.token) {
    window.localStorage.setItem('access_token', data.token)
    window.location.replace('./index.html')
  } else {
    const errorMessage = document.querySelector('.error')
    console.log(errorMessage)
    errorMessage.textContent = 'Something went wrong'
    errorMessage.style.visibility = 'visible'
  }
}

// Make event listener to get login credentials from form
/** @type {HTMLFormElement} */
const form = document.querySelector('#login form')
form.addEventListener('submit', (event) => {
  event.preventDefault()
  const errorMessage = document.querySelector('.error')
  errorMessage.textContent = ''
  errorMessage.style.visibility = 'hidden'
  const email = form.elements.email.value
  const password = form.elements.password.value
  sendLoginRequest(email, password)
})
