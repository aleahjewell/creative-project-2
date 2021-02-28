document.getElementById("all-recipes").innerHTML = "<p>Loading...</p>";
getAllRecipes();

async function getAllRecipes() {
    let results = "";
    document.getElementById("recipe").innerHTML = null;

    for (let letter of "abcdefghijklmnopqrstuvwxyz") {
        const url = "https://www.themealdb.com/api/json/v1/1/search.php?f=" + letter;

        await fetch(url)
            .then(function (response) {
                return response.json();
            }).then(function (json) {
                if (json.meals != null && json.meals.length > 0) {
                    results += formatRecipesList(json);
                }
            });
    }

    document.getElementById("all-recipes").innerHTML = results;
    setUpListeners();
}

document.getElementById("search-button").addEventListener("click", async function (event) {
    event.preventDefault();

    document.getElementById("recipe").innerHTML = null;
    const value = document.getElementById("search-input").value;
    const title = document.getElementById("page-title");
    title.innerHTML = "'" + value + "' Results";

    const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + value;
    await fetch(url)
        .then(function (response) {
            return response.json();
        }).then(function (json) {
            let results = formatRecipesList(json);
            document.getElementById("all-recipes").innerHTML = results;
        });
    setUpListeners();
});

function setUpListeners() {
    let items = document.getElementsByClassName("grid-item");
    for (let item of items) {
        item.addEventListener("click", function (event) {
            displayRecipe(this.id);
        })
    }
}

let mealNamesMap = new Map();

function formatRecipesList(json) {
    let results = "";

    if (json.meals == null || json.meals.length == 0) {
        results += "<p>No results found.</p>";
        return results;
    }

    for (let i = 0; i < json.meals.length; ++i) {
        mealNamesMap.set(json.meals[i].idMeal, json.meals[i].strMeal);

        results += "<div id='" + json.meals[i].idMeal + "' class='grid-item'>";
        results += "<img src='" + json.meals[i].strMealThumb + "' />";
        results += "<p class='category'>" + json.meals[i].strCategory + "</p>";
        results += "<p>" + json.meals[i].strMeal + "</p>";
        results += "</div>";
    }

    return results;
}

function displayRecipe(id) {
    document.getElementById("page-title").innerHTML = mealNamesMap.get(id);
    document.getElementById("all-recipes").innerHTML = null;

    const url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;
    fetch(url)
        .then(function (response) {
            return response.json();
        }).then(function (json) {
            let results = formatRecipe(json);
            document.getElementById("recipe").innerHTML = results;
        });

}

function formatRecipe(json) {
    let meal = json.meals[0];
    let results = "";

    results += "<p class='category'>" + meal.strArea + ", " + meal.strCategory + "</p>";

    results += "<div class='horizontal-container'>";
    results += "<img class='recipe-img' src='" + meal.strMealThumb + "' />";

    results += "<div class='vertical-container'>";
    results += "<h5>Ingredients</h5>";

    results += "<ul>";
    for (let i = 1; i <= 20; ++i) {
        let ingredientVal = "strIngredient" + i;
        let amountVal = "strMeasure" + i;
        let ingredient = meal[ingredientVal];
        let amount = meal[amountVal];

        if (ingredient != null && ingredient != "" && ingredient != " ") {
            results += "<li>" + amount + " " + ingredient + "</li>";
        }
    }
    results += "</ul>";
    results += "</div>";
    results += "</div>";

    results += "<h5 class='top-margin'>Instructions</h5>";

    let instructions = meal.strInstructions.split(/\r?\n/);
    results += "<ol>";
    for (let i = 0; i < instructions.length; ++i) {
        if (instructions[i].trim() != "") {
            results += "<li>" + instructions[i] + "</li>";
        }
    }
    results += "</ol>";

    if (meal.strYoutube != null && meal.strYoutube != "") {
        results += "<p class='top-margin'>For more information: <a class='youtube-link' href='" + meal.strYoutube + "'>" + meal.strYoutube + "</a></p>";
    }

    return results;
}
