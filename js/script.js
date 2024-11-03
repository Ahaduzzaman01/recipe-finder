let apiUrls = {
    Seafood: "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood",
    Chicken: "https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken",
    Dessert: "https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert"
};
const mealDetailsUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const categoriesUrl = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
let mealDetails = [];

// Fetch category-specific meals based on given URL and limit
async function fetchCategoryMeals(url, limit) {
    const response = await fetch(url);
    const data = await response.json();
    return limit ? data.meals.slice(0, limit) : data.meals;
}

// Fetch meal details based on meal ID
async function fetchMealDetails(meals) {
    return Promise.all(
        meals.map(meal => fetch(mealDetailsUrl + meal.idMeal).then(res => res.json()))
    );
}

// Main fetch function to handle different data sources (direct category or API update)
async function fetchMeals(category, limit = null, from = null) {
    try {
        if (from === "recipes") {
            const categoriesData = await fetch(categoriesUrl).then(res => res.json());
            apiUrls = categoriesData.meals.reduce((acc, { strCategory }) => {
                acc[strCategory] = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${strCategory}`;
                return acc;
            }, {});
        }

        const meals = await fetchCategoryMeals(apiUrls[category], limit);
        mealDetails = await fetchMealDetails(meals);
        displayMeals(mealDetails, limit ? `${category.toLowerCase()}-section` : "all-meals-section");

    } catch (error) {
        console.error("Error fetching meal data:", error);
    }
}

// Display meals in specified section
function displayMeals(mealDetails, sectionId) {
    const container = document.getElementById(sectionId);
    console.log(sectionId);
    container.innerHTML = mealDetails
        .map(({ meals }) => {
            const meal = meals[0];
            return `
                <div class="col-sm-12 col-md-4 col-lg-3 ${sectionId == "all-meals-section" ? "mt-5" : ""}">
                    <div class="container card custom-card h-100 shadow py-4">
                        <div class="watch-background">
                            <a href="recipe-details.html?id=${meal.idMeal}">
                                <img class="img-fluid" src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                            </a>
                        </div>
                        <div class="card-body">
                            <h5 class="mb-0 card-title text-center text-truncate" style="font-size: 17px"><a class="text-decoration-none" style="color: inherit;" href="recipe-details.html?id=${meal.idMeal}">${meal.strMeal}</a></h5>
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
        })
        .join("");
}

// Fetch initial category data on page load
["Seafood", "Chicken", "Dessert"].forEach(category => fetchMeals(category, 4));

// Check URL parameters for additional data fetch conditions
const params = new URLSearchParams(window.location.search);
const category = params.get("category");
const from = params.get("from");
if (category) {
    fetchMeals(category, null, from);
}