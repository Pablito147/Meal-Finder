const search = document.getElementById("search"),
    submit = document.getElementById("submit"),
    random = document.getElementById("random"),
    mealsEl = document.getElementById("meals"),
    reasultHeading = document.getElementById("result-heading"),
    single_mealEl = document.getElementById("single-meal");

function searchMeal(e) {
    e.preventDefault();
    const term = search.value;
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                reasultHeading.innerHTML = `<h2>Search results for'${term}'</h2>`;

                if (data.meals === null) {
                    reasultHeading.innerHTML = `<p>There are no search results. Try again!</p>`
                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                    <div class = "meal">
                        <img src = "${meal.strMealThumb}" alt="${meal.strMeal}" />
                        <div class="meal-info" data-mealID= "${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                    `)
                        .join("");
                }
            });
        // clear search 
        search.value = "";
    } else {
        alert("Please enter search value")
    }
    single_mealEl.innerHTML = "";
}
function getShowCaseMeals() {
    // const populateMeals = [];
    // fetch("https://themealdb.com/api/json/v1/1/filter.php?a=Italian")
    //     .then(res => res.json())
    //     .then(data => {
    //         console.log(data)
    //         console.log(data.meals[0]);
    //         for (let i = 0; i < 4; i++) {
    //             const obj = { name: data.meals[i] }

    //             populateMeals.push(obj);
    //             addMealToDOOM(obj.name)

    //         }
    //         console.log(populateMeals);
    //     })

    const term = "Italian";

    fetch(`https://themealdb.com/api/json/v1/1/filter.php?a=${term}`)
        .then(res => res.json())
        .then(data => {
            reasultHeading.innerHTML = `<h2>Search results for'${term}'</h2>`;
            data.meals.splice(4)

            mealsEl.innerHTML = data.meals.map((meal, index) => `
                    <div class = "meal">
                        <img src = "${meal.strMealThumb}" alt="${meal.strMeal}" />
                        <div class="meal-info" data-mealID= "${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                    `)
                .join("");

        });
}

getShowCaseMeals();

//Fetch meal by id
function getMealByID(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOOM(meal);
        });
}
function addMealToDOOM(meal) {
    ingredeints = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredeints.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        } else {
            break
        }
    }
    single_mealEl.innerHTML = `
    <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info">
    <p class="box-item">
    Type of meal: <span>${meal.strCategory ? `${meal.strCategory}` : ""}</span>
    </p>
    <p class="box-item">
    Meal coming from country:<span> ${meal.strArea ? `${meal.strArea}` : ""}</span>
    </p>
    </div>
    <p>${meal.strInstructions}</p>
     <ul>
    ${ingredeints.map(ing => `<li>${ing}</li>`).join("")}
    </ul>
    </div>
    `;
}
function randomMeal() {
    let populateMeals = [];
    mealsEl.innerHTML = "";
    reasultHeading.innerHTML = "";
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOOM(meal);
        })
}

submit.addEventListener("submit", searchMeal, lol);
random.addEventListener("click", randomMeal)

function lol(e) {
    e.preventDefault();
    console.log("Sfsdfs")
}
mealsEl.addEventListener("click", e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains("meal-info");
        } else {
            return false;
        }
    });
    if (mealInfo) {
        const mealID = mealInfo.getAttribute("data-mealid")
        getMealByID(mealID);
    }
})
