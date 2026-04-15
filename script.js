const input = document.getElementById("input")
const searchBtn = document.getElementById("search")
let ingredientList = document.getElementById("ingredient-list")
let sum = document.getElementById("sum")
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
        slider.max = 1000
        slider.value = item.grams

        let nutritionOutput = document.createElement("div")
        let unitOutput = document.createElement("div")

        function update() {
            item.grams = Number(slider.value)
            const res = calculateNutrition(item, item.grams)

            unitOutput.textContent = `${item.grams} g`
            nutritionOutput.textContent = res
            .map(n => `${n.name}: ${n.value.toFixed(1)} ${n.unit}`) //formats data to readable text 
            .join("\n");

            sum.innerHTML = ""
            const totals = calculateTotals() //returns an object

            for(let key in totals){
                const div = document.createElement("div")
                div.textContent = `${key}: ${totals[key].toFixed(1)}`
                sum.appendChild(div)
            }

        }

        slider.addEventListener("input", update);

        li.appendChild(slider)

        li.appendChild(unitOutput)
        li.appendChild(nutritionOutput)
        
        ingredientList.appendChild(li)

        update()

    })
}



function calculateNutrition(item, grams){
    const factor = grams / 100
    return item.nutrition.map(n => ({
        name: n.name,
        value: n.value * factor,
        unit: n.unit
    }))
}


async function getNutrition(id){
    const res = await fetch(
        `https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel/${id}/naringsvarden`
    )

    const data = await res.json()

        const allowed = [
        "Energi (kcal)",
        "Protein",
        "Fett, totalt",
        "Kolhydrater, tillgängliga",
        "Fibrer"
    ];    

    return data.filter(n => allowed.includes(n.namn)).map(n => ({
        name: n.namn,
        value: n.varde,
        unit: n.enhet
    }))
}

async function addItemWithNutrition(item)
{
    const nutrition = await getNutrition(item.id)

    const fullItem = {
        ...item, //copies all the properties from item into fullitem
        nutrition: nutrition,
        grams: 100
    }

    addToIngredientList(fullItem)

}

//todo 
//make the values stop changing when adding a new item 
//create sum 


function calculateTotals(){
    const totals = {}
    
    //fill totals with the total amount of nutrition summed from each item in the ingredient list

    for(let item of selectedIngredients){ // loop through the ingredient list 
        const nutrition = calculateNutrition(item, item.grams) 

        for(let n of nutrition){ // check loop through each nutrition for the item 
            if(totals[n.name] === undefined){
                totals[n.name] = n.value
            } else {
                totals[n.name] += n.value
            }
        }
    }
    return totals
}