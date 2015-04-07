window.toLetters = function(num) {
  var mod = num % 26,
      pow = num / 26 | 0,
      out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
  return pow ? toLetters(pow) + out : out;
}
var Question = React.createClass({displayName: "Question",
  render: function() {
    return (
      React.createElement("div", {className: "question"}, 
        React.createElement("p", null,  this.props.title), 
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
  },
  render: function() {
    return (
      React.createElement("div", {className: "row"}, 
        React.createElement("div", {className: "col-md-11"}, 
          React.createElement("input", {type: "text", className: "form-control", placeholder: "Option", ref: "option"})
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
    if (!title || !answer) {
      return;
    }

    this.props.onQuestionSubmit({title: title, answer: answer, options: this.state.options});
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
          React.createElement("label", null, "问题"), 
          React.createElement("input", {type: "text", className: "form-control", placeholder: "Title", ref: "title"})
        ), 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("label", null, "选项"), 
          React.createElement(OptionForm, {onOptionSubmit: this.handleOptionSubmit}), 
          React.createElement(Options, {options: this.state.options})
        ), 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("label", null, "答案"), 
          React.createElement("textarea", {className: "form-control", rows: "3", placeholder: "Answer", ref: "answer"})
        ), 
        React.createElement("button", {type: "submit", className: "btn btn-default"}, "添加")
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
        React.createElement(Question, {title: question.title, options: question.options, answer: question.answer, key: index}
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
var ContentBox = React.createClass({displayName: "ContentBox",
  getInitialState: function() {
    return {data: []};
  },
  handleQuestionSubmit: function (question) {
    var questions = this.state.data;
    questions.push(question);
    this.setState({data: questions});
  },
  newQuestion: function(){
    React.render(
      React.createElement(QuestionForm, {onQuestionSubmit: this.handleQuestionSubmit}),
      document.getElementById('question-form')
    );
  },
  generateHTML: function() {
    console.log(this.state.data);
  },
  render: function() {
    return (React.createElement("div", {className: "question-box"}, 
      React.createElement("div", {className: "row"}, 
        React.createElement("div", {className: "col-md-1"}, 
          React.createElement("div", {className: "btn btn-default", onClick: this.newQuestion}, "添加问题")
        ), 
        React.createElement("div", {className: "col-md-1"}, 
          React.createElement("div", {className: "btn btn-default", onClick: this.generateHTML}, "生成 HTML")
        )
      ), 
      React.createElement("div", {id: "question-form"}), 
      React.createElement(Questions, {data: this.state.data})
    )
    );
  }
});

React.render(
  React.createElement(ContentBox, null),
  document.getElementById('content')
);
