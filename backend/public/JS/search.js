const searchBox=document.querySelector('.searchterm');
const searchResults=document.querySelector('.searchResults');
const form=document.querySelector('.formsearch');
document.addEventListener('click',()=>{
    searchResults.style.visibility='hidden';
})
 form.addEventListener('submit',(event)=>{
    event.preventDefault();
})



 function insertResults(arr){
 
    for (let res of arr){
        let div1=document.createElement('div');

        div1.innerHTML=`
         <div class="card" onclick='location.href="/products/${res._id}"'>
            <div class="row">
                <div class="col-md-4">
                    <img src="${res.images[0].url}">
                </div>
                <div class="col">
                    <div class="card-body">
                        <h4>${res.name}</h4>
                        <p>${res.description.slice(0,70)+'...'}</p>
                        <p>₹${res.sellingprice}</p>

                    </div>
                </div>
            </div>
        </div>` 
    
        searchResults.append(div1)
      
    }
} 

searchBox.addEventListener('click',async (event)=>{
    event.stopPropagation();
    searchResults.style.visibility='visible';
    let searchTerm=searchBox.value;
    searchResults.innerHTML=''
    data=await axios.get(`/search?q=${searchTerm}`)
    console.log(data)
    insertResults(data.data)
})
searchBox.addEventListener('keyup',async (ev)=>{
    searchResults.style.visibility='visible';
    let searchTerm=searchBox.value;
    console.log(searchTerm)
    searchResults.innerHTML=''
    data=await axios.get(`/search?q=${searchTerm}`)
    console.log(data)
    insertResults(data.data)  
})

