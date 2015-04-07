var Question = React.createClass({
  render: function() {
    var rawMarkup = this.props.children.toString();
    return (
      <div className="question">
        <p>{ this.props.title }</p>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});
var QuestionForm = React.createClass({
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
      <form className="questionForm" onSubmit={this.handleSubmit}>
        <div class="form-group">
          <label>问题</label>
          <input type="text" className="form-control" placeholder="Title" ref="title" />
        </div>
        <div class="form-group">
          <label>答案</label>
          <input type="text" className="form-control" placeholder="Answer" ref="answer" />
        </div>
        <button type="submit" className="btn btn-default">添加</button>
      </form>
    );
  }
});
var Questions = React.createClass({
  render: function() {
    var questionNodes = this.props.data.map(function(question, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Question title={question.title} key={index}>
          {question.answer}
        </Question>
      );
    });
    return (
      <div className="questionList">
        {questionNodes}
      </div>
    );
  }
});
var ContentBox = React.createClass({
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
      <QuestionForm onQuestionSubmit={this.handleQuestionSubmit}/>,
      document.getElementById('question-form')
    );
  },
  render: function() {
    return (<div className="question-box">
      <div className="btn btn-default" onClick={this.newQuestion}>Add Question</div>
      <div id="question-form"></div>
      <Questions data={this.state.data} />
    </div>
    );
  }
});

React.render(
  <ContentBox />,
  document.getElementById('content')
);
