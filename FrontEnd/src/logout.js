export const logout = () => {
  // get navigation links and turn login button into logout
  const navLinks = document.querySelectorAll('nav a')
  const loginLink = navLinks[navLinks.length - 1]

  // change link text to 'logout'
  loginLink.firstElementChild.textContent = 'logout'

  // add event listener to delete token
  loginLink.addEventListener('click', () => {
    window.sessionStorage.removeItem('access_token')
  })
}
