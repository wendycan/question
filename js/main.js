window.toLetters = function(num) {
  var mod = num % 26,
      pow = num / 26 | 0,
      out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
  return pow ? toLetters(pow) + out : out;
}
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
var OptionForm = React.createClass({
  handleOptionSubmit: function() {
    var option = React.findDOMNode(this.refs.option).value.trim();
    this.props.onOptionSubmit({option: option});
    React.findDOMNode(this.refs.option).value = '';
  },
  render: function() {
    return (
      <div>
        <input type="text" className="form-option" placeholder="Option" ref="option" />
        <div className="btn btn-default" id="create-option" onClick={this.handleOptionSubmit}>添加</div>
      </div>
    );
  }
});
var QuestionForm = React.createClass({
  getInitialState: function() {
    return {options: []};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var title = React.findDOMNode(this.refs.title).value.trim();
    var answer = React.findDOMNode(this.refs.answer).value.trim();
    if (!title || !answer) {
      return;
    }
    this.props.onQuestionSubmit({title: title, answer: answer});
    $('#question-form').empty();
  },
  handleOptionSubmit: function(option) {
    var options = this.state.options;
    options.push(option);
    this.setState({options: options});
  },
  addOption: function() {
    React.render(
      <OptionForm onOptionSubmit={this.handleOptionSubmit}/>,
      document.getElementById('question-options')
    );
  },
  render: function() {
    return (
      <form className="questionForm" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label>问题</label>
          <input type="text" className="form-control" placeholder="Title" ref="title" />
        </div>
        <div className="form-group">
          <label>选项</label>
          <button className="btn btn-default" onClick={this.addOption}>添加</button>
          <div id="question-options"></div>
          <Options options={this.state.options}></Options>
        </div>

        <div className="form-group">
          <label className="checkbox-inline">
            <input type="checkbox" id="inlineCheckbox1" value="option1" /> 1
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" id="inlineCheckbox1" value="option1" /> 2
          </label><label className="checkbox-inline">
            <input type="checkbox" id="inlineCheckbox1" value="option1" /> 3
          </label>
        </div>
        <div className="form-group">
          <label>答案</label>
          <textarea className="form-control" rows="3" placeholder="Answer" ref="answer"></textarea>
        </div>
        <button type="submit" className="btn btn-default">添加</button>
      </form>
    );
  }
});
var Options = React.createClass({
  render: function() {
    var optionsNodes = this.props.options.map(function(option, index) {
      console.log(index);
      return (
        <div title={option.title} key={index}>
          {toLetters(index + 1)} {option.option}
        </div>
      );
    });
    return (
      <div className="optionsList">
        {optionsNodes}
      </div>
    )
  }
});
var Questions = React.createClass({
  render: function() {
    var questionNodes = this.props.data.map(function(question, index) {
      return (
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
  generateHTML: function() {
    console.log(this.state.data);
  },
  render: function() {
    return (<div className="question-box">
      <div className="row">
        <div className="col-md-1">
          <div className="btn btn-default" onClick={this.newQuestion}>添加问题</div>
        </div>
        <div className="col-md-1">
          <div className="btn btn-default" onClick={this.generateHTML}>生成 HTML</div>
        </div>
      </div>
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
