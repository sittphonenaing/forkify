import {elements} from "./base";

export const getInput= ()=> elements.searchInput.value;
export const clearInput=()=>{
    elements.searchInput.value="";
};
export const clearResult=()=>{
    elements.searchResList.innerHTML="";
    elements.searchResPage.innerHTML="";
};
export const highlightSelected=(id)=>{
    const resultArr=Array.from(document.querySelectorAll(".results__link"));
    resultArr.forEach(el => {
        el.classList.remove("results__link--active");
    })

    document.querySelector(`.results__link[href="#${id}"]`).classList.add("results__link--active");
}
/* 
1st we need to split the recipe title and use reduce method on resulting arrary which then allows
to have accumulator and test current title + next word is under maximum length ,  

pasta with tomato and spinach
accu=0 /accu+current(pasta) =5 /newTitleRecipe=["Pasta"];
accu=5 /accu+current(with) =9 /newTitleRecipe=["Pasta","with"];
accu=9 /accu+current(tomato)=15/newTitleRecipe=["Pasta","with","tomato"];
accu=15 /accu+current(and)=18/newTitleRecipe=["Pasta","with","tomato"];


*/
export const limitRecipeTitle=(title,limit =17)=>{
    const newTitleRecipe=[];//array and object can be add value by push..it is not call mutate.
    if(title.length>limit){
        title.split(" ").reduce((accu,cur)=>{
            if(accu+cur.length<=limit){
                newTitleRecipe.push(cur);
            }
            return accu+cur.length;
        },0);
        //return result
        return `${newTitleRecipe.join(" ")}...`;//join is opposite of split
    }
    return title;
}

const renderRecipe=(recipe)=>{
    const markup=`
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li> 
    `;
    elements.searchResList.insertAdjacentHTML("beforeend",markup);
};
//"prev" "next"
const createButton=(page,type)=> `
            <button class="btn-inline results__btn--${type}" data-goto=${type === "prev" ? page-1 :page +1}>
            <span>Page${type === "prev" ? page-1 :page +1}</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-${type === "prev" ? "left" :"right"}"></use>
                </svg>
            </button>`;

const renderButtons=(page,numResults,resultPerPage)=>{
        const totalPages=Math.ceil(numResults/resultPerPage);//for future if the api change resultperpage to 40 or 45,current resultperpage is 30...so use math.ceil().
        let button;//let and const are block scope if we use in button under if statement ,,button will not go outside.
        if(page==1 && totalPages>1){
            //only render next button
            //we can create button in here but for maintainbility and reusabilty we use outside button functions.
            button=createButton(page,"next");
            
        }else if(page <totalPages){
            //render both buttons            
            button=`${button=createButton(page,"prev")}
                ${button=createButton(page,"next")}
            `
        }else if(page==totalPages && totalPages>1){
            //only render prev button for last page
            button=createButton(page,"prev");
        }
        elements.searchResPage.insertAdjacentHTML("afterbegin",button);

}

export const renderResults = (recipes,page=1,resultPerPage=10)=>{
    //render for current pages
    const start=(page-1)*resultPerPage;//index start at 0
    const end=page*resultPerPage;//0,1,2,3,4,5,6,7,8,9,10
    recipes.slice(start,end).forEach(renderRecipe);

    //render for pagination buttons
    renderButtons(page,recipes.length,resultPerPage);//recipes.length ==numResults
};