const cl = console.log;

const todoForm = document.getElementById("todoForm")
const todoItem = document.getElementById("todoItem")
const todoContainer = document.getElementById("todoContainer")
const addTodoBtn= document.getElementById("addTodoBtn")
const updateTodoBtn= document.getElementById("updateTodoBtn")


let todoArr = [];
if(localStorage.getItem("todoArr")){
	todoArr = JSON.parse(localStorage.getItem("todoArr"))
}
 
const uuid = () => {
  return String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(
    /[xy]/g,
    character => {
      const random = (Math.random() * 16) | 0
      const value = character === 'x' ? random : (random & 0x3) | 0x8
      return value.toString(16)
    }
  )
}

const createLists=(arr)=>{
	let result=arr.map(todo=>{
		return `<li class="list-group-item d-flex justify-content-between" id=${todo.todoId}>
					<span>${todo.todoItem}</span>
					<div>
						<i onclick=onTodoEdit(this) class="fas fa-edit text-success"></i>
						<i onclick=onTodoRemove(this) class="fas fa-trash-alt text-danger"></i>
					</div>
				</li>`
	}).join("");
	todoContainer.innerHTML = result;
}

createLists(todoArr)

const onTodoEdit=(ele)=>{
	let EDIT_ID = ele.closest("li").id
	localStorage.setItem("EDIT_ID",EDIT_ID)
	cl(EDIT_ID)
	
	let EDIT_OBJ = todoArr.find(todo=>todo.todoId === EDIT_ID)
	cl(EDIT_OBJ)
	
	todoItem.value = EDIT_OBJ.todoItem;
	
	addTodoBtn.classList.add("d-none")
	updateTodoBtn.classList.remove("d-none")
}


const onTodoRemove=(ele)=>{
	
	Swal.fire({
	  title: "Are you sure?",
	  text: "You won't to remove this todoItem!",
	  icon: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#3085d6",
	  cancelButtonColor: "#d33",
	  confirmButtonText: "Yes, remove it!"
	}).then((result) => {
	  if (result.isConfirmed) {
		let REMOVE_ID = ele.closest("li").id
		cl(REMOVE_ID)
		
		let getIndex = todoArr.findIndex(todo=>todo.todoId === REMOVE_ID)
		cl(getIndex)
		
		todoArr.splice(getIndex,1);
		
		localStorage.setItem("todoArr",JSON.stringify(todoArr))
		
		ele.closest("li").remove();
		
		Swal.fire({
			  title: "removed!",
			  text: `removed this todoItem who's Id is ${REMOVE_ID}`,
			  icon: "success"
			});
	   }
	});
	
	
}


const onTodoSubmit=(eve)=>{
	eve.preventDefault()   
	cl("submited!!!")
	let todoObj ={
		todoItem:todoItem.value,
		todoId:uuid(),
	}
	cl(todoObj)
	todoForm.reset();
	
	todoArr.unshift(todoObj)
	cl(todoArr)
	localStorage.setItem("todoArr",JSON.stringify(todoArr))
	
	let li = document.createElement("li")
	li.id =todoObj.todoId;
	li.className= `list-group-item d-flex justify-content-between`;
	li.innerHTML = `<span>${todoObj.todoItem}</span>
					<div>
						<i onclick=onTodoEdit(this) class="fas fa-edit text-success"></i>
						<i onclick=onTodoRemove(this) class="fas fa-trash-alt text-danger"></i>
					</div>`
					
	 todoContainer.prepend(li)
	 
	 Swal.fire({
		 title:`todoItem ${todoObj.todoItem} added successfully!!`,
		 icon:'success',
		 timer:3000
	 })
	
}


const onUpdateTodo=()=>{
	let UPDATE_ID = localStorage.getItem("EDIT_ID")
	cl(UPDATE_ID)
	
	let UPDATED_OBJ ={
		todoItem:todoItem.value,
		todoId:UPDATE_ID,
	}
	cl(UPDATED_OBJ)
	todoForm.reset();
	
	let getIndex = todoArr.findIndex(todo=>todo.todoId === UPDATE_ID)
	cl(getIndex)
	
	todoArr[getIndex] = UPDATED_OBJ;
	
	localStorage.setItem("todoArr",JSON.stringify(todoArr))
	
	let li = document.getElementById(UPDATE_ID)
	li.firstElementChild.innerText = UPDATED_OBJ.todoItem; 
	
	addTodoBtn.classList.remove("d-none")
	updateTodoBtn.classList.add("d-none")
	
	Swal.fire({
		title:"Updated",
		text:`The todoItem who's id ${UPDATE_ID} is updated successfully!!`,
		icon:"success",
		timer:3000
	})
}	


todoForm.addEventListener("submit",onTodoSubmit)
updateTodoBtn.addEventListener("click",onUpdateTodo)