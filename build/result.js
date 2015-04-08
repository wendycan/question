window.addEventListener('DOMContentLoaded', function(){

  var $ = function(selector, context){
    return (context || document).querySelector(selector)
  }
  var $$ = function(selector, context){
    return (context || document).querySelectorAll(selector)
  }
  $.toArray = function(list){
    return Array.prototype.slice.call(list)
  }

  var inputs = $$('.bm_optionList input');
  var resultDiv = $('.bm_result');

  $.toArray(inputs).forEach(function(input){
      input.addEventListener('click', function(e){
        var target_li = e.currentTarget.parentNode;
        var result = e.currentTarget.parentNode.parentNode.parentNode.querySelector('.bm_result');
        $.toArray(target_li.parentNode.querySelectorAll('input')).forEach(function(el) {
          el.disabled = "disabled";
        });
        if(target_li.getAttribute('data-right') == 'true'){
          target_li.className += 'right';
          result.querySelector('.right').style.display = 'block';
          result.querySelector('.error').style.display = 'none';
        } else {
          target_li.className += 'error';
          result.querySelector('.right').style.display = 'none';
          result.querySelector('.error').style.display = 'block';
        }
        result.style.display = 'block';
    });
  });
}, false)
