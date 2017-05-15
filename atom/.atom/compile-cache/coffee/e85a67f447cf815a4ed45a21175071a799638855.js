(function() {
  var CompositeDisposable, MinimapHighlightSelected, requirePackages,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('event-kit').CompositeDisposable;

  requirePackages = require('atom-utils').requirePackages;

  MinimapHighlightSelected = (function() {
    function MinimapHighlightSelected() {
      this.markersDestroyed = bind(this.markersDestroyed, this);
      this.markerCreated = bind(this.markerCreated, this);
      this.dispose = bind(this.dispose, this);
      this.init = bind(this.init, this);
      this.subscriptions = new CompositeDisposable;
    }

    MinimapHighlightSelected.prototype.activate = function(state) {
      if (!atom.inSpecMode()) {
        return require('atom-package-deps').install('minimap-highlight-selected', true);
      }
    };

    MinimapHighlightSelected.prototype.consumeMinimapServiceV1 = function(minimap1) {
      this.minimap = minimap1;
      return this.minimap.registerPlugin('highlight-selected', this);
    };

    MinimapHighlightSelected.prototype.consumeHighlightSelectedServiceV2 = function(highlightSelected) {
      this.highlightSelected = highlightSelected;
      if ((this.minimap != null) && (this.active != null)) {
        return this.init();
      }
    };

    MinimapHighlightSelected.prototype.deactivate = function() {
      this.deactivatePlugin();
      this.minimapPackage = null;
      this.highlightSelectedPackage = null;
      this.highlightSelected = null;
      return this.minimap = null;
    };

    MinimapHighlightSelected.prototype.isActive = function() {
      return this.active;
    };

    MinimapHighlightSelected.prototype.activatePlugin = function() {
      if (this.active) {
        return;
      }
      this.subscriptions.add(this.minimap.onDidActivate(this.init));
      this.subscriptions.add(this.minimap.onDidDeactivate(this.dispose));
      this.active = true;
      if (this.highlightSelected != null) {
        return this.init();
      }
    };

    MinimapHighlightSelected.prototype.init = function() {
      this.decorations = [];
      this.highlightSelected.onDidAddMarkerForEditor((function(_this) {
        return function(options) {
          return _this.markerCreated(options);
        };
      })(this));
      this.highlightSelected.onDidAddSelectedMarkerForEditor((function(_this) {
        return function(options) {
          return _this.markerCreated(options, true);
        };
      })(this));
      return this.highlightSelected.onDidRemoveAllMarkers((function(_this) {
        return function() {
          return _this.markersDestroyed();
        };
      })(this));
    };

    MinimapHighlightSelected.prototype.dispose = function() {
      var ref;
      if ((ref = this.decorations) != null) {
        ref.forEach(function(decoration) {
          return decoration.destroy();
        });
      }
      return this.decorations = null;
    };

    MinimapHighlightSelected.prototype.markerCreated = function(options, selected) {
      var className, decoration, minimap;
      if (selected == null) {
        selected = false;
      }
      minimap = this.minimap.minimapForEditor(options.editor);
      if (minimap == null) {
        return;
      }
      className = 'highlight-selected';
      if (selected) {
        className += ' selected';
      }
      decoration = minimap.decorateMarker(options.marker, {
        type: 'highlight',
        "class": className
      });
      return this.decorations.push(decoration);
    };

    MinimapHighlightSelected.prototype.markersDestroyed = function() {
      this.decorations.forEach(function(decoration) {
        return decoration.destroy();
      });
      return this.decorations = [];
    };

    MinimapHighlightSelected.prototype.deactivatePlugin = function() {
      if (!this.active) {
        return;
      }
      this.active = false;
      this.dispose();
      return this.subscriptions.dispose();
    };

    return MinimapHighlightSelected;

  })();

  module.exports = new MinimapHighlightSelected;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvbWluaW1hcC1oaWdobGlnaHQtc2VsZWN0ZWQvbGliL21pbmltYXAtaGlnaGxpZ2h0LXNlbGVjdGVkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsOERBQUE7SUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVI7O0VBQ3ZCLGtCQUFtQixPQUFBLENBQVEsWUFBUjs7RUFFZDtJQUNTLGtDQUFBOzs7OztNQUNYLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7SUFEVjs7dUNBR2IsUUFBQSxHQUFVLFNBQUMsS0FBRDtNQUNSLElBQUEsQ0FBTyxJQUFJLENBQUMsVUFBTCxDQUFBLENBQVA7ZUFDRSxPQUFBLENBQVEsbUJBQVIsQ0FBNEIsQ0FBQyxPQUE3QixDQUFxQyw0QkFBckMsRUFBbUUsSUFBbkUsRUFERjs7SUFEUTs7dUNBSVYsdUJBQUEsR0FBeUIsU0FBQyxRQUFEO01BQUMsSUFBQyxDQUFBLFVBQUQ7YUFDeEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxjQUFULENBQXdCLG9CQUF4QixFQUE4QyxJQUE5QztJQUR1Qjs7dUNBR3pCLGlDQUFBLEdBQW1DLFNBQUMsaUJBQUQ7TUFBQyxJQUFDLENBQUEsb0JBQUQ7TUFDbEMsSUFBVyxzQkFBQSxJQUFjLHFCQUF6QjtlQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsRUFBQTs7SUFEaUM7O3VDQUduQyxVQUFBLEdBQVksU0FBQTtNQUNWLElBQUMsQ0FBQSxnQkFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLGNBQUQsR0FBa0I7TUFDbEIsSUFBQyxDQUFBLHdCQUFELEdBQTRCO01BQzVCLElBQUMsQ0FBQSxpQkFBRCxHQUFxQjthQUNyQixJQUFDLENBQUEsT0FBRCxHQUFXO0lBTEQ7O3VDQU9aLFFBQUEsR0FBVSxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUo7O3VDQUVWLGNBQUEsR0FBZ0IsU0FBQTtNQUNkLElBQVUsSUFBQyxDQUFBLE1BQVg7QUFBQSxlQUFBOztNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBdUIsSUFBQyxDQUFBLElBQXhCLENBQW5CO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMsZUFBVCxDQUF5QixJQUFDLENBQUEsT0FBMUIsQ0FBbkI7TUFFQSxJQUFDLENBQUEsTUFBRCxHQUFVO01BRVYsSUFBVyw4QkFBWDtlQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsRUFBQTs7SUFSYzs7dUNBVWhCLElBQUEsR0FBTSxTQUFBO01BQ0osSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyx1QkFBbkIsQ0FBMkMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7aUJBQWEsS0FBQyxDQUFBLGFBQUQsQ0FBZSxPQUFmO1FBQWI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNDO01BQ0EsSUFBQyxDQUFBLGlCQUFpQixDQUFDLCtCQUFuQixDQUFtRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRDtpQkFBYSxLQUFDLENBQUEsYUFBRCxDQUFlLE9BQWYsRUFBd0IsSUFBeEI7UUFBYjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkQ7YUFDQSxJQUFDLENBQUEsaUJBQWlCLENBQUMscUJBQW5CLENBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsZ0JBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QztJQUpJOzt1Q0FNTixPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7O1dBQVksQ0FBRSxPQUFkLENBQXNCLFNBQUMsVUFBRDtpQkFBZ0IsVUFBVSxDQUFDLE9BQVgsQ0FBQTtRQUFoQixDQUF0Qjs7YUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlO0lBRlI7O3VDQUlULGFBQUEsR0FBZSxTQUFDLE9BQUQsRUFBVSxRQUFWO0FBQ2IsVUFBQTs7UUFEdUIsV0FBVzs7TUFDbEMsT0FBQSxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsZ0JBQVQsQ0FBMEIsT0FBTyxDQUFDLE1BQWxDO01BQ1YsSUFBYyxlQUFkO0FBQUEsZUFBQTs7TUFDQSxTQUFBLEdBQWE7TUFDYixJQUE0QixRQUE1QjtRQUFBLFNBQUEsSUFBYSxZQUFiOztNQUVBLFVBQUEsR0FBYSxPQUFPLENBQUMsY0FBUixDQUF1QixPQUFPLENBQUMsTUFBL0IsRUFDWDtRQUFDLElBQUEsRUFBTSxXQUFQO1FBQW9CLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBM0I7T0FEVzthQUViLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixVQUFsQjtJQVJhOzt1Q0FVZixnQkFBQSxHQUFrQixTQUFBO01BQ2hCLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixTQUFDLFVBQUQ7ZUFBZ0IsVUFBVSxDQUFDLE9BQVgsQ0FBQTtNQUFoQixDQUFyQjthQUNBLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFGQzs7dUNBSWxCLGdCQUFBLEdBQWtCLFNBQUE7TUFDaEIsSUFBQSxDQUFjLElBQUMsQ0FBQSxNQUFmO0FBQUEsZUFBQTs7TUFFQSxJQUFDLENBQUEsTUFBRCxHQUFVO01BQ1YsSUFBQyxDQUFBLE9BQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0lBTGdCOzs7Ozs7RUFPcEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsSUFBSTtBQW5FckIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdldmVudC1raXQnXG57cmVxdWlyZVBhY2thZ2VzfSA9IHJlcXVpcmUgJ2F0b20tdXRpbHMnXG5cbmNsYXNzIE1pbmltYXBIaWdobGlnaHRTZWxlY3RlZFxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICB1bmxlc3MgYXRvbS5pblNwZWNNb2RlKClcbiAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCAnbWluaW1hcC1oaWdobGlnaHQtc2VsZWN0ZWQnLCB0cnVlXG5cbiAgY29uc3VtZU1pbmltYXBTZXJ2aWNlVjE6IChAbWluaW1hcCkgLT5cbiAgICBAbWluaW1hcC5yZWdpc3RlclBsdWdpbiAnaGlnaGxpZ2h0LXNlbGVjdGVkJywgdGhpc1xuXG4gIGNvbnN1bWVIaWdobGlnaHRTZWxlY3RlZFNlcnZpY2VWMjogKEBoaWdobGlnaHRTZWxlY3RlZCkgLT5cbiAgICBAaW5pdCgpIGlmIEBtaW5pbWFwPyBhbmQgQGFjdGl2ZT9cblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBkZWFjdGl2YXRlUGx1Z2luKClcbiAgICBAbWluaW1hcFBhY2thZ2UgPSBudWxsXG4gICAgQGhpZ2hsaWdodFNlbGVjdGVkUGFja2FnZSA9IG51bGxcbiAgICBAaGlnaGxpZ2h0U2VsZWN0ZWQgPSBudWxsXG4gICAgQG1pbmltYXAgPSBudWxsXG5cbiAgaXNBY3RpdmU6IC0+IEBhY3RpdmVcblxuICBhY3RpdmF0ZVBsdWdpbjogLT5cbiAgICByZXR1cm4gaWYgQGFjdGl2ZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBtaW5pbWFwLm9uRGlkQWN0aXZhdGUgQGluaXRcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQG1pbmltYXAub25EaWREZWFjdGl2YXRlIEBkaXNwb3NlXG5cbiAgICBAYWN0aXZlID0gdHJ1ZVxuXG4gICAgQGluaXQoKSBpZiBAaGlnaGxpZ2h0U2VsZWN0ZWQ/XG5cbiAgaW5pdDogPT5cbiAgICBAZGVjb3JhdGlvbnMgPSBbXVxuICAgIEBoaWdobGlnaHRTZWxlY3RlZC5vbkRpZEFkZE1hcmtlckZvckVkaXRvciAob3B0aW9ucykgPT4gQG1hcmtlckNyZWF0ZWQob3B0aW9ucylcbiAgICBAaGlnaGxpZ2h0U2VsZWN0ZWQub25EaWRBZGRTZWxlY3RlZE1hcmtlckZvckVkaXRvciAob3B0aW9ucykgPT4gQG1hcmtlckNyZWF0ZWQob3B0aW9ucywgdHJ1ZSlcbiAgICBAaGlnaGxpZ2h0U2VsZWN0ZWQub25EaWRSZW1vdmVBbGxNYXJrZXJzID0+IEBtYXJrZXJzRGVzdHJveWVkKClcblxuICBkaXNwb3NlOiA9PlxuICAgIEBkZWNvcmF0aW9ucz8uZm9yRWFjaCAoZGVjb3JhdGlvbikgLT4gZGVjb3JhdGlvbi5kZXN0cm95KClcbiAgICBAZGVjb3JhdGlvbnMgPSBudWxsXG5cbiAgbWFya2VyQ3JlYXRlZDogKG9wdGlvbnMsIHNlbGVjdGVkID0gZmFsc2UpID0+XG4gICAgbWluaW1hcCA9IEBtaW5pbWFwLm1pbmltYXBGb3JFZGl0b3Iob3B0aW9ucy5lZGl0b3IpXG4gICAgcmV0dXJuIHVubGVzcyBtaW5pbWFwP1xuICAgIGNsYXNzTmFtZSAgPSAnaGlnaGxpZ2h0LXNlbGVjdGVkJ1xuICAgIGNsYXNzTmFtZSArPSAnIHNlbGVjdGVkJyBpZiBzZWxlY3RlZFxuXG4gICAgZGVjb3JhdGlvbiA9IG1pbmltYXAuZGVjb3JhdGVNYXJrZXIob3B0aW9ucy5tYXJrZXIsXG4gICAgICB7dHlwZTogJ2hpZ2hsaWdodCcsIGNsYXNzOiBjbGFzc05hbWUgfSlcbiAgICBAZGVjb3JhdGlvbnMucHVzaCBkZWNvcmF0aW9uXG5cbiAgbWFya2Vyc0Rlc3Ryb3llZDogPT5cbiAgICBAZGVjb3JhdGlvbnMuZm9yRWFjaCAoZGVjb3JhdGlvbikgLT4gZGVjb3JhdGlvbi5kZXN0cm95KClcbiAgICBAZGVjb3JhdGlvbnMgPSBbXVxuXG4gIGRlYWN0aXZhdGVQbHVnaW46IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAYWN0aXZlXG5cbiAgICBAYWN0aXZlID0gZmFsc2VcbiAgICBAZGlzcG9zZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IE1pbmltYXBIaWdobGlnaHRTZWxlY3RlZFxuIl19
