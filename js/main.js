jQuery(function($) {
  var toLetters = function(num) {
    var mod = num % 26,
        pow = num / 26 | 0,
        out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
    return pow ? toLetters(pow) + out : out;
  };
  var jsUrl = 'http://localhost:8000/js/result.js';
  var cssUrl = 'http://localhost:8000/css/result.css'
  var Question = React.createClass({
    render: function() {
      return (
        <div className="question">
          <h4>问题{this.props.index}：{ this.props.title }</h4>
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
      $('#f-option').focus();
    },
    render: function() {
      return (
        <div className="row">
          <div className="col-md-11">
            <input type="text" className="form-control" placeholder="Option" ref="option" id="f-option" />
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
        <form className="questionForm" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="f-title">问题</label>
            <input type="text" className="form-control" placeholder="Title" ref="title" id="f-title" />
          </div>
          <div className="form-group">
            <label htmlFor="f-option">选项<mark>添加后，点击选项选择正确答案。</mark></label>
            <OptionForm onOptionSubmit={this.handleOptionSubmit}/>
            <Options options={this.state.options}></Options>
          </div>
          <div className="form-group">
            <label  htmlFor="f-answer">答案</label>
            <textarea className="form-control" rows="3" placeholder="Answer" ref="answer" id="f-answer"></textarea>
          </div>
          <button type="submit" className="btn btn-default">添加</button>
          <button className="btn btn-default" onClick={this.cancelAdd}>取消</button>
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
          <Question title={question.title} options={question.options} answer={question.answer} index={index + 1} key={index}>
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
  var PageMetas = React.createClass({
    render: function() {
      return (
        <div>
          <h3>{this.props.data.title}</h3>
          <p>{this.props.data.desc}</p>
        </div>
      );
    }
  });
  var Result = React.createClass({
    render: function() {
      var questionNodes = this.props.data.map(function(question, index) {
        var _index = index;
        var optionsNodes = question.options.map(function(option, index) {
          var isTrue = index === question.answer.index? true:false;
          return (
            <li data-right={isTrue} key={index} style={{listStyle: 'none'}}>
            <input type="radio" name={_index} value={index} id={"f-option-" + _index + '-' + index}/>
            <label htmlFor={"f-option-" + _index + '-' + index}>{option}</label>
            </li>
          )
        });
        return (
          <li key={index} style={{listStyle: 'none'}} className="bm_question">
            <h4>{ question.title }</h4>
            <ol className="bm_optionList">{optionsNodes}</ol>
            <div style={{ display: 'none' }} className="bm_result">
              <div className='right' ><h3>正确</h3><p>{ question.answer.desc }</p></div>
              <div className='error' ><h3>错误</h3><p>{ question.answer.desc }</p></div>
            </div>
          </li>
        );
      });
      return (
        <div className="bm_page">
          <h3>{this.props.meta.title}</h3>
          <p>{this.props.meta.desc}</p>
          <ul className="bm_questionList" style={{padding: 0}}>
            {questionNodes}
          </ul>
        </div>
      );
    }
  });
  var PageForm = React.createClass({
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
        <form className="PageForm" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="f-p-title">标题</label>
            <input type="text" className="form-control" placeholder="Title" ref="title" id="f-p-title" defaultValue={this.props.data.title} />
          </div>
          <div className="form-group">
            <label htmlFor="f-p-desc">描述</label>
            <textarea className="form-control" placeholder="Desc" row="5" ref="desc" id="f-p-desc" defaultValue={this.props.data.desc}/>
          </div>
          <button type="submit" className="btn btn-default">更新</button>
          <button id="cancal-update-meta" className="btn btn-default" onClick={this.cancelUpdate}>取消</button>
        </form>
      );
    }
  });
  var ContentBox = React.createClass({
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
        <QuestionForm onQuestionSubmit={this.handleQuestionSubmit}/>,
        document.getElementById('question-form')
      );
    },
    editPage: function() {
      $('#question-form').empty();
      React.render(
        <PageForm onPageSubmit={this.handlePageSubmit} data={this.state.meta}/>,
        document.getElementById('meta-form')
      );
    },
    generateHTML: function() {
      if (this.state.data.length <= 0) {return};
      var text = React.renderToStaticMarkup(<Result data={this.state.data} meta={this.state.meta}/>);
      text += '<link rel="stylesheet" type="text/css" href="' + cssUrl + '">';
      text += '<script type="text/javascript" src="' + jsUrl + '"></script>';
      $('#result-text textarea').val(text);
      $('#result-text').css('display', 'block');
    },
    render: function() {
      return (<div className="question-box">
        <div className="row top-buttons">
          <div className="col-md-1">
            <div className="btn btn-default" onClick={this.newQuestion}>添加问题</div>
          </div>
          <div className="col-md-1">
            <div className="btn btn-default" onClick={this.editPage}>编辑页面</div>
          </div>
          <div className="col-md-1">
            <div className="btn btn-default" onClick={this.generateHTML}>生成 HTML</div>
          </div>
        </div>
        <div id="question-form"></div>
        <div id="meta-form"></div>
        <PageMetas data={this.state.meta} />
        <Questions data={this.state.data} />
      </div>
      );
    }
  });

  React.render(
    <ContentBox />,
    document.getElementById('content')
  );
});
