(function() {
  var TodoRegex;

  module.exports = TodoRegex = (function() {
    function TodoRegex(regex, todoList) {
      this.regex = regex;
      this.error = false;
      this.regexp = this.createRegexp(this.regex, todoList);
    }

    TodoRegex.prototype.makeRegexObj = function(regexStr) {
      var flags, pattern, ref, ref1;
      if (regexStr == null) {
        regexStr = '';
      }
      pattern = (ref = regexStr.match(/\/(.+)\//)) != null ? ref[1] : void 0;
      flags = (ref1 = regexStr.match(/\/(\w+$)/)) != null ? ref1[1] : void 0;
      if (!pattern) {
        this.error = true;
        return false;
      }
      return new RegExp(pattern, flags);
    };

    TodoRegex.prototype.createRegexp = function(regexStr, todoList) {
      if (!(Object.prototype.toString.call(todoList) === '[object Array]' && todoList.length > 0 && regexStr)) {
        this.error = true;
        return false;
      }
      return this.makeRegexObj(regexStr.replace('${TODOS}', todoList.join('|')));
    };

    return TodoRegex;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLXJlZ2V4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLG1CQUFDLEtBQUQsRUFBUyxRQUFUO01BQUMsSUFBQyxDQUFBLFFBQUQ7TUFDWixJQUFDLENBQUEsS0FBRCxHQUFTO01BQ1QsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxLQUFmLEVBQXNCLFFBQXRCO0lBRkM7O3dCQUliLFlBQUEsR0FBYyxTQUFDLFFBQUQ7QUFFWixVQUFBOztRQUZhLFdBQVc7O01BRXhCLE9BQUEsbURBQXNDLENBQUEsQ0FBQTtNQUV0QyxLQUFBLHFEQUFvQyxDQUFBLENBQUE7TUFFcEMsSUFBQSxDQUFPLE9BQVA7UUFDRSxJQUFDLENBQUEsS0FBRCxHQUFTO0FBQ1QsZUFBTyxNQUZUOzthQUdJLElBQUEsTUFBQSxDQUFPLE9BQVAsRUFBZ0IsS0FBaEI7SUFUUTs7d0JBV2QsWUFBQSxHQUFjLFNBQUMsUUFBRCxFQUFXLFFBQVg7TUFDWixJQUFBLENBQUEsQ0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUExQixDQUErQixRQUEvQixDQUFBLEtBQTRDLGdCQUE1QyxJQUNQLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBRFgsSUFFUCxRQUZBLENBQUE7UUFHRSxJQUFDLENBQUEsS0FBRCxHQUFTO0FBQ1QsZUFBTyxNQUpUOzthQUtBLElBQUMsQ0FBQSxZQUFELENBQWMsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsVUFBakIsRUFBNkIsUUFBUSxDQUFDLElBQVQsQ0FBYyxHQUFkLENBQTdCLENBQWQ7SUFOWTs7Ozs7QUFqQmhCIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVG9kb1JlZ2V4XG4gIGNvbnN0cnVjdG9yOiAoQHJlZ2V4LCB0b2RvTGlzdCkgLT5cbiAgICBAZXJyb3IgPSBmYWxzZVxuICAgIEByZWdleHAgPSBAY3JlYXRlUmVnZXhwKEByZWdleCwgdG9kb0xpc3QpXG5cbiAgbWFrZVJlZ2V4T2JqOiAocmVnZXhTdHIgPSAnJykgLT5cbiAgICAjIEV4dHJhY3QgdGhlIHJlZ2V4IHBhdHRlcm4gKGFueXRoaW5nIGJldHdlZW4gdGhlIHNsYXNoZXMpXG4gICAgcGF0dGVybiA9IHJlZ2V4U3RyLm1hdGNoKC9cXC8oLispXFwvLyk/WzFdXG4gICAgIyBFeHRyYWN0IHRoZSBmbGFncyAoYWZ0ZXIgbGFzdCBzbGFzaClcbiAgICBmbGFncyA9IHJlZ2V4U3RyLm1hdGNoKC9cXC8oXFx3KyQpLyk/WzFdXG5cbiAgICB1bmxlc3MgcGF0dGVyblxuICAgICAgQGVycm9yID0gdHJ1ZVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgbmV3IFJlZ0V4cChwYXR0ZXJuLCBmbGFncylcblxuICBjcmVhdGVSZWdleHA6IChyZWdleFN0ciwgdG9kb0xpc3QpIC0+XG4gICAgdW5sZXNzIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0b2RvTGlzdCkgaXMgJ1tvYmplY3QgQXJyYXldJyBhbmRcbiAgICB0b2RvTGlzdC5sZW5ndGggPiAwIGFuZFxuICAgIHJlZ2V4U3RyXG4gICAgICBAZXJyb3IgPSB0cnVlXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBAbWFrZVJlZ2V4T2JqKHJlZ2V4U3RyLnJlcGxhY2UoJyR7VE9ET1N9JywgdG9kb0xpc3Quam9pbignfCcpKSlcbiJdfQ==
