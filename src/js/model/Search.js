import axios from "axios";
import { proxy,apikey } from "../config";
export default class Search{
    constructor(query){
        this.query=query;
    }
    async getResult(){
       
        try{
            const result= await axios(`${proxy}https://www.food2fork.com/api/search?key=${apikey}&q=${this.query}`);
             this.recipe=result.data.recipes;
            //console.log(this.recipe);
    
        }
        catch(error){
            alert(error);
        }
     }

};

