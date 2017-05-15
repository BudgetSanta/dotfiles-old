(function() {
  var Emitter, TodoCollection, TodoModel, TodoRegex, TodosMarkdown, path;

  path = require('path');

  Emitter = require('atom').Emitter;

  TodoModel = require('./todo-model');

  TodosMarkdown = require('./todo-markdown');

  TodoRegex = require('./todo-regex');

  module.exports = TodoCollection = (function() {
    function TodoCollection() {
      this.emitter = new Emitter;
      this.defaultKey = 'Text';
      this.scope = 'workspace';
      this.todos = [];
    }

    TodoCollection.prototype.onDidAddTodo = function(cb) {
      return this.emitter.on('did-add-todo', cb);
    };

    TodoCollection.prototype.onDidRemoveTodo = function(cb) {
      return this.emitter.on('did-remove-todo', cb);
    };

    TodoCollection.prototype.onDidClear = function(cb) {
      return this.emitter.on('did-clear-todos', cb);
    };

    TodoCollection.prototype.onDidStartSearch = function(cb) {
      return this.emitter.on('did-start-search', cb);
    };

    TodoCollection.prototype.onDidSearchPaths = function(cb) {
      return this.emitter.on('did-search-paths', cb);
    };

    TodoCollection.prototype.onDidFinishSearch = function(cb) {
      return this.emitter.on('did-finish-search', cb);
    };

    TodoCollection.prototype.onDidCancelSearch = function(cb) {
      return this.emitter.on('did-cancel-search', cb);
    };

    TodoCollection.prototype.onDidFailSearch = function(cb) {
      return this.emitter.on('did-fail-search', cb);
    };

    TodoCollection.prototype.onDidSortTodos = function(cb) {
      return this.emitter.on('did-sort-todos', cb);
    };

    TodoCollection.prototype.onDidFilterTodos = function(cb) {
      return this.emitter.on('did-filter-todos', cb);
    };

    TodoCollection.prototype.onDidChangeSearchScope = function(cb) {
      return this.emitter.on('did-change-scope', cb);
    };

    TodoCollection.prototype.clear = function() {
      this.cancelSearch();
      this.todos = [];
      return this.emitter.emit('did-clear-todos');
    };

    TodoCollection.prototype.addTodo = function(todo) {
      if (this.alreadyExists(todo)) {
        return;
      }
      this.todos.push(todo);
      return this.emitter.emit('did-add-todo', todo);
    };

    TodoCollection.prototype.getTodos = function() {
      return this.todos;
    };

    TodoCollection.prototype.getTodosCount = function() {
      return this.todos.length;
    };

    TodoCollection.prototype.getState = function() {
      return this.searching;
    };

    TodoCollection.prototype.sortTodos = function(arg) {
      var ref, ref1, sortAsc, sortBy;
      ref = arg != null ? arg : {}, sortBy = ref.sortBy, sortAsc = ref.sortAsc;
      if (sortBy == null) {
        sortBy = this.defaultKey;
      }
      if (((ref1 = this.searches) != null ? ref1[this.searches.length - 1].sortBy : void 0) !== sortBy) {
        if (this.searches == null) {
          this.searches = [];
        }
        this.searches.push({
          sortBy: sortBy,
          sortAsc: sortAsc
        });
      } else {
        this.searches[this.searches.length - 1] = {
          sortBy: sortBy,
          sortAsc: sortAsc
        };
      }
      this.todos = this.todos.sort((function(_this) {
        return function(todoA, todoB) {
          return _this.todoSorter(todoA, todoB, sortBy, sortAsc);
        };
      })(this));
      if (this.filter) {
        return this.filterTodos(this.filter);
      }
      return this.emitter.emit('did-sort-todos', this.todos);
    };

    TodoCollection.prototype.todoSorter = function(todoA, todoB, sortBy, sortAsc) {
      var aVal, bVal, comp, findTheseTodos, ref, ref1, ref2, ref3, search, sortAsc2, sortBy2;
      ref = [sortBy, sortAsc], sortBy2 = ref[0], sortAsc2 = ref[1];
      aVal = todoA.get(sortBy2);
      bVal = todoB.get(sortBy2);
      if (aVal === bVal) {
        if (search = (ref1 = this.searches) != null ? ref1[this.searches.length - 2] : void 0) {
          ref2 = [search.sortBy, search.sortAsc], sortBy2 = ref2[0], sortAsc2 = ref2[1];
        } else {
          sortBy2 = this.defaultKey;
        }
        ref3 = [todoA.get(sortBy2), todoB.get(sortBy2)], aVal = ref3[0], bVal = ref3[1];
      }
      if (sortBy2 === 'Type') {
        findTheseTodos = atom.config.get('todo-show.findTheseTodos');
        comp = findTheseTodos.indexOf(aVal) - findTheseTodos.indexOf(bVal);
      } else if (todoA.keyIsNumber(sortBy2)) {
        comp = parseInt(aVal) - parseInt(bVal);
      } else {
        comp = aVal.localeCompare(bVal);
      }
      if (sortAsc2) {
        return comp;
      } else {
        return -comp;
      }
    };

    TodoCollection.prototype.filterTodos = function(filter) {
      var result;
      if (this.filter = filter) {
        result = this.todos.filter(function(todo) {
          return todo.contains(filter);
        });
      } else {
        result = this.todos;
      }
      return this.emitter.emit('did-filter-todos', result);
    };

    TodoCollection.prototype.getAvailableTableItems = function() {
      return this.availableItems;
    };

    TodoCollection.prototype.setAvailableTableItems = function(availableItems) {
      this.availableItems = availableItems;
    };

    TodoCollection.prototype.getSearchScope = function() {
      return this.scope;
    };

    TodoCollection.prototype.setSearchScope = function(scope) {
      return this.emitter.emit('did-change-scope', this.scope = scope);
    };

    TodoCollection.prototype.toggleSearchScope = function() {
      var scope;
      scope = (function() {
        switch (this.scope) {
          case 'workspace':
            return 'project';
          case 'project':
            return 'open';
          case 'open':
            return 'active';
          default:
            return 'workspace';
        }
      }).call(this);
      this.setSearchScope(scope);
      return scope;
    };

    TodoCollection.prototype.alreadyExists = function(newTodo) {
      var properties;
      properties = ['range', 'path'];
      return this.todos.some(function(todo) {
        return properties.every(function(prop) {
          if (todo[prop] === newTodo[prop]) {
            return true;
          }
        });
      });
    };

    TodoCollection.prototype.fetchRegexItem = function(todoRegex, activeProjectOnly) {
      var options;
      options = {
        paths: this.getSearchPaths(),
        onPathsSearched: (function(_this) {
          return function(nPaths) {
            if (_this.searching) {
              return _this.emitter.emit('did-search-paths', nPaths);
            }
          };
        })(this)
      };
      return atom.workspace.scan(todoRegex.regexp, options, (function(_this) {
        return function(result, error) {
          var i, len, match, ref, results;
          if (error) {
            console.debug(error.message);
          }
          if (!result) {
            return;
          }
          if (activeProjectOnly && !_this.activeProjectHas(result.filePath)) {
            return;
          }
          ref = result.matches;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            match = ref[i];
            results.push(_this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              loc: result.filePath,
              position: match.range,
              regex: todoRegex.regex,
              regexp: todoRegex.regexp
            })));
          }
          return results;
        };
      })(this));
    };

    TodoCollection.prototype.fetchOpenRegexItem = function(todoRegex, activeEditorOnly) {
      var editor, editors, i, len, ref;
      editors = [];
      if (activeEditorOnly) {
        if (editor = (ref = atom.workspace.getPanes()[0]) != null ? ref.getActiveEditor() : void 0) {
          editors = [editor];
        }
      } else {
        editors = atom.workspace.getTextEditors();
      }
      for (i = 0, len = editors.length; i < len; i++) {
        editor = editors[i];
        editor.scan(todoRegex.regexp, (function(_this) {
          return function(match, error) {
            var range;
            if (error) {
              console.debug(error.message);
            }
            if (!match) {
              return;
            }
            range = [[match.range.start.row, match.range.start.column], [match.range.end.row, match.range.end.column]];
            return _this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              loc: editor.getPath(),
              position: range,
              regex: todoRegex.regex,
              regexp: todoRegex.regexp
            }));
          };
        })(this));
      }
      return Promise.resolve();
    };

    TodoCollection.prototype.search = function() {
      var todoRegex;
      this.clear();
      this.searching = true;
      this.emitter.emit('did-start-search');
      todoRegex = new TodoRegex(atom.config.get('todo-show.findUsingRegex'), atom.config.get('todo-show.findTheseTodos'));
      if (todoRegex.error) {
        this.emitter.emit('did-fail-search', "Invalid todo search regex");
        return;
      }
      this.searchPromise = (function() {
        switch (this.scope) {
          case 'open':
            return this.fetchOpenRegexItem(todoRegex, false);
          case 'active':
            return this.fetchOpenRegexItem(todoRegex, true);
          case 'project':
            return this.fetchRegexItem(todoRegex, true);
          default:
            return this.fetchRegexItem(todoRegex);
        }
      }).call(this);
      return this.searchPromise.then((function(_this) {
        return function(result) {
          _this.searching = false;
          if (result === 'cancelled') {
            return _this.emitter.emit('did-cancel-search');
          } else {
            return _this.emitter.emit('did-finish-search');
          }
        };
      })(this))["catch"]((function(_this) {
        return function(reason) {
          _this.searching = false;
          return _this.emitter.emit('did-fail-search', reason);
        };
      })(this));
    };

    TodoCollection.prototype.getSearchPaths = function() {
      var i, ignore, ignores, len, results;
      ignores = atom.config.get('todo-show.ignoreThesePaths');
      if (ignores == null) {
        return ['*'];
      }
      if (Object.prototype.toString.call(ignores) !== '[object Array]') {
        this.emitter.emit('did-fail-search', "ignoreThesePaths must be an array");
        return ['*'];
      }
      results = [];
      for (i = 0, len = ignores.length; i < len; i++) {
        ignore = ignores[i];
        results.push("!" + ignore);
      }
      return results;
    };

    TodoCollection.prototype.activeProjectHas = function(filePath) {
      var project;
      if (filePath == null) {
        filePath = '';
      }
      if (!(project = this.getActiveProject())) {
        return;
      }
      return filePath.indexOf(project) === 0;
    };

    TodoCollection.prototype.getActiveProject = function() {
      var project;
      if (this.activeProject) {
        return this.activeProject;
      }
      if (project = this.getFallbackProject()) {
        return this.activeProject = project;
      }
    };

    TodoCollection.prototype.getFallbackProject = function() {
      var i, item, len, project, ref;
      ref = atom.workspace.getPaneItems();
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (project = this.projectForFile(typeof item.getPath === "function" ? item.getPath() : void 0)) {
          return project;
        }
      }
      if (project = atom.project.getPaths()[0]) {
        return project;
      }
    };

    TodoCollection.prototype.getActiveProjectName = function() {
      var projectName;
      projectName = path.basename(this.getActiveProject());
      if (projectName === 'undefined') {
        return "no active project";
      } else {
        return projectName;
      }
    };

    TodoCollection.prototype.setActiveProject = function(filePath) {
      var lastProject, project;
      lastProject = this.activeProject;
      if (project = this.projectForFile(filePath)) {
        this.activeProject = project;
      }
      if (!lastProject) {
        return false;
      }
      return lastProject !== this.activeProject;
    };

    TodoCollection.prototype.projectForFile = function(filePath) {
      var project;
      if (typeof filePath !== 'string') {
        return;
      }
      if (project = atom.project.relativizePath(filePath)[0]) {
        return project;
      }
    };

    TodoCollection.prototype.getMarkdown = function() {
      var todosMarkdown;
      todosMarkdown = new TodosMarkdown;
      return todosMarkdown.markdown(this.getTodos());
    };

    TodoCollection.prototype.cancelSearch = function() {
      var ref;
      return (ref = this.searchPromise) != null ? typeof ref.cancel === "function" ? ref.cancel() : void 0 : void 0;
    };

    TodoCollection.prototype.getPreviousSearch = function() {
      var sortBy;
      return sortBy = localStorage.getItem('todo-show.previous-sortBy');
    };

    TodoCollection.prototype.setPreviousSearch = function(search) {
      return localStorage.setItem('todo-show.previous-search', search);
    };

    return TodoCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLWNvbGxlY3Rpb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sVUFBVyxPQUFBLENBQVEsTUFBUjs7RUFFWixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7O0VBQ1osYUFBQSxHQUFnQixPQUFBLENBQVEsaUJBQVI7O0VBQ2hCLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUjs7RUFFWixNQUFNLENBQUMsT0FBUCxHQUNNO0lBQ1Msd0JBQUE7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUk7TUFDZixJQUFDLENBQUEsVUFBRCxHQUFjO01BQ2QsSUFBQyxDQUFBLEtBQUQsR0FBUztNQUNULElBQUMsQ0FBQSxLQUFELEdBQVM7SUFKRTs7NkJBTWIsWUFBQSxHQUFjLFNBQUMsRUFBRDthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGNBQVosRUFBNEIsRUFBNUI7SUFBUjs7NkJBQ2QsZUFBQSxHQUFpQixTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixFQUEvQjtJQUFSOzs2QkFDakIsVUFBQSxHQUFZLFNBQUMsRUFBRDthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGlCQUFaLEVBQStCLEVBQS9CO0lBQVI7OzZCQUNaLGdCQUFBLEdBQWtCLFNBQUMsRUFBRDthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGtCQUFaLEVBQWdDLEVBQWhDO0lBQVI7OzZCQUNsQixnQkFBQSxHQUFrQixTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxrQkFBWixFQUFnQyxFQUFoQztJQUFSOzs2QkFDbEIsaUJBQUEs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QixVQUFBO2FBQUEsTUFBQSxHQUFTLFlBQVksQ0FBQyxPQUFiLENBQXFCLDJCQUFyQjtJQURROzs2QkFHbkIsaUJBQUEsR0FBbUIsU0FBQyxNQUFEO2FBQ2pCLFlBQVksQ0FBQyxPQUFiLENBQXFCLDJCQUFyQixFQUFrRCxNQUFsRDtJQURpQjs7Ozs7QUF0UHJCIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57RW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xuXG5Ub2RvTW9kZWwgPSByZXF1aXJlICcuL3RvZG8tbW9kZWwnXG5Ub2Rvc01hcmtkb3duID0gcmVxdWlyZSAnLi90b2RvLW1hcmtkb3duJ1xuVG9kb1JlZ2V4ID0gcmVxdWlyZSAnLi90b2RvLXJlZ2V4J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBUb2RvQ29sbGVjdGlvblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgQGRlZmF1bHRLZXkgPSAnVGV4dCdcbiAgICBAc2NvcGUgPSAnd29ya3NwYWNlJ1xuICAgIEB0b2RvcyA9IFtdXG5cbiAgb25EaWRBZGRUb2RvOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtYWRkLXRvZG8nLCBjYlxuICBvbkRpZFJlbW92ZVRvZG86IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1yZW1vdmUtdG9kbycsIGNiXG4gIG9uRGlkQ2xlYXI6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1jbGVhci10b2RvcycsIGNiXG4gIG9uRGlkU3RhcnRTZWFyY2g6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1zdGFydC1zZWFyY2gnLCBjYlxuICBvbkRpZFNlYXJjaFBhdGhzOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtc2VhcmNoLXBhdGhzJywgY2JcbiAgb25EaWRGaW5pc2hTZWFyY2g6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1maW5pc2gtc2VhcmNoJywgY2JcbiAgb25EaWRDYW5jZWxTZWFyY2g6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1jYW5jZWwtc2VhcmNoJywgY2JcbiAgb25EaWRGYWlsU2VhcmNoOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtZmFpbC1zZWFyY2gnLCBjYlxuICBvbkRpZFNvcnRUb2RvczogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLXNvcnQtdG9kb3MnLCBjYlxuICBvbkRpZEZpbHRlclRvZG9zOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtZmlsdGVyLXRvZG9zJywgY2JcbiAgb25EaWRDaGFuZ2VTZWFyY2hTY29wZTogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLWNoYW5nZS1zY29wZScsIGNiXG5cbiAgY2xlYXI6IC0+XG4gICAgQGNhbmNlbFNlYXJjaCgpXG4gICAgQHRvZG9zID0gW11cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtY2xlYXItdG9kb3MnXG5cbiAgYWRkVG9kbzogKHRvZG8pIC0+XG4gICAgcmV0dXJuIGlmIEBhbHJlYWR5RXhpc3RzKHRvZG8pXG4gICAgQHRvZG9zLnB1c2godG9kbylcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLXRvZG8nLCB0b2RvXG5cbiAgZ2V0VG9kb3M6IC0+IEB0b2Rvc1xuICBnZXRUb2Rvc0NvdW50OiAtPiBAdG9kb3MubGVuZ3RoXG4gIGdldFN0YXRlOiAtPiBAc2VhcmNoaW5nXG5cbiAgc29ydFRvZG9zOiAoe3NvcnRCeSwgc29ydEFzY30gPSB7fSkgLT5cbiAgICBzb3J0QnkgPz0gQGRlZmF1bHRLZXlcblxuICAgICMgU2F2ZSBoaXN0b3J5IG9mIG5ldyBzb3J0IGVsZW1lbnRzXG4gICAgaWYgQHNlYXJjaGVzP1tAc2VhcmNoZXMubGVuZ3RoIC0gMV0uc29ydEJ5IGlzbnQgc29ydEJ5XG4gICAgICBAc2VhcmNoZXMgPz0gW11cbiAgICAgIEBzZWFyY2hlcy5wdXNoIHtzb3J0QnksIHNvcnRBc2N9XG4gICAgZWxzZVxuICAgICAgQHNlYXJjaGVzW0BzZWFyY2hlcy5sZW5ndGggLSAxXSA9IHtzb3J0QnksIHNvcnRBc2N9XG5cbiAgICBAdG9kb3MgPSBAdG9kb3Muc29ydCgodG9kb0EsIHRvZG9CKSA9PlxuICAgICAgQHRvZG9Tb3J0ZXIodG9kb0EsIHRvZG9CLCBzb3J0QnksIHNvcnRBc2MpXG4gICAgKVxuXG4gICAgcmV0dXJuIEBmaWx0ZXJUb2RvcyhAZmlsdGVyKSBpZiBAZmlsdGVyXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXNvcnQtdG9kb3MnLCBAdG9kb3NcblxuICB0b2RvU29ydGVyOiAodG9kb0EsIHRvZG9CLCBzb3J0QnksIHNvcnRBc2MpIC0+XG4gICAgW3NvcnRCeTIsIHNvcnRBc2MyXSA9IFtzb3J0QnksIHNvcnRBc2NdXG5cbiAgICBhVmFsID0gdG9kb0EuZ2V0KHNvcnRCeTIpXG4gICAgYlZhbCA9IHRvZG9CLmdldChzb3J0QnkyKVxuXG4gICAgaWYgYVZhbCBpcyBiVmFsXG4gICAgICAjIFVzZSBwcmV2aW91cyBzb3J0cyB0byBtYWtlIGEgMi1sZXZlbCBzdGFibGUgc29ydFxuICAgICAgaWYgc2VhcmNoID0gQHNlYXJjaGVzP1tAc2VhcmNoZXMubGVuZ3RoIC0gMl1cbiAgICAgICAgW3NvcnRCeTIsIHNvcnRBc2MyXSA9IFtzZWFyY2guc29ydEJ5LCBzZWFyY2guc29ydEFzY11cbiAgICAgIGVsc2VcbiAgICAgICAgc29ydEJ5MiA9IEBkZWZhdWx0S2V5XG5cbiAgICAgIFthVmFsLCBiVmFsXSA9IFt0b2RvQS5nZXQoc29ydEJ5MiksIHRvZG9CLmdldChzb3J0QnkyKV1cblxuICAgICMgU29ydCB0eXBlIGluIHRoZSBkZWZpbmVkIG9yZGVyLCBhcyBudW1iZXIgb3Igbm9ybWFsIHN0cmluZyBzb3J0XG4gICAgaWYgc29ydEJ5MiBpcyAnVHlwZSdcbiAgICAgIGZpbmRUaGVzZVRvZG9zID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuZmluZFRoZXNlVG9kb3MnKVxuICAgICAgY29tcCA9IGZpbmRUaGVzZVRvZG9zLmluZGV4T2YoYVZhbCkgLSBmaW5kVGhlc2VUb2Rvcy5pbmRleE9mKGJWYWwpXG4gICAgZWxzZSBpZiB0b2RvQS5rZXlJc051bWJlcihzb3J0QnkyKVxuICAgICAgY29tcCA9IHBhcnNlSW50KGFWYWwpIC0gcGFyc2VJbnQoYlZhbClcbiAgICBlbHNlXG4gICAgICBjb21wID0gYVZhbC5sb2NhbGVDb21wYXJlKGJWYWwpXG4gICAgaWYgc29ydEFzYzIgdGhlbiBjb21wIGVsc2UgLWNvbXBcblxuICBmaWx0ZXJUb2RvczogKGZpbHRlcikgLT5cbiAgICBpZiBAZmlsdGVyID0gZmlsdGVyXG4gICAgICByZXN1bHQgPSBAdG9kb3MuZmlsdGVyICh0b2RvKSAtPlxuICAgICAgICB0b2RvLmNvbnRhaW5zKGZpbHRlcilcbiAgICBlbHNlXG4gICAgICByZXN1bHQgPSBAdG9kb3NcblxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1maWx0ZXItdG9kb3MnLCByZXN1bHRcblxuICBnZXRBdmFpbGFibGVUYWJsZUl0ZW1zOiAtPiBAYXZhaWxhYmxlSXRlbXNcbiAgc2V0QXZhaWxhYmxlVGFibGVJdGVtczogKEBhdmFpbGFibGVJdGVtcykgLT5cblxuICBnZXRTZWFyY2hTY29wZTogLT4gQHNjb3BlXG4gIHNldFNlYXJjaFNjb3BlOiAoc2NvcGUpIC0+XG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNoYW5nZS1zY29wZScsIEBzY29wZSA9IHNjb3BlXG5cbiAgdG9nZ2xlU2VhcmNoU2NvcGU6IC0+XG4gICAgc2NvcGUgPSBzd2l0Y2ggQHNjb3BlXG4gICAgICB3aGVuICd3b3Jrc3BhY2UnIHRoZW4gJ3Byb2plY3QnXG4gICAgICB3aGVuICdwcm9qZWN0JyB0aGVuICdvcGVuJ1xuICAgICAgd2hlbiAnb3BlbicgdGhlbiAnYWN0aXZlJ1xuICAgICAgZWxzZSAnd29ya3NwYWNlJ1xuICAgIEBzZXRTZWFyY2hTY29wZShzY29wZSlcbiAgICBzY29wZVxuXG4gIGFscmVhZHlFeGlzdHM6IChuZXdUb2RvKSAtPlxuICAgIHByb3BlcnRpZXMgPSBbJ3JhbmdlJywgJ3BhdGgnXVxuICAgIEB0b2Rvcy5zb21lICh0b2RvKSAtPlxuICAgICAgcHJvcGVydGllcy5ldmVyeSAocHJvcCkgLT5cbiAgICAgICAgdHJ1ZSBpZiB0b2RvW3Byb3BdIGlzIG5ld1RvZG9bcHJvcF1cblxuICAjIFNjYW4gcHJvamVjdCB3b3Jrc3BhY2UgZm9yIHRoZSBUb2RvUmVnZXggb2JqZWN0XG4gICMgcmV0dXJucyBhIHByb21pc2UgdGhhdCB0aGUgc2NhbiBnZW5lcmF0ZXNcbiAgZmV0Y2hSZWdleEl0ZW06ICh0b2RvUmVnZXgsIGFjdGl2ZVByb2plY3RPbmx5KSAtPlxuICAgIG9wdGlvbnMgPVxuICAgICAgcGF0aHM6IEBnZXRTZWFyY2hQYXRocygpXG4gICAgICBvblBhdGhzU2VhcmNoZWQ6IChuUGF0aHMpID0+XG4gICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1zZWFyY2gtcGF0aHMnLCBuUGF0aHMgaWYgQHNlYXJjaGluZ1xuXG4gICAgYXRvbS53b3Jrc3BhY2Uuc2NhbiB0b2RvUmVnZXgucmVnZXhwLCBvcHRpb25zLCAocmVzdWx0LCBlcnJvcikgPT5cbiAgICAgIGNvbnNvbGUuZGVidWcgZXJyb3IubWVzc2FnZSBpZiBlcnJvclxuICAgICAgcmV0dXJuIHVubGVzcyByZXN1bHRcblxuICAgICAgcmV0dXJuIGlmIGFjdGl2ZVByb2plY3RPbmx5IGFuZCBub3QgQGFjdGl2ZVByb2plY3RIYXMocmVzdWx0LmZpbGVQYXRoKVxuXG4gICAgICBmb3IgbWF0Y2ggaW4gcmVzdWx0Lm1hdGNoZXNcbiAgICAgICAgQGFkZFRvZG8gbmV3IFRvZG9Nb2RlbChcbiAgICAgICAgICBhbGw6IG1hdGNoLmxpbmVUZXh0XG4gICAgICAgICAgdGV4dDogbWF0Y2gubWF0Y2hUZXh0XG4gICAgICAgICAgbG9jOiByZXN1bHQuZmlsZVBhdGhcbiAgICAgICAgICBwb3NpdGlvbjogbWF0Y2gucmFuZ2VcbiAgICAgICAgICByZWdleDogdG9kb1JlZ2V4LnJlZ2V4XG4gICAgICAgICAgcmVnZXhwOiB0b2RvUmVnZXgucmVnZXhwXG4gICAgICAgIClcblxuICAjIFNjYW4gb3BlbiBmaWxlcyBmb3IgdGhlIFRvZG9SZWdleCBvYmplY3RcbiAgZmV0Y2hPcGVuUmVnZXhJdGVtOiAodG9kb1JlZ2V4LCBhY3RpdmVFZGl0b3JPbmx5KSAtPlxuICAgIGVkaXRvcnMgPSBbXVxuICAgIGlmIGFjdGl2ZUVkaXRvck9ubHlcbiAgICAgIGlmIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClbMF0/LmdldEFjdGl2ZUVkaXRvcigpXG4gICAgICAgIGVkaXRvcnMgPSBbZWRpdG9yXVxuICAgIGVsc2VcbiAgICAgIGVkaXRvcnMgPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG5cbiAgICBmb3IgZWRpdG9yIGluIGVkaXRvcnNcbiAgICAgIGVkaXRvci5zY2FuIHRvZG9SZWdleC5yZWdleHAsIChtYXRjaCwgZXJyb3IpID0+XG4gICAgICAgIGNvbnNvbGUuZGVidWcgZXJyb3IubWVzc2FnZSBpZiBlcnJvclxuICAgICAgICByZXR1cm4gdW5sZXNzIG1hdGNoXG5cbiAgICAgICAgcmFuZ2UgPSBbXG4gICAgICAgICAgW21hdGNoLnJhbmdlLnN0YXJ0LnJvdywgbWF0Y2gucmFuZ2Uuc3RhcnQuY29sdW1uXVxuICAgICAgICAgIFttYXRjaC5yYW5nZS5lbmQucm93LCBtYXRjaC5yYW5nZS5lbmQuY29sdW1uXVxuICAgICAgICBdXG5cbiAgICAgICAgQGFkZFRvZG8gbmV3IFRvZG9Nb2RlbChcbiAgICAgICAgICBhbGw6IG1hdGNoLmxpbmVUZXh0XG4gICAgICAgICAgdGV4dDogbWF0Y2gubWF0Y2hUZXh0XG4gICAgICAgICAgbG9jOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgcG9zaXRpb246IHJhbmdlXG4gICAgICAgICAgcmVnZXg6IHRvZG9SZWdleC5yZWdleFxuICAgICAgICAgIHJlZ2V4cDogdG9kb1JlZ2V4LnJlZ2V4cFxuICAgICAgICApXG5cbiAgICAjIE5vIGFzeW5jIG9wZXJhdGlvbnMsIHNvIGp1c3QgcmV0dXJuIGEgcmVzb2x2ZWQgcHJvbWlzZVxuICAgIFByb21pc2UucmVzb2x2ZSgpXG5cbiAgc2VhcmNoOiAtPlxuICAgIEBjbGVhcigpXG4gICAgQHNlYXJjaGluZyA9IHRydWVcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtc3RhcnQtc2VhcmNoJ1xuXG4gICAgdG9kb1JlZ2V4ID0gbmV3IFRvZG9SZWdleChcbiAgICAgIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRVc2luZ1JlZ2V4JylcbiAgICAgIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJylcbiAgICApXG5cbiAgICBpZiB0b2RvUmVnZXguZXJyb3JcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1mYWlsLXNlYXJjaCcsIFwiSW52YWxpZCB0b2RvIHNlYXJjaCByZWdleFwiXG4gICAgICByZXR1cm5cblxuICAgIEBzZWFyY2hQcm9taXNlID0gc3dpdGNoIEBzY29wZVxuICAgICAgd2hlbiAnb3BlbicgdGhlbiBAZmV0Y2hPcGVuUmVnZXhJdGVtKHRvZG9SZWdleCwgZmFsc2UpXG4gICAgICB3aGVuICdhY3RpdmUnIHRoZW4gQGZldGNoT3BlblJlZ2V4SXRlbSh0b2RvUmVnZXgsIHRydWUpXG4gICAgICB3aGVuICdwcm9qZWN0JyB0aGVuIEBmZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgsIHRydWUpXG4gICAgICBlbHNlIEBmZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG5cbiAgICBAc2VhcmNoUHJvbWlzZS50aGVuIChyZXN1bHQpID0+XG4gICAgICBAc2VhcmNoaW5nID0gZmFsc2VcbiAgICAgIGlmIHJlc3VsdCBpcyAnY2FuY2VsbGVkJ1xuICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtY2FuY2VsLXNlYXJjaCdcbiAgICAgIGVsc2VcbiAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWZpbmlzaC1zZWFyY2gnXG4gICAgLmNhdGNoIChyZWFzb24pID0+XG4gICAgICBAc2VhcmNoaW5nID0gZmFsc2VcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1mYWlsLXNlYXJjaCcsIHJlYXNvblxuXG4gIGdldFNlYXJjaFBhdGhzOiAtPlxuICAgIGlnbm9yZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5pZ25vcmVUaGVzZVBhdGhzJylcbiAgICByZXR1cm4gWycqJ10gdW5sZXNzIGlnbm9yZXM/XG4gICAgaWYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlnbm9yZXMpIGlzbnQgJ1tvYmplY3QgQXJyYXldJ1xuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWZhaWwtc2VhcmNoJywgXCJpZ25vcmVUaGVzZVBhdGhzIG11c3QgYmUgYW4gYXJyYXlcIlxuICAgICAgcmV0dXJuIFsnKiddXG4gICAgXCIhI3tpZ25vcmV9XCIgZm9yIGlnbm9yZSBpbiBpZ25vcmVzXG5cbiAgYWN0aXZlUHJvamVjdEhhczogKGZpbGVQYXRoID0gJycpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBwcm9qZWN0ID0gQGdldEFjdGl2ZVByb2plY3QoKVxuICAgIGZpbGVQYXRoLmluZGV4T2YocHJvamVjdCkgaXMgMFxuXG4gIGdldEFjdGl2ZVByb2plY3Q6IC0+XG4gICAgcmV0dXJuIEBhY3RpdmVQcm9qZWN0IGlmIEBhY3RpdmVQcm9qZWN0XG4gICAgQGFjdGl2ZVByb2plY3QgPSBwcm9qZWN0IGlmIHByb2plY3QgPSBAZ2V0RmFsbGJhY2tQcm9qZWN0KClcblxuICBnZXRGYWxsYmFja1Byb2plY3Q6IC0+XG4gICAgZm9yIGl0ZW0gaW4gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKClcbiAgICAgIGlmIHByb2plY3QgPSBAcHJvamVjdEZvckZpbGUoaXRlbS5nZXRQYXRoPygpKVxuICAgICAgICByZXR1cm4gcHJvamVjdFxuICAgIHByb2plY3QgaWYgcHJvamVjdCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG5cbiAgZ2V0QWN0aXZlUHJvamVjdE5hbWU6IC0+XG4gICAgcHJvamVjdE5hbWUgPSBwYXRoLmJhc2VuYW1lKEBnZXRBY3RpdmVQcm9qZWN0KCkpXG4gICAgaWYgcHJvamVjdE5hbWUgaXMgJ3VuZGVmaW5lZCcgdGhlbiBcIm5vIGFjdGl2ZSBwcm9qZWN0XCIgZWxzZSBwcm9qZWN0TmFtZVxuXG4gIHNldEFjdGl2ZVByb2plY3Q6IChmaWxlUGF0aCkgLT5cbiAgICBsYXN0UHJvamVjdCA9IEBhY3RpdmVQcm9qZWN0XG4gICAgQGFjdGl2ZVByb2plY3QgPSBwcm9qZWN0IGlmIHByb2plY3QgPSBAcHJvamVjdEZvckZpbGUoZmlsZVBhdGgpXG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBsYXN0UHJvamVjdFxuICAgIGxhc3RQcm9qZWN0IGlzbnQgQGFjdGl2ZVByb2plY3RcblxuICBwcm9qZWN0Rm9yRmlsZTogKGZpbGVQYXRoKSAtPlxuICAgIHJldHVybiBpZiB0eXBlb2YgZmlsZVBhdGggaXNudCAnc3RyaW5nJ1xuICAgIHByb2plY3QgaWYgcHJvamVjdCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF1cblxuICBnZXRNYXJrZG93bjogLT5cbiAgICB0b2Rvc01hcmtkb3duID0gbmV3IFRvZG9zTWFya2Rvd25cbiAgICB0b2Rvc01hcmtkb3duLm1hcmtkb3duIEBnZXRUb2RvcygpXG5cbiAgY2FuY2VsU2VhcmNoOiAtPlxuICAgIEBzZWFyY2hQcm9taXNlPy5jYW5jZWw/KClcblxuICAjIFRPRE86IFByZXZpb3VzIHNlYXJjaGVzIGFyZSBub3Qgc2F2ZWQgeWV0IVxuICBnZXRQcmV2aW91c1NlYXJjaDogLT5cbiAgICBzb3J0QnkgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSAndG9kby1zaG93LnByZXZpb3VzLXNvcnRCeSdcblxuICBzZXRQcmV2aW91c1NlYXJjaDogKHNlYXJjaCkgLT5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSAndG9kby1zaG93LnByZXZpb3VzLXNlYXJjaCcsIHNlYXJjaFxuIl19
