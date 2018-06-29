let itemLink = Array.from(document.querySelectorAll('.item'));
let overlay = document.getElementById("overlay");

const handleClick = (e) => {
  e.preventDefault();
  itemLink.forEach(node => {
    node.classList.remove('active');
  });
  e.currentTarget.classList.add('active');
  overlay.classList.add('active');
  document.getElementById("navigation").onmouseleave = function(){
    overlay.classList.remove('active');
  }
}

itemLink.forEach(node => {
  node.addEventListener('click', handleClick)
});



var rellax = new Rellax('.rellax', {
  speed: -2,
  center: false,
  wrapper: null,
  round: true,
  vertical: true,
  horizontal: false
});
