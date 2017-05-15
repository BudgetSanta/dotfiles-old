(function() {
  var $, CompositeDisposable, ShowTodoView, TableHeaderView, TodoEmptyView, TodoView, View, ref, ref1,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), View = ref.View, $ = ref.$;

  ref1 = require('./todo-item-view'), TableHeaderView = ref1.TableHeaderView, TodoView = ref1.TodoView, TodoEmptyView = ref1.TodoEmptyView;

  module.exports = ShowTodoView = (function(superClass) {
    extend(ShowTodoView, superClass);

    function ShowTodoView() {
      this.renderTable = bind(this.renderTable, this);
      this.clearTodos = bind(this.clearTodos, this);
      this.renderTodo = bind(this.renderTodo, this);
      this.tableHeaderClicked = bind(this.tableHeaderClicked, this);
      this.initTable = bind(this.initTable, this);
      return ShowTodoView.__super__.constructor.apply(this, arguments);
    }

    ShowTodoView.content = function() {
      return this.div({
        "class": 'todo-table',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.table({
            outlet: 'table'
          });
        };
      })(this));
    };

    ShowTodoView.prototype.initialize = function(collection) {
      this.collection = collection;
      this.disposables = new CompositeDisposable;
      this.handleConfigChanges();
      return this.handleEvents();
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.disposables.add(this.collection.onDidFinishSearch(this.initTable));
      this.disposables.add(this.collection.onDidRemoveTodo(this.removeTodo));
      this.disposables.add(this.collection.onDidClear(this.clearTodos));
      this.disposables.add(this.collection.onDidSortTodos((function(_this) {
        return function(todos) {
          return _this.renderTable(todos);
        };
      })(this)));
      this.disposables.add(this.collection.onDidFilterTodos((function(_this) {
        return function(todos) {
          return _this.renderTable(todos);
        };
      })(this)));
      return this.on('click', 'th', this.tableHeaderClicked);
    };

    ShowTodoView.prototype.handleConfigChanges = function() {
      this.disposables.add(atom.config.onDidChange('todo-show.showInTable', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          _this.showInTable = newValue;
          return _this.renderTable(_this.collection.getTodos());
        };
      })(this)));
      this.disposables.add(atom.config.onDidChange('todo-show.sortBy', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          return _this.sort(_this.sortBy = newValue, _this.sortAsc);
        };
      })(this)));
      return this.disposables.add(atom.config.onDidChange('todo-show.sortAscending', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          return _this.sort(_this.sortBy, _this.sortAsc = newValue);
        };
      })(this)));
    };

    ShowTodoView.prototype.destroy = function() {
      this.disposables.dispose();
      return this.empty();
    };

    ShowTodoView.prototype.initTable = function() {
      this.showInTable = atom.config.get('todo-show.showInTable');
      this.sortBy = atom.config.get('todo-show.sortBy');
      this.sortAsc = atom.config.get('todo-show.sortAscending');
      return this.sort(this.sortBy, this.sortAsc);
    };

    ShowTodoView.prototype.renderTableHeader = function() {
      return this.table.append(new TableHeaderView(this.showInTable, {
        sortBy: this.sortBy,
        sortAsc: this.sortAsc
      }));
    };

    ShowTodoView.prototype.tableHeaderClicked = function(e) {
      var item, sortAsc;
      item = e.target.innerText;
      sortAsc = this.sortBy === item ? !this.sortAsc : this.sortAsc;
      atom.config.set('todo-show.sortBy', item);
      return atom.config.set('todo-show.sortAscending', sortAsc);
    };

    ShowTodoView.prototype.renderTodo = function(todo) {
      return this.table.append(new TodoView(this.showInTable, todo));
    };

    ShowTodoView.prototype.removeTodo = function(todo) {
      return console.log('removeTodo');
    };

    ShowTodoView.prototype.clearTodos = function() {
      return this.table.empty();
    };

    ShowTodoView.prototype.renderTable = function(todos) {
      var i, len, ref2, todo;
      this.clearTodos();
      this.renderTableHeader();
      ref2 = todos = todos;
      for (i = 0, len = ref2.length; i < len; i++) {
        todo = ref2[i];
        this.renderTodo(todo);
      }
      if (!todos.length) {
        return this.table.append(new TodoEmptyView(this.showInTable));
      }
    };

    ShowTodoView.prototype.sort = function(sortBy, sortAsc) {
      return this.collection.sortTodos({
        sortBy: sortBy,
        sortAsc: sortAsc
      });
    };

    return ShowTodoView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLXRhYmxlLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrRkFBQTtJQUFBOzs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsZUFBRCxFQUFPOztFQUVQLE9BQTZDLE9BQUEsQ0FBUSxrQkFBUixDQUE3QyxFQUFDLHNDQUFELEVBQWtCLHdCQUFsQixFQUE0Qjs7RUFFNUIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozs7Ozs7O0lBQ0osWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sWUFBUDtRQUFxQixRQUFBLEVBQVUsQ0FBQyxDQUFoQztPQUFMLEVBQXdDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDdEMsS0FBQyxDQUFBLEtBQUQsQ0FBTztZQUFBLE1BQUEsRUFBUSxPQUFSO1dBQVA7UUFEc0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhDO0lBRFE7OzJCQUlWLFVBQUEsR0FBWSxTQUFDLFVBQUQ7TUFBQyxJQUFDLENBQUEsYUFBRDtNQUNYLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSTtNQUNuQixJQUFDLENBQUEsbUJBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxZQUFELENBQUE7SUFIVTs7MkJBS1osWUFBQSxHQUFjLFNBQUE7TUFFWixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxpQkFBWixDQUE4QixJQUFDLENBQUEsU0FBL0IsQ0FBakI7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxlQUFaLENBQTRC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QUEsTUFBQSxFQUFRLE1BQVI7UUFBZ0IsT0FBQSxFQUFTLE9BQXpCO09BQXRCO0lBREk7Ozs7S0FwRW1CO0FBTjNCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbntWaWV3LCAkfSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG57VGFibGVIZWFkZXJWaWV3LCBUb2RvVmlldywgVG9kb0VtcHR5Vmlld30gPSByZXF1aXJlICcuL3RvZG8taXRlbS12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTaG93VG9kb1ZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6ICd0b2RvLXRhYmxlJywgdGFiaW5kZXg6IC0xLCA9PlxuICAgICAgQHRhYmxlIG91dGxldDogJ3RhYmxlJ1xuXG4gIGluaXRpYWxpemU6IChAY29sbGVjdGlvbikgLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBoYW5kbGVDb25maWdDaGFuZ2VzKClcbiAgICBAaGFuZGxlRXZlbnRzKClcblxuICBoYW5kbGVFdmVudHM6IC0+XG4gICAgIyBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkQWRkVG9kbyBAcmVuZGVyVG9kb1xuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRGaW5pc2hTZWFyY2ggQGluaXRUYWJsZVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRSZW1vdmVUb2RvIEByZW1vdmVUb2RvXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZENsZWFyIEBjbGVhclRvZG9zXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZFNvcnRUb2RvcyAodG9kb3MpID0+IEByZW5kZXJUYWJsZSB0b2Rvc1xuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRGaWx0ZXJUb2RvcyAodG9kb3MpID0+IEByZW5kZXJUYWJsZSB0b2Rvc1xuXG4gICAgQG9uICdjbGljaycsICd0aCcsIEB0YWJsZUhlYWRlckNsaWNrZWRcblxuICBoYW5kbGVDb25maWdDaGFuZ2VzOiAtPlxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ3RvZG8tc2hvdy5zaG93SW5UYWJsZScsICh7bmV3VmFsdWUsIG9sZFZhbHVlfSkgPT5cbiAgICAgIEBzaG93SW5UYWJsZSA9IG5ld1ZhbHVlXG4gICAgICBAcmVuZGVyVGFibGUgQGNvbGxlY3Rpb24uZ2V0VG9kb3MoKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAndG9kby1zaG93LnNvcnRCeScsICh7bmV3VmFsdWUsIG9sZFZhbHVlfSkgPT5cbiAgICAgIEBzb3J0KEBzb3J0QnkgPSBuZXdWYWx1ZSwgQHNvcnRBc2MpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICd0b2RvLXNob3cuc29ydEFzY2VuZGluZycsICh7bmV3VmFsdWUsIG9sZFZhbHVlfSkgPT5cbiAgICAgIEBzb3J0KEBzb3J0QnksIEBzb3J0QXNjID0gbmV3VmFsdWUpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgQGVtcHR5KClcblxuICBpbml0VGFibGU6ID0+XG4gICAgQHNob3dJblRhYmxlID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuc2hvd0luVGFibGUnKVxuICAgIEBzb3J0QnkgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5zb3J0QnknKVxuICAgIEBzb3J0QXNjID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuc29ydEFzY2VuZGluZycpXG4gICAgQHNvcnQoQHNvcnRCeSwgQHNvcnRBc2MpXG5cbiAgcmVuZGVyVGFibGVIZWFkZXI6IC0+XG4gICAgQHRhYmxlLmFwcGVuZCBuZXcgVGFibGVIZWFkZXJWaWV3KEBzaG93SW5UYWJsZSwge0Bzb3J0QnksIEBzb3J0QXNjfSlcblxuICB0YWJsZUhlYWRlckNsaWNrZWQ6IChlKSA9PlxuICAgIGl0ZW0gPSBlLnRhcmdldC5pbm5lclRleHRcbiAgICBzb3J0QXNjID0gaWYgQHNvcnRCeSBpcyBpdGVtIHRoZW4gIUBzb3J0QXNjIGVsc2UgQHNvcnRBc2NcblxuICAgIGF0b20uY29uZmlnLnNldCgndG9kby1zaG93LnNvcnRCeScsIGl0ZW0pXG4gICAgYXRvbS5jb25maWcuc2V0KCd0b2RvLXNob3cuc29ydEFzY2VuZGluZycsIHNvcnRBc2MpXG5cbiAgcmVuZGVyVG9kbzogKHRvZG8pID0+XG4gICAgQHRhYmxlLmFwcGVuZCBuZXcgVG9kb1ZpZXcoQHNob3dJblRhYmxlLCB0b2RvKVxuXG4gIHJlbW92ZVRvZG86ICh0b2RvKSAtPlxuICAgIGNvbnNvbGUubG9nICdyZW1vdmVUb2RvJ1xuXG4gIGNsZWFyVG9kb3M6ID0+XG4gICAgQHRhYmxlLmVtcHR5KClcblxuICByZW5kZXJUYWJsZTogKHRvZG9zKSA9PlxuICAgIEBjbGVhclRvZG9zKClcbiAgICBAcmVuZGVyVGFibGVIZWFkZXIoKVxuXG4gICAgZm9yIHRvZG8gaW4gdG9kb3MgPSB0b2Rvc1xuICAgICAgQHJlbmRlclRvZG8odG9kbylcbiAgICBAdGFibGUuYXBwZW5kIG5ldyBUb2RvRW1wdHlWaWV3KEBzaG93SW5UYWJsZSkgdW5sZXNzIHRvZG9zLmxlbmd0aFxuXG4gIHNvcnQ6IChzb3J0QnksIHNvcnRBc2MpIC0+XG4gICAgQGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogc29ydEJ5LCBzb3J0QXNjOiBzb3J0QXNjKVxuIl19
