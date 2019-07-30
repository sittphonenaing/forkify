export default class Likes {
    constructor(){
        this.likes =[];
    }
    addLike(id,title,author,image){
        const like={id,title,author,image};
        this.likes.push(like);
        
        //persist data in local storage
        this.persistData();
        return like;
    }

    deleteLike(id){        
        const index=this.likes.findIndex(el => el.id === id); 
        this.likes.splice(index,1);

        //persist data in local storage
        this.persistData();
    }

    isLiked(id){
        return this.likes.findIndex(el=>el.id ===id) !== -1//findindex will return -1 if cant find ..
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem("likes",JSON.stringify(this.likes));//local storage only store string..so we need to convert arr into string..
    }

    readStorage(){
        const storage =JSON.parse(localStorage.getItem("likes"));//convert string into original arry 
        
        //restore likes from local storage
        if(storage) this.likes =storage;
    }
}