import axios from "axios";
import { proxy,apikey } from "../config";

export default class Recipe{
    constructor(id){
        this.id=id;
    };

    async getRecipe(){
        try{
            const res=await axios(`${proxy}https://www.food2fork.com/api/get?key=${apikey}&rId=${this.id}`);
            this.title=res.data.recipe.title;
            this.author=res.data.recipe.publisher;
            this.image=res.data.recipe.image_url;
            this.url=res.data.recipe.source_url;
            this.ingredients=res.data.recipe.ingredients;            
            
        }
        catch(error){
            console.log(error);
            alert("Sorry!Something went wrong with recipe!");
        }
    
    }
    calcTime(){
        //assuming we need 15min for each 3 ingredients;
        const numIng=this.ingredients.length;
        const periods=Math.ceil(numIng/3);
         this.time=periods*15;
    };
    calcServing(){
        this.servings =4;
    };

    //standardize ingredients unit
    parseIngredients(){
        const unitLong=["tablespoons","tablespoon","ounces","ounce","pounds","cups","teaspoons","teaspoon"];
        const unitShort=["tbsp","tbsp","oz","oz","pound","cup","tsp","tsp"];
        const units=[...unitShort,"kg","g"];//es6 destructing method
        const newIngredients= this.ingredients.map(el=>{
            //1)uniform units...create 2 array unitLong and unitShort and loop unitlong in ingredient ..if match replace with unitshort
            let ingredient=el.toLowerCase();//later we will mutate ingredients so we use let;
            unitLong.forEach((unit,i)=>{
                ingredient=ingredient.replace(unit,unitShort[i]);
            })

            //2)remove parenthesis
            ingredient=ingredient.replace(/ *\([^)]*\) */g, " ");

            //3)parse ingredients into count,unit and ingredients itself;

            //first test there is a unit in string and if so,where it is located.
            //find where the index is located
            const arrIng=ingredient.split(" ");//we will get array here
            const unitIndex=arrIng.findIndex(el2=>units.includes(el2));//we cant use index method here bcz we dont know what we are searching..if result cant find ..findindex will return -1;
            
            
            let objIng;//final object
            if (unitIndex> -1){
                //there is a unit
                const arrCount=arrIng.slice(0,unitIndex);//4 1/2 cups arrCount is [4, 1/2];
                let count;
                if(arrCount===1){
                    count=eval(arrIng[0].replace("-","+"));
                }else{
                    count= eval(arrIng.slice(0,unitIndex).join("+"));//4+1/2 "4.5"..eval method is string math.
                }
                objIng={
                    count,
                    unit:arrIng[unitIndex],
                    ingredient:arrIng.slice(unitIndex+1).join(" ")//[4 cup coffee] 
                }


            }else if(parseInt(arrIng[0],10)){
                //there is no unit but number eg.1 bread .. it dont need unit
                objIng={
                    count:parseInt(arrIng[0],10),
                    unit:"",
                    ingredient:arrIng.slice(1).join(" ")
                }
            }else if(unitIndex=== -1){
                //there is NO unit and no number in 1 position
                objIng={
                    count:1,
                    unit:"",
                    ingredient//es6 feature ..no need to write ingredient:ingredient..auto covert
                }
            }
            
            return objIng;
        });
        this.ingredients=newIngredients;
    }; 

     updateServings(type){
        //servings
        const newServings = type === "dec" ? this.servings-1 : this.servings+1;
    
    
        //ingredients
        this.ingredients.forEach(ing=>{
             ing.count *=  (newServings/this.servings);
    
        });
        
        this.servings=newServings;
    }

};


