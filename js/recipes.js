const categoriesUrl = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
const mealDetailsUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const mealCategoryBaseUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";

// Main container for all sections
const mainContainer = document.querySelector("main.recipes-container");

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

    if (mainContainer.children.length === 0) {
        section.classList.add("pt-5");
    }

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
                    <div class="col-sm-6 col-md-4 col-lg-3">
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

    } catch (error) {
        console.error("Error fetching meal data:", error);
    }
}

// Initialize category sections and display meals on page load
fetchMealCategories();

window.addEventListener("load", function () {
	setTimeout(function(){
        document.getElementById("loader").style.display = "none";
    }, 1200);
});

function googleTranslateElementInit() {
	new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
}

function translatePage() {
	const language = document.getElementById("language_selector").value;
	localStorage.setItem('selectedLanguage', language); // Save the selected language
	const translateElement = document.querySelector('.goog-te-combo');

	if (translateElement) {
		translateElement.value = language;
		translateElement.dispatchEvent(new Event('change'));
	}
}

// Check and apply stored language on page load
window.onload = function () {
	const storedLanguage = localStorage.getItem('selectedLanguage') || 'en'; // Default to English
	document.getElementById("language_selector").value = storedLanguage; // Set dropdown to stored language
	const translateElement = document.querySelector('.goog-te-combo');

	if (translateElement) {
		translateElement.value = storedLanguage;
		translateElement.dispatchEvent(new Event('change'));
	}
};

window.addEventListener("load", function () {
	setTimeout(function () {
		document.getElementById("loader").style.display = "none";
	}, 1200);
});