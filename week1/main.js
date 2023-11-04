// The texts of the breeds are taken from their wikipedia sites

function main() {
    // Getting the container from the html
  const container = document.querySelector('.container')

  // Hard coding the breeds I want 
  const breedName = ['hound', 'retriever', 'waterdog', 'husky', 'poodle']

  // Looping the names and getting the images etc
  for (let i = 0; i < breedName.length; i++) {
    createWikiItem(breedName[i], container)
  }
}

// The function to create the html structure
async function createWikiItem(breedName, container) {
 
  const itemWiki = document.createElement('div')
  itemWiki.className = 'wiki-item'

  const header = document.createElement('h1')
  header.className = 'wiki-header'
  header.textContent = breedName.toUpperCase()

  const content = document.createElement('div')
  content.className = 'wiki-content'

  const text = document.createElement('p')
  text.className = 'wiki-text'

  let breedText = await fetchDataText(breedName)
  text.textContent = breedText.extract
  // console.log(breedText)

  const imgContainer = document.createElement('div')
  imgContainer.className = 'img-container'

  const image = document.createElement('img')
  image.className = 'wiki-img'
  const imageUrl = await fetchData(breedName)
  image.src = imageUrl.message

  // Appending the elements needed to the div
  imgContainer.appendChild(image)
  content.appendChild(imgContainer)
  content.appendChild(text)
  itemWiki.appendChild(header)
  itemWiki.appendChild(content)

  container.appendChild(itemWiki)
}

// Function to fetch the image of the wanted dog breed
async function fetchDataText(breedName) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${breedName}`
    const dataPromise = await fetch(url)
    return await dataPromise.json()
  }

// Function to fetch the image of the wanted dog breed
async function fetchData(breedName) {
const url = `https://dog.ceo/api/breed/${breedName}/images/random`
  const dataPromise = await fetch(url)
  return await dataPromise.json()
}

document.addEventListener("DOMContentLoaded", main)