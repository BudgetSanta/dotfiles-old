(function() {
  var TodosMarkdown;

  module.exports = TodosMarkdown = (function() {
    function TodosMarkdown() {
      this.showInTable = atom.config.get('todo-show.showInTable');
    }

    TodosMarkdown.prototype.getTable = function(todos) {
      var key, md, out, todo;
      md = "| " + (((function() {
        var i, len, ref, results;
        ref = this.showInTable;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          key = ref[i];
          results.push(key);
        }
        return results;
      }).call(this)).join(' | ')) + " |\n";
      md += "|" + (Array(md.length - 2).join('-')) + "|\n";
      return md + ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = todos.length; i < len; i++) {
          todo = todos[i];
          out = '|' + todo.getMarkdownArray(this.showInTable).join(' |');
          results.push(out + " |\n");
        }
        return results;
      }).call(this)).join('');
    };

    TodosMarkdown.prototype.getList = function(todos) {
      var out, todo;
      return ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = todos.length; i < len; i++) {
          todo = todos[i];
          out = '-' + todo.getMarkdownArray(this.showInTable).join('');
          if (out === '-') {
            out = "- No details";
          }
          results.push(out + "\n");
        }
        return results;
      }).call(this)).join('');
    };

    TodosMarkdown.prototype.markdown = function(todos) {
      if (atom.config.get('todo-show.saveOutputAs') === 'Table') {
        return this.getTable(todos);
      } else {
        return this.getList(todos);
      }
    };

    return TodosMarkdown;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvdG9kby1zaG93L2xpYi90b2RvLW1hcmtkb3duLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHVCQUFBO01BQ1gsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCO0lBREo7OzRCQUdiLFFBQUEsR0FBVSxTQUFDLEtBQUQ7QUFDUixVQUFBO01BQUEsRUFBQSxHQUFNLElBQUEsR0FBSSxDQUFDOztBQUFDO0FBQUE7YUFBQSxxQ0FBQTs7dUJBQTZCO0FBQTdCOzttQkFBRCxDQUFrQyxDQUFDLElBQW5DLENBQXdDLEtBQXhDLENBQUQsQ0FBSixHQUFvRDtNQUMxRCxFQUFBLElBQU0sR0FBQSxHQUFHLENBQUMsS0FBQSxDQUFNLEVBQUUsQ0FBQyxNQUFILEdBQVUsQ0FBaEIsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixHQUF4QixDQUFELENBQUgsR0FBaUM7YUFDdkMsRUFBQSxHQUFLOztBQUFDO2FBQUEsdUNBQUE7O1VBQ0osR0FBQSxHQUFNLEdBQUEsR0FBTSxJQUFJLENBQUMsZ0JBQUwsQ0FBc0IsSUFBQyxDQUFBLFdBQXZCLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsSUFBekM7dUJBQ1QsR0FBRCxHQUFLO0FBRkg7O21CQUFELENBR0osQ0FBQyxJQUhHLENBR0UsRUFIRjtJQUhHOzs0QkFRVixPQUFBLEdBQVMsU0FBQyxLQUFEO0FBQ1AsVUFBQTthQUFBOztBQUFDO2FBQUEsdUNBQUE7O1VBQ0MsR0FBQSxHQUFNLEdBQUEsR0FBTSxJQUFJLENBQUMsZ0JBQUwsQ0FBc0IsSUFBQyxDQUFBLFdBQXZCLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsRUFBekM7VUFDWixJQUF3QixHQUFBLEtBQU8sR0FBL0I7WUFBQSxHQUFBLEdBQU0sZUFBTjs7dUJBQ0csR0FBRCxHQUFLO0FBSFI7O21CQUFELENBSUMsQ0FBQyxJQUpGLENBSU8sRUFKUDtJQURPOzs0QkFPVCxRQUFBLEdBQVUsU0FBQyxLQUFEO01BQ1IsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBQUEsS0FBNkMsT0FBaEQ7ZUFDRSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsT0FBRCxDQUFTLEtBQVQsRUFIRjs7SUFEUTs7Ozs7QUFwQloiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBUb2Rvc01hcmtkb3duXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBzaG93SW5UYWJsZSA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LnNob3dJblRhYmxlJylcblxuICBnZXRUYWJsZTogKHRvZG9zKSAtPlxuICAgIG1kID0gIFwifCAjeyhmb3Iga2V5IGluIEBzaG93SW5UYWJsZSB0aGVuIGtleSkuam9pbignIHwgJyl9IHxcXG5cIlxuICAgIG1kICs9IFwifCN7QXJyYXkobWQubGVuZ3RoLTIpLmpvaW4oJy0nKX18XFxuXCJcbiAgICBtZCArIChmb3IgdG9kbyBpbiB0b2Rvc1xuICAgICAgb3V0ID0gJ3wnICsgdG9kby5nZXRNYXJrZG93bkFycmF5KEBzaG93SW5UYWJsZSkuam9pbignIHwnKVxuICAgICAgXCIje291dH0gfFxcblwiXG4gICAgKS5qb2luKCcnKVxuXG4gIGdldExpc3Q6ICh0b2RvcykgLT5cbiAgICAoZm9yIHRvZG8gaW4gdG9kb3NcbiAgICAgIG91dCA9ICctJyArIHRvZG8uZ2V0TWFya2Rvd25BcnJheShAc2hvd0luVGFibGUpLmpvaW4oJycpXG4gICAgICBvdXQgPSBcIi0gTm8gZGV0YWlsc1wiIGlmIG91dCBpcyAnLSdcbiAgICAgIFwiI3tvdXR9XFxuXCJcbiAgICApLmpvaW4oJycpXG5cbiAgbWFya2Rvd246ICh0b2RvcykgLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5zYXZlT3V0cHV0QXMnKSBpcyAnVGFibGUnXG4gICAgICBAZ2V0VGFibGUgdG9kb3NcbiAgICBlbHNlXG4gICAgICBAZ2V0TGlzdCB0b2Rvc1xuIl19
