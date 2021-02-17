  let btn= document.querySelector('.reviewbtn')
  let pid=document.querySelector('#hidden').value

  function addReview(data){
      let div1=document.createElement('div')
      div1.classList.add('card','bg-light','my-2')
      
      

      let div2=document.createElement('div')
      div2.classList.add('card-body')
      div1.appendChild(div2)
      
     

      let h4=document.createElement('h4')
      h4.classList.add('card-title')
      h4.appendChild(document.createTextNode(data.data.authorName))
      div2.appendChild(h4)

      let p=document.createElement('p')
      p.classList.add('card-text')
      p.appendChild(document.createTextNode(data.data.review))
      div2.appendChild(p)
      
      let div3=document.createElement('div')
      //div3.classList.add('d-flex')
      div2.appendChild(div3)  
      
       let form=document.createElement('form')
       form.setAttribute('action',`/products/${pid}/review?revId=${data.data._id}&&_method=delete`)
       form.setAttribute('method','post')
       form.classList.add('mx-1')
       div3.appendChild(form)

       let btn=document.createElement('button')
       btn.classList.add('btn','btn-danger')
       btn.appendChild(document.createTextNode('Delete'))
       form.appendChild(btn)
     

      document.querySelector('.allreviews').prepend(div1)
    
  } 
  btn.addEventListener('click',async (event)=>{
    event.preventDefault(); 
    let text=document.querySelector('#comment').value;
       try{ 
         let data =await axios.post(`/products/${pid}/review`,{text:text}) 
           addReview(data);
              document.querySelector('#comment').value='';
      }
       catch(e){
         console.dir(e)
         switch(e.response.status){
           case(403):{
            window.location.href='/login';
            break;
          } 
          case(400):{
            window.location.href=`/products/${pid}`;
            break;
          }
          case(404):{
            window.location.href='/products';
            break;
          }
          case(401):{
            window.location.href=`/products/${pid}`;
            break;
          }

         }
        //window.location.href='/login';
       }
      
    })
   