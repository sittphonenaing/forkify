// Global app controller

// import str from  "./model/Search";
// //import { add as a ,multiply as m,ID } from "./view/searchView";
// import * as searchView from "./view/searchView";

// console.log(`Using imported functions! ${searchView.add(2,searchView.ID)} and ${searchView.multiply(3,25)}.${str}`);

//70bcb7e68e152373a3d1b1195a2cc748
//https://www.food2fork.com/api/search
import Search from "./model/Search";
import Recipe from "./model/Recipe";
import List from "./model/List";
import Likes from "./model/Likes";
import * as searchView from "./view/searchView";
import * as recipeView from "./view/recipeView";
import * as listView from "./view/listView";
import * as likeView from "./view/likeView";
import { elements,renderLoader,clearLoader } from "./view/base";






/**global state of app
 * -search object
 * -current recipe object
 * -shopping list object
 * -liked recipe
 */
const state={};


/**
 * search controller
 */
    const controlSearch=async ()=>{
        //1) get query from view
        const query=searchView.getInput();
        //const query="pizza";//for testing
        
        if (query){
        //2) new search object add to state
        state.search= new Search(query);
        
        //3)prepare for ui (clear previous recsult and show pic)
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);
        try {

        //4)search for recipes
        await state.search.getResult();
        
        //5)Render results for ui
        clearLoader();
        searchView.renderResults(state.search.recipe);
    }catch(error){
        console.log(error);
        alert("something wrong with search!");
        clearLoader();
        }
        }
    }

    //add event listener in controller
    elements.searchForm.addEventListener("submit",e=>{
        e.preventDefault();
        controlSearch();
    });
    // /////testing///////////////////
    // window.addEventListener("load",e=>{
    //     e.preventDefault();
    //     controlSearch();
    // });

    elements.searchResPage.addEventListener("click",e=>{
        const btn=e.target.closest(".btn-inline");//need to use closest method..bcz if we didnt use that eveytime we click the arrow in button or text in button indicates each other..
        searchView.clearResult();//clear the results and button 1st
        const goToPage=parseInt(btn.dataset.goto,10)//base 10;//html 5 data-attribute feature ..data-goto ..
        searchView.renderResults(state.search.recipe,goToPage);
    });

/**
 * recipe controller
 * 
 */


    const controlRecipe=async ()=>{
    //get id from url
    const id=window.location.hash.replace("#","");//window.location is entire url in browser.
    

    if (id){
        //1)prepare for ui changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight selected search item
       if(state.search) searchView.highlightSelected(id);

        //2)create recipe object
        state.recipe=new Recipe(id);
       
        try{
            //3)get recipe data and parseIngredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            //4) calc serving and time
            state.recipe.calcTime();
            state.recipe.calcServing();

            //5 render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id));
        }catch(error){
            console.log(error);
            alert("something wrong with recipe")
        }
    }
}

// window.addEventListener("hashchange",controlRecipe);
// window.addEventListener("load",controlRecipe);//if a user bookmark this site..reload for him

["hashchange","load"].forEach(event=>window.addEventListener(event,controlRecipe));

/**
 * list controller
 * 
 */
    const controlList=()=>{
        //create new list if there is non yet.
        if (!state.list) state.list=new List();
        
        //add each ingredient to list and ui
        state.recipe.ingredients.forEach(el =>{
            const item=state.list.addItems(el.count,el.unit,el.ingredient);
            listView.renderItem(item);
            
        });
    };


//handling update and delete items
elements.shoppingdiv.addEventListener("click",e=>{
    
const id= e.target.closest(".shopping__item").dataset.itemid;

//handle delete button
if(e.target.matches(".shopping__delete, .shopping__delete *")){
    //delete from state
    state.list.delItems(id);

    //delete item from ui
    listView.deleteItem(id);

    //handle count
}else if (e.target.matches(".shopping__count-value")){
    const val=parseFloat(e.target.value,10);
    state.list.updateCount(id,val);
}

});

/**
 * like controller
 * 
 */

 
const controlLike=()=>{
    if(!state.likes) state.likes =new Likes();
    const currentId=state.recipe.id;
    //if user has not like like
    if(!state.likes.isLiked(currentId)){
    //add like to state
    const newLike=state.likes.addLike(
        currentId,
        state.recipe.title,
        state.recipe.author,
        state.recipe.image
    );
    console.log(newLike);

    //toggle button
        likeView.toggleLikeBtn(true);
    //add like to UI
    likeView.renderLike(newLike);    
    }else {
    //remove like from state
    state.likes.deleteLike(currentId);

    //toggle button
    likeView.toggleLikeBtn(false);
    //remove like from UI
    likeView.deleteLike(currentId);
    };
    likeView.toggleLikeMenu(state.likes.getNumLikes());
    
};

//restore like on page reload
window.addEventListener("load",()=>{
    state.likes =new Likes();

    //restore like
    state.likes.readStorage();

    //toggle like menu button
    likeView.toggleLikeMenu(state.likes.getNumLikes());

    //render existing likes
    state.likes.likes.forEach(like => likeView.renderLike(like));
})


//handling button controller
//we cant use closest method here bcz here we need to target different button like,servings,..so we use matches method.
elements.recipe.addEventListener("click",e =>{
    //decrease button was clicked
    
    if(e.target.matches(".btn-decrease, .btn-decrease *")){//select btn decrease all child
        if(state.recipe.servings >1){

            state.recipe.updateServings("dec");
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    //increase button was clicked
    else if(e.target.matches(".btn-increase, .btn-increase *")){//select btn decrease all child//omg i have to find 15min this error.. ".btn-increase", ".btn-increase *"
        state.recipe.updateServings("inc");
        recipeView.updateServingsIngredients(state.recipe);
    
    //add list to shopping
    }else if(e.target.matches(".recipe__btn-add , .recipe__btn-add *")){
        controlList();
    }else if(e.target.matches(".recipe__love , .recipe__love *")){
        controlLike();
    };
    
});

