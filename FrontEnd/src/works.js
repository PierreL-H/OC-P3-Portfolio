// create Work class
export class Work {
  constructor (jsonData) {
    jsonData && Object.assign(this, jsonData)
  }
}

// append a work to the .gallery div
export const appendWork = (work) => {
  const figureElement = document.createElement('figure')
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
