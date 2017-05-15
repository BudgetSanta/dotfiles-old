(function() {
  var CompositeDisposable, ScrollView, ShowTodoView, TextBuffer, TextEditorView, TodoOptions, TodoTable, deprecatedTextEditor, fs, path, ref, ref1,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, TextBuffer = ref.TextBuffer;

  ref1 = require('atom-space-pen-views'), ScrollView = ref1.ScrollView, TextEditorView = ref1.TextEditorView;

  path = require('path');

  fs = require('fs-plus');

  TodoTable = require('./todo-table-view');

  TodoOptions = require('./todo-options-view');

  deprecatedTextEditor = function(params) {
    var TextEditor;
    if (atom.workspace.buildTextEditor != null) {
      return atom.workspace.buildTextEditor(params);
    } else {
      TextEditor = require('atom').TextEditor;
      return new TextEditor(params);
    }
  };

  module.exports = ShowTodoView = (function(superClass) {
    extend(ShowTodoView, superClass);

    ShowTodoView.content = function(collection, filterBuffer) {
      var filterEditor;
      filterEditor = deprecatedTextEditor({
        mini: true,
        tabLength: 2,
        softTabs: true,
        softWrapped: false,
        buffer: filterBuffer,
        placeholderText: 'Search Todos'
      });
      return this.div({
        "class": 'show-todo-preview',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'input-block'
          }, function() {
            _this.div({
              "class": 'input-block-item input-block-item--flex'
            }, function() {
              return _this.subview('filterEditorView', new TextEditorView({
                editor: filterEditor
              }));
            });
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.div({
                "class": 'btn-group'
              }, function() {
                _this.button({
                  outlet: 'scopeButton',
                  "class": 'btn'
                });
                _this.button({
                  outlet: 'optionsButton',
                  "class": 'btn icon-gear'
                });
                _this.button({
                  outlet: 'saveAsButton',
                  "class": 'btn icon-cloud-download'
                });
                return _this.button({
                  outlet: 'refreshButton',
                  "class": 'btn icon-sync'
                });
              });
            });
          });
          _this.div({
            "class": 'input-block todo-info-block'
          }, function() {
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.span({
                outlet: 'todoInfo'
              });
            });
          });
          _this.div({
            outlet: 'optionsView'
          });
          _this.div({
            outlet: 'todoLoading',
            "class": 'todo-loading'
          }, function() {
            _this.div({
              "class": 'markdown-spinner'
            });
            return _this.h5({
              outlet: 'searchCount',
              "class": 'text-center'
            }, "Loading Todos...");
          });
          return _this.subview('todoTable', new TodoTable(collection));
        };
      })(this));
    };

    function ShowTodoView(collection1, uri) {
      this.collection = collection1;
      this.uri = uri;
      this.toggleOptions = bind(this.toggleOptions, this);
      this.setScopeButtonState = bind(this.setScopeButtonState, this);
      this.toggleSearchScope = bind(this.toggleSearchScope, this);
      this.saveAs = bind(this.saveAs, this);
      this.stopLoading = bind(this.stopLoading, this);
      this.startLoading = bind(this.startLoading, this);
      ShowTodoView.__super__.constructor.call(this, this.collection, this.filterBuffer = new TextBuffer);
    }

    ShowTodoView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      this.collection.search();
      this.setScopeButtonState(this.collection.getSearchScope());
      this.notificationOptions = {
        detail: 'Atom todo-show package',
        dismissable: true,
        icon: this.getIconName()
      };
      this.checkDeprecation();
      this.disposables.add(atom.tooltips.add(this.scopeButton, {
        title: "What to Search"
      }));
      this.disposables.add(atom.tooltips.add(this.optionsButton, {
        title: "Show Todo Options"
      }));
      this.disposables.add(atom.tooltips.add(this.saveAsButton, {
        title: "Save Todos to File"
      }));
      return this.disposables.add(atom.tooltips.add(this.refreshButton, {
        title: "Refresh Todos"
      }));
    };

    ShowTodoView.prototype.handleEvents = function() {
      var pane;
      this.disposables.add(atom.commands.add(this.element, {
        'core:save-as': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.saveAs();
          };
        })(this),
        'core:refresh': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.collection.search();
          };
        })(this)
      }));
      pane = atom.workspace.getActivePane();
      if (atom.config.get('todo-show.rememberViewSize')) {
        this.restorePaneFlex(pane);
      }
      this.disposables.add(pane.observeFlexScale((function(_this) {
        return function(flexScale) {
          return _this.savePaneFlex(flexScale);
        };
      })(this)));
      this.disposables.add(this.collection.onDidStartSearch(this.startLoading));
      this.disposables.add(this.collection.onDidFinishSearch(this.stopLoading));
      this.disposables.add(this.collection.onDidFailSearch((function(_this) {
        return function(err) {
          _this.searchCount.text("Search Failed");
          if (err) {
            console.error(err);
          }
          if (err) {
            return _this.showError(err);
          }
        };
      })(this)));
      this.disposables.add(this.collection.onDidChangeSearchScope((function(_this) {
        return function(scope) {
          _this.setScopeButtonState(scope);
          return _this.collection.search();
        };
      })(this)));
      this.disposables.add(this.collection.onDidSearchPaths((function(_this) {
        return function(nPaths) {
          return _this.searchCount.text(nPaths + " paths searched...");
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          if (_this.collection.setActiveProject(item != null ? typeof item.getPath === "function" ? item.getPath() : void 0 : void 0) || ((item != null ? item.constructor.name : void 0) === 'TextEditor' && _this.collection.scope === 'active')) {
            return _this.collection.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidAddTextEditor((function(_this) {
        return function(arg) {
          var textEditor;
          textEditor = arg.textEditor;
          if (_this.collection.scope === 'open') {
            return _this.collection.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(arg) {
          var item;
          item = arg.item;
          if (_this.collection.scope === 'open') {
            return _this.collection.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.disposables.add(editor.onDidSave(function() {
            return _this.collection.search();
          }));
        };
      })(this)));
      this.filterEditorView.getModel().onDidStopChanging((function(_this) {
        return function() {
          if (_this.firstTimeFilter) {
            _this.filter();
          }
          return _this.firstTimeFilter = true;
        };
      })(this));
      this.scopeButton.on('click', this.toggleSearchScope);
      this.optionsButton.on('click', this.toggleOptions);
      this.saveAsButton.on('click', this.saveAs);
      return this.refreshButton.on('click', (function(_this) {
        return function() {
          return _this.collection.search();
        };
      })(this));
    };

    ShowTodoView.prototype.destroy = function() {
      this.collection.cancelSearch();
      this.disposables.dispose();
      return this.detach();
    };

    ShowTodoView.prototype.savePaneFlex = function(flex) {
      return localStorage.setItem('todo-show.flex', flex);
    };

    ShowTodoView.prototype.restorePaneFlex = function(pane) {
      var flex;
      flex = localStorage.getItem('todo-show.flex');
      if (flex) {
        return pane.setFlexScale(parseFloat(flex));
      }
    };

    ShowTodoView.prototype.getTitle = function() {
      return "Todo Show";
    };

    ShowTodoView.prototype.getIconName = function() {
      return "checklist";
    };

    ShowTodoView.prototype.getURI = function() {
      return this.uri;
    };

    ShowTodoView.prototype.getProjectName = function() {
      return this.collection.getActiveProjectName();
    };

    ShowTodoView.prototype.getProjectPath = function() {
      return this.collection.getActiveProject();
    };

    ShowTodoView.prototype.getTodos = function() {
      return this.collection.getTodos();
    };

    ShowTodoView.prototype.getTodosCount = function() {
      return this.collection.getTodosCount();
    };

    ShowTodoView.prototype.isSearching = function() {
      return this.collection.getState();
    };

    ShowTodoView.prototype.startLoading = function() {
      this.todoLoading.show();
      return this.updateInfo();
    };

    ShowTodoView.prototype.stopLoading = function() {
      this.todoLoading.hide();
      return this.updateInfo();
    };

    ShowTodoView.prototype.updateInfo = function() {
      return this.todoInfo.html((this.getInfoText()) + " " + (this.getScopeText()));
    };

    ShowTodoView.prototype.getInfoText = function() {
      var count;
      if (this.isSearching()) {
        return "Found ... results";
      }
      switch (count = this.getTodosCount()) {
        case 1:
          return "Found " + count + " result";
        default:
          return "Found " + count + " results";
      }
    };

    ShowTodoView.prototype.getScopeText = function() {
      switch (this.collection.scope) {
        case 'active':
          return "in active file";
        case 'open':
          return "in open files";
        case 'project':
          return "in project <code>" + (this.getProjectName()) + "</code>";
        default:
          return "in workspace";
      }
    };

    ShowTodoView.prototype.showError = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addError(message.toString(), this.notificationOptions);
    };

    ShowTodoView.prototype.showWarning = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addWarning(message.toString(), this.notificationOptions);
    };

    ShowTodoView.prototype.saveAs = function() {
      var filePath, outputFilePath, projectPath;
      if (this.isSearching()) {
        return;
      }
      filePath = (this.getProjectName() || 'todos') + ".md";
      if (projectPath = this.getProjectPath()) {
        filePath = path.join(projectPath, filePath);
      }
      if (outputFilePath = atom.showSaveDialogSync(filePath.toLowerCase())) {
        fs.writeFileSync(outputFilePath, this.collection.getMarkdown());
        return atom.workspace.open(outputFilePath);
      }
    };

    ShowTodoView.prototype.toggleSearchScope = function() {
      var scope;
      scope = this.collection.toggleSearchScope();
      return this.setScopeButtonState(scope);
    };

    ShowTodoView.prototype.setScopeButtonState = function(state) {
      switch (state) {
        case 'workspace':
          return this.scopeButton.text('Workspace');
        case 'project':
          return this.scopeButton.text('Project');
        case 'open':
          return this.scopeButton.text('Open Files');
        case 'active':
          return this.scopeButton.text('Active File');
      }
    };

    ShowTodoView.prototype.toggleOptions = function() {
      if (!this.todoOptions) {
        this.optionsView.hide();
        this.todoOptions = new TodoOptions(this.collection);
        this.optionsView.html(this.todoOptions);
      }
      return this.optionsView.slideToggle();
    };

    ShowTodoView.prototype.filter = function() {
      return this.collection.filterTodos(this.filterBuffer.getText());
    };

    ShowTodoView.prototype.checkDeprecation = function() {
      if (atom.config.get('todo-show.findTheseRegexes')) {
        return this.showWarning('Deprecation Warning:\n\n`findTheseRegexes` config is deprecated, please use `findTheseTodos` and `findUsingRegex` for custom behaviour.\nSee https://github.com/mrodalgaard/atom-todo-show#config for more information.');
      }
    };

    return ShowTodoView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw0SUFBQTtJQUFBOzs7O0VBQUEsTUFBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFDdEIsT0FBK0IsT0FBQSxDQUFRLHNCQUFSLENBQS9CLEVBQUMsNEJBQUQsRUFBYTs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUVMLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVI7O0VBQ1osV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUjs7RUFFZCxvQkFBQSxHQUF1QixTQUFDLE1BQUQ7QUFDckIsUUFBQTtJQUFBLElBQUcsc0NBQUg7YUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBK0IsTUFBL0IsRUFERjtLQUFBLE1BQUE7TUFHRSxVQUFBLEdBQWEsT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDO2FBQ3pCLElBQUEsVUFBQSxDQUFXLE1BQVgsRUFKTjs7RUFEcUI7O0VBT3ZCLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNKLFlBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxVQUFELEVBQWEsWUFBYjtBQUNSLFVBQUE7TUFBQSxZQUFBLEdBQWUsb0JBQUEsQ0FDYjtRQUFBLElBQUEsRUFBTSxJQUFOO1FBQ0EsU0FBQSxFQUFXLENBRFg7UUFFQSxRQUFBLEVBQVUsSUFGVjtRQUdBLFdBQUEsRUFBYSxLQUhiO1FBSUEsTUFBQSxFQUFRLFlBSlI7UUFLQSxlQUFBLEVBQWlCLGNBTGpCO09BRGE7YUFTZixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxtQkFBUDtRQUE0QixRQUFBLEVBQVUsQ0FBQyxDQUF2QztP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QUFsQjtBQUR4QixhQUVPLFNBRlA7aUJBRXNCLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixTQUFsQjtBQUZ0QixhQUdPLE1BSFA7aUJBR21CLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixZQUFsQjtBQUhuQixhQUlPLFFBSlA7aUJBSXFCLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixhQUFsQjtBQUpyQjtJQURtQjs7MkJBT3JCLGFBQUEsR0FBZSxTQUFBO01BQ2IsSUFBQSxDQUFPLElBQUMsQ0FBQSxXQUFSO1FBQ0UsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQUE7UUFDQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLFdBQUEsQ0FBWSxJQUFDLENBQUEsVUFBYjtRQUNuQixJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsSUFBQyxDQUFBLFdBQW5CLEVBSEY7O2FBSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxXQUFiLENBQUE7SUFMYTs7MkJBT2YsTUFBQSxHQUFRLFNBQUE7YUFDTixJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBd0IsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsQ0FBeEI7SUFETTs7MkJBR1IsZ0JBQUEsR0FBa0IsU0FBQTtNQUNoQixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsQ0FBSDtlQUNFLElBQUMsQ0FBQSxXQUFELENBQWEseU5BQWIsRUFERjs7SUFEZ0I7Ozs7S0FwTU87QUFoQjNCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGUsIFRleHRCdWZmZXJ9ID0gcmVxdWlyZSAnYXRvbSdcbntTY3JvbGxWaWV3LCBUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuXG5Ub2RvVGFibGUgPSByZXF1aXJlICcuL3RvZG8tdGFibGUtdmlldydcblRvZG9PcHRpb25zID0gcmVxdWlyZSAnLi90b2RvLW9wdGlvbnMtdmlldydcblxuZGVwcmVjYXRlZFRleHRFZGl0b3IgPSAocGFyYW1zKSAtPlxuICBpZiBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3I/XG4gICAgYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKHBhcmFtcylcbiAgZWxzZVxuICAgIFRleHRFZGl0b3IgPSByZXF1aXJlKCdhdG9tJykuVGV4dEVkaXRvclxuICAgIG5ldyBUZXh0RWRpdG9yKHBhcmFtcylcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU2hvd1RvZG9WaWV3IGV4dGVuZHMgU2Nyb2xsVmlld1xuICBAY29udGVudDogKGNvbGxlY3Rpb24sIGZpbHRlckJ1ZmZlcikgLT5cbiAgICBmaWx0ZXJFZGl0b3IgPSBkZXByZWNhdGVkVGV4dEVkaXRvcihcbiAgICAgIG1pbmk6IHRydWVcbiAgICAgIHRhYkxlbmd0aDogMlxuICAgICAgc29mdFRhYnM6IHRydWVcbiAgICAgIHNvZnRXcmFwcGVkOiBmYWxzZVxuICAgICAgYnVmZmVyOiBmaWx0ZXJCdWZmZXJcbiAgICAgIHBsYWNlaG9sZGVyVGV4dDogJ1NlYXJjaCBUb2RvcydcbiAgICApXG5cbiAgICBAZGl2IGNsYXNzOiAnc2hvdy10b2RvLXByZXZpZXcnLCB0YWJpbmRleDogLTEsID0+XG4gICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2snLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2staXRlbSBpbnB1dC1ibG9jay1pdGVtLS1mbGV4JywgPT5cbiAgICAgICAgICBAc3VidmlldyAnZmlsdGVyRWRpdG9yVmlldycsIG5ldyBUZXh0RWRpdG9yVmlldyhlZGl0b3I6IGZpbHRlckVkaXRvcilcbiAgICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrLWl0ZW0nLCA9PlxuICAgICAgICAgIEBkaXYgY2xhc3M6ICdidG4tZ3JvdXAnLCA9PlxuICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdzY29wZUJ1dHRvbicsIGNsYXNzOiAnYnRuJ1xuICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdvcHRpb25zQnV0dG9uJywgY2xhc3M6ICdidG4gaWNvbi1nZWFyJ1xuICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdzYXZlQXNCdXR0b24nLCBjbGFzczogJ2J0biBpY29uLWNsb3VkLWRvd25sb2FkJ1xuICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdyZWZyZXNoQnV0dG9uJywgY2xhc3M6ICdidG4gaWNvbi1zeW5jJ1xuXG4gICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2sgdG9kby1pbmZvLWJsb2NrJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrLWl0ZW0nLCA9PlxuICAgICAgICAgIEBzcGFuIG91dGxldDogJ3RvZG9JbmZvJ1xuXG4gICAgICBAZGl2IG91dGxldDogJ29wdGlvbnNWaWV3J1xuXG4gICAgICBAZGl2IG91dGxldDogJ3RvZG9Mb2FkaW5nJywgY2xhc3M6ICd0b2RvLWxvYWRpbmcnLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAnbWFya2Rvd24tc3Bpbm5lcidcbiAgICAgICAgQGg1IG91dGxldDogJ3NlYXJjaENvdW50JywgY2xhc3M6ICd0ZXh0LWNlbnRlcicsIFwiTG9hZGluZyBUb2Rvcy4uLlwiXG5cbiAgICAgIEBzdWJ2aWV3ICd0b2RvVGFibGUnLCBuZXcgVG9kb1RhYmxlKGNvbGxlY3Rpb24pXG5cbiAgY29uc3RydWN0b3I6IChAY29sbGVjdGlvbiwgQHVyaSkgLT5cbiAgICBzdXBlciBAY29sbGVjdGlvbiwgQGZpbHRlckJ1ZmZlciA9IG5ldyBUZXh0QnVmZmVyXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBoYW5kbGVFdmVudHMoKVxuICAgIEBjb2xsZWN0aW9uLnNlYXJjaCgpXG4gICAgQHNldFNjb3BlQnV0dG9uU3RhdGUoQGNvbGxlY3Rpb24uZ2V0U2VhcmNoU2NvcGUoKSlcblxuICAgIEBub3RpZmljYXRpb25PcHRpb25zID1cbiAgICAgIGRldGFpbDogJ0F0b20gdG9kby1zaG93IHBhY2thZ2UnXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgaWNvbjogQGdldEljb25OYW1lKClcblxuICAgIEBjaGVja0RlcHJlY2F0aW9uKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQHNjb3BlQnV0dG9uLCB0aXRsZTogXCJXaGF0IHRvIFNlYXJjaFwiXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAb3B0aW9uc0J1dHRvbiwgdGl0bGU6IFwiU2hvdyBUb2RvIE9wdGlvbnNcIlxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQHNhdmVBc0J1dHRvbiwgdGl0bGU6IFwiU2F2ZSBUb2RvcyB0byBGaWxlXCJcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20udG9vbHRpcHMuYWRkIEByZWZyZXNoQnV0dG9uLCB0aXRsZTogXCJSZWZyZXNoIFRvZG9zXCJcblxuICBoYW5kbGVFdmVudHM6IC0+XG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBAZWxlbWVudCxcbiAgICAgICdjb3JlOnNhdmUtYXMnOiAoZXZlbnQpID0+XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIEBzYXZlQXMoKVxuICAgICAgJ2NvcmU6cmVmcmVzaCc6IChldmVudCkgPT5cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgQGNvbGxlY3Rpb24uc2VhcmNoKClcblxuICAgICMgUGVyc2lzdCBwYW5lIHNpemUgYnkgc2F2aW5nIHRvIGxvY2FsIHN0b3JhZ2VcbiAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgQHJlc3RvcmVQYW5lRmxleChwYW5lKSBpZiBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5yZW1lbWJlclZpZXdTaXplJylcbiAgICBAZGlzcG9zYWJsZXMuYWRkIHBhbmUub2JzZXJ2ZUZsZXhTY2FsZSAoZmxleFNjYWxlKSA9PlxuICAgICAgQHNhdmVQYW5lRmxleChmbGV4U2NhbGUpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkU3RhcnRTZWFyY2ggQHN0YXJ0TG9hZGluZ1xuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRGaW5pc2hTZWFyY2ggQHN0b3BMb2FkaW5nXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZEZhaWxTZWFyY2ggKGVycikgPT5cbiAgICAgIEBzZWFyY2hDb3VudC50ZXh0IFwiU2VhcmNoIEZhaWxlZFwiXG4gICAgICBjb25zb2xlLmVycm9yIGVyciBpZiBlcnJcbiAgICAgIEBzaG93RXJyb3IgZXJyIGlmIGVyclxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZENoYW5nZVNlYXJjaFNjb3BlIChzY29wZSkgPT5cbiAgICAgIEBzZXRTY29wZUJ1dHRvblN0YXRlKHNjb3BlKVxuICAgICAgQGNvbGxlY3Rpb24uc2VhcmNoKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRTZWFyY2hQYXRocyAoblBhdGhzKSA9PlxuICAgICAgQHNlYXJjaENvdW50LnRleHQgXCIje25QYXRoc30gcGF0aHMgc2VhcmNoZWQuLi5cIlxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtIChpdGVtKSA9PlxuICAgICAgaWYgQGNvbGxlY3Rpb24uc2V0QWN0aXZlUHJvamVjdChpdGVtPy5nZXRQYXRoPygpKSBvclxuICAgICAgKGl0ZW0/LmNvbnN0cnVjdG9yLm5hbWUgaXMgJ1RleHRFZGl0b3InIGFuZCBAY29sbGVjdGlvbi5zY29wZSBpcyAnYWN0aXZlJylcbiAgICAgICAgQGNvbGxlY3Rpb24uc2VhcmNoKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWRBZGRUZXh0RWRpdG9yICh7dGV4dEVkaXRvcn0pID0+XG4gICAgICBAY29sbGVjdGlvbi5zZWFyY2goKSBpZiBAY29sbGVjdGlvbi5zY29wZSBpcyAnb3BlbidcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZUl0ZW0gKHtpdGVtfSkgPT5cbiAgICAgIEBjb2xsZWN0aW9uLnNlYXJjaCgpIGlmIEBjb2xsZWN0aW9uLnNjb3BlIGlzICdvcGVuJ1xuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgZWRpdG9yLm9uRGlkU2F2ZSA9PiBAY29sbGVjdGlvbi5zZWFyY2goKVxuXG4gICAgQGZpbHRlckVkaXRvclZpZXcuZ2V0TW9kZWwoKS5vbkRpZFN0b3BDaGFuZ2luZyA9PlxuICAgICAgQGZpbHRlcigpIGlmIEBmaXJzdFRpbWVGaWx0ZXJcbiAgICAgIEBmaXJzdFRpbWVGaWx0ZXIgPSB0cnVlXG5cbiAgICBAc2NvcGVCdXR0b24ub24gJ2NsaWNrJywgQHRvZ2dsZVNlYXJjaFNjb3BlXG4gICAgQG9wdGlvbnNCdXR0b24ub24gJ2NsaWNrJywgQHRvZ2dsZU9wdGlvbnNcbiAgICBAc2F2ZUFzQnV0dG9uLm9uICdjbGljaycsIEBzYXZlQXNcbiAgICBAcmVmcmVzaEJ1dHRvbi5vbiAnY2xpY2snLCA9PiBAY29sbGVjdGlvbi5zZWFyY2goKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGNvbGxlY3Rpb24uY2FuY2VsU2VhcmNoKClcbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgQGRldGFjaCgpXG5cbiAgc2F2ZVBhbmVGbGV4OiAoZmxleCkgLT5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSAndG9kby1zaG93LmZsZXgnLCBmbGV4XG5cbiAgcmVzdG9yZVBhbmVGbGV4OiAocGFuZSkgLT5cbiAgICBmbGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0gJ3RvZG8tc2hvdy5mbGV4J1xuICAgIHBhbmUuc2V0RmxleFNjYWxlIHBhcnNlRmxvYXQoZmxleCkgaWYgZmxleFxuXG4gIGdldFRpdGxlOiAtPiBcIlRvZG8gU2hvd1wiXG4gIGdldEljb25OYW1lOiAtPiBcImNoZWNrbGlzdFwiXG4gIGdldFVSSTogLT4gQHVyaVxuICBnZXRQcm9qZWN0TmFtZTogLT4gQGNvbGxlY3Rpb24uZ2V0QWN0aXZlUHJvamVjdE5hbWUoKVxuICBnZXRQcm9qZWN0UGF0aDogLT4gQGNvbGxlY3Rpb24uZ2V0QWN0aXZlUHJvamVjdCgpXG4gIGdldFRvZG9zOiAtPiBAY29sbGVjdGlvbi5nZXRUb2RvcygpXG4gIGdldFRvZG9zQ291bnQ6IC0+IEBjb2xsZWN0aW9uLmdldFRvZG9zQ291bnQoKVxuICBpc1NlYXJjaGluZzogLT4gQGNvbGxlY3Rpb24uZ2V0U3RhdGUoKVxuXG4gIHN0YXJ0TG9hZGluZzogPT5cbiAgICBAdG9kb0xvYWRpbmcuc2hvdygpXG4gICAgQHVwZGF0ZUluZm8oKVxuXG4gIHN0b3BMb2FkaW5nOiA9PlxuICAgIEB0b2RvTG9hZGluZy5oaWRlKClcbiAgICBAdXBkYXRlSW5mbygpXG5cbiAgdXBkYXRlSW5mbzogLT5cbiAgICBAdG9kb0luZm8uaHRtbChcIiN7QGdldEluZm9UZXh0KCl9ICN7QGdldFNjb3BlVGV4dCgpfVwiKVxuXG4gIGdldEluZm9UZXh0OiAtPlxuICAgIHJldHVybiBcIkZvdW5kIC4uLiByZXN1bHRzXCIgaWYgQGlzU2VhcmNoaW5nKClcbiAgICBzd2l0Y2ggY291bnQgPSBAZ2V0VG9kb3NDb3VudCgpXG4gICAgICB3aGVuIDEgdGhlbiBcIkZvdW5kICN7Y291bnR9IHJlc3VsdFwiXG4gICAgICBlbHNlIFwiRm91bmQgI3tjb3VudH0gcmVzdWx0c1wiXG5cbiAgZ2V0U2NvcGVUZXh0OiAtPlxuICAgICMgVE9ETzogQWxzbyBzaG93IG51bWJlciBvZiBmaWxlc1xuXG4gICAgc3dpdGNoIEBjb2xsZWN0aW9uLnNjb3BlXG4gICAgICB3aGVuICdhY3RpdmUnXG4gICAgICAgIFwiaW4gYWN0aXZlIGZpbGVcIlxuICAgICAgd2hlbiAnb3BlbidcbiAgICAgICAgXCJpbiBvcGVuIGZpbGVzXCJcbiAgICAgIHdoZW4gJ3Byb2plY3QnXG4gICAgICAgIFwiaW4gcHJvamVjdCA8Y29kZT4je0BnZXRQcm9qZWN0TmFtZSgpfTwvY29kZT5cIlxuICAgICAgZWxzZVxuICAgICAgICBcImluIHdvcmtzcGFjZVwiXG5cbiAgc2hvd0Vycm9yOiAobWVzc2FnZSA9ICcnKSAtPlxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBtZXNzYWdlLnRvU3RyaW5nKCksIEBub3RpZmljYXRpb25PcHRpb25zXG5cbiAgc2hvd1dhcm5pbmc6IChtZXNzYWdlID0gJycpIC0+XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcgbWVzc2FnZS50b1N0cmluZygpLCBAbm90aWZpY2F0aW9uT3B0aW9uc1xuXG4gIHNhdmVBczogPT5cbiAgICByZXR1cm4gaWYgQGlzU2VhcmNoaW5nKClcblxuICAgIGZpbGVQYXRoID0gXCIje0BnZXRQcm9qZWN0TmFtZSgpIG9yICd0b2Rvcyd9Lm1kXCJcbiAgICBpZiBwcm9qZWN0UGF0aCA9IEBnZXRQcm9qZWN0UGF0aCgpXG4gICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihwcm9qZWN0UGF0aCwgZmlsZVBhdGgpXG5cbiAgICBpZiBvdXRwdXRGaWxlUGF0aCA9IGF0b20uc2hvd1NhdmVEaWFsb2dTeW5jKGZpbGVQYXRoLnRvTG93ZXJDYXNlKCkpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG91dHB1dEZpbGVQYXRoLCBAY29sbGVjdGlvbi5nZXRNYXJrZG93bigpKVxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihvdXRwdXRGaWxlUGF0aClcblxuICB0b2dnbGVTZWFyY2hTY29wZTogPT5cbiAgICBzY29wZSA9IEBjb2xsZWN0aW9uLnRvZ2dsZVNlYXJjaFNjb3BlKClcbiAgICBAc2V0U2NvcGVCdXR0b25TdGF0ZShzY29wZSlcblxuICBzZXRTY29wZUJ1dHRvblN0YXRlOiAoc3RhdGUpID0+XG4gICAgc3dpdGNoIHN0YXRlXG4gICAgICB3aGVuICd3b3Jrc3BhY2UnIHRoZW4gQHNjb3BlQnV0dG9uLnRleHQgJ1dvcmtzcGFjZSdcbiAgICAgIHdoZW4gJ3Byb2plY3QnIHRoZW4gQHNjb3BlQnV0dG9uLnRleHQgJ1Byb2plY3QnXG4gICAgICB3aGVuICdvcGVuJyB0aGVuIEBzY29wZUJ1dHRvbi50ZXh0ICdPcGVuIEZpbGVzJ1xuICAgICAgd2hlbiAnYWN0aXZlJyB0aGVuIEBzY29wZUJ1dHRvbi50ZXh0ICdBY3RpdmUgRmlsZSdcblxuICB0b2dnbGVPcHRpb25zOiA9PlxuICAgIHVubGVzcyBAdG9kb09wdGlvbnNcbiAgICAgIEBvcHRpb25zVmlldy5oaWRlKClcbiAgICAgIEB0b2RvT3B0aW9ucyA9IG5ldyBUb2RvT3B0aW9ucyhAY29sbGVjdGlvbilcbiAgICAgIEBvcHRpb25zVmlldy5odG1sIEB0b2RvT3B0aW9uc1xuICAgIEBvcHRpb25zVmlldy5zbGlkZVRvZ2dsZSgpXG5cbiAgZmlsdGVyOiAtPlxuICAgIEBjb2xsZWN0aW9uLmZpbHRlclRvZG9zIEBmaWx0ZXJCdWZmZXIuZ2V0VGV4dCgpXG5cbiAgY2hlY2tEZXByZWNhdGlvbjogLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5maW5kVGhlc2VSZWdleGVzJylcbiAgICAgIEBzaG93V2FybmluZyAnJydcbiAgICAgIERlcHJlY2F0aW9uIFdhcm5pbmc6XFxuXG4gICAgICBgZmluZFRoZXNlUmVnZXhlc2AgY29uZmlnIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgYGZpbmRUaGVzZVRvZG9zYCBhbmQgYGZpbmRVc2luZ1JlZ2V4YCBmb3IgY3VzdG9tIGJlaGF2aW91ci5cbiAgICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbXJvZGFsZ2FhcmQvYXRvbS10b2RvLXNob3cjY29uZmlnIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgICAgJycnXG4iXX0=
