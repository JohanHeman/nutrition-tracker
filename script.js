const input = document.getElementById("input")
const searchBtn = document.getElementById("search")
let ingredientList = document.getElementById("ingredient-list")

let resultList = document.getElementById("result-list") 

let ingredients = []
let selectedIngredients = []

const foodURL = "https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel?limit=2000&offset=0";


let nutritionURL = "https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel/{nummer}/naringsvarden"

searchBtn.addEventListener("click", searchFood)

function searchFood()
{
    renderResults()
}


fetch(foodURL)
.then(response => response.json())
.then(function (data) {
    ingredients = data.livsmedel.map(function (item){
        return {
            id: item.nummer,
            name: item.namn,
            type: item.livsmedelsTyp
        }
    })
    console.log(ingredients.length)
})


function searchFoods()
{
    const query = input.value.trim().toLowerCase()
    if(query === "")
    {
        alert("not a valid input")
        return []
    }
    
    return ingredients.filter(item => item.name.toLowerCase().includes(query))
}


function renderResults(){
    const results = searchFoods()
    resultList.innerHTML = "";
    results.forEach(item => {
        const li = document.createElement("li")
        li.textContent = item.name
        li.addEventListener("click", () => {
            addItemWithNutrition(item)
        })
        resultList.appendChild(li)
    })
}


function addToIngredientList(item){
    selectedIngredients.push(item)
    renderIngredientList()
}


function renderIngredientList() {
    ingredientList.innerHTML = ""

    selectedIngredients.forEach(item => {
        const li = document.createElement("li")

        li.textContent = item.name


        ingredientList.appendChild(li)
    })
}

function getNutrition(id){
    return fetch(
        `https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel/${id}/naringsvarden`
    )
    .then(res => res.json())
}

function addItemWithNutrition(item)
{
    const nutrition = getNutrition(item.id)

    const fullItem = {
        item, 
        nutrition: nutrition
    }

    addToIngredientList(fullItem)

}