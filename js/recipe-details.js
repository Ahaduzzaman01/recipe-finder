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
                            <iframe id="empbed-yt" src="https://www.youtube.com/embed/${youtubeID}" 
                                    frameborder="0" allowfullscreen></iframe>
                        `;
                    }

                    // Step 3: Create HTML elements to display the recipe details
                    const recipeHTML = `
                            <div class="container card custom-card h-100 shadow py-4">
                                <h2 class="mb-4 yellow-text">${meal.strMeal}</h2>
                                ${youtubeEmbed}

                                <div>
                                    <h3 class="my-4 navy-text">Ingredients:</h3>
                                    <ul class="mb-0">
                                        ${getIngredients(meal)}
                                    </ul>
                                </div>

                                <div class="my-4">
                                    <img style="width: 100%; height: auto; border-radius: 20px;" src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-image" />
                                </div>
                                
                                <p class="mb-0"><strong class="green-text">Category:</strong> <a class="text-decoration-none navy-text" href="view-all.html?category=${meal.strCategory}">${meal.strCategory}</a></p>
                                <p class="mb-0"><strong class="green-text">Cuisine:</strong> <a class="text-decoration-none navy-text" href="view-all.html?category=${meal.strCategory}">${meal.strArea}</a></p>
                                <h2 class="my-4 navy-text">Instructions:</h2>
                                <p>${meal.strInstructions}</p>
                            </div>
                        </div>
                    `;

                    // Step 4: Append to the wrapper
                    recipeDetailsWrapper.innerHTML = recipeHTML;
                } else {
                    recipeDetailsWrapper.innerHTML = '<div class="m-t mb-0 alert alert-warning">Recipe not found!</div>';
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
