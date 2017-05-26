





function resetzoom() {
  document.getElementById('zoommain').style['-webkit-transition-duration']='0.6s';
  document.getElementById('zoommain').style['transition-duration']='0.6s';
  document.getElementById('body').style['-webkit-transition-duration']='0.6s';
  document.getElementById('body').style['transition-duration']='0.6s';

  document.getElementById('zoommain').style.transform='';
  document.getElementById('body').style.transform='';
  
  setTimeout(function(){
	  document.getElementById('zoommain').style['-webkit-transition-duration']='';
	  document.getElementById('zoommain').style['transition-duration']='';
	  document.getElementById('body').style['-webkit-transition-duration']='';
	  document.getElementById('body').style['transition-duration']='';
  }, 800);
};






