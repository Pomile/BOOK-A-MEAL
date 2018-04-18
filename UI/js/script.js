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