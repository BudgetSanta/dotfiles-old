(function() {
  var CompositeDisposable, ShowTodoView, TodoCollection, TodoIndicatorView;

  CompositeDisposable = require('atom').CompositeDisposable;

  ShowTodoView = require('./todo-view');

  TodoCollection = require('./todo-collection');

  TodoIndicatorView = null;

  module.exports = {
    config: {
      findTheseTodos: {
        description: 'An array of todo types used by the search regex.',
        type: 'array',
        "default": ['TODO', 'FIXME', 'CHANGED', 'XXX', 'IDEA', 'HACK', 'NOTE', 'REVIEW', 'NB', 'BUG', 'QUESTION', 'COMBAK', 'TEMP'],
        items: {
          type: 'string'
        }
      },
      findUsingRegex: {
        description: 'Regex string used to find all your todos. `${TODOS}` is replaced with `FindTheseTodos` from above.',
        type: 'string',
        "default": '/\\b(${TODOS})[:;.,]?\\d*($|\\s.*$|\\(.*$)/g'
      },
      ignoreThesePaths: {
        description: 'Similar to `.gitignore` (remember to use `/` on Mac/Linux and `\\` on Windows for subdirectories).',
        type: 'array',
        "default": ['node_modules', 'vendor', 'bower_components'],
        items: {
          type: 'string'
        }
      },
      showInTable: {
        description: 'An array of properties to show for each todo in table.',
        type: 'array',
        "default": ['Text', 'Type', 'Path']
      },
      sortBy: {
        type: 'string',
        "default": 'Text',
        "enum": ['All', 'Text', 'Type', 'Range', 'Line', 'Regex', 'Path', 'File', 'Tags', 'Id', 'Project']
      },
      sortAscending: {
        type: 'boolean',
        "default": true
      },
      openListInDirection: {
        description: 'Defines where the todo list is shown when opened.',
        type: 'string',
        "default": 'right',
        "enum": ['up', 'right', 'down', 'left', 'ontop']
      },
      rememberViewSize: {
        type: 'boolean',
        "default": true
      },
      saveOutputAs: {
        type: 'string',
        "default": 'List',
        "enum": ['List', 'Table']
      },
      statusBarIndicator: {
        type: 'boolean',
        "default": false
      }
    },
    URI: {
      workspace: 'atom://todo-show/todos',
      project: 'atom://todo-show/project-todos',
      open: 'atom://todo-show/open-todos',
      active: 'atom://todo-show/active-todos'
    },
    activate: function() {
      this.collection = new TodoCollection;
      this.collection.setAvailableTableItems(this.config.sortBy["enum"]);
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.commands.add('atom-workspace', {
        'todo-show:find-in-workspace': (function(_this) {
          return function() {
            return _this.show(_this.URI.workspace);
          };
        })(this),
        'todo-show:find-in-project': (function(_this) {
          return function() {
            return _this.show(_this.URI.project);
          };
        })(this),
        'todo-show:find-in-open-files': (function(_this) {
          return function() {
            return _this.show(_this.URI.open);
          };
        })(this),
        'todo-show:find-in-active-file': (function(_this) {
          return function() {
            return _this.show(_this.URI.active);
          };
        })(this)
      }));
      return this.disposables.add(atom.workspace.addOpener((function(_this) {
        return function(uriToOpen) {
          var scope;
          scope = (function() {
            switch (uriToOpen) {
              case this.URI.workspace:
                return 'workspace';
              case this.URI.project:
                return 'project';
              case this.URI.open:
                return 'open';
              case this.URI.active:
                return 'active';
            }
          }).call(_this);
          if (scope) {
            _this.collection.scope = scope;
            return new ShowTodoView(_this.collection, uriToOpen);
          }
        };
      })(this)));
    },
    deactivate: function() {
      var ref;
      this.destroyTodoIndicator();
      return (ref = this.disposables) != null ? ref.dispose() : void 0;
    },
    destroyPaneItem: function() {
      var pane;
      pane = atom.workspace.paneForItem(this.showTodoView);
      if (!pane) {
        return false;
      }
      pane.destroyItem(this.showTodoView);
      if (pane.getItems().length === 0) {
        pane.destroy();
      }
      return true;
    },
    show: function(uri) {
      var direction, prevPane;
      prevPane = atom.workspace.getActivePane();
      direction = atom.config.get('todo-show.openListInDirection');
      if (this.destroyPaneItem()) {
        return;
      }
      switch (direction) {
        case 'down':
          if (prevPane.parent.orientation !== 'vertical') {
            prevPane.splitDown();
          }
          break;
        case 'up':
          if (prevPane.parent.orientation !== 'vertical') {
            prevPane.splitUp();
          }
          break;
        case 'left':
          if (prevPane.parent.orientation !== 'horizontal') {
            prevPane.splitLeft();
          }
      }
      return atom.workspace.open(uri, {
        split: direction
      }).then((function(_this) {
        return function(showTodoView) {
          _this.showTodoView = showTodoView;
          return prevPane.activate();
        };
      })(this));
    },
    consumeStatusBar: function(statusBar) {
      return atom.config.observe('todo-show.statusBarIndicator', (function(_this) {
        return function(newValue) {
          if (newValue) {
            if (TodoIndicatorView == null) {
              TodoIndicatorView = require('./todo-indicator-view');
            }
            if (_this.todoIndicatorView == null) {
              _this.todoIndicatorView = new TodoIndicatorView(_this.collection);
            }
            return _this.statusBarTile = statusBar.addLeftTile({
              item: _this.todoIndicatorView,
              priority: 200
            });
          } else {
            return _this.destroyTodoIndicator();
          }
        };
      })(this));
    },
    destroyTodoIndicator: function() {
      var ref, ref1;
      if ((ref = this.todoIndicatorView) != null) {
        ref.destroy();
      }
      this.todoIndicatorView = null;
      if ((ref1 = this.statusBarTile) != null) {
        ref1.destroy();
      }
      return this.statusBarTile = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi9zaG93LXRvZG8uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLFlBQUEsR0FBZSxPQUFBLENBQVEsYUFBUjs7RUFDZixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUjs7RUFDakIsaUJBQUEsR0FBb0I7O0VBRXBCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSxjQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsa0RBQWI7UUFDQSxJQUFBLEVBQU0sT0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FDUCxNQURPLEVBRVAsT0FGTyxFQUdQLFNBSE8sRUFJUCxLQUpPLEVBS1AsTUFMTyxFQU1QLE1BTk8sRUFPUCxNQVBPLEVBUVAsUUFSTyxFQVNQLElBVE8sRUFVUCxLQVZPLEVBV1AsVUFYTyxFQVlQLFFBWk8sRUFhUCxNQWJPLENBRlQ7UUFpQkEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FsQkY7T0FERjtNQW9CQSxjQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsb0dBQWI7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsOENBRlQ7T0FyQkY7TUF3QkEsZ0JBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSxvR0FBYjtRQUNBLElBQUEsRUFBTSxPQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUNQLGNBRE8sRUFFUCxRQUZPLEVBR1Asa0JBSE8sQ0FGVDtRQU9BLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1NBUkY7T0F6QkY7TUFrQ0EsV0FBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLHdEQUFiO1FBQ0EsSUFBQSxFQUFNLE9BRE47UUFFQSxDQUFBLE9BQUEsQ0FB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b0JBQUQsQ0FBQSxFQUxGOztRQURrRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEQ7SUFEZ0IsQ0F4SGxCO0lBaUlBLG9CQUFBLEVBQXNCLFNBQUE7QUFDcEIsVUFBQTs7V0FBa0IsQ0FBRSxPQUFwQixDQUFBOztNQUNBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjs7WUFDUCxDQUFFLE9BQWhCLENBQUE7O2FBQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUI7SUFKRyxDQWpJdEI7O0FBUEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5TaG93VG9kb1ZpZXcgPSByZXF1aXJlICcuL3RvZG8tdmlldydcblRvZG9Db2xsZWN0aW9uID0gcmVxdWlyZSAnLi90b2RvLWNvbGxlY3Rpb24nXG5Ub2RvSW5kaWNhdG9yVmlldyA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgZmluZFRoZXNlVG9kb3M6XG4gICAgICBkZXNjcmlwdGlvbjogJ0FuIGFycmF5IG9mIHRvZG8gdHlwZXMgdXNlZCBieSB0aGUgc2VhcmNoIHJlZ2V4LidcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFtcbiAgICAgICAgJ1RPRE8nXG4gICAgICAgICdGSVhNRSdcbiAgICAgICAgJ0NIQU5HRUQnXG4gICAgICAgICdYWFgnXG4gICAgICAgICdJREVBJ1xuICAgICAgICAnSEFDSydcbiAgICAgICAgJ05PVEUnXG4gICAgICAgICdSRVZJRVcnXG4gICAgICAgICdOQidcbiAgICAgICAgJ0JVRydcbiAgICAgICAgJ1FVRVNUSU9OJ1xuICAgICAgICAnQ09NQkFLJ1xuICAgICAgICAnVEVNUCdcbiAgICAgIF1cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIGZpbmRVc2luZ1JlZ2V4OlxuICAgICAgZGVzY3JpcHRpb246ICdSZWdleCBzdHJpbmcgdXNlZCB0byBmaW5kIGFsbCB5b3VyIHRvZG9zLiBgJHtUT0RPU31gIGlzIHJlcGxhY2VkIHdpdGggYEZpbmRUaGVzZVRvZG9zYCBmcm9tIGFib3ZlLidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnL1xcXFxiKCR7VE9ET1N9KVs6Oy4sXT9cXFxcZCooJHxcXFxccy4qJHxcXFxcKC4qJCkvZydcbiAgICBpZ25vcmVUaGVzZVBhdGhzOlxuICAgICAgZGVzY3JpcHRpb246ICdTaW1pbGFyIHRvIGAuZ2l0aWdub3JlYCAocmVtZW1iZXIgdG8gdXNlIGAvYCBvbiBNYWMvTGludXggYW5kIGBcXFxcYCBvbiBXaW5kb3dzIGZvciBzdWJkaXJlY3RvcmllcykuJ1xuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogW1xuICAgICAgICAnbm9kZV9tb2R1bGVzJ1xuICAgICAgICAndmVuZG9yJ1xuICAgICAgICAnYm93ZXJfY29tcG9uZW50cydcbiAgICAgIF1cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIHNob3dJblRhYmxlOlxuICAgICAgZGVzY3JpcHRpb246ICdBbiBhcnJheSBvZiBwcm9wZXJ0aWVzIHRvIHNob3cgZm9yIGVhY2ggdG9kbyBpbiB0YWJsZS4nXG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbJ1RleHQnLCAnVHlwZScsICdQYXRoJ11cbiAgICBzb3J0Qnk6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ1RleHQnXG4gICAgICBlbnVtOiBbJ0FsbCcsICdUZXh0JywgJ1R5cGUnLCAnUmFuZ2UnLCAnTGluZScsICdSZWdleCcsICdQYXRoJywgJ0ZpbGUnLCAnVGFncycsICdJZCcsICdQcm9qZWN0J11cbiAgICBzb3J0QXNjZW5kaW5nOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgb3Blbkxpc3RJbkRpcmVjdGlvbjpcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGVmaW5lcyB3aGVyZSB0aGUgdG9kbyBsaXN0IGlzIHNob3duIHdoZW4gb3BlbmVkLidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAncmlnaHQnXG4gICAgICBlbnVtOiBbJ3VwJywgJ3JpZ2h0JywgJ2Rvd24nLCAnbGVmdCcsICdvbnRvcCddXG4gICAgcmVtZW1iZXJWaWV3U2l6ZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIHNhdmVPdXRwdXRBczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnTGlzdCdcbiAgICAgIGVudW06IFsnTGlzdCcsICdUYWJsZSddXG4gICAgc3RhdHVzQmFySW5kaWNhdG9yOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuXG4gIFVSSTpcbiAgICB3b3Jrc3BhY2U6ICdhdG9tOi8vdG9kby1zaG93L3RvZG9zJ1xuICAgIHByb2plY3Q6ICdhdG9tOi8vdG9kby1zaG93L3Byb2plY3QtdG9kb3MnXG4gICAgb3BlbjogJ2F0b206Ly90b2RvLXNob3cvb3Blbi10b2RvcydcbiAgICBhY3RpdmU6ICdhdG9tOi8vdG9kby1zaG93L2FjdGl2ZS10b2RvcydcblxuICBhY3RpdmF0ZTogLT5cbiAgICBAY29sbGVjdGlvbiA9IG5ldyBUb2RvQ29sbGVjdGlvblxuICAgIEBjb2xsZWN0aW9uLnNldEF2YWlsYWJsZVRhYmxlSXRlbXMoQGNvbmZpZy5zb3J0QnkuZW51bSlcblxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ3RvZG8tc2hvdzpmaW5kLWluLXdvcmtzcGFjZSc6ID0+IEBzaG93KEBVUkkud29ya3NwYWNlKVxuICAgICAgJ3RvZG8tc2hvdzpmaW5kLWluLXByb2plY3QnOiA9PiBAc2hvdyhAVVJJLnByb2plY3QpXG4gICAgICAndG9kby1zaG93OmZpbmQtaW4tb3Blbi1maWxlcyc6ID0+IEBzaG93KEBVUkkub3BlbilcbiAgICAgICd0b2RvLXNob3c6ZmluZC1pbi1hY3RpdmUtZmlsZSc6ID0+IEBzaG93KEBVUkkuYWN0aXZlKVxuXG4gICAgIyBSZWdpc3RlciB0aGUgdG9kb2xpc3QgVVJJLCB3aGljaCB3aWxsIHRoZW4gb3BlbiBvdXIgY3VzdG9tIHZpZXdcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lciAodXJpVG9PcGVuKSA9PlxuICAgICAgc2NvcGUgPSBzd2l0Y2ggdXJpVG9PcGVuXG4gICAgICAgIHdoZW4gQFVSSS53b3Jrc3BhY2UgdGhlbiAnd29ya3NwYWNlJ1xuICAgICAgICB3aGVuIEBVUkkucHJvamVjdCB0aGVuICdwcm9qZWN0J1xuICAgICAgICB3aGVuIEBVUkkub3BlbiB0aGVuICdvcGVuJ1xuICAgICAgICB3aGVuIEBVUkkuYWN0aXZlIHRoZW4gJ2FjdGl2ZSdcbiAgICAgIGlmIHNjb3BlXG4gICAgICAgIEBjb2xsZWN0aW9uLnNjb3BlID0gc2NvcGVcbiAgICAgICAgbmV3IFNob3dUb2RvVmlldyhAY29sbGVjdGlvbiwgdXJpVG9PcGVuKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGRlc3Ryb3lUb2RvSW5kaWNhdG9yKClcbiAgICBAZGlzcG9zYWJsZXM/LmRpc3Bvc2UoKVxuXG4gIGRlc3Ryb3lQYW5lSXRlbTogLT5cbiAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oQHNob3dUb2RvVmlldylcbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIHBhbmVcblxuICAgIHBhbmUuZGVzdHJveUl0ZW0oQHNob3dUb2RvVmlldylcbiAgICAjIElnbm9yZSBjb3JlLmRlc3Ryb3lFbXB0eVBhbmVzIGFuZCBjbG9zZSBlbXB0eSBwYW5lXG4gICAgcGFuZS5kZXN0cm95KCkgaWYgcGFuZS5nZXRJdGVtcygpLmxlbmd0aCBpcyAwXG4gICAgcmV0dXJuIHRydWVcblxuICBzaG93OiAodXJpKSAtPlxuICAgIHByZXZQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgZGlyZWN0aW9uID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cub3Blbkxpc3RJbkRpcmVjdGlvbicpXG5cbiAgICByZXR1cm4gaWYgQGRlc3Ryb3lQYW5lSXRlbSgpXG5cbiAgICBzd2l0Y2ggZGlyZWN0aW9uXG4gICAgICB3aGVuICdkb3duJ1xuICAgICAgICBwcmV2UGFuZS5zcGxpdERvd24oKSBpZiBwcmV2UGFuZS5wYXJlbnQub3JpZW50YXRpb24gaXNudCAndmVydGljYWwnXG4gICAgICB3aGVuICd1cCdcbiAgICAgICAgcHJldlBhbmUuc3BsaXRVcCgpIGlmIHByZXZQYW5lLnBhcmVudC5vcmllbnRhdGlvbiBpc250ICd2ZXJ0aWNhbCdcbiAgICAgIHdoZW4gJ2xlZnQnXG4gICAgICAgIHByZXZQYW5lLnNwbGl0TGVmdCgpIGlmIHByZXZQYW5lLnBhcmVudC5vcmllbnRhdGlvbiBpc250ICdob3Jpem9udGFsJ1xuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3Blbih1cmksIHNwbGl0OiBkaXJlY3Rpb24pLnRoZW4gKEBzaG93VG9kb1ZpZXcpID0+XG4gICAgICBwcmV2UGFuZS5hY3RpdmF0ZSgpXG5cbiAgY29uc3VtZVN0YXR1c0JhcjogKHN0YXR1c0JhcikgLT5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICd0b2RvLXNob3cuc3RhdHVzQmFySW5kaWNhdG9yJywgKG5ld1ZhbHVlKSA9PlxuICAgICAgaWYgbmV3VmFsdWVcbiAgICAgICAgVG9kb0luZGljYXRvclZpZXcgPz0gcmVxdWlyZSAnLi90b2RvLWluZGljYXRvci12aWV3J1xuICAgICAgICBAdG9kb0luZGljYXRvclZpZXcgPz0gbmV3IFRvZG9JbmRpY2F0b3JWaWV3KEBjb2xsZWN0aW9uKVxuICAgICAgICBAc3RhdHVzQmFyVGlsZSA9IHN0YXR1c0Jhci5hZGRMZWZ0VGlsZShpdGVtOiBAdG9kb0luZGljYXRvclZpZXcsIHByaW9yaXR5OiAyMDApXG4gICAgICBlbHNlXG4gICAgICAgIEBkZXN0cm95VG9kb0luZGljYXRvcigpXG5cbiAgZGVzdHJveVRvZG9JbmRpY2F0b3I6IC0+XG4gICAgQHRvZG9JbmRpY2F0b3JWaWV3Py5kZXN0cm95KClcbiAgICBAdG9kb0luZGljYXRvclZpZXcgPSBudWxsXG4gICAgQHN0YXR1c0JhclRpbGU/LmRlc3Ryb3koKVxuICAgIEBzdGF0dXNCYXJUaWxlID0gbnVsbFxuIl19
