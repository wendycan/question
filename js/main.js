window.toLetters = function(num) {
  var mod = num % 26,
      pow = num / 26 | 0,
      out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
  return pow ? toLetters(pow) + out : out;
}
var Question = React.createClass({
  render: function() {
    return (
      <div className="question">
        <p>{ this.props.title }</p>
        <OptionsList options={this.props.options} selected={this.props.answer.index} ></OptionsList>
        <p> { this.props.answer.desc} </p>
      </div>
    );
  }
});
var OptionForm = React.createClass({
  handleOptionSubmit: function() {
    var option = React.findDOMNode(this.refs.option).value.trim();
    if (!option) return;
    this.props.onOptionSubmit({option: option});
    React.findDOMNode(this.refs.option).value = '';
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-md-11">
          <input type="text" className="form-control" placeholder="Option" ref="option" />
        </div>
        <div className="col-md-1">
          <div className="btn btn-default" id="create-option" onClick={this.handleOptionSubmit}>添加</div>
        </div>
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
      <form className="questionForm" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label>问题</label>
          <input type="text" className="form-control" placeholder="Title" ref="title" />
        </div>
        <div className="form-group">
          <label>选项</label>
          <OptionForm onOptionSubmit={this.handleOptionSubmit}/>
          <Options options={this.state.options}></Options>
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
  selectOption: function(e) {
    $(e.target).addClass('active').siblings().removeClass('active');
  },
  render: function() {
    var optionsNodes = this.props.options.map(function(option, index) {
      return (
        <p data-title={option.option} data-id={index} key={index} onClick={this.selectOption}>{toLetters(index + 1)+ '.' + option.option}</p>
      );
    }.bind(this));//to pass this to function
    return (
      <div className="optionsList">
        {optionsNodes}
      </div>
    )
  }
});
var OptionsList = React.createClass({
  render: function() {
    var optionsNodes = this.props.options.map(function(option, index) {
      if (index === this.props.selected) {
        return (
          <p key={index} className="active">{toLetters(index + 1)+ '.' + option.option}</p>
        );
      } else {
        return (
          <p key={index}>{toLetters(index + 1)+ '.' + option.option}</p>
        );        
      }
    }.bind(this));
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
        <Question title={question.title} options={question.options} answer={question.answer} key={index}>
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
