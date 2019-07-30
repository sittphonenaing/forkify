import uniqid from "uniqid";
export default class List {
    constructor(){
        
       this.items=[];
    };

    addItems(count,unit,ingredient){
        const item={
        id:uniqid(),
        count,
        unit,
        ingredient
        };
        this.items.push(item);
        return item;
    };

    delItems(id){
        //1st check the id of item with current id
        const index=this.items.findIndex(el => el.id === id);
        
        //[2,4,8].splice(1,2), return [4,8] original arry is [2];
        //[2,4,8].slice(1,2),return [4] original arry is [2,4,8];
        this.items.splice(index,1);
    };

    updateCount(id,newCount){
        this.items.find(el=>el.id ===id).count =newCount;//find method will return element ..in here it will return item same as current id.
    }
}