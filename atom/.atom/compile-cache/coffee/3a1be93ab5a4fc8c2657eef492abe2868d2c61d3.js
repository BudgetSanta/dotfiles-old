(function() {
  var CodeView, CompositeDisposable, ItemView, ShowTodoView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('atom-space-pen-views').View;

  ItemView = (function(superClass) {
    extend(ItemView, superClass);

    function ItemView() {
      return ItemView.__super__.constructor.apply(this, arguments);
    }

    ItemView.content = function(item) {
      return this.span({
        "class": 'badge badge-large',
        'data-id': item
      }, item);
    };

    return ItemView;

  })(View);

  CodeView = (function(superClass) {
    extend(CodeView, superClass);

    function CodeView() {
      return CodeView.__super__.constructor.apply(this, arguments);
    }

    CodeView.content = function(item) {
      return this.code(item);
    };

    return CodeView;

  })(View);

  module.exports = ShowTodoView = (function(superClass) {
    extend(ShowTodoView, superClass);

    function ShowTodoView() {
      this.updateShowInTable = bind(this.updateShowInTable, this);
      return ShowTodoView.__super__.constructor.apply(this, arguments);
    }

    ShowTodoView.content = function() {
      return this.div({
        outlet: 'todoOptions',
        "class": 'todo-options'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('On Table');
            return _this.div({
              outlet: 'itemsOnTable',
              "class": 'block items-on-table'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Off Table');
            return _this.div({
              outlet: 'itemsOffTable',
              "class": 'block items-off-table'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Find Todos');
            return _this.div({
              outlet: 'findTodoDiv'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Find Regex');
            return _this.div({
              outlet: 'findRegexDiv'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Ignore Paths');
            return _this.div({
              outlet: 'ignorePathDiv'
            });
          });
          return _this.div({
            "class": 'option'
          }, function() {
            _this.h2('');
            return _this.div({
              "class": 'btn-group'
            }, function() {
              _this.button({
                outlet: 'configButton',
                "class": 'btn'
              }, "Go to Config");
              return _this.button({
                outlet: 'closeButton',
                "class": 'btn'
              }, "Close Options");
            });
          });
        };
      })(this));
    };

    ShowTodoView.prototype.initialize = function(collection) {
      this.collection = collection;
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      return this.updateUI();
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.configButton.on('click', function() {
        return atom.workspace.open('atom://config/packages/todo-show');
      });
      return this.closeButton.on('click', (function(_this) {
        return function() {
          return _this.parent().slideToggle();
        };
      })(this));
    };

    ShowTodoView.prototype.detach = function() {
      return this.disposables.dispose();
    };

    ShowTodoView.prototype.updateShowInTable = function() {
      var showInTable;
      showInTable = this.sortable.toArray();
      return atom.config.set('todo-show.showInTable', showInTable);
    };

    ShowTodoView.prototype.updateUI = function() {
      var Sortable, i, item, j, k, len, len1, len2, path, ref, ref1, ref2, regex, results, tableItems, todo, todos;
      tableItems = atom.config.get('todo-show.showInTable');
      ref = this.collection.getAvailableTableItems();
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (tableItems.indexOf(item) === -1) {
          this.itemsOffTable.append(new ItemView(item));
        } else {
          this.itemsOnTable.append(new ItemView(item));
        }
      }
      Sortable = require('sortablejs');
      this.sortable = Sortable.create(this.itemsOnTable.context, {
        group: 'tableItems',
        ghostClass: 'ghost',
        onSort: this.updateShowInTable
      });
      Sortable.create(this.itemsOffTable.context, {
        group: 'tableItems',
        ghostClass: 'ghost'
      });
      ref1 = todos = atom.config.get('todo-show.findTheseTodos');
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        todo = ref1[j];
        this.findTodoDiv.append(new CodeView(todo));
      }
      regex = atom.config.get('todo-show.findUsingRegex');
      this.findRegexDiv.append(new CodeView(regex.replace('${TODOS}', todos.join('|'))));
      ref2 = atom.config.get('todo-show.ignoreThesePaths');
      results = [];
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        path = ref2[k];
        results.push(this.ignorePathDiv.append(new CodeView(path)));
      }
      return results;
    };

    return ShowTodoView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLW9wdGlvbnMtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDJEQUFBO0lBQUE7Ozs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3ZCLE9BQVEsT0FBQSxDQUFRLHNCQUFSOztFQUVIOzs7Ozs7O0lBQ0osUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQ7YUFDUixJQUFDLENBQUEsSUFBRCxDQUFNO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxtQkFBUDtRQUE0QixTQUFBLEVBQVcsSUFBdkM7T0FBTixFQUFtRCxJQUFuRDtJQURROzs7O0tBRFc7O0VBSWpCOzs7Ozs7O0lBQ0osUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQ7YUFDUixJQUFDLENBQUEsSUFBRCxDQUFNLElBQU47SUFEUTs7OztLQURXOztFQUl2QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7OztJQUNKLFlBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxNQUFBLEVBQVEsYUFBUjtRQUF1QixDQUFBLEtBQUEsQ0FBQSxFQUFPLGNBQTlCO09BQUwsRUFBbUQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ2pELEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFFBQVA7V0FBTCxFQUFzQixTQUFBO1lBQ3BCLEtBQUMsQ0FBQSxFQUFELENBQUksVUFBSjttQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsTUFBQSxFQUFRLGNBQVI7Y0FBd0IsQ0FBQSxLQUFBLENBQUEsRUFBTyxzQkFBL0I7YUFBTDtVQUZvQixDQUF0QjtVQUlBLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFFB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WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue1ZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmNsYXNzIEl0ZW1WaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogKGl0ZW0pIC0+XG4gICAgQHNwYW4gY2xhc3M6ICdiYWRnZSBiYWRnZS1sYXJnZScsICdkYXRhLWlkJzogaXRlbSwgaXRlbVxuXG5jbGFzcyBDb2RlVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IChpdGVtKSAtPlxuICAgIEBjb2RlIGl0ZW1cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU2hvd1RvZG9WaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IG91dGxldDogJ3RvZG9PcHRpb25zJywgY2xhc3M6ICd0b2RvLW9wdGlvbnMnLCA9PlxuICAgICAgQGRpdiBjbGFzczogJ29wdGlvbicsID0+XG4gICAgICAgIEBoMiAnT24gVGFibGUnXG4gICAgICAgIEBkaXYgb3V0bGV0OiAnaXRlbXNPblRhYmxlJywgY2xhc3M6ICdibG9jayBpdGVtcy1vbi10YWJsZSdcblxuICAgICAgQGRpdiBjbGFzczogJ29wdGlvbicsID0+XG4gICAgICAgIEBoMiAnT2ZmIFRhYmxlJ1xuICAgICAgICBAZGl2IG91dGxldDogJ2l0ZW1zT2ZmVGFibGUnLCBjbGFzczogJ2Jsb2NrIGl0ZW1zLW9mZi10YWJsZSdcblxuICAgICAgQGRpdiBjbGFzczogJ29wdGlvbicsID0+XG4gICAgICAgIEBoMiAnRmluZCBUb2RvcydcbiAgICAgICAgQGRpdiBvdXRsZXQ6ICdmaW5kVG9kb0RpdidcblxuICAgICAgQGRpdiBjbGFzczogJ29wdGlvbicsID0+XG4gICAgICAgIEBoMiAnRmluZCBSZWdleCdcbiAgICAgICAgQGRpdiBvdXRsZXQ6ICdmaW5kUmVnZXhEaXYnXG5cbiAgICAgIEBkaXYgY2xhc3M6ICdvcHRpb24nLCA9PlxuICAgICAgICBAaDIgJ0lnbm9yZSBQYXRocydcbiAgICAgICAgQGRpdiBvdXRsZXQ6ICdpZ25vcmVQYXRoRGl2J1xuXG4gICAgICBAZGl2IGNsYXNzOiAnb3B0aW9uJywgPT5cbiAgICAgICAgQGgyICcnXG4gICAgICAgIEBkaXYgY2xhc3M6ICdidG4tZ3JvdXAnLCA9PlxuICAgICAgICAgIEBidXR0b24gb3V0bGV0OiAnY29uZmlnQnV0dG9uJywgY2xhc3M6ICdidG4nLCBcIkdvIHRvIENvbmZpZ1wiXG4gICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdjbG9zZUJ1dHRvbicsIGNsYXNzOiAnYnRuJywgXCJDbG9zZSBPcHRpb25zXCJcblxuICBpbml0aWFsaXplOiAoQGNvbGxlY3Rpb24pIC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAaGFuZGxlRXZlbnRzKClcbiAgICBAdXBkYXRlVUkoKVxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICBAY29uZmlnQnV0dG9uLm9uICdjbGljaycsIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuICdhdG9tOi8vY29uZmlnL3BhY2thZ2VzL3RvZG8tc2hvdydcbiAgICBAY2xvc2VCdXR0b24ub24gJ2NsaWNrJywgPT4gQHBhcmVudCgpLnNsaWRlVG9nZ2xlKClcblxuICBkZXRhY2g6IC0+XG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuXG4gIHVwZGF0ZVNob3dJblRhYmxlOiA9PlxuICAgIHNob3dJblRhYmxlID0gQHNvcnRhYmxlLnRvQXJyYXkoKVxuICAgIGF0b20uY29uZmlnLnNldCgndG9kby1zaG93LnNob3dJblRhYmxlJywgc2hvd0luVGFibGUpXG5cbiAgdXBkYXRlVUk6IC0+XG4gICAgdGFibGVJdGVtcyA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LnNob3dJblRhYmxlJylcbiAgICBmb3IgaXRlbSBpbiBAY29sbGVjdGlvbi5nZXRBdmFpbGFibGVUYWJsZUl0ZW1zKClcbiAgICAgIGlmIHRhYmxlSXRlbXMuaW5kZXhPZihpdGVtKSBpcyAtMVxuICAgICAgICBAaXRlbXNPZmZUYWJsZS5hcHBlbmQgbmV3IEl0ZW1WaWV3KGl0ZW0pXG4gICAgICBlbHNlXG4gICAgICAgIEBpdGVtc09uVGFibGUuYXBwZW5kIG5ldyBJdGVtVmlldyhpdGVtKVxuXG4gICAgU29ydGFibGUgPSByZXF1aXJlICdzb3J0YWJsZWpzJ1xuXG4gICAgQHNvcnRhYmxlID0gU29ydGFibGUuY3JlYXRlKFxuICAgICAgQGl0ZW1zT25UYWJsZS5jb250ZXh0XG4gICAgICBncm91cDogJ3RhYmxlSXRlbXMnXG4gICAgICBnaG9zdENsYXNzOiAnZ2hvc3QnXG4gICAgICBvblNvcnQ6IEB1cGRhdGVTaG93SW5UYWJsZVxuICAgIClcblxuICAgIFNvcnRhYmxlLmNyZWF0ZShcbiAgICAgIEBpdGVtc09mZlRhYmxlLmNvbnRleHRcbiAgICAgIGdyb3VwOiAndGFibGVJdGVtcydcbiAgICAgIGdob3N0Q2xhc3M6ICdnaG9zdCdcbiAgICApXG5cbiAgICBmb3IgdG9kbyBpbiB0b2RvcyA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJylcbiAgICAgIEBmaW5kVG9kb0Rpdi5hcHBlbmQgbmV3IENvZGVWaWV3KHRvZG8pXG5cbiAgICByZWdleCA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRVc2luZ1JlZ2V4JylcbiAgICBAZmluZFJlZ2V4RGl2LmFwcGVuZCBuZXcgQ29kZVZpZXcocmVnZXgucmVwbGFjZSgnJHtUT0RPU30nLCB0b2Rvcy5qb2luKCd8JykpKVxuXG4gICAgZm9yIHBhdGggaW4gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuaWdub3JlVGhlc2VQYXRocycpXG4gICAgICBAaWdub3JlUGF0aERpdi5hcHBlbmQgbmV3IENvZGVWaWV3KHBhdGgpXG4iXX0=
