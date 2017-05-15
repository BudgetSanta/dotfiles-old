(function() {
  var $, BufferedProcess, CompositeDisposable, Os, Path, TagCreateView, TextEditorView, View, fs, git, notifier, ref, ref1,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  ref = require('atom'), BufferedProcess = ref.BufferedProcess, CompositeDisposable = ref.CompositeDisposable;

  ref1 = require('atom-space-pen-views'), $ = ref1.$, TextEditorView = ref1.TextEditorView, View = ref1.View;

  notifier = require('../notifier');

  git = require('../git');

  module.exports = TagCreateView = (function(superClass) {
    extend(TagCreateView, superClass);

    function TagCreateView() {
      return TagCreateView.__super__.constructor.apply(this, arguments);
    }

    TagCreateView.content = function() {
      return this.div((function(_this) {
        return function() {
          _this.div({
            "class": 'block'
          }, function() {
            return _this.subview('tagName', new TextEditorView({
              mini: true,
              placeholderText: 'Tag'
            }));
          });
          _this.div({
            "class": 'block'
          }, function() {
            return _this.subview('tagMessage', new TextEditorView({
              mini: true,
              placeholderText: 'Annotation message'
            }));
          });
          return _this.div({
            "class": 'block'
          }, function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight gp-confirm-button',
                click: 'createTag'
              }, 'Create Tag');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight gp-cancel-button',
                click: 'destroy'
              }, 'Cancel');
            });
          });
        };
      })(this));
    };

    TagCreateView.prototype.initialize = function(repo) {
      this.repo = repo;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.tagName.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function() {
            return _this.createTag();
          };
        })(this)
      }));
    };

    TagCreateView.prototype.createTag = function() {
      var tag;
      tag = {
        name: this.tagName.getModel().getText(),
        message: this.tagMessage.getModel().getText()
      };
      git.cmd(['tag', '-a', tag.name, '-m', tag.message], {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(success) {
        if (success) {
          return notifier.addSuccess("Tag '" + tag.name + "' has been created successfully!");
        }
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
      return this.destroy();
    };

    TagCreateView.prototype.destroy = function() {
      var ref2;
      if ((ref2 = this.panel) != null) {
        ref2.destroy();
      }
      this.disposables.dispose();
      return this.currentPane.activate();
    };

    return TagCreateView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3RhZy1jcmVhdGUtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9IQUFBO0lBQUE7OztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUVMLE1BQXlDLE9BQUEsQ0FBUSxNQUFSLENBQXpDLEVBQUMscUNBQUQsRUFBa0I7O0VBQ2xCLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFVBQUQsRUFBSSxvQ0FBSixFQUFvQjs7RUFDcEIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFFTixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osYUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDSCxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFQO1dBQUwsRUFBcUIsU0FBQTttQkFDbkIsS0FBQyxDQUFBLE9BQUQsQ0FBUyxTQUFULEVBQXdCLElBQUEsY0FBQSxDQUFlO2NBQUEsSUFBQSxFQUFNLElBQU47Y0FBWSxlQUFBLEVBQWlCLEtBQTdCO2FBQWYsQ0FBeEI7VUFEbUIsQ0FBckI7VUFFQSxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFQO1dBQUwsRUFBcUIsU0FBQTttQkFDbkIsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQTJCLElBQUEsY0FBQSxDQUFlO2NBQUEsSUFBQSxFQUFNLElBQU47Y0FBWSxlQUFBLEVBQWlC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WCxPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7O1lBQU0sQ0FBRSxPQUFSLENBQUE7O01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBQTtJQUhPOzs7O0tBL0JpQjtBQVY1QiIsInNvdXJjZXNDb250ZW50IjpbIk9zID0gcmVxdWlyZSAnb3MnXG5QYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcblxue0J1ZmZlcmVkUHJvY2VzcywgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xueyQsIFRleHRFZGl0b3JWaWV3LCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcblxubW9kdWxlLmV4cG9ydHM9XG5jbGFzcyBUYWdDcmVhdGVWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2ID0+XG4gICAgICBAZGl2IGNsYXNzOiAnYmxvY2snLCA9PlxuICAgICAgICBAc3VidmlldyAndGFnTmFtZScsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6ICdUYWcnKVxuICAgICAgQGRpdiBjbGFzczogJ2Jsb2NrJywgPT5cbiAgICAgICAgQHN1YnZpZXcgJ3RhZ01lc3NhZ2UnLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiAnQW5ub3RhdGlvbiBtZXNzYWdlJylcbiAgICAgIEBkaXYgY2xhc3M6ICdibG9jaycsID0+XG4gICAgICAgIEBzcGFuIGNsYXNzOiAncHVsbC1sZWZ0JywgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1zdWNjZXNzIGlubGluZS1ibG9jay10aWdodCBncC1jb25maXJtLWJ1dHRvbicsIGNsaWNrOiAnY3JlYXRlVGFnJywgJ0NyZWF0ZSBUYWcnXG4gICAgICAgIEBzcGFuIGNsYXNzOiAncHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tZXJyb3IgaW5saW5lLWJsb2NrLXRpZ2h0IGdwLWNhbmNlbC1idXR0b24nLCBjbGljazogJ2Rlc3Ryb3knLCAnQ2FuY2VsJ1xuXG4gIGluaXRpYWxpemU6IChAcmVwbykgLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBjdXJyZW50UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEB0YWdOYW1lLmZvY3VzKClcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y2FuY2VsJzogPT4gQGRlc3Ryb3koKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjb25maXJtJzogPT4gQGNyZWF0ZVRhZygpXG5cbiAgY3JlYXRlVGFnOiAtPlxuICAgIHRhZyA9IG5hbWU6IEB0YWdOYW1lLmdldE1vZGVsKCkuZ2V0VGV4dCgpLCBtZXNzYWdlOiBAdGFnTWVzc2FnZS5nZXRNb2RlbCgpLmdldFRleHQoKVxuICAgIGdpdC5jbWQoWyd0YWcnLCAnLWEnLCB0YWcubmFtZSwgJy1tJywgdGFnLm1lc3NhZ2VdLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoc3VjY2VzcykgLT5cbiAgICAgIG5vdGlmaWVyLmFkZFN1Y2Nlc3MoXCJUYWcgJyN7dGFnLm5hbWV9JyBoYXMgYmVlbiBjcmVhdGVkIHN1Y2Nlc3NmdWxseSFcIikgaWYgc3VjY2Vzc1xuICAgIC5jYXRjaCAobXNnKSAtPlxuICAgICAgbm90aWZpZXIuYWRkRXJyb3IgbXNnXG4gICAgQGRlc3Ryb3koKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHBhbmVsPy5kZXN0cm95KClcbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgQGN1cnJlbnRQYW5lLmFjdGl2YXRlKClcbiJdfQ==
