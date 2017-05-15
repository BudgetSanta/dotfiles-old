(function() {
  var TableHeaderView, TodoEmptyView, TodoView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  View = require('atom-space-pen-views').View;

  TableHeaderView = (function(superClass) {
    extend(TableHeaderView, superClass);

    function TableHeaderView() {
      return TableHeaderView.__super__.constructor.apply(this, arguments);
    }

    TableHeaderView.content = function(showInTable, arg) {
      var sortAsc, sortBy;
      if (showInTable == null) {
        showInTable = [];
      }
      sortBy = arg.sortBy, sortAsc = arg.sortAsc;
      return this.tr((function(_this) {
        return function() {
          var i, item, len, results;
          results = [];
          for (i = 0, len = showInTable.length; i < len; i++) {
            item = showInTable[i];
            results.push(_this.th(item, function() {
              if (item === sortBy && sortAsc) {
                _this.div({
                  "class": 'sort-asc icon-triangle-down active'
                });
              } else {
                _this.div({
                  "class": 'sort-asc icon-triangle-down'
                });
              }
              if (item === sortBy && !sortAsc) {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up active'
                });
              } else {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up'
                });
              }
            }));
          }
          return results;
        };
      })(this));
    };

    return TableHeaderView;

  })(View);

  TodoView = (function(superClass) {
    extend(TodoView, superClass);

    function TodoView() {
      this.openPath = bind(this.openPath, this);
      return TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.content = function(showInTable, todo) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          var i, item, len, results;
          results = [];
          for (i = 0, len = showInTable.length; i < len; i++) {
            item = showInTable[i];
            results.push(_this.td(function() {
              switch (item) {
                case 'All':
                  return _this.span(todo.all);
                case 'Text':
                  return _this.span(todo.text);
                case 'Type':
                  return _this.i(todo.type);
                case 'Range':
                  return _this.i(todo.range);
                case 'Line':
                  return _this.i(todo.line);
                case 'Regex':
                  return _this.code(todo.regex);
                case 'Path':
                  return _this.a(todo.path);
                case 'File':
                  return _this.a(todo.file);
                case 'Tags':
                  return _this.i(todo.tags);
                case 'Id':
                  return _this.i(todo.id);
                case 'Project':
                  return _this.a(todo.project);
              }
            }));
          }
          return results;
        };
      })(this));
    };

    TodoView.prototype.initialize = function(showInTable, todo1) {
      this.todo = todo1;
      return this.handleEvents();
    };

    TodoView.prototype.destroy = function() {
      return this.detach();
    };

    TodoView.prototype.handleEvents = function() {
      return this.on('click', 'td', this.openPath);
    };

    TodoView.prototype.openPath = function() {
      var position;
      if (!(this.todo && this.todo.loc)) {
        return;
      }
      position = [this.todo.position[0][0], this.todo.position[0][1]];
      return atom.workspace.open(this.todo.loc, {
        split: this.getSplitDirection(),
        pending: atom.config.get('core.allowPendingPaneItems') || false
      }).then(function() {
        var textEditor;
        if (textEditor = atom.workspace.getActiveTextEditor()) {
          textEditor.setCursorBufferPosition(position, {
            autoscroll: false
          });
          return textEditor.scrollToCursorPosition({
            center: true
          });
        }
      });
    };

    TodoView.prototype.getSplitDirection = function() {
      switch (atom.config.get('todo-show.openListInDirection')) {
        case 'up':
          return 'down';
        case 'down':
          return 'up';
        case 'left':
          return 'right';
        default:
          return 'left';
      }
    };

    return TodoView;

  })(View);

  TodoEmptyView = (function(superClass) {
    extend(TodoEmptyView, superClass);

    function TodoEmptyView() {
      return TodoEmptyView.__super__.constructor.apply(this, arguments);
    }

    TodoEmptyView.content = function(showInTable) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          return _this.td({
            colspan: showInTable.length
          }, function() {
            return _this.p("No results...");
          });
        };
      })(this));
    };

    return TodoEmptyView;

  })(View);

  module.exports = {
    TableHeaderView: TableHeaderView,
    TodoView: TodoView,
    TodoEmptyView: TodoEmptyView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLWl0ZW0tdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDhDQUFBO0lBQUE7Ozs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUjs7RUFFSDs7Ozs7OztJQUNKLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxXQUFELEVBQW1CLEdBQW5CO0FBQ1IsVUFBQTs7UUFEUyxjQUFjOztNQUFLLHFCQUFRO2FBQ3BDLElBQUMsQ0FBQSxFQUFELENBQUksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ0YsY0FBQTtBQUFBO2VBQUEsNkNBQUE7O3lCQUNFLEtBQUMsQ0FBQSxFQUFELENBQUksSUFBSixFQUFVLFNBQUE7Y0FDUixJQUFHLElBQUEsS0FBUSxNQUFSLElBQW1CLE9BQXRCO2dCQUNFLEtBQUMsQ0FBQSxHQUFELENBQUs7a0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxvQ0FBUDtpQkFBTCxFQURGO2VBQUEsTUFBQTtnQkFHRSxLQUFDLENBQUEsR0FBRCxDQUFLO2tCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sNkJBQVA7aUJBQUwsRUFIRjs7Y0FJQSxJQUFHLElBQUEsS0FBUSxNQUFSLElBQW1CLENBQUksT0FBMUI7dUJBQ0UsS0FBQyxDQUFBLEdBQUQsQ0FBSztrQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLG1DQUFQO2lCQUFMLEVBREY7ZUFBQSxNQUFBO3VCQUdFLEtBQUMsQ0FBQSxHQUFELENBQUs7a0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyw0QkFBUDtpQkFBTCxFQUhGOztZQUxRLENBQVY7QUFERjs7UUFERTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSjtJQURROzs7O0tBRGtCOztFQWN4Qjs7Ozs7Ozs7SUFDSixRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsV0FBRCxFQUFtQixJQUFuQjs7UUFBQyxjQUFjOzthQUN2QixJQUFDLENBQUEsRUFBRCxDQUFJLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUNGLGNBQUE7QUFBQTtlQUFBLDZDQUFBOzt5QkFDRSxLQUFDLENBQUEsRUFBRCxDQUFJLFNBQUE7QUFDRixzQkFBTyxJQUFQO0FBQUEscUJBQ08sS0FEUDt5QkFDb0IsS0FBQyxDQUFBLElBQUQsQ0FBTSxJQUFJLENBQUMsR0FBWDtBQURwQixxQkFFTyxNQUZQO3lCQUVvQixLQUFDLENBQUEsSUFBRCxDQUFNLElBQUksQ0FBQyxJQUFYO0FBRnBCLHFCQUdPLE1BSFA7eUJBR29CLEtBQUMsQ0FBQSxDQUFELENBQUcsSUFBSSxDQUFDLElBQVI7QUFIcEIscUJBSU8sT0FKUDt5QkFJb0IsS0FBQyxDQUFBLENBQUQsQ0FBRyxJQUFJLENBQUMsS0FBUjtBQUpwQixxQkFLTyxNQUxQO3lCQUtvQixLQUFDLENBQUEsQ0FBRCxDQUFHLElBQUksQ0FBQyxJQUFSO0FBTHBCLHFCQU1PLE9BTlA7eUJBTW9CLEtBQUMsQ0FBQSxJQUFELENBQU0sSUFBSSxDQUFDLEtBQVg7QUFOcEIscUJBT08sTUFQUDt5QkFPb0IsS0FBQyxDQUFBLENBQUQsQ0FBRyxJQUFJLENBQUMsSUFBUjtBQVBwQixxQkFRTyxNQVJQO3lCQVFvQixLQUFDLENBQUEsQ0FBRCxDQUFHLElBQUksQ0FBQyxJQUFSO0FBUnBCLHFCQVNPLE1BVFA7eUJBU29CLEtBQUMsQ0FBQSxDQUFELENBQUcsSUFBSSxDQUFDLElBQVI7QUFUcEIscUJBVU8sSUFWUDt5QkFVb0IsS0FBQyxDQUFBLENBQUQsQ0FBRyxJQUFJLENBQUMsRUFBUjtBQVZwQixxQkFXTyxTQVhQO3lCQVdzQixLQUFDLENBQUEsQ0FBRCxDQUFHLElBQUksQ0FBQyxPQUFSO0FBWHRCO1lBREUsQ0FBSjtBQURGOztRQURFO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFKO0lBRFE7O3VCQWlCVixVQUFBLEdBQVksU0FBQyxXQUFELEVBQWMsS0FBZDtNQUFjLElBQUMsQ0FBQSxPQUFEO2FBQ3hCLElBQUMsQ0FBQSxZQUFELENBQUE7SUFEVTs7dUJBR1osT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsTUFBRCxDQUFBO0lBRE87O3VCQUdULFlBQUEsR0FBYyxTQUFBO2FBQ1osSUFBQyxDQUFBLEVBQUQsQ0FBSSxPQUFKLEVBQWEsSUFBYixFQUFtQixJQUFDLENBQUEsUUFBcEI7SUFEWTs7dUJBR2QsUUFBQSxHQUFVLFNBQUE7QUFDUixVQUFBO01BQUEsSUFBQSxDQUFBLENBQWMsSUFBQyxDQUFBLElBQUQsSUFBVSxJQUFDLENBQUEsSUFBSSxDQUFDLEdBQTlCLENBQUE7QUFBQSxlQUFBOztNQUNBLFFBQUEsR0FBVyxDQUFDLElBQUMsQ0FBQSxJQUFJLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBbkIsRUFBdUIsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUF6QzthQUVYLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFDLENBQUEsSUFBSSxDQUFDLEdBQTFCLEVBQStCO1FBQzdCLEtBQUEsRUFBTyxJQUFDLENBQUEsaUJBQUQsQ0FBQSxDQURzQjtRQUU3QixPQUFBLEVBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUFBLElBQWlELEtBRjdCO09BQS9CLENBR0UsQ0FBQyxJQUhILENBR1EsU0FBQTtBQUVOLFlBQUE7UUFBQSxJQUFHLFVBQUEsR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBaEI7VUFDRSxVQUFVLENBQUMsdUJBQVgsQ0FBbUMsUUFBbkMsRUFBNkM7WUFBQSxVQUFBLEVBQVksS0FBWjtXQUE3QztpQkFDQSxVQUFVLENBQUMsc0JBQVgsQ0FBa0M7WUFBQSxNQUFBLEVBQVEsSUFBUjtXQUFsQyxFQUZGOztNQUZNLENBSFI7SUFKUTs7dUJBYVYsaUJBQUEsR0FBbUIsU0FBQTtBQUNqQixjQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEIsQ0FBUDtBQUFBLGFBQ08sSUFEUDtpQkFDaUI7QUFEakIsYUFFTyxNQUZQO2lCQUVtQjtBQUZuQixhQUdPLE1BSFA7aUJBR21CO0FBSG5CO2lCQUlPO0FBSlA7SUFEaUI7Ozs7S0F4Q0U7O0VBK0NqQjs7Ozs7OztJQUNKLGFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxXQUFEOztRQUFDLGNBQWM7O2FBQ3ZCLElBQUMsQ0FBQSxFQUFELENBQUksQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNGLEtBQUMsQ0FBQSxFQUFELENBQUk7WUFBQSxPQUFBLEVBQVMsV0FBVyxDQUFDLE1BQXJCO1dBQUosRUFBaUMsU0FBQTttQkFDL0IsS0FBQyxDQUFBLENBQUQsQ0FBRyxlQUFIO1VBRCtCLENBQWpDO1FBREU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUo7SUFEUTs7OztLQURnQjs7RUFNNUIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFBQyxpQkFBQSxlQUFEO0lBQWtCLFVBQUEsUUFBbEI7SUFBNEIsZUFBQSxhQUE1Qjs7QUFyRWpCIiwic291cmNlc0NvbnRlbnQiOlsie1ZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmNsYXNzIFRhYmxlSGVhZGVyVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IChzaG93SW5UYWJsZSA9IFtdLCB7c29ydEJ5LCBzb3J0QXNjfSkgLT5cbiAgICBAdHIgPT5cbiAgICAgIGZvciBpdGVtIGluIHNob3dJblRhYmxlXG4gICAgICAgIEB0aCBpdGVtLCA9PlxuICAgICAgICAgIGlmIGl0ZW0gaXMgc29ydEJ5IGFuZCBzb3J0QXNjXG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAnc29ydC1hc2MgaWNvbi10cmlhbmdsZS1kb3duIGFjdGl2ZSdcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAnc29ydC1hc2MgaWNvbi10cmlhbmdsZS1kb3duJ1xuICAgICAgICAgIGlmIGl0ZW0gaXMgc29ydEJ5IGFuZCBub3Qgc29ydEFzY1xuICAgICAgICAgICAgQGRpdiBjbGFzczogJ3NvcnQtZGVzYyBpY29uLXRyaWFuZ2xlLXVwIGFjdGl2ZSdcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAnc29ydC1kZXNjIGljb24tdHJpYW5nbGUtdXAnXG5cbmNsYXNzIFRvZG9WaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogKHNob3dJblRhYmxlID0gW10sIHRvZG8pIC0+XG4gICAgQHRyID0+XG4gICAgICBmb3IgaXRlbSBpbiBzaG93SW5UYWJsZVxuICAgICAgICBAdGQgPT5cbiAgICAgICAgICBzd2l0Y2ggaXRlbVxuICAgICAgICAgICAgd2hlbiAnQWxsJyAgIHRoZW4gQHNwYW4gdG9kby5hbGxcbiAgICAgICAgICAgIHdoZW4gJ1RleHQnICB0aGVuIEBzcGFuIHRvZG8udGV4dFxuICAgICAgICAgICAgd2hlbiAnVHlwZScgIHRoZW4gQGkgdG9kby50eXBlXG4gICAgICAgICAgICB3aGVuICdSYW5nZScgdGhlbiBAaSB0b2RvLnJhbmdlXG4gICAgICAgICAgICB3aGVuICdMaW5lJyAgdGhlbiBAaSB0b2RvLmxpbmVcbiAgICAgICAgICAgIHdoZW4gJ1JlZ2V4JyB0aGVuIEBjb2RlIHRvZG8ucmVnZXhcbiAgICAgICAgICAgIHdoZW4gJ1BhdGgnICB0aGVuIEBhIHRvZG8ucGF0aFxuICAgICAgICAgICAgd2hlbiAnRmlsZScgIHRoZW4gQGEgdG9kby5maWxlXG4gICAgICAgICAgICB3aGVuICdUYWdzJyAgdGhlbiBAaSB0b2RvLnRhZ3NcbiAgICAgICAgICAgIHdoZW4gJ0lkJyAgICB0aGVuIEBpIHRvZG8uaWRcbiAgICAgICAgICAgIHdoZW4gJ1Byb2plY3QnIHRoZW4gQGEgdG9kby5wcm9qZWN0XG5cbiAgaW5pdGlhbGl6ZTogKHNob3dJblRhYmxlLCBAdG9kbykgLT5cbiAgICBAaGFuZGxlRXZlbnRzKClcblxuICBkZXN0cm95OiAtPlxuICAgIEBkZXRhY2goKVxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICBAb24gJ2NsaWNrJywgJ3RkJywgQG9wZW5QYXRoXG5cbiAgb3BlblBhdGg6ID0+XG4gICAgcmV0dXJuIHVubGVzcyBAdG9kbyBhbmQgQHRvZG8ubG9jXG4gICAgcG9zaXRpb24gPSBbQHRvZG8ucG9zaXRpb25bMF1bMF0sIEB0b2RvLnBvc2l0aW9uWzBdWzFdXVxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbihAdG9kby5sb2MsIHtcbiAgICAgIHNwbGl0OiBAZ2V0U3BsaXREaXJlY3Rpb24oKVxuICAgICAgcGVuZGluZzogYXRvbS5jb25maWcuZ2V0KCdjb3JlLmFsbG93UGVuZGluZ1BhbmVJdGVtcycpIG9yIGZhbHNlXG4gICAgfSkudGhlbiAtPlxuICAgICAgIyBTZXR0aW5nIGluaXRpYWxDb2x1bW4vTGluZSBkb2VzIG5vdCBhbHdheXMgY2VudGVyIHZpZXdcbiAgICAgIGlmIHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgdGV4dEVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihwb3NpdGlvbiwgYXV0b3Njcm9sbDogZmFsc2UpXG4gICAgICAgIHRleHRFZGl0b3Iuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbihjZW50ZXI6IHRydWUpXG5cbiAgZ2V0U3BsaXREaXJlY3Rpb246IC0+XG4gICAgc3dpdGNoIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93Lm9wZW5MaXN0SW5EaXJlY3Rpb24nKVxuICAgICAgd2hlbiAndXAnIHRoZW4gJ2Rvd24nXG4gICAgICB3aGVuICdkb3duJyB0aGVuICd1cCdcbiAgICAgIHdoZW4gJ2xlZnQnIHRoZW4gJ3JpZ2h0J1xuICAgICAgZWxzZSAnbGVmdCdcblxuY2xhc3MgVG9kb0VtcHR5VmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IChzaG93SW5UYWJsZSA9IFtdKSAtPlxuICAgIEB0ciA9PlxuICAgICAgQHRkIGNvbHNwYW46IHNob3dJblRhYmxlLmxlbmd0aCwgPT5cbiAgICAgICAgQHAgXCJObyByZXN1bHRzLi4uXCJcblxubW9kdWxlLmV4cG9ydHMgPSB7VGFibGVIZWFkZXJWaWV3LCBUb2RvVmlldywgVG9kb0VtcHR5Vmlld31cbiJdfQ==
