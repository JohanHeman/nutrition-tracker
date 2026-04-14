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
        const slider = document.createElement("input")
        slider.type = "range"
        slider.min = 1
        slider.value = 100
        let output = document.createElement("div")

        li.appendChild(slider)

        li.appendChild(output)
        
        ingredientList.appendChild(li)

    })
}




async function getNutrition(id){
    const res = await fetch(
        `https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel/${id}/naringsvarden`
    )

    const data = await res.json()

    return data
}

async function addItemWithNutrition(item)
{
    const nutrition = await getNutrition(item.id)

    const fullItem = {
        ...item, //copies all the properties from item into fullitem
        nutrition: nutrition
    }

    addToIngredientList(fullItem)

}