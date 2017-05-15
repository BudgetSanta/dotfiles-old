(function() {
  var Emitter, TodoModel, _, maxLength, path;

  path = require('path');

  Emitter = require('atom').Emitter;

  _ = require('underscore-plus');

  maxLength = 120;

  module.exports = TodoModel = (function() {
    function TodoModel(match, arg) {
      var plain;
      plain = (arg != null ? arg : []).plain;
      if (plain) {
        return _.extend(this, match);
      }
      this.handleScanMatch(match);
    }

    TodoModel.prototype.getAllKeys = function() {
      return atom.config.get('todo-show.showInTable') || ['Text'];
    };

    TodoModel.prototype.get = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if ((value = this[key.toLowerCase()]) || value === '') {
        return value;
      }
      return this.text || 'No details';
    };

    TodoModel.prototype.getMarkdown = function(key) {
      var value;
      if (key == null) {
        key = '';
      }
      if (!(value = this[key.toLowerCase()])) {
        return '';
      }
      switch (key) {
        case 'All':
        case 'Text':
          return " " + value;
        case 'Type':
        case 'Project':
          return " __" + value + "__";
        case 'Range':
        case 'Line':
          return " _:" + value + "_";
        case 'Regex':
          return " _'" + value + "'_";
        case 'Path':
        case 'File':
          return " [" + value + "](" + value + ")";
        case 'Tags':
        case 'Id':
          return " _" + value + "_";
      }
    };

    TodoModel.prototype.getMarkdownArray = function(keys) {
      var i, key, len, ref, results;
      ref = keys || this.getAllKeys();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        results.push(this.getMarkdown(key));
      }
      return results;
    };

    TodoModel.prototype.keyIsNumber = function(key) {
      return key === 'Range' || key === 'Line';
    };

    TodoModel.prototype.contains = function(string) {
      var i, item, key, len, ref;
      if (string == null) {
        string = '';
      }
      ref = this.getAllKeys();
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        if (!(item = this.get(key))) {
          break;
        }
        if (item.toLowerCase().indexOf(string.toLowerCase()) !== -1) {
          return true;
        }
      }
      return false;
    };

    TodoModel.prototype.handleScanMatch = function(match) {
      var _matchText, loc, matchText, matches, pos, project, ref, ref1, ref2, ref3, relativePath, tag;
      matchText = match.text || match.all || '';
      if (matchText.length > ((ref = match.all) != null ? ref.length : void 0)) {
        match.all = matchText;
      }
      while ((_matchText = (ref1 = match.regexp) != null ? ref1.exec(matchText) : void 0)) {
        if (!match.type) {
          match.type = _matchText[1];
        }
        matchText = _matchText.pop();
      }
      if (matchText.indexOf('(') === 0) {
        if (matches = matchText.match(/\((.*?)\):?(.*)/)) {
          matchText = matches.pop();
          match.id = matches.pop();
        }
      }
      matchText = this.stripCommentEnd(matchText);
      match.tags = ((function() {
        var results;
        results = [];
        while ((tag = /\s*#(\w+)[,.]?$/.exec(matchText))) {
          if (tag.length !== 2) {
            break;
          }
          matchText = matchText.slice(0, -tag.shift().length);
          results.push(tag.shift());
        }
        return results;
      })()).sort().join(', ');
      if (!matchText && match.all && (pos = (ref2 = match.position) != null ? (ref3 = ref2[0]) != null ? ref3[1] : void 0 : void 0)) {
        matchText = match.all.substr(0, pos);
        matchText = this.stripCommentStart(matchText);
      }
      if (matchText.length >= maxLength) {
        matchText = (matchText.substr(0, maxLength - 3)) + "...";
      }
      if (!(match.position && match.position.length > 0)) {
        match.position = [[0, 0]];
      }
      if (match.position.serialize) {
        match.range = match.position.serialize().toString();
      } else {
        match.range = match.position.toString();
      }
      relativePath = atom.project.relativizePath(match.loc);
      if (relativePath[0] == null) {
        relativePath[0] = '';
      }
      match.path = relativePath[1] || '';
      if ((loc = path.basename(match.loc)) !== 'undefined') {
        match.file = loc;
      } else {
        match.file = 'untitled';
      }
      if ((project = path.basename(relativePath[0])) !== 'null') {
        match.project = project;
      } else {
        match.project = '';
      }
      match.text = matchText || "No details";
      match.line = (parseInt(match.range.split(',')[0]) + 1).toString();
      match.regex = match.regex.replace('${TODOS}', match.type);
      match.id = match.id || '';
      return _.extend(this, match);
    };

    TodoModel.prototype.stripCommentStart = function(text) {
      var startRegex;
      if (text == null) {
        text = '';
      }
      startRegex = /(\/\*|<\?|<!--|<#|{-|\[\[|\/\/|#)\s*$/;
      return text.replace(startRegex, '').trim();
    };

    TodoModel.prototype.stripCommentEnd = function(text) {
      var endRegex;
      if (text == null) {
        text = '';
      }
      endRegex = /(\*\/}?|\?>|-->|#>|-}|\]\])\s*$/;
      return text.replace(endRegex, '').trim();
    };

    return TodoModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLW1vZGVsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVOLFVBQVcsT0FBQSxDQUFRLE1BQVI7O0VBQ1osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFFSixTQUFBLEdBQVk7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLG1CQUFDLEtBQUQsRUFBUSxHQUFSO0FBQ1gsVUFBQTtNQURvQix1QkFBRCxNQUFVO01BQzdCLElBQWdDLEtBQWhDO0FBQUEsZUFBTyxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxLQUFmLEVBQVA7O01BQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsS0FBakI7SUFGVzs7d0JBSWIsVUFBQSxHQUFZLFNBQUE7YUFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQUEsSUFBNEMsQ0FBQyxNQUFEO0lBRGxDOzt3QkFHWixHQUFBLEdBQUssU0FBQyxHQUFEO0FBQ0gsVUFBQTs7UUFESSxNQUFNOztNQUNWLElBQWdCLENBQUMsS0FBQSxHQUFRLElBQUUsQ0FBQSxHQUFHLENBQUMsV0FBSixDQUFBLENBQUEsQ0FBWCxDQUFBLElBQWtDLEtBQUEsS0FBUyxFQUEzRDtBQUFBLGVBQU8sTUFBUDs7YUFDQSxJQUFDLENBQUEsSUFBRCxJQUFTO0lBRk47O3dCQUlMLFdBQUEsR0FBYSxTQUFDLEdBQUQ7QUFDWCxVQUFBOztRQURZLE1BQU07O01BQ2xCLElBQUEsQ0FBaUIsQ0FBQSxLQUFBLEdBQVEsSUFBRSxDQUFBLEdBQUcsQ0FBQyxXQUFKLENBQUEsQ0FBQSxDQUFWLENBQWpCO0FBQUEsZUFBTyxHQUFQOztBQUNBLGNBQU8sR0FBUDtBQUFBLGFBQ08sS0FEUDtBQUFBLGFB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QUFjLFlBQWEsQ0FBQSxDQUFBLENBQTNCLENBQVgsQ0FBQSxLQUFnRCxNQUFuRDtRQUNFLEtBQUssQ0FBQyxPQUFOLEdBQWdCLFFBRGxCO09BQUEsTUFBQTtRQUdFLEtBQUssQ0FBQyxPQUFOLEdBQWdCLEdBSGxCOztNQUtBLEtBQUssQ0FBQyxJQUFOLEdBQWEsU0FBQSxJQUFhO01BQzFCLEtBQUssQ0FBQyxJQUFOLEdBQWEsQ0FBQyxRQUFBLENBQVMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFaLENBQWtCLEdBQWxCLENBQXVCLENBQUEsQ0FBQSxDQUFoQyxDQUFBLEdBQXNDLENBQXZDLENBQXlDLENBQUMsUUFBMUMsQ0FBQTtNQUNiLEtBQUssQ0FBQyxLQUFOLEdBQWMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFaLENBQW9CLFVBQXBCLEVBQWdDLEtBQUssQ0FBQyxJQUF0QztNQUNkLEtBQUssQ0FBQyxFQUFOLEdBQVcsS0FBSyxDQUFDLEVBQU4sSUFBWTthQUV2QixDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxLQUFmO0lBaEVlOzt3QkFrRWpCLGlCQUFBLEdBQW1CLFNBQUMsSUFBRDtBQUNqQixVQUFBOztRQURrQixPQUFPOztNQUN6QixVQUFBLEdBQWE7YUFDYixJQUFJLENBQUMsT0FBTCxDQUFhLFVBQWIsRUFBeUIsRUFBekIsQ0FBNEIsQ0FBQyxJQUE3QixDQUFBO0lBRmlCOzt3QkFJbkIsZUFBQSxHQUFpQixTQUFDLElBQUQ7QUFDZixVQUFBOztRQURnQixPQUFPOztNQUN2QixRQUFBLEdBQVc7YUFDWCxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsRUFBdUIsRUFBdkIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFBO0lBRmU7Ozs7O0FBakhuQiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG57RW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcblxubWF4TGVuZ3RoID0gMTIwXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRvZG9Nb2RlbFxuICBjb25zdHJ1Y3RvcjogKG1hdGNoLCB7cGxhaW59ID0gW10pIC0+XG4gICAgcmV0dXJuIF8uZXh0ZW5kKHRoaXMsIG1hdGNoKSBpZiBwbGFpblxuICAgIEBoYW5kbGVTY2FuTWF0Y2ggbWF0Y2hcblxuICBnZXRBbGxLZXlzOiAtPlxuICAgIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LnNob3dJblRhYmxlJykgb3IgWydUZXh0J11cblxuICBnZXQ6IChrZXkgPSAnJykgLT5cbiAgICByZXR1cm4gdmFsdWUgaWYgKHZhbHVlID0gQFtrZXkudG9Mb3dlckNhc2UoKV0pIG9yIHZhbHVlIGlzICcnXG4gICAgQHRleHQgb3IgJ05vIGRldGFpbHMnXG5cbiAgZ2V0TWFya2Rvd246IChrZXkgPSAnJykgLT5cbiAgICByZXR1cm4gJycgdW5sZXNzIHZhbHVlID0gQFtrZXkudG9Mb3dlckNhc2UoKV1cbiAgICBzd2l0Y2gga2V5XG4gICAgICB3aGVuICdBbGwnLCAnVGV4dCcgdGhlbiBcIiAje3ZhbHVlfVwiXG4gICAgICB3aGVuICdUeXBlJywgJ1Byb2plY3QnIHRoZW4gXCIgX18je3ZhbHVlfV9fXCJcbiAgICAgIHdoZW4gJ1JhbmdlJywgJ0xpbmUnIHRoZW4gXCIgXzoje3ZhbHVlfV9cIlxuICAgICAgd2hlbiAnUmVnZXgnIHRoZW4gXCIgXycje3ZhbHVlfSdfXCJcbiAgICAgIHdoZW4gJ1BhdGgnLCAnRmlsZScgdGhlbiBcIiBbI3t2YWx1ZX1dKCN7dmFsdWV9KVwiXG4gICAgICB3aGVuICdUYWdzJywgJ0lkJyB0aGVuIFwiIF8je3ZhbHVlfV9cIlxuXG4gIGdldE1hcmtkb3duQXJyYXk6IChrZXlzKSAtPlxuICAgIGZvciBrZXkgaW4ga2V5cyBvciBAZ2V0QWxsS2V5cygpXG4gICAgICBAZ2V0TWFya2Rvd24oa2V5KVxuXG4gIGtleUlzTnVtYmVyOiAoa2V5KSAtPlxuICAgIGtleSBpbiBbJ1JhbmdlJywgJ0xpbmUnXVxuXG4gIGNvbnRhaW5zOiAoc3RyaW5nID0gJycpIC0+XG4gICAgZm9yIGtleSBpbiBAZ2V0QWxsS2V5cygpXG4gICAgICBicmVhayB1bmxlc3MgaXRlbSA9IEBnZXQoa2V5KVxuICAgICAgcmV0dXJuIHRydWUgaWYgaXRlbS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc3RyaW5nLnRvTG93ZXJDYXNlKCkpIGlzbnQgLTFcbiAgICBmYWxzZVxuXG4gIGhhbmRsZVNjYW5NYXRjaDogKG1hdGNoKSAtPlxuICAgIG1hdGNoVGV4dCA9IG1hdGNoLnRleHQgb3IgbWF0Y2guYWxsIG9yICcnXG4gICAgaWYgbWF0Y2hUZXh0Lmxlbmd0aCA+IG1hdGNoLmFsbD8ubGVuZ3RoXG4gICAgICBtYXRjaC5hbGwgPSBtYXRjaFRleHRcblxuICAgICMgU3RyaXAgb3V0IHRoZSByZWdleCB0b2tlbiBmcm9tIHRoZSBmb3VuZCBhbm5vdGF0aW9uXG4gICAgIyBub3QgYWxsIG9iamVjdHMgd2lsbCBoYXZlIGFuIGV4ZWMgbWF0Y2hcbiAgICB3aGlsZSAoX21hdGNoVGV4dCA9IG1hdGNoLnJlZ2V4cD8uZXhlYyhtYXRjaFRleHQpKVxuICAgICAgIyBGaW5kIG1hdGNoIHR5cGVcbiAgICAgIG1hdGNoLnR5cGUgPSBfbWF0Y2hUZXh0WzFdIHVubGVzcyBtYXRjaC50eXBlXG4gICAgICAjIEV4dHJhY3QgdG9kbyB0ZXh0XG4gICAgICBtYXRjaFRleHQgPSBfbWF0Y2hUZXh0LnBvcCgpXG5cbiAgICAjIEV4dHJhY3QgZ29vZ2xlIHN0eWxlIGd1aWRlIHRvZG8gaWRcbiAgICBpZiBtYXRjaFRleHQuaW5kZXhPZignKCcpIGlzIDBcbiAgICAgIGlmIG1hdGNoZXMgPSBtYXRjaFRleHQubWF0Y2goL1xcKCguKj8pXFwpOj8oLiopLylcbiAgICAgICAgbWF0Y2hUZXh0ID0gbWF0Y2hlcy5wb3AoKVxuICAgICAgICBtYXRjaC5pZCA9IG1hdGNoZXMucG9wKClcblxuICAgIG1hdGNoVGV4dCA9IEBzdHJpcENvbW1lbnRFbmQobWF0Y2hUZXh0KVxuXG4gICAgIyBFeHRyYWN0IHRvZG8gdGFnc1xuICAgIG1hdGNoLnRhZ3MgPSAod2hpbGUgKHRhZyA9IC9cXHMqIyhcXHcrKVssLl0/JC8uZXhlYyhtYXRjaFRleHQpKVxuICAgICAgYnJlYWsgaWYgdGFnLmxlbmd0aCBpc250IDJcbiAgICAgIG1hdGNoVGV4dCA9IG1hdGNoVGV4dC5zbGljZSgwLCAtdGFnLnNoaWZ0KCkubGVuZ3RoKVxuICAgICAgdGFnLnNoaWZ0KClcbiAgICApLnNvcnQoKS5qb2luKCcsICcpXG5cbiAgICAjIFVzZSB0ZXh0IGJlZm9yZSB0b2RvIGlmIG5vIGNvbnRlbnQgYWZ0ZXJcbiAgICBpZiBub3QgbWF0Y2hUZXh0IGFuZCBtYXRjaC5hbGwgYW5kIHBvcyA9IG1hdGNoLnBvc2l0aW9uP1swXT9bMV1cbiAgICAgIG1hdGNoVGV4dCA9IG1hdGNoLmFsbC5zdWJzdHIoMCwgcG9zKVxuICAgICAgbWF0Y2hUZXh0ID0gQHN0cmlwQ29tbWVudFN0YXJ0KG1hdGNoVGV4dClcblxuICAgICMgVHJ1bmNhdGUgbG9uZyBtYXRjaCBzdHJpbmdzXG4gICAgaWYgbWF0Y2hUZXh0Lmxlbmd0aCA+PSBtYXhMZW5ndGhcbiAgICAgIG1hdGNoVGV4dCA9IFwiI3ttYXRjaFRleHQuc3Vic3RyKDAsIG1heExlbmd0aCAtIDMpfS4uLlwiXG5cbiAgICAjIE1ha2Ugc3VyZSByYW5nZSBpcyBzZXJpYWxpemVkIHRvIHByb2R1Y2UgY29ycmVjdCByZW5kZXJlZCBmb3JtYXRcbiAgICBtYXRjaC5wb3NpdGlvbiA9IFtbMCwwXV0gdW5sZXNzIG1hdGNoLnBvc2l0aW9uIGFuZCBtYXRjaC5wb3NpdGlvbi5sZW5ndGggPiAwXG4gICAgaWYgbWF0Y2gucG9zaXRpb24uc2VyaWFsaXplXG4gICAgICBtYXRjaC5yYW5nZSA9IG1hdGNoLnBvc2l0aW9uLnNlcmlhbGl6ZSgpLnRvU3RyaW5nKClcbiAgICBlbHNlXG4gICAgICBtYXRjaC5yYW5nZSA9IG1hdGNoLnBvc2l0aW9uLnRvU3RyaW5nKClcblxuICAgICMgRXh0cmFjdCBwYXRocyBhbmQgcHJvamVjdFxuICAgIHJlbGF0aXZlUGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChtYXRjaC5sb2MpXG4gICAgcmVsYXRpdmVQYXRoWzBdID89ICcnXG4gICAgbWF0Y2gucGF0aCA9IHJlbGF0aXZlUGF0aFsxXSBvciAnJ1xuXG4gICAgaWYgKGxvYyA9IHBhdGguYmFzZW5hbWUobWF0Y2gubG9jKSkgaXNudCAndW5kZWZpbmVkJ1xuICAgICAgbWF0Y2guZmlsZSA9IGxvY1xuICAgIGVsc2VcbiAgICAgIG1hdGNoLmZpbGUgPSAndW50aXRsZWQnXG5cbiAgICBpZiAocHJvamVjdCA9IHBhdGguYmFzZW5hbWUocmVsYXRpdmVQYXRoWzBdKSkgaXNudCAnbnVsbCdcbiAgICAgIG1hdGNoLnByb2plY3QgPSBwcm9qZWN0XG4gICAgZWxzZVxuICAgICAgbWF0Y2gucHJvamVjdCA9ICcnXG5cbiAgICBtYXRjaC50ZXh0ID0gbWF0Y2hUZXh0IG9yIFwiTm8gZGV0YWlsc1wiXG4gICAgbWF0Y2gubGluZSA9IChwYXJzZUludChtYXRjaC5yYW5nZS5zcGxpdCgnLCcpWzBdKSArIDEpLnRvU3RyaW5nKClcbiAgICBtYXRjaC5yZWdleCA9IG1hdGNoLnJlZ2V4LnJlcGxhY2UoJyR7VE9ET1N9JywgbWF0Y2gudHlwZSlcbiAgICBtYXRjaC5pZCA9IG1hdGNoLmlkIG9yICcnXG5cbiAgICBfLmV4dGVuZCh0aGlzLCBtYXRjaClcblxuICBzdHJpcENvbW1lbnRTdGFydDogKHRleHQgPSAnJykgLT5cbiAgICBzdGFydFJlZ2V4ID0gLyhcXC9cXCp8PFxcP3w8IS0tfDwjfHstfFxcW1xcW3xcXC9cXC98IylcXHMqJC9cbiAgICB0ZXh0LnJlcGxhY2Uoc3RhcnRSZWdleCwgJycpLnRyaW0oKVxuXG4gIHN0cmlwQ29tbWVudEVuZDogKHRleHQgPSAnJykgLT5cbiAgICBlbmRSZWdleCA9IC8oXFwqXFwvfT98XFw/PnwtLT58Iz58LX18XFxdXFxdKVxccyokL1xuICAgIHRleHQucmVwbGFjZShlbmRSZWdleCwgJycpLnRyaW0oKVxuIl19
