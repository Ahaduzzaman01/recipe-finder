document.addEventListener("DOMContentLoaded", function () {
    const recipeDetailsWrapper = document.getElementById("recipe-details-wrapper");

    // Step 1: Get the recipe ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    if (recipeId) {
        // Step 2: Fetch data from the API
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
            .then(response => response.json())
            .then(data => {
                if (data.meals) {
                    const meal = data.meals[0];

                    // Check if a YouTube link is available and embed it
                    let youtubeEmbed = "";
                    if (meal.strYoutube) {
                        const youtubeID = meal.strYoutube.split("v=")[1];
                        youtubeEmbed = `
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeID}" 
                                    frameborder="0" allowfullscreen></iframe>
                        `;
                    }

                    // Step 3: Create HTML elements to display the recipe details
                    const recipeHTML = `
                        <div>
                            <h2>${meal.strMeal}</h2>
                            ${youtubeEmbed}

                            <div>
                                <h3>Ingredients:</h3>
                                <ul>
                                    ${getIngredients(meal)}
                                </ul>
                            </div>

                            <div>
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-image" />
                            </div>
                            
                            <p><strong>Category:</strong> ${meal.strCategory}</p>
                            <p><strong>Cuisine:</strong> ${meal.strArea}</p>
                            <p><strong>Instructions:</strong></p>
                            <p>${meal.strInstructions}</p>
                        </div>
                    `;

                    // Step 4: Append to the wrapper
                    recipeDetailsWrapper.innerHTML = recipeHTML;
                } else {
                    recipeDetailsWrapper.innerHTML = "<p>Recipe not found.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching recipe details:", error);
                recipeDetailsWrapper.innerHTML = "<p>Error loading recipe details.</p>";
            });
    } else {
        recipeDetailsWrapper.innerHTML = "<p>No recipe ID found in URL.</p>";
    }
});

// Helper function to get ingredients and measures
function getIngredients(meal) {
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && measure) {
            ingredients += `<li>${measure} ${ingredient}</li>`;
        }
    }
    return ingredients;
}
