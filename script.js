// Define the base API URLs for fetching data
const apiUrls = {
    Seafood: "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood",
    Chicken: "https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken",
    Dessert: "https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert"
};
const mealDetailsUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
let mealDetails = []; // Store meal details to avoid refetching

async function fetchMeals(category, limit = null) {
    try {
        const response = await fetch(apiUrls[category]);
        const data = await response.json();
        const meals = limit ? data.meals.slice(0, limit) : data.meals;

        // Fetch all meal details only once
        mealDetails = await Promise.all(
            meals.map(meal => fetch(mealDetailsUrl + meal.idMeal).then(res => res.json()))
        );

        displayMeals(mealDetails, limit ? `${category.toLowerCase()}-section` : "all-meals-section");

    } catch (error) {
        console.error("Error fetching meal data:", error);
    }
}

function displayMeals(mealDetails, sectionId) {
    const container = document.getElementById(sectionId);
    container.innerHTML = mealDetails
        .map(mealData => {
            const meal = mealData.meals[0];
            return `
                <div class="col-sm-12 col-md-4 col-lg-3">
                    <div class="container card custom-card h-100 shadow py-4">
                        <div class="watch-background">
                            <a href="#">
                                <img class="img-fluid" src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                            </a>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-center  text-truncate" style="font-size: 17px">${meal.strMeal}</h5>
                        </div>
                        <div class="card-footer custom-card-footer d-flex justify-content-center align-items-center">
                            <a href="#" class="custom-primary-button">
                                <i class="fa-regular fa-eye"></i>
                                <span>View Recipe</span>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        })
        .join("");
}

// Usage on the main page (displays only a limited number of meals for each category)
fetchMeals("Seafood", 4);
fetchMeals("Chicken", 4);
fetchMeals("Dessert", 4);

// Usage on the "View All" page
// Get the category from the URL
const params = new URLSearchParams(window.location.search);
const category = params.get("category");
if (category) {
    fetchMeals(category); // Fetch and display all meals for the chosen category
}