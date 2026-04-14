const input = document.getElementById("input")
const addBtn = document.getElementById("add-btn")
let ingredientsList = document.getElementById("ingredient-list")

let ingredients = []

const foodURL = "https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel"


let nutritionURL = "https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel/{nummer}/naringsvarden"




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

