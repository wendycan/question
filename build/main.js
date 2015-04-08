jQuery(function($) {
  var toLetters = function(num) {
    var mod = num % 26,
        pow = num / 26 | 0,
        out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? toLetters(pow) + out : out;
  };
  var jsUrl = 'http://localhost:8000/js/result.js';
  var cssUrl = 'http://localhost:8000/css/result.css'
  var Question = React.createClass({displayName: "Question",
    render: function() {
      return (
        React.createElement("div", {className: "question"}, 
          React.createElement("h4", null, "问题", this.props.index, "：",  this.props.title), 
          React.createElement(OptionsList, {options: this.props.options, selected: this.props.answer.index}), 
          React.createElement("p", null, " ",  this.props.answer.desc, " ")
        )
      );
    }
  });
  var OptionForm = React.createClass({displayName: "OptionForm",
    handleOptionSubmit: function() {
      var option = React.findDOMNode(this.refs.option).value.trim();
      if (!option) return;
      this.props.onOptionSubmit({option: option});
      React.findDOMNode(this.refs.option).value = '';
      $('#f-option').focus();
    },
    render: function() {
      return (
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-md-11"}, 
            React.createElement("input", {type: "text", className: "form-control", placeholder: "Option", ref: "option", id: "f-option"})
          ), 
          React.createElement("div", {className: "col-md-1"}, 
            React.createElement("div", {className: "btn btn-default", id: "create-option", onClick: this.handleOptionSubmit}, "添加")
          )
        )
      );
    }
  });
  var QuestionForm = React.createClass({displayName: "QuestionForm",
    getInitialState: function() {
      return {options: []};
    },
    handleSubmit: function(e) {
      e.preventDefault();
      var title = React.findDOMNode(this.refs.title).value.trim();
      var answer = {
        desc: React.findDOMNode(this.refs.answer).value.trim(),
        index: $('.optionsList .active').data('id')
      };
      if (!title || !answer || answer.index === undefined) {
        return;
      }

      this.props.onQuestionSubmit({title: title, answer: answer, options: this.state.options});
      $('#question-form').empty();
    },
    cancelAdd: function(e) {
      e.preventDefault();
      $('#question-form').empty();
    },
    handleOptionSubmit: function(option) {
      var options = this.state.options;
      options.push(option);
      this.setState({options: options});
    },
    render: function() {
      return (
        React.createElement("form", {className: "questionForm", onSubmit: this.handleSubmit}, 
          React.createElement("div", {className: "form-group"}, 
            React.createElement("label", {htmlFor: "f-title"}, "问题"), 
            React.createElement("input", {type: "text", className: "form-control", placeholder: "Title", ref: "title", id: "f-title"})
          ), 
          React.createElement("div", {className: "form-group"}, 
            React.createElement("label", {htmlFor: "f-option"}, "选项", React.createElement("mark", null, "添加后，点击选项选择正确答案。")), 
            React.createElement(OptionForm, {onOptionSubmit: this.handleOptionSubmit}), 
            React.createElement(Options, {options: this.state.options})
          ), 
          React.createElement("div", {className: "form-group"}, 
            React.createElement("label", {htmlFor: "f-answer"}, "答案"), 
            React.createElement("textarea", {className: "form-control", rows: "3", placeholder: "Answer", ref: "answer", id: "f-answer"})
          ), 
          React.createElement("button", {type: "submit", className: "btn btn-default"}, "添加"), 
          React.createElement("button", {className: "btn btn-default", onClick: this.cancelAdd}, "取消")
        )
      );
    }
  });
  var Options = React.createClass({displayName: "Options",
    selectOption: function(e) {
      $(e.target).addClass('active').siblings().removeClass('active');
    },
    render: function() {
      var optionsNodes = this.props.options.map(function(option, index) {
        return (
          React.createElement("p", {"data-title": option.option, "data-id": index, key: index, onClick: this.selectOption}, toLetters(index + 1)+ '.' + option.option)
        );
      }.bind(this));//to pass this to function
      return (
        React.createElement("div", {className: "optionsList"}, 
          optionsNodes
        )
      )
    }
  });
  var OptionsList = React.createClass({displayName: "OptionsList",
    render: function() {
      var optionsNodes = this.props.options.map(function(option, index) {
        if (index === this.props.selected) {
          return (
            React.createElement("p", {key: index, className: "active"}, toLetters(index + 1)+ '.' + option.option)
          );
        } else {
          return (
            React.createElement("p", {key: index}, toLetters(index + 1)+ '.' + option.option)
          );        
        }
      }.bind(this));
      return (
        React.createElement("div", {className: "optionsList"}, 
          optionsNodes
        )
      )
    }
  });
  var Questions = React.createClass({displayName: "Questions",
    render: function() {
      var questionNodes = this.props.data.map(function(question, index) {
        return (
          React.createElement(Question, {title: question.title, options: question.options, answer: question.answer, index: index + 1, key: index}
          )
        );
      });
      return (
        React.createElement("div", {className: "questionList"}, 
          questionNodes
        )
      );
    }
  });
  var PageMetas = React.createClass({displayName: "PageMetas",
    render: function() {
      return (
        React.createElement("div", null, 
          React.createElement("h3", null, this.props.data.title), 
          React.createElement("p", null, this.props.data.desc)
        )
      );
    }
  });
  var Result = React.createClass({displayName: "Result",
    render: function() {
      var questionNodes = this.props.data.map(function(question, index) {
        var _index = index;
        var optionsNodes = question.options.map(function(option, index) {
          var isTrue = index === question.answer.index? true:false;
          return (
            React.createElement("li", {"data-right": isTrue, key: index, style: {listStyle: 'none'}}, 
            React.createElement("input", {type: "radio", name: _index, value: index, id: "f-option-" + _index + '-' + index}), 
            React.createElement("label", {htmlFor: "f-option-" + _index + '-' + index}, option)
            )
          )
        });
        return (
          React.createElement("li", {key: index, style: {listStyle: 'none'}, className: "bm_question"}, 
            React.createElement("h4", null,  question.title), 
            React.createElement("ol", {className: "bm_optionList"}, optionsNodes), 
            React.createElement("div", {style: { display: 'none'}, className: "bm_result"}, 
              React.createElement("div", {className: "right"}, React.createElement("h3", null, "正确"), React.createElement("p", null,  question.answer.desc)), 
              React.createElement("div", {className: "error"}, React.createElement("h3", null, "错误"), React.createElement("p", null,  question.answer.desc))
            )
          )
        );
      });
      return (
        React.createElement("div", {className: "bm_page"}, 
          React.createElement("h3", null, this.props.meta.title), 
          React.createElement("p", null, this.props.meta.desc), 
          React.createElement("ul", {className: "bm_questionList", style: {padding: 0}}, 
            questionNodes
          )
        )
      );
    }
  });
  var PageForm = React.createClass({displayName: "PageForm",
    handleSubmit: function(e){
      e.preventDefault();
      this.props.onPageSubmit({
        title: React.findDOMNode(this.refs.title).value.trim(),
        desc: React.findDOMNode(this.refs.desc).value.trim()
      });
    },
    cancelUpdate: function(e) {
      e.preventDefault();
      $('#meta-form').empty();
    },
    render: function() {
      return (
        React.createElement("form", {className: "PageForm", onSubmit: this.handleSubmit}, 
          React.createElement("div", {className: "form-group"}, 
            React.createElement("label", {htmlFor: "f-p-title"}, "标题"), 
            React.createElement("input", {type: "text", className: "form-control", placeholder: "Title", ref: "title", id: "f-p-title", defaultValue: this.props.data.title})
          ), 
          React.createElement("div", {className: "form-group"}, 
            React.createElement("label", {htmlFor: "f-p-desc"}, "描述"), 
            React.createElement("textarea", {className: "form-control", placeholder: "Desc", row: "5", ref: "desc", id: "f-p-desc", defaultValue: this.props.data.desc})
          ), 
          React.createElement("button", {type: "submit", className: "btn btn-default"}, "更新"), 
          React.createElement("button", {id: "cancal-update-meta", className: "btn btn-default", onClick: this.cancelUpdate}, "取消")
        )
      );
    }
  });
  var ContentBox = React.createClass({displayName: "ContentBox",
    getInitialState: function() {
      return {data: [], meta: {}};
    },
    handleQuestionSubmit: function(question) {
      var questions = this.state.data;
      questions.push(question);
      this.setState({data: questions});
    },
    handlePageSubmit: function(meta) {
      this.setState({meta: meta})
      $('#meta-form').empty();
    },
    newQuestion: function(){
      $('#meta-form').empty();
      $('#result-text').hide();
      React.render(
        React.createElement(QuestionForm, {onQuestionSubmit: this.handleQuestionSubmit}),
        document.getElementById('question-form')
      );
    },
    editPage: function() {
      $('#question-form').empty();
      React.render(
        React.createElement(PageForm, {onPageSubmit: this.handlePageSubmit, data: this.state.meta}),
        document.getElementById('meta-form')
      );
    },
    generateHTML: function() {
      if (this.state.data.length <= 0) {return};
      var text = React.renderToStaticMarkup(React.createElement(Result, {data: this.state.data, meta: this.state.meta}));
      text += '<link rel="stylesheet" type="text/css" href="' + cssUrl + '">';
      text += '<script type="text/javascript" src="' + jsUrl + '"></script>';
      $('#result-text textarea').val(text);
      $('#result-text').css('display', 'block');
    },
    render: function() {
      return (React.createElement("div", {className: "question-box"}, 
        React.createElement("div", {className: "row top-buttons"}, 
          React.createElement("div", {className: "col-md-1"}, 
            React.createElement("div", {className: "btn btn-default", onClick: this.newQuestion}, "添加问题")
          ), 
          React.createElement("div", {className: "col-md-1"}, 
            React.createElement("div", {className: "btn btn-default", onClick: this.editPage}, "编辑页面")
          ), 
          React.createElement("div", {className: "col-md-1"}, 
            React.createElement("div", {className: "btn btn-default", onClick: this.generateHTML}, "生成 HTML")
          )
        ), 
        React.createElement("div", {id: "question-form"}), 
        React.createElement("div", {id: "meta-form"}), 
        React.createElement(PageMetas, {data: this.state.meta}), 
        React.createElement(Questions, {data: this.state.data})
      )
      );
    }
  });

  React.render(
    React.createElement(ContentBox, null),
    document.getElementById('content')
  );
});
