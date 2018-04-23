function opennav () {
    const backdrop = document.getElementById("backdrop");
    const sidenav = document.getElementById("sidenav");
    backdrop.style.display = "block";
    sidenav.style.display = "block";
    sidenav.style.transform = "translateX(0%)";
}

function closenav () {
    const backdrop = document.getElementById("backdrop");
    const sidenav = document.getElementById("sidenav");
    backdrop.style.display = "none";
    sidenav.style.transform = "translateX(-100%)";
    
}

function displayArrowUp (id) {
    const arrowUp = document.getElementById(id);
    arrowUp.style.display = "block";
    
}

function hideArrowUp (id) {
    const arrowUp = document.getElementById(id);
    arrowUp.style.display = "none";
    
}

function displayTabBox(id, tablink) {
    removeTabBoxes();
    const Tab= document.getElementById(id);
    const tab = document.getElementById(tablink);
    console.log(Tab);
    Tab.style.display = "block";
    tab.classList.add("active");
}

function removeTabBoxes(){
    const Tabs = document.getElementsByClassName("mealtabs");
    const tooldrop = document.getElementsByClassName("tool-drop");
    const len = Tabs.length;

    let counter = 0;
    for (counter; counter < len; counter++){
        Tabs[counter].style.display = "none";
        console.log(counter);
        tooldrop[counter].classList.remove("active");
    }

}



const menupage = document.getElementById("menu-page");
if(menupage){
    document.onload = displayTabBox("setup-menu-content", 1);
} else {
    document.onload = displayTabBox("add-meal-content", 1);
}

 

 function getFeedBack(type) {
    const backdrop = document.getElementById("meal-backdrop");
    const message = document.getElementById("action-message");

    backdrop.style.display = "block";
    if (type === "remove"){
        message.innerHTML = "Meal sucessfully removed"
    } else if (type === "add") {
        message.innerHTML = "Meal sucessfully added"
    } else if (type === "modify") {
        message.innerHTML = "Meal sucessfully Updated"
    }
    

 }


 function closeBackdrop () {
    const backdrop = document.getElementById("meal-backdrop");
    const message = document.getElementById("action-message");

    backdrop.style.display = "none";
    message.innerHTML = "";
 }


 const showModal = (id) => {
	return document.getElementById(id).style.display = "block";
};

const closeModal = (id) => {
	return document.getElementById(id).style.display = "none";
};

function toggle (id) {
    let displayStatus = document.getElementById(id);
    if (displayStatus.style.display === "block") {
       return displayStatus.style.display = "none"
    }
    return displayStatus.style.display = "block"
};
