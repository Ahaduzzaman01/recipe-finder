// Fetch query parameters from URL
const params = new URLSearchParams(window.location.search);
const selectedFilter = params.get('selected-filter');
const searchKeyword = params.get('search-keyword');
const mealsSection = document.getElementById('searched-meals-section');
const filterSelectBox = document.getElementById('selected-filter');
filterSelectBox.value = selectedFilter;
const searchkeywordInput = document.getElementById('search-keyword');
searchkeywordInput.value = searchKeyword;
const noResults = document.getElementById('no-results');

async function fetchMeals() {
    let apiUrl = '';

    switch (selectedFilter) {
        case '1': // Search by Name
            apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchKeyword}`;
            break;
        case '2': // Search by Ingredients
            apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchKeyword}`;
            break;
        case '3': // Search by Cuisine
            apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchKeyword}`;
            break;
        default:
            return;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.meals) {
        // If we have meals, check the selected filter
        if (selectedFilter === "2" || selectedFilter === "3") {
            const mealPromises = data.meals.map(meal =>
                fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                .then(res => res.json())
                .then(mealData => mealData.meals[0]) // Get the first meal from response
            );
    
            const meals = await Promise.all(mealPromises);
            displayMeals(meals);
        } else {
            displayMeals(data.meals);
        }
    } else {
        // Show no results if meals are not found
        noResults.style.display = 'block';
    }
}

function displayMeals(meals) {
    meals.forEach(meal => {
        const mealCard = `
                    <div class="col-sm-12 col-md-4 col-lg-3">
                        <div class="container card custom-card h-100 shadow py-4">
                            <div class="watch-background">
                                <a href="recipe-details.html?id=${meal.idMeal}">
                                    <img class="img-fluid" src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                                </a>
                            </div>
                            <div class="card-body">
                                <h5 class="mb-0 card-title text-center text-truncate" style="font-size: 17px">
                                    <a class="text-decoration-none" style="color: inherit;" href="recipe-details.html?id=${meal.idMeal}">${meal.strMeal}</a>
                                </h5>
                            </div>
                            <div class="card-footer py-0 custom-card-footer d-flex justify-content-center align-items-center">
                                <a href="recipe-details.html?id=${meal.idMeal}" class="custom-primary-button">
                                    <i class="fa-regular fa-eye"></i>
                                    <span>View Recipe</span>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
        mealsSection.innerHTML += mealCard;
    });
}

fetchMeals();

window.addEventListener("load", function () {
	setTimeout(function(){
        document.getElementById("loader").style.display = "none";
    }, 1200);
});