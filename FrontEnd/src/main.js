import { Work } from './works.js'
console.log('test')

// append a work to the .gallery div
const appendWork = (work) => {
  const figureElement = document.createElement('figure')
  const galleryElement = document.querySelector('.gallery')
  const imgElement = document.createElement('img')
  const figcaptionElement = document.createElement('figcaption')
  imgElement.src = work.imageUrl
  imgElement.crossOrigin = 'anonymous'
  imgElement.alt = work.title
  figcaptionElement.textContent = work.title
  figureElement.appendChild(imgElement)
  figureElement.appendChild(figcaptionElement)
  galleryElement.appendChild(figureElement)
}

// fetch works from API
const getWorks = async () => {
  await fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(jsonWorks => {
      for (const jsonWork of jsonWorks) {
        const work = new Work(jsonWork)
        console.log(work)
        appendWork(work)
      }
    })
}
getWorks()
