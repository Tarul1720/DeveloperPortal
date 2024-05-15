
// slate sidenav caret
var element1 = document.querySelector('.dropdown-icon');
if (typeof (element1) != 'undefined' && element1 != null) {
    element1.addEventListener("click", function () {
        if (document.querySelector('.fas.fa-angle-down')) {
            document.querySelector('.fas.fa-angle-down').classList.toggle('fa-angle-right');
        }
    });
}
// slate sidenav caret 

// associate company member modal //
var modalopen = document.querySelector('.associateCompany');
var modalclose = document.getElementById('myModalAssociateCompany');
// If it isn't "undefined" and it isn't "null", then it exists.
/*if (typeof (modalopen) != 'undefined' && modalopen != null) {
    modalclose.addEventListener("click", function () {
        if (modalclose.style.display = 'none') {
            document.querySelector('#myModalAssociateCompany .modal-dialog').classList.remove('modal-lg');
        }
    });

    modalopen.addEventListener("click", function () {
        if (modalclose.style.display = 'block') {
            document.querySelector('#myModalAssociateCompany .modal-dialog').classList.add('modal-lg');
        }
    });
}*/
// associate company member modal//

// start sidenav on click open close //
function openSideNav() {
    document.getElementById("asideNav").style.width = "320px";
}
function closeSideNav() {
    document.getElementById("asideNav").style.width = "0";
}
// start sidenav on click open close //

// close user menu when clicking outside
var profileMenu = document.querySelector('.profile-menu');
var profileCollapse = document.querySelector('#profileMenu');
var bsCollapse = new bootstrap.Collapse(profileCollapse, {
  toggle: false
})

document.addEventListener('click', event => {
  const isClickInside = profileMenu.contains(event.target);
  if (!isClickInside) {
    bsCollapse.hide()
  }
})

//#region