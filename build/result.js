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

  // input.addEventListener('click', function(e){
  //   console.log(e);
  //   var checked = $$('li.on', form)
  //   if(checked.length !== questions.length) return alert('这位客官请回答完先！')

  //   var point = 0
  //   var result = ''
  //   var resultArr = $.toArray(resultLists)
  //   checked = $$('input:checked', form)
  //   if(questions.length > 1) {
  //     $.toArray(checked).forEach(function(radio){
  //       point += Number(radio.value)
  //     })
  //     result = resultArr.filter(function(li){
  //       var max = Number(li.getAttribute('max'))
  //       var min = Number(li.getAttribute('min'))
  //       return point >= min && point <= max
  //     })[0].innerText
  //   } else {
  //     point = Number(checked[0].value)
  //     result = resultArr.filter(function(li){
  //       return Number(li.getAttribute('rel')) === point
  //     })[0].innerText
  //   }
  //   content.innerText = result

  //   resultDiv.style.display = 'block'
  //   submit.style.background = '#ccc'
  //   submit.addEventListener('click', function(e){
  //     e.preventDefault()
  //   })
  // })

}, false)
