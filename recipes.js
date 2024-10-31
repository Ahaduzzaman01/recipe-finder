const categoriesUrl = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
const mealDetailsUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const mealCategoryBaseUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";

// Main container for all sections
const mainContainer = document.querySelector("main.container");

// Function to fetch meal categories and dynamically create sections
async function fetchMealCategories() {
    try {
        const response = await fetch(categoriesUrl);
        const data = await response.json();

        const mealCategories = data.meals.map((category) => ({
            apiUrl: `${mealCategoryBaseUrl}${category.strCategory}`,
            sectionId: `${category.strCategory.toLowerCase()}-section`,
            categoryName: category.strCategory
        }));

        mealCategories.forEach(createCategorySection);
        mealCategories.forEach(fetchAndDisplayMeals);

    } catch (error) {
        console.error("Error fetching meal categories:", error);
    }
}

// Function to create category section structure
function createCategorySection({ sectionId, categoryName }) {
    const section = document.createElement("section");
    section.className = "mt-5 mb-5";

    section.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <h3 class="navy-text mb-0">${categoryName.toUpperCase()} RECIPES</h3>
            <a href="view-all.html?category=${categoryName}&from=recipes" class="custom-link-only-btn">View All</a>
        </div>
        <div id="${sectionId}" class="row row-cols-1 row-cols-md-3 g-4 card-height mt-4"></div>
    `;

    mainContainer.appendChild(section);
}

// Function to fetch and display meals for a specific category
async function fetchAndDisplayMeals({ apiUrl, sectionId }) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const meals = data.meals.slice(0, 4); // Limit to first 4 meals

        const mealDetails = await Promise.all(
            meals.map(meal => fetch(mealDetailsUrl + meal.idMeal).then(res => res.json()))
        );

        document.getElementById(sectionId).innerHTML = mealDetails
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

    } catch (error) {
        console.error("Error fetching meal data:", error);
    }
}

// Initialize category sections and display meals on page load
fetchMealCategories();
