(function() {
  var CompositeDisposable, MinimapFindAndReplaceBinding;

  CompositeDisposable = require('atom').CompositeDisposable;

  MinimapFindAndReplaceBinding = null;

  module.exports = {
    active: false,
    bindingsById: {},
    subscriptionsById: {},
    isActive: function() {
      return this.active;
    },
    activate: function(state) {
      return this.subscriptions = new CompositeDisposable;
    },
    consumeMinimapServiceV1: function(minimap1) {
      this.minimap = minimap1;
      return this.minimap.registerPlugin('find-and-replace', this);
    },
    deactivate: function() {
      this.minimap.unregisterPlugin('find-and-replace');
      return this.minimap = null;
    },
    activatePlugin: function() {
      var fnrHasServiceAPI, fnrVersion;
      if (this.active) {
        return;
      }
      this.active = true;
      fnrVersion = atom.packages.getLoadedPackage('find-and-replace').metadata.version;
      fnrHasServiceAPI = parseFloat(fnrVersion) >= 0.194;
      if (fnrHasServiceAPI) {
        this.initializeServiceAPI();
      } else {
        this.initializeLegacyAPI();
      }
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'find-and-replace:show': (function(_this) {
          return function() {
            return _this.discoverMarkers();
          };
        })(this),
        'find-and-replace:toggle': (function(_this) {
          return function() {
            return _this.discoverMarkers();
          };
        })(this),
        'find-and-replace:show-replace': (function(_this) {
          return function() {
            return _this.discoverMarkers();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.clearBindings();
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.clearBindings();
          };
        })(this)
      }));
    },
    initializeServiceAPI: function() {
      return atom.packages.serviceHub.consume('find-and-replace', '0.0.1', (function(_this) {
        return function(fnr) {
          return _this.subscriptions.add(_this.minimap.observeMinimaps(function(minimap) {
            var binding, id;
            if (MinimapFindAndReplaceBinding == null) {
              MinimapFindAndReplaceBinding = require('./minimap-find-and-replace-binding');
            }
            id = minimap.id;
            binding = new MinimapFindAndReplaceBinding(minimap, fnr);
            _this.bindingsById[id] = binding;
            return _this.subscriptionsById[id] = minimap.onDidDestroy(function() {
              var ref, ref1;
              if ((ref = _this.subscriptionsById[id]) != null) {
                ref.dispose();
              }
              if ((ref1 = _this.bindingsById[id]) != null) {
                ref1.destroy();
              }
              delete _this.bindingsById[id];
              return delete _this.subscriptionsById[id];
            });
          }));
        };
      })(this));
    },
    initializeLegacyAPI: function() {
      return this.subscriptions.add(this.minimap.observeMinimaps((function(_this) {
        return function(minimap) {
          var binding, id;
          if (MinimapFindAndReplaceBinding == null) {
            MinimapFindAndReplaceBinding = require('./minimap-find-and-replace-binding');
          }
          id = minimap.id;
          binding = new MinimapFindAndReplaceBinding(minimap);
          _this.bindingsById[id] = binding;
          return _this.subscriptionsById[id] = minimap.onDidDestroy(function() {
            var ref, ref1;
            if ((ref = _this.subscriptionsById[id]) != null) {
              ref.dispose();
            }
            if ((ref1 = _this.bindingsById[id]) != null) {
              ref1.destroy();
            }
            delete _this.bindingsById[id];
            return delete _this.subscriptionsById[id];
          });
        };
      })(this)));
    },
    deactivatePlugin: function() {
      var binding, id, ref, ref1, sub;
      if (!this.active) {
        return;
      }
      this.active = false;
      this.subscriptions.dispose();
      ref = this.subscriptionsById;
      for (id in ref) {
        sub = ref[id];
        sub.dispose();
      }
      ref1 = this.bindingsById;
      for (id in ref1) {
        binding = ref1[id];
        binding.destroy();
      }
      this.bindingsById = {};
      return this.subscriptionsById = {};
    },
    discoverMarkers: function() {
      var binding, id, ref, results;
      ref = this.bindingsById;
      results = [];
      for (id in ref) {
        binding = ref[id];
        results.push(binding.discoverMarkers());
      }
      return results;
    },
    clearBindings: function() {
      var binding, id, ref, results;
      ref = this.bindingsById;
      results = [];
      for (id in ref) {
        binding = ref[id];
        results.push(binding.clear());
      }
      return results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvbWluaW1hcC1maW5kLWFuZC1yZXBsYWNlL2xpYi9taW5pbWFwLWZpbmQtYW5kLXJlcGxhY2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLDRCQUFBLEdBQStCOztFQUUvQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUFRLEtBQVI7SUFDQSxZQUFBLEVBQWMsRUFEZDtJQUVBLGlCQUFBLEVBQW1CLEVBRm5CO0lBSUEsUUFBQSxFQUFVLFNBQUE7YUFBRyxJQUFDLENBQUE7SUFBSixDQUpWO0lBTUEsUUFBQSxFQUFVLFNBQUMsS0FBRDthQUNSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7SUFEYixDQU5WO0lBU0EsdUJBQUEsRUFBeUIsU0FBQyxRQUFEO01BQUMsSUFBQyxDQUFBLFVBQUQ7YUFDeEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxjQUFULENBQXdCLGtCQUF4QixFQUE0QyxJQUE1QztJQUR1QixDQVR6QjtJQVlBLFVBQUEsRUFBWSxTQUFBO01BQ1YsSUFBQyxDQUFBLE9BQU8sQ0FBQyxnQkFBVCxDQUEwQixrQkFBMUI7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXO0lBRkQsQ0FaWjtJQWdCQSxjQUFBLEVBQWdCLFNBQUE7QUFDZCxVQUFBO01BQUEsSUFBVSxJQUFDLENBQUEsTUFBWDtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUVWLFVBQUEsR0FBYSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLGtCQUEvQixDQUFrRCxDQUFDLFFBQVEsQ0FBQztNQUN6RSxnQkFBQSxHQUFtQixVQUFBLENBQVcsVUFBWCxDQUFBLElBQTBCO01BRTdDLElBQUcsZ0JBQUg7UUFDRSxJQUFDLENBQUEsb0JBQUQsQ0FBQSxFQURG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QUFyQjtRQVBpQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekIsQ0FBbkI7SUFEbUIsQ0FwRHJCO0lBbUVBLGdCQUFBLEVBQWtCLFNBQUE7QUFDaEIsVUFBQTtNQUFBLElBQUEsQ0FBYyxJQUFDLENBQUEsTUFBZjtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0FBRUE7QUFBQSxXQUFBLFNBQUE7O1FBQUEsR0FBRyxDQUFDLE9BQUosQ0FBQTtBQUFBO0FBQ0E7QUFBQSxXQUFBLFVBQUE7O1FBQUEsT0FBTyxDQUFDLE9BQVIsQ0FBQTtBQUFBO01BRUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7YUFDaEIsSUFBQyxDQUFBLGlCQUFELEdBQXFCO0lBVkwsQ0FuRWxCO0lBK0VBLGVBQUEsRUFBaUIsU0FBQTtBQUNmLFVBQUE7QUFBQTtBQUFBO1dBQUEsU0FBQTs7cUJBQUEsT0FBTyxDQUFDLGVBQVIsQ0FBQTtBQUFBOztJQURlLENBL0VqQjtJQWtGQSxhQUFBLEVBQWUsU0FBQTtBQUNiLFVBQUE7QUFBQTtBQUFBO1dBQUEsU0FBQTs7cUJBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBQTtBQUFBOztJQURhLENBbEZmOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbk1pbmltYXBGaW5kQW5kUmVwbGFjZUJpbmRpbmcgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZlOiBmYWxzZVxuICBiaW5kaW5nc0J5SWQ6IHt9XG4gIHN1YnNjcmlwdGlvbnNCeUlkOiB7fVxuXG4gIGlzQWN0aXZlOiAtPiBAYWN0aXZlXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgY29uc3VtZU1pbmltYXBTZXJ2aWNlVjE6IChAbWluaW1hcCkgLT5cbiAgICBAbWluaW1hcC5yZWdpc3RlclBsdWdpbiAnZmluZC1hbmQtcmVwbGFjZScsIHRoaXNcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBtaW5pbWFwLnVucmVnaXN0ZXJQbHVnaW4gJ2ZpbmQtYW5kLXJlcGxhY2UnXG4gICAgQG1pbmltYXAgPSBudWxsXG5cbiAgYWN0aXZhdGVQbHVnaW46IC0+XG4gICAgcmV0dXJuIGlmIEBhY3RpdmVcblxuICAgIEBhY3RpdmUgPSB0cnVlXG5cbiAgICBmbnJWZXJzaW9uID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKCdmaW5kLWFuZC1yZXBsYWNlJykubWV0YWRhdGEudmVyc2lvblxuICAgIGZuckhhc1NlcnZpY2VBUEkgPSBwYXJzZUZsb2F0KGZuclZlcnNpb24pID49IDAuMTk0XG5cbiAgICBpZiBmbnJIYXNTZXJ2aWNlQVBJXG4gICAgICBAaW5pdGlhbGl6ZVNlcnZpY2VBUEkoKVxuICAgIGVsc2VcbiAgICAgIEBpbml0aWFsaXplTGVnYWN5QVBJKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ2ZpbmQtYW5kLXJlcGxhY2U6c2hvdyc6ID0+IEBkaXNjb3Zlck1hcmtlcnMoKVxuICAgICAgJ2ZpbmQtYW5kLXJlcGxhY2U6dG9nZ2xlJzogPT4gQGRpc2NvdmVyTWFya2VycygpXG4gICAgICAnZmluZC1hbmQtcmVwbGFjZTpzaG93LXJlcGxhY2UnOiA9PiBAZGlzY292ZXJNYXJrZXJzKClcbiAgICAgICdjb3JlOmNhbmNlbCc6ID0+IEBjbGVhckJpbmRpbmdzKClcbiAgICAgICdjb3JlOmNsb3NlJzogPT4gQGNsZWFyQmluZGluZ3MoKVxuXG4gIGluaXRpYWxpemVTZXJ2aWNlQVBJOiAtPlxuICAgIGF0b20ucGFja2FnZXMuc2VydmljZUh1Yi5jb25zdW1lICdmaW5kLWFuZC1yZXBsYWNlJywgJzAuMC4xJywgKGZucikgPT5cbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAbWluaW1hcC5vYnNlcnZlTWluaW1hcHMgKG1pbmltYXApID0+XG4gICAgICAgIE1pbmltYXBGaW5kQW5kUmVwbGFjZUJpbmRpbmcgPz0gcmVxdWlyZSAnLi9taW5pbWFwLWZpbmQtYW5kLXJlcGxhY2UtYmluZGluZydcblxuICAgICAgICBpZCA9IG1pbmltYXAuaWRcbiAgICAgICAgYmluZGluZyA9IG5ldyBNaW5pbWFwRmluZEFuZFJlcGxhY2VCaW5kaW5nKG1pbmltYXAsIGZucilcbiAgICAgICAgQGJpbmRpbmdzQnlJZFtpZF0gPSBiaW5kaW5nXG5cbiAgICAgICAgQHN1YnNjcmlwdGlvbnNCeUlkW2lkXSA9IG1pbmltYXAub25EaWREZXN0cm95ID0+XG4gICAgICAgICAgQHN1YnNjcmlwdGlvbnNCeUlkW2lkXT8uZGlzcG9zZSgpXG4gICAgICAgICAgQGJpbmRpbmdzQnlJZFtpZF0/LmRlc3Ryb3koKVxuXG4gICAgICAgICAgZGVsZXRlIEBiaW5kaW5nc0J5SWRbaWRdXG4gICAgICAgICAgZGVsZXRlIEBzdWJzY3JpcHRpb25zQnlJZFtpZF1cblxuICBpbml0aWFsaXplTGVnYWN5QVBJOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAbWluaW1hcC5vYnNlcnZlTWluaW1hcHMgKG1pbmltYXApID0+XG4gICAgICBNaW5pbWFwRmluZEFuZFJlcGxhY2VCaW5kaW5nID89IHJlcXVpcmUgJy4vbWluaW1hcC1maW5kLWFuZC1yZXBsYWNlLWJpbmRpbmcnXG5cbiAgICAgIGlkID0gbWluaW1hcC5pZFxuICAgICAgYmluZGluZyA9IG5ldyBNaW5pbWFwRmluZEFuZFJlcGxhY2VCaW5kaW5nKG1pbmltYXApXG4gICAgICBAYmluZGluZ3NCeUlkW2lkXSA9IGJpbmRpbmdcblxuICAgICAgQHN1YnNjcmlwdGlvbnNCeUlkW2lkXSA9IG1pbmltYXAub25EaWREZXN0cm95ID0+XG4gICAgICAgIEBzdWJzY3JpcHRpb25zQnlJZFtpZF0/LmRpc3Bvc2UoKVxuICAgICAgICBAYmluZGluZ3NCeUlkW2lkXT8uZGVzdHJveSgpXG5cbiAgICAgICAgZGVsZXRlIEBiaW5kaW5nc0J5SWRbaWRdXG4gICAgICAgIGRlbGV0ZSBAc3Vic2NyaXB0aW9uc0J5SWRbaWRdXG5cbiAgZGVhY3RpdmF0ZVBsdWdpbjogLT5cbiAgICByZXR1cm4gdW5sZXNzIEBhY3RpdmVcblxuICAgIEBhY3RpdmUgPSBmYWxzZVxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG4gICAgc3ViLmRpc3Bvc2UoKSBmb3IgaWQsc3ViIG9mIEBzdWJzY3JpcHRpb25zQnlJZFxuICAgIGJpbmRpbmcuZGVzdHJveSgpIGZvciBpZCxiaW5kaW5nIG9mIEBiaW5kaW5nc0J5SWRcblxuICAgIEBiaW5kaW5nc0J5SWQgPSB7fVxuICAgIEBzdWJzY3JpcHRpb25zQnlJZCA9IHt9XG5cbiAgZGlzY292ZXJNYXJrZXJzOiAtPlxuICAgIGJpbmRpbmcuZGlzY292ZXJNYXJrZXJzKCkgZm9yIGlkLGJpbmRpbmcgb2YgQGJpbmRpbmdzQnlJZFxuXG4gIGNsZWFyQmluZGluZ3M6IC0+XG4gICAgYmluZGluZy5jbGVhcigpIGZvciBpZCxiaW5kaW5nIG9mIEBiaW5kaW5nc0J5SWRcbiJdfQ==
