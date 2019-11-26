/* Prevent dropdown menu closing on click */
var drop = document.querySelector('.dropdown-menu')
drop.addEventListener('click', function(e) {
  e.stopPropagation();
})

/////////////////////////////////////////////////////////////////////////////////////////

/* Click a button and copy associated text to computer clipboard */
function copy_to_clipboard(type) {
  if (type === "gmail") {
    var element = document.querySelector("#copy_gmail")
    /* only HTMLInputElement has the select() function, so create a pseudo <input> */
    var pseudo = document.createElement('input')
    pseudo.setAttribute('value', element.textContent)
    pseudo.style = {left: '-9999px'}  // make sure it does not appear on the page

    document.body.appendChild(pseudo)  // add it to HTML
    pseudo.select()  // select all text in this HTMLInputElement object
    document.execCommand('copy')  // copy whatever is selected to clipboard
    document.body.removeChild(pseudo)  // remove it from HTML
  }
  else if (type === 'qq') {
    var element = document.querySelector("#copy_qq")

    /* only HTMLInputElement has the select() function, so create a pseudo <input> */
    var pseudo = document.createElement('input')
    pseudo.setAttribute('value', element.textContent)
    pseudo.style = {left: '-9999px'}  // make sure it does not appear on the page

    document.body.appendChild(pseudo)  // add it to HTML
    pseudo.select()  // select all text in this HTMLInputElement object
    document.execCommand('copy')  // copy whatever is selected to clipboard
    document.body.removeChild(pseudo)  // remove it from HTML
  }
  else {
    alert("Somehow copy was unsuccessful..")
  }
}

////////////////////////////////////////////////////////////////////////////////////////////

/* Use Bootstrap tooltip and change its text on click */
$(function () {  // initialize
  $('[data-toggle="tooltip"]').tooltip()
})

$(document).on('inserted.bs.tooltip', function(e) {  // make tooltip accept css customization
    var tooltip = $(e.target).data('bs.tooltip');
    $(tooltip.tip).addClass($(e.target).data('tooltip-custom-classes'));
});

$('.copy_button').click(function() {  // change text when clicked
        $(this).tooltip('hide');
        $(this).tooltip().attr('data-original-title', "Copied");
        $(this).tooltip('show');
})
$('.copy_button').hover(function() {  // change text back when rehover
        $(this).tooltip().attr('data-original-title', "Copy to clipboard");
})

///////////////////////////////////////////////////////////////////////////////////////////////

/* Change navbar color at scroll */
var navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
  // console.log(window.scrollY)
  if (window.scrollY > 80) navbar.style.backgroundColor = '#7a7e82';  // 100 is not a calculated number
  else navbar.style.backgroundColor = 'transparent';
});

///////////////////////////////////////////////////////////////////////////////////////////////
