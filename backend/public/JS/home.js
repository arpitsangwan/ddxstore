const slider = document.querySelector(".slider");
const btns = document.querySelectorAll(".btnn");
const slides = document.querySelectorAll(".img");

let index = 1;
let size = slides[index].clientWidth;

window.addEventListener('resize', ()=>{
	size = slides[index].clientWidth;

})

function slide() {
	slider.style.transition = "transform .5s ease-in-out";
	slider.style.transform = "translateX(" + (-size * index) + "px)";
}

function btnClick(event) {
	event.preventDefault();

	if (this.id === "prev") {
		if(index==0){index=slides.length - 1}
		else{index--;}
		
	}
	else {
		index++;
		if(index==slides.length){index=0;}
	}
 	slide();
}

/* slider.addEventListener('transitionend', () => {

	if (slides[index].id === "first") {
		slider.style.transition = "none";
		index = slides.length - 1;
		slider.style.transform = "translateX(" + (-size * index) + "px)";
	}
	else if (slides[index].id === "last") {
		slider.style.transition = "none";
		index = 0;
		slider.style.transform = "translateX(" + (-size * index) + "px)";
	}
	btns[0].disabled = false
	btns[1].disabled = false
})
 */
btns.forEach(btn => btn.addEventListener('click', btnClick));


