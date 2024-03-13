function performSearch(action, value, resourceType) {
  hideResultContainer(); 
  showSpinner();
  setTimeout(function() {
    if (action === 'search') {
      if (resourceType === 'People') {
        searchCharacters(value);
      } else if (resourceType === 'Planet') {
        searchPlanets(value);
      } else if (resourceType === 'Species') {
        searchSpecies(value);
      }
    } else if (action === 'getById') {
      if (resourceType === 'People') {
        getCharacterById(value);
      } else if (resourceType === 'Planet') {
        getPlanetsById(value);
      } else if (resourceType === 'Species') {
        getSpeciesById(value);
      }
    }

    hideSpinner();
    showResultContainer();
  }, 1000);
}

document.getElementById('searchButtonId').addEventListener('click', function() {
  var id = document.getElementById('searchInputId').value;
  var selectedResource = document.getElementById('searchSelectId').value;
  performSearch('getById', id, selectedResource);
});

document.getElementById('searchButton').addEventListener('click', function() {
  var query = document.getElementById('searchInput').value;
  var selectedResource = document.getElementById('searchSelect').value;
  performSearch('search', query, selectedResource);
});

function showSpinner() {
  var spinnerContainer = document.getElementById('spinner');
  spinnerContainer.style.visibility = 'visible';
}

function hideSpinner() {
  var spinnerContainer = document.getElementById('spinner');
  spinnerContainer.style.visibility = 'hidden';
}

function showResultContainer() {
  var resultContainer = document.getElementById('result-container');
  resultContainer.style.visibility = 'visible';
}

function hideResultContainer() {
  var resultContainer = document.getElementById('result-container');
  resultContainer.style.visibility = 'hidden';
}

function searchCharacters(query) {
  var resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = '';

  starWars.searchCharacters(query)
    .then(function(characters) {
      var characterPromises = characters.results.map(function(character) {
        return starWars.getPlanetsById(getIdFromUrl(character.homeworld))
          .then(function(planet) {
            character.homeworld = planet.name;
          })
          .catch(function(error) {
            console.log('getPlanetsById error: ', error);
          });
      });

      return Promise.all(characterPromises)
        .then(function() {
          return characters;
        });
    })
    .then(function(characters) {
      characters.results.forEach(function(character) {
        createAndDisplayDetails(character, resultContainer, 'character');
      });

      console.log(characters);
    })
    .catch(function(error) {
      console.log('searchCharacters error: ', error);
    });
}

function createAndDisplayDetails(item, resourceType) {
  var resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = '';

  var article = document.createElement('article');
  article.classList.add('message', 'is-dark');

  var messageHeader = document.createElement('div');
  messageHeader.classList.add('message-header');

  var title = document.createElement('p');
  title.textContent = item.name;

  var deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  deleteButton.setAttribute('aria-label', 'delete');

  messageHeader.appendChild(title);
  messageHeader.appendChild(deleteButton);

  var messageBody = document.createElement('div');
  messageBody.classList.add('message-body');

  var itemInfo = '';
  for (var key in item) {
    if (item.hasOwnProperty(key) && key !== 'name') {
      if (key === 'homeworld' && resourceType === 'character') {
        itemInfo += `<p><strong>${key}:</strong> ${item.homeworld}</p>`;
      } else {
        itemInfo += `<p><strong>${key}:</strong> ${item[key]}</p>`;
      }
    }
  }
  messageBody.innerHTML = itemInfo;
  article.appendChild(messageHeader);
  article.appendChild(messageBody);

  resultContainer.appendChild(article);
}

function searchPlanets(query) {
  searchResource(query, 'planet');
}

function searchSpecies(query) {
  searchResource(query, 'species');
}

function searchResource(query, resourceType) {
  var resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = '';

  var searchFunction = resourceType === 'planet' ? starWars.searchPlanets : starWars.searchSpecies;

  searchFunction(query)
    .then(function(data) {
      data.results.forEach(function(item) {
        createAndDisplayDetails(item, resultContainer, resourceType);
      });

      console.log(data);
    })
    .catch(function(error) {
      console.log(resourceType + ' error: ', error);
    });
}

function getIdFromUrl(url) {
  var parts = url.split('/');
  return parts[parts.length - 2];
}

async function getCharacterById(id) {
  try {
    const character = await starWars.getCharactersById(id);
    displayDetails(character, 'character');
  } catch (error) {
    console.error('Error fetching character by ID:', error);
  }
}

async function getSpeciesById(id) {
  try {
    const species = await starWars.getSpeciesById(id);
    displayDetails(species, 'species');
  } catch (error) {
    console.error('Error fetching species by ID:', error);
  }
}

async function getPlanetsById(id) {
  try {
    const planet = await starWars.getPlanetsById(id);
    displayDetails(planet, 'planet');
  } catch (error) {
    console.error('Error fetching planet by ID:', error);
  }
}

function displayDetails(data, type) {
  var resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = '';

  var article = document.createElement('article');
  article.classList.add('message', 'is-dark');

  var messageHeader = document.createElement('div');
  messageHeader.classList.add('message-header');

  var title = document.createElement('p');
  title.textContent = data.name;

  var deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  deleteButton.setAttribute('aria-label', 'delete');

  messageHeader.appendChild(title);
  messageHeader.appendChild(deleteButton);

  var messageBody = document.createElement('div');
  messageBody.classList.add('message-body');

  var info = '';
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      info += `<p><strong>${key}:</strong> ${data[key]}</p>`;
    }
  }
  messageBody.innerHTML = info;
  article.appendChild(messageHeader);
  article.appendChild(messageBody);

  resultContainer.appendChild(article);
}
