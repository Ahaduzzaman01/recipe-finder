let apiUrls = {
    Seafood: "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood",
    Chicken: "https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken",
    Dessert: "https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert"
};
const mealDetailsUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const categoriesUrl = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
let mealDetails = [];

async function fetchMeals(category, limit = null, from = null) {
    try {
        if (from === "recipes") {
            const categoriesResponse = await fetch(categoriesUrl);
            const categoriesData = await categoriesResponse.json();
            
            apiUrls = categoriesData.meals.reduce((acc, category) => {
                const categoryName = category.strCategory;
                acc[categoryName] = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`;
                return acc;
            }, {});
    
            const response = await fetch(apiUrls[category]);
            const data = await response.json();
            const meals = limit ? data.meals.slice(0, limit) : data.meals;
            
            mealDetails = await Promise.all(
                meals.map(meal => fetch(mealDetailsUrl + meal.idMeal).then(res => res.json()))
            );
            
            displayMeals(mealDetails, limit ? `${category.toLowerCase()}-section` : "all-meals-section");
        } else{
            const response = await fetch(apiUrls[category]);
            const data = await response.json();
            const meals = limit ? data.meals.slice(0, limit) : data.meals;
            
            mealDetails = await Promise.all(
                meals.map(meal => fetch(mealDetailsUrl + meal.idMeal).then(res => res.json()))
            );
            
            displayMeals(mealDetails, limit ? `${category.toLowerCase()}-section` : "all-meals-section");
        }

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
                            <h5 class="card-title text-center text-truncate" style="font-size: 17px">${meal.strMeal}</h5>
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

fetchMeals("Seafood", 4);
fetchMeals("Chicken", 4);
fetchMeals("Dessert", 4);

const params = new URLSearchParams(window.location.search);
const category = params.get("category");
const from = params.get("from");
if (category && from === null) {
    fetchMeals(category);
} else if (category && from != null) {
    fetchMeals(category, null, from);
}