var Question = React.createClass({displayName: "Question",
  render: function() {
    var rawMarkup = this.props.children.toString();
    return (
      React.createElement("div", {className: "question"}, 
        React.createElement("p", null,  this.props.title), 
        React.createElement("span", {dangerouslySetInnerHTML: {__html: rawMarkup}})
      )
    );
  }
});
var QuestionForm = React.createClass({displayName: "QuestionForm",
  handleSubmit: function(e) {
    e.preventDefault();
    var title = React.findDOMNode(this.refs.title).value.trim();
    var answer = React.findDOMNode(this.refs.answer).value.trim();
    if (!title || !answer) {
      return;
    }
    this.props.onQuestionSubmit({title: title, answer: answer});
    React.findDOMNode(this.refs.title).value = '';
    React.findDOMNode(this.refs.answer).value = '';
    $('#question-form').empty();
  },
  render: function() {
    return (
      React.createElement("form", {className: "questionForm", onSubmit: this.handleSubmit}, 
        React.createElement("div", {class: "form-group"}, 
          React.createElement("label", null, "问题"), 
          React.createElement("input", {type: "text", className: "form-control", placeholder: "Title", ref: "title"})
        ), 
        React.createElement("div", {class: "form-group"}, 
          React.createElement("label", null, "答案"), 
          React.createElement("input", {type: "text", className: "form-control", placeholder: "Answer", ref: "answer"})
        ), 
        React.createElement("button", {type: "submit", className: "btn btn-default"}, "添加")
      )
    );
  }
});
var Questions = React.createClass({displayName: "Questions",
  render: function() {
    var questionNodes = this.props.data.map(function(question, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        React.createElement(Question, {title: question.title, key: index}, 
          question.answer
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
    console.log(this.state.data);
  },
  newQuestion: function(){
    React.render(
      React.createElement(QuestionForm, {onQuestionSubmit: this.handleQuestionSubmit}),
      document.getElementById('question-form')
    );
  },
  render: function() {
    return (React.createElement("div", {className: "question-box"}, 
      React.createElement("div", {className: "btn btn-default", onClick: this.newQuestion}, "Add Question"), 
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
