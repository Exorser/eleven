document.getElementById('searchButton').addEventListener('click', function() {
  var query = document.getElementById('searchInput').value;
  var selectedResource = document.getElementById('searchSelect').value;

  hideResultContainer(); 
  showSpinner();
  setTimeout(function() {
    if (selectedResource === 'People') {
      searchCharacters(query);
    } else if (selectedResource === 'Planet') {
      searchPlanets(query);
    } else if (selectedResource === 'Species') {
      searchSpecies(query);
    }

    hideSpinner();
    showResultContainer();
  }, 1000);
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
      var planetPromises = characters.results.map(function(character) {
        return starWars.getPlanetsById(getIdFromUrl(character.homeworld))
          .then(function(planet) {
            character.homeworld = planet.name;
          })
          .catch(function(error) {
            console.log('getPlanetsById error: ', error);
          });
      });

      return Promise.all(planetPromises)
        .then(function() {
          return characters;
        });
    })
    .then(function(characters) {
      characters.results.forEach(function(character) {
        var article = document.createElement('article');
        article.classList.add('message', 'is-dark');

        var messageHeader = document.createElement('div');
        messageHeader.classList.add('message-header');

        var title = document.createElement('p');
        title.textContent = character.name;

        var deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.setAttribute('aria-label', 'delete');

        messageHeader.appendChild(title);
        messageHeader.appendChild(deleteButton);

        var messageBody = document.createElement('div');
        messageBody.classList.add('message-body');

        var characterInfo = '';
        for (var key in character) {
          if (character.hasOwnProperty(key)) {
            if (key === 'homeworld') {
              characterInfo += `<p><strong>${key}:</strong> ${character.homeworld}</p>`;
            } else {
              characterInfo += `<p><strong>${key}:</strong> ${character[key]}</p>`;
            }
          }
        }
        messageBody.innerHTML = characterInfo;  
        article.appendChild(messageHeader);
        article.appendChild(messageBody);

        resultContainer.appendChild(article);
      });

      console.log(characters);
    })
    .catch(function(error) {
      console.log('searchCharacters error: ', error);
    });
}

function searchPlanets(query) {
  var resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = '';

  starWars.searchPlanets(query)
  .then(function(planets) {
    planets.results.forEach(function(planet) {
      var article = document.createElement('article');
      article.classList.add('message', 'is-dark');

      var messageHeader = document.createElement('div');
      messageHeader.classList.add('message-header');

      var title = document.createElement('p');
      title.textContent = planet.name;

      var deleteButton = document.createElement('button');
      deleteButton.classList.add('delete');
      deleteButton.setAttribute('aria-label', 'delete');

      messageHeader.appendChild(title);
      messageHeader.appendChild(deleteButton);

      var messageBody = document.createElement('div');
      messageBody.classList.add('message-body');

      var planetInfo = '';
      for (var key in planet) {
        if (planet.hasOwnProperty(key)) {
          planetInfo += `<p><strong>${key}:</strong> ${planet[key]}</p>`;
        }
      }
      messageBody.innerHTML = planetInfo;
      article.appendChild(messageHeader);
      article.appendChild(messageBody);

      resultContainer.appendChild(article);
    });

    console.log(planets);
  })
  .catch(function(error) {
    console.log('searchPlanets error: ', error);
  });
}

function searchSpecies(query) {
  var resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = '';

  starWars.searchSpecies(query)
  .then(function(species) {
    species.results.forEach(function(species) {
      var article = document.createElement('article');
      article.classList.add('message', 'is-dark');

      var messageHeader = document.createElement('div');
      messageHeader.classList.add('message-header');

      var title = document.createElement('p');
      title.textContent = species.name;

      var deleteButton = document.createElement('button');
      deleteButton.classList.add('delete');
      deleteButton.setAttribute('aria-label', 'delete');

      messageHeader.appendChild(title);
      messageHeader.appendChild(deleteButton);

      var messageBody = document.createElement('div');
      messageBody.classList.add('message-body');

      var speciesInfo = '';
      for (var key in species) {
        if (species.hasOwnProperty(key)) {
          speciesInfo += `<p><strong>${key}:</strong> ${species[key]}</p>`;
        }
      }
      messageBody.innerHTML = speciesInfo;
      article.appendChild(messageHeader);
      article.appendChild(messageBody);

      resultContainer.appendChild(article);
    });

    console.log(species);
  })
  .catch(function(error) {
    console.log('searchSpecies error: ', error);
  });
}

function getIdFromUrl(url) {
  var parts = url.split('/');
  return parts[parts.length - 2];
}
