const input = document.getElementById("input")
const addBtn = document.getElementById("add-btn")
let ingredientsList = document.getElementById("ingredient-list")

let ingredients = []

const foodURL = "https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel"


let nutritionURL = "https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel/{nummer}/naringsvarden"

addBtn.addEventListener("click", test)

function test()
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
    console.log(ingredients)
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

    results.forEach(item => {
        alert(item.name)
    })
}


//create function to search for foods 
//store the search result inside a variable in global scope
//create function for adding the item to the list 