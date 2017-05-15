(function() {
  var CompositeDisposable, FindAndReplace, MinimapFindAndReplaceBinding;

  CompositeDisposable = require('atom').CompositeDisposable;

  FindAndReplace = null;

  module.exports = MinimapFindAndReplaceBinding = (function() {
    function MinimapFindAndReplaceBinding(minimap, fnrAPI) {
      this.minimap = minimap;
      this.fnrAPI = fnrAPI;
      this.editor = this.minimap.getTextEditor();
      this.subscriptions = new CompositeDisposable;
      this.decorationsByMarkerId = {};
      this.subscriptionsByMarkerId = {};
      if (this.fnrAPI != null) {
        this.layer = this.fnrAPI.resultsMarkerLayerForTextEditor(this.editor);
        this.subscriptions.add(this.layer.onDidCreateMarker((function(_this) {
          return function(marker) {
            return _this.handleCreatedMarker(marker);
          };
        })(this)));
      } else {
        this.subscriptions.add(this.editor.displayBuffer.onDidCreateMarker((function(_this) {
          return function(marker) {
            return _this.handleCreatedMarker(marker);
          };
        })(this)));
      }
      this.discoverMarkers();
    }

    MinimapFindAndReplaceBinding.prototype.destroy = function() {
      var decoration, id, ref, ref1, sub;
      ref = this.subscriptionsByMarkerId;
      for (id in ref) {
        sub = ref[id];
        sub.dispose();
      }
      ref1 = this.decorationsByMarkerId;
      for (id in ref1) {
        decoration = ref1[id];
        decoration.destroy();
      }
      this.subscriptions.dispose();
      this.minimap = null;
      this.editor = null;
      this.decorationsByMarkerId = {};
      return this.subscriptionsByMarkerId = {};
    };

    MinimapFindAndReplaceBinding.prototype.clear = function() {
      var decoration, id, ref, ref1, results, sub;
      ref = this.subscriptionsByMarkerId;
      for (id in ref) {
        sub = ref[id];
        sub.dispose();
        delete this.subscriptionsByMarkerId[id];
      }
      ref1 = this.decorationsByMarkerId;
      results = [];
      for (id in ref1) {
        decoration = ref1[id];
        decoration.destroy();
        results.push(delete this.decorationsByMarkerId[id]);
      }
      return results;
    };

    MinimapFindAndReplaceBinding.prototype.findAndReplace = function() {
      return FindAndReplace != null ? FindAndReplace : FindAndReplace = atom.packages.getLoadedPackage('find-and-replace').mainModule;
    };

    MinimapFindAndReplaceBinding.prototype.discoverMarkers = function() {
      if (this.fnrAPI != null) {
        return this.layer.getMarkers().forEach((function(_this) {
          return function(marker) {
            return _this.createDecoration(marker);
          };
        })(this));
      } else {
        return this.editor.findMarkers({
          "class": 'find-result'
        }).forEach((function(_this) {
          return function(marker) {
            return _this.createDecoration(marker);
          };
        })(this));
      }
    };

    MinimapFindAndReplaceBinding.prototype.handleCreatedMarker = function(marker) {
      var ref;
      if ((this.fnrAPI != null) || ((ref = marker.getProperties()) != null ? ref["class"] : void 0) === 'find-result') {
        return this.createDecoration(marker);
      }
    };

    MinimapFindAndReplaceBinding.prototype.createDecoration = function(marker) {
      var decoration, id;
      if (!this.findViewIsVisible()) {
        return;
      }
      if (this.decorationsByMarkerId[marker.id] != null) {
        return;
      }
      decoration = this.minimap.decorateMarker(marker, {
        type: 'highlight',
        scope: ".minimap .search-result",
        plugin: 'find-and-replace'
      });
      if (decoration == null) {
        return;
      }
      id = marker.id;
      this.decorationsByMarkerId[id] = decoration;
      return this.subscriptionsByMarkerId[id] = decoration.onDidDestroy((function(_this) {
        return function() {
          _this.subscriptionsByMarkerId[id].dispose();
          delete _this.decorationsByMarkerId[id];
          return delete _this.subscriptionsByMarkerId[id];
        };
      })(this));
    };

    MinimapFindAndReplaceBinding.prototype.findViewIsVisible = function() {
      return document.querySelector('.find-and-replace') != null;
    };

    return MinimapFindAndReplaceBinding;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvbWluaW1hcC1maW5kLWFuZC1yZXBsYWNlL2xpYi9taW5pbWFwLWZpbmQtYW5kLXJlcGxhY2UtYmluZGluZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsY0FBQSxHQUFpQjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHNDQUFDLE9BQUQsRUFBVyxNQUFYO01BQUMsSUFBQyxDQUFBLFVBQUQ7TUFBVSxJQUFDLENBQUEsU0FBRDtNQUN0QixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUFBO01BQ1YsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEscUJBQUQsR0FBeUI7TUFDekIsSUFBQyxDQUFBLHVCQUFELEdBQTJCO01BRTNCLElBQUcsbUJBQUg7UUFDRSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsK0JBQVIsQ0FBd0MsSUFBQyxDQUFBLE1BQXpDO1FBRVQsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxLQUFLLENBQUMsaUJBQVAsQ0FBeUIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxNQUFEO21CQUMxQyxLQUFDLENBQUEsbUJBQUQsQ0FBcUIsTUFBckI7VUFEMEM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCLENBQW5CLEVBSEY7T0FBQSxNQUFBO1FBTUUsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBYSxDQUFDLGlCQUF0QixDQUF3QyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLE1BQUQ7bUJBQ3pELEtBQUMsQ0FBQSxtQkFBRCxDQUFxQixNQUFyQjtVQUR5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UUFIcUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCO0lBYmY7OzJDQWtCbEIsaUJBQUEsR0FBbUIsU0FBQTthQUNqQjtJQURpQjs7Ozs7QUF4RXJCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbkZpbmRBbmRSZXBsYWNlID0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBNaW5pbWFwRmluZEFuZFJlcGxhY2VCaW5kaW5nXG4gIGNvbnN0cnVjdG9yOiAoQG1pbmltYXAsIEBmbnJBUEkpIC0+XG4gICAgQGVkaXRvciA9IEBtaW5pbWFwLmdldFRleHRFZGl0b3IoKVxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAZGVjb3JhdGlvbnNCeU1hcmtlcklkID0ge31cbiAgICBAc3Vic2NyaXB0aW9uc0J5TWFya2VySWQgPSB7fVxuXG4gICAgaWYgQGZuckFQST9cbiAgICAgIEBsYXllciA9IEBmbnJBUEkucmVzdWx0c01hcmtlckxheWVyRm9yVGV4dEVkaXRvcihAZWRpdG9yKVxuXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGxheWVyLm9uRGlkQ3JlYXRlTWFya2VyIChtYXJrZXIpID0+XG4gICAgICAgIEBoYW5kbGVDcmVhdGVkTWFya2VyKG1hcmtlcilcbiAgICBlbHNlXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQGVkaXRvci5kaXNwbGF5QnVmZmVyLm9uRGlkQ3JlYXRlTWFya2VyIChtYXJrZXIpID0+XG4gICAgICAgIEBoYW5kbGVDcmVhdGVkTWFya2VyKG1hcmtlcilcblxuICAgIEBkaXNjb3Zlck1hcmtlcnMoKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgc3ViLmRpc3Bvc2UoKSBmb3IgaWQsc3ViIG9mIEBzdWJzY3JpcHRpb25zQnlNYXJrZXJJZFxuICAgIGRlY29yYXRpb24uZGVzdHJveSgpIGZvciBpZCxkZWNvcmF0aW9uIG9mIEBkZWNvcmF0aW9uc0J5TWFya2VySWRcblxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIEBtaW5pbWFwID0gbnVsbFxuICAgIEBlZGl0b3IgPSBudWxsXG4gICAgQGRlY29yYXRpb25zQnlNYXJrZXJJZCA9IHt9XG4gICAgQHN1YnNjcmlwdGlvbnNCeU1hcmtlcklkID0ge31cblxuICBjbGVhcjogLT5cbiAgICBmb3IgaWQsc3ViIG9mIEBzdWJzY3JpcHRpb25zQnlNYXJrZXJJZFxuICAgICAgc3ViLmRpc3Bvc2UoKVxuICAgICAgZGVsZXRlIEBzdWJzY3JpcHRpb25zQnlNYXJrZXJJZFtpZF1cblxuICAgIGZvciBpZCxkZWNvcmF0aW9uIG9mIEBkZWNvcmF0aW9uc0J5TWFya2VySWRcbiAgICAgIGRlY29yYXRpb24uZGVzdHJveSgpXG4gICAgICBkZWxldGUgQGRlY29yYXRpb25zQnlNYXJrZXJJZFtpZF1cblxuICBmaW5kQW5kUmVwbGFjZTogLT4gRmluZEFuZFJlcGxhY2UgPz0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKCdmaW5kLWFuZC1yZXBsYWNlJykubWFpbk1vZHVsZVxuXG4gIGRpc2NvdmVyTWFya2VyczogLT5cbiAgICBpZiBAZm5yQVBJP1xuICAgICAgQGxheWVyLmdldE1hcmtlcnMoKS5mb3JFYWNoIChtYXJrZXIpID0+IEBjcmVhdGVEZWNvcmF0aW9uKG1hcmtlcilcbiAgICBlbHNlXG4gICAgICBAZWRpdG9yLmZpbmRNYXJrZXJzKGNsYXNzOiAnZmluZC1yZXN1bHQnKS5mb3JFYWNoIChtYXJrZXIpID0+XG4gICAgICAgIEBjcmVhdGVEZWNvcmF0aW9uKG1hcmtlcilcblxuICBoYW5kbGVDcmVhdGVkTWFya2VyOiAobWFya2VyKSAtPlxuICAgIGlmIEBmbnJBUEk/IG9yIG1hcmtlci5nZXRQcm9wZXJ0aWVzKCk/LmNsYXNzIGlzICdmaW5kLXJlc3VsdCdcbiAgICAgIEBjcmVhdGVEZWNvcmF0aW9uKG1hcmtlcilcblxuICBjcmVhdGVEZWNvcmF0aW9uOiAobWFya2VyKSAtPlxuICAgIHJldHVybiB1bmxlc3MgQGZpbmRWaWV3SXNWaXNpYmxlKClcbiAgICByZXR1cm4gaWYgQGRlY29yYXRpb25zQnlNYXJrZXJJZFttYXJrZXIuaWRdP1xuXG4gICAgZGVjb3JhdGlvbiA9IEBtaW5pbWFwLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgdHlwZTogJ2hpZ2hsaWdodCdcbiAgICAgIHNjb3BlOiBcIi5taW5pbWFwIC5zZWFyY2gtcmVzdWx0XCJcbiAgICAgIHBsdWdpbjogJ2ZpbmQtYW5kLXJlcGxhY2UnXG4gICAgfSlcbiAgICByZXR1cm4gdW5sZXNzIGRlY29yYXRpb24/XG5cbiAgICBpZCA9IG1hcmtlci5pZFxuICAgIEBkZWNvcmF0aW9uc0J5TWFya2VySWRbaWRdID0gZGVjb3JhdGlvblxuICAgIEBzdWJzY3JpcHRpb25zQnlNYXJrZXJJZFtpZF0gPSBkZWNvcmF0aW9uLm9uRGlkRGVzdHJveSA9PlxuICAgICAgQHN1YnNjcmlwdGlvbnNCeU1hcmtlcklkW2lkXS5kaXNwb3NlKClcbiAgICAgIGRlbGV0ZSBAZGVjb3JhdGlvbnNCeU1hcmtlcklkW2lkXVxuICAgICAgZGVsZXRlIEBzdWJzY3JpcHRpb25zQnlNYXJrZXJJZFtpZF1cblxuICBmaW5kVmlld0lzVmlzaWJsZTogLT5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmluZC1hbmQtcmVwbGFjZScpP1xuIl19
