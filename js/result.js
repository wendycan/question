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
        if(target_li.getAttribute('data-right') == 'true'){
          result.querySelector('.right').style.display = 'block';
          result.querySelector('.error').style.display = 'none';
        } else {
          result.querySelector('.right').style.display = 'none';
          result.querySelector('.error').style.display = 'block';
        }
        result.style.display = 'block';
    });
  });
}, false)
