  let btn= document.querySelector('.reviewbtn')
  let pid=document.querySelector('#hidden').value
  function addReview(data){
      let div1=document.createElement('div')
      div1.classList.add('card','bg-light','my-2')
      
      

      let div2=document.createElement('div')
      div2.classList.add('card-body')
      div1.appendChild(div2)
      
      let h5=document.createElement('h5')
      h5.classList.add('card-title')
      h5.appendChild(document.createTextNode('Username'))
      div2.appendChild(h5)

      let p=document.createElement('p')
      p.classList.add('card-text')
      p.appendChild(document.createTextNode(data.data))
      div2.appendChild(p)
      
      document.querySelector('.allreviews').prepend(div1)
    
  } 
  btn.addEventListener('click',async (event)=>{
    event.preventDefault(); 
    let text=document.querySelector('#comment').value;
       let data =await axios.post(`/products/${pid}/comment`,{text:text})
       addReview(data);
         document.querySelector('#comment').value='';
    })
//  <div class="card bg-light">
//  <div class="card-body">
//  <h5 class="card-title">Special title treatment</h5>
//  <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
//  <a href="#" class="btn btn-primary">Go somewhere</a>
// </div>
// </div>  