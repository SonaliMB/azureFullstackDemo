const API="/api";

async function loadItems(){

const res = await fetch(API+"/items");

const data = await res.json();

const list=document.getElementById("list");

list.innerHTML="";

data.forEach(i=>{
const li=document.createElement("li");
li.textContent=i.name;
list.appendChild(li);
});

}

async function addItem(){

const val=document.getElementById("item").value;

await fetch(API+"/items",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name:val})
});

loadItems();

}

loadItems();
