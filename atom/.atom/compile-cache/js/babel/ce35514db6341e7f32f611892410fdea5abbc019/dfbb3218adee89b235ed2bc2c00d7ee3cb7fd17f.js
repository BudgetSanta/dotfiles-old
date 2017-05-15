'use babel';

time_last_lint = new Date().getTime();
lint_waiting = false;

CompositeDisposable = require('atom').CompositeDisposable;

module.exports = {
  config: {
    execPath: {
      title: "GCC Executable Path",
      description: "Note for Windows/Mac OS X users: please ensure that GCC is in your ```$PATH``` otherwise the linter might not work. If your path contains spaces, it needs to be enclosed in double quotes.",
      type: "string",
      'default': "/usr/bin/g++",
      order: 1
    },
    gccDefaultCFlags: {
      title: "C Flags",
      description: "Supports the use of escaped characters",
      type: "string",
      'default': "-c -Wall",
      order: 2
    },
    gccDefaultCppFlags: {
      title: "C++ Flags",
      description: "Supports the use of escaped characters",
      type: "string",
      'default': "-c -Wall -std=c++11",
      order: 3
    },
    gccIncludePaths: {
      title: "GCC Include Paths",
      description: "Enter your include paths as a comma-separated list. Paths starting with ```.``` or ```..``` are expanded relative to the project root path and paths starting with a ```-``` are expanded relative to the path of the active file. If any of your paths contain spaces, they need to be enclosed in double quotes. To expand a directory recursively, add ```/*``` to the end of the path",
      type: "string",
      'default': " ",
      order: 4
    },
    gccErrorLimit: {
      title: "GCC Error Limit",
      description: "To completely remove `-fmax-errors`, simply enter `-1` here.",
      type: "integer",
      'default': 0,
      order: 5
    },
    gccSuppressWarnings: {
      title: "Suppress GCC Warnings",
      type: "boolean",
      'default': false,
      order: 6
    },
    gccErrorString: {
      title: "String GCC prepends to errors",
      type: "string",
      'default': "error",
      order: 7
    },
    gccWarningString: {
      title: "String GCC prepends to warnings",
      type: "string",
      'default': "warning",
      order: 8
    },
    gccNoteString: {
      title: "String GCC prepends to notes",
      type: "string",
      'default': "note",
      order: 9
    },
    gccLintOnTheFly: {
      title: "Lint on-the-fly",
      description: "Please ensure any auto-saving packages are disabled before using this feature",
      type: "boolean",
      'default': false,
      order: 10
    },
    gccLintOnTheFlyInterval: {
      title: "Lint on-the-fly Interval",
      description: "Time interval (in ms) between linting",
      type: "integer",
      'default': 300,
      order: 11
    },
    gccDebug: {
      title: "Show Debugging Messages",
      description: "Please read the linter-gcc wiki [here](https://github.com/hebaishi/linter-gcc/wiki) before reporting any issues.",
      type: "boolean",
      'default': false,
      order: 12
    },
    compileCommandsFile: {
      title: "Compile commands file",
      description: "Path to cmake compile_commands.json",
      type: "string",
      'default': "./build/compile_commands.json",
      order: 13
    }
  },

  messages: {},
  linter_gcc: undefined,

  temp_file: {
    "C++": require("tempfile")(".cpp"),
    "C": require("tempfile")(".c")
  },

  lint: function lint(editor, linted_file, real_file) {
    var helpers = require("atom-linter");
    var regex = '(?<file>.+):(?<line>\\d+):(?<col>\\d+):\\s*\\w*\\s*(?<type>(' + atom.config.get("linter-gcc.gccErrorString") + '|' + atom.config.get("linter-gcc.gccWarningString") + '|' + atom.config.get("linter-gcc.gccNoteString") + '))\\s*:\\s*(?<message>.*)';
    command = require("./utility").buildCommand(editor, linted_file);
    return helpers.exec(command.binary, command.args, { stream: "stderr" }).then(function (output) {
      msgs = helpers.parse(output, regex);
      msgs.forEach(function (entry) {
        if (entry.filePath === module.exports.temp_file["C"] || entry.filePath === module.exports.temp_file["C++"]) {
          entry.filePath = real_file;
        }
        if (entry.type === '' + atom.config.get("linter-gcc.gccWarningString")) entry.type = "warning";else if (entry.type === '' + atom.config.get("linter-gcc.gccErrorString")) entry.type = "error";else if (entry.type === '' + atom.config.get("linter-gcc.gccNoteString")) entry.type = "note";
      });
      if (msgs.length == 0 && output.indexOf("error") != -1) {
        msgs = [{
          type: 'error',
          text: output,
          filePath: real_file
        }];
      }
      module.exports.messages[real_file] = msgs;
      // console.log(msgs)
      if (typeof module.exports.linter_gcc != "undefined") {
        module.exports.linter_gcc.setMessages(JSON.parse(JSON.stringify(require("./utility").flattenHash(module.exports.messages))));
      }
      return msgs;
    });
  },

  activate: function activate() {
    this.subscriptions = new CompositeDisposable();
    if (!atom.packages.getLoadedPackages("linter")) {
      atom.notifications.addError("Linter package not found.", {
        detail: "Please install the `linter` package in your Settings view."
      });
    }
    require("atom-package-deps").install("linter-gcc");
    time_last_lint = new Date().getTime();
    lint_waiting = false;
  },
  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },
  consumeLinter: function consumeLinter(indieRegistry) {
    module.exports.linter_gcc = indieRegistry.register({
      name: 'GCC'
    });

    subs = this.subscriptions;
    utility = require("./utility");
    lintOnTheFly = function () {
      editor = utility.getValidEditor(atom.workspace.getActiveTextEditor());
      if (!editor) return;
      if (atom.config.get("linter-gcc.gccLintOnTheFly") == false) return;
      if (lint_waiting) return;
      lint_waiting = true;
      interval = atom.config.get("linter-gcc.gccLintOnTheFlyInterval");
      time_now = new Date().getTime();
      timeout = interval - (time_now - time_last_lint);
      setTimeout(function () {
        time_last_lint = new Date().getTime();
        lint_waiting = false;
        grammar_type = utility.grammarType(editor.getGrammar().name);
        filename = String(module.exports.temp_file[grammar_type]);
        require('fs-extra').outputFileSync(filename, editor.getText());
        module.exports.lint(editor, filename, editor.getPath());
      }, timeout);
    };

    lintOnSave = function () {
      editor = utility.getValidEditor(atom.workspace.getActiveTextEditor());
      if (!editor) return;
      if (atom.config.get("linter-gcc.gccLintOnTheFly") == true) return;
      real_file = editor.getPath();
      module.exports.lint(editor, real_file, real_file);
    };

    cleanupMessages = function () {
      editor_hash = {};
      atom.workspace.getTextEditors().forEach(function (entry) {
        try {
          path = entry.getPath();
        } catch (err) {}
        editor_hash[entry.getPath()] = 1;
      });
      for (var file in module.exports.messages) {
        if (!editor_hash.hasOwnProperty(file)) {
          delete module.exports.messages[file];
        }
      }
      module.exports.linter_gcc.setMessages(JSON.parse(JSON.stringify(require("./utility").flattenHash(module.exports.messages))));
    };

    subs.add(module.exports.linter_gcc);

    atom.workspace.observeTextEditors(function (editor) {
      subs.add(editor.onDidSave(lintOnSave));
      subs.add(editor.onDidStopChanging(lintOnTheFly));
      subs.add(editor.onDidDestroy(cleanupMessages));
    });
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2phcmVkLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1nY2MvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOztBQUVYLGNBQWMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3JDLFlBQVksR0FBRyxLQUFLLENBQUE7O0FBRXBCLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQzs7QUFFMUQsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLFFBQU0sRUFBRTtBQUNOLFlBQVEsRUFBRTtBQUNSLFdBQUssRUFBRSxxQkFBcUI7QUFDNUIsaUJBQVcsRUFBRSw2TEFBNkw7QUFDMU0sVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxjQUFjO0FBQ3ZCLFdBQUssRUFBRyxDQUFDO0tBQ1Y7QUFDRCxvQkFBZ0IsRUFBRTtBQUNoQixXQUFLLEVBQUUsU0FBUztBQUNoQixpQkFBVyxFQUFFLHdDQUF3QztBQUNyRCxVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLFVBQVU7QUFDbkIsV0FBSyxFQUFHLENBQUM7S0FDVjtBQUNELHNCQUFrQixFQUFFO0FBQ2xCLFdBQUssRUFBRSxXQUFXO0FBQ2xCLGlCQUFXLEVBQUUsd0NBQXdDO0FBQ3JELFVBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMscUJBQXFCO0FBQzlCLFdBQUssRUFBRyxDQUFDO0tBQ1Y7QUFDRCxtQkFBZSxFQUFFO0FBQ2YsV0FBSyxFQUFFLG1CQUFtQjtBQUMxQixpQkFBVyxFQUFFLDJYQUEyWDtBQUN4WSxVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLEdBQUc7QUFDWixXQUFLLEVBQUcsQ0FBQztLQUNWO0FBQ0QsaUJBQWEsRUFBRTtBQUNiLFdBQUssRUFBRSxpQkFBaUI7QUFDeEIsaUJBQVcsRUFBRSw4REFBOEQ7QUFDM0UsVUFBSSxFQUFFLFNBQVM7QUFDZixpQkFBUyxDQUFDO0FBQ1YsV0FBSyxF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QyxHQUFHLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7QUFDaEQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUE7S0FDL0MsQ0FBQyxDQUFBO0dBQ0g7Q0FDRixDQUFBIiwiZmlsZSI6Ii9ob21lL2phcmVkLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1nY2MvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG50aW1lX2xhc3RfbGludCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG5saW50X3dhaXRpbmcgPSBmYWxzZVxuXG5Db21wb3NpdGVEaXNwb3NhYmxlID0gcmVxdWlyZSgnYXRvbScpLkNvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb25maWc6IHtcbiAgICBleGVjUGF0aDoge1xuICAgICAgdGl0bGU6IFwiR0NDIEV4ZWN1dGFibGUgUGF0aFwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiTm90ZSBmb3IgV2luZG93cy9NYWMgT1MgWCB1c2VyczogcGxlYXNlIGVuc3VyZSB0aGF0IEdDQyBpcyBpbiB5b3VyIGBgYCRQQVRIYGBgIG90aGVyd2lzZSB0aGUgbGludGVyIG1pZ2h0IG5vdCB3b3JrLiBJZiB5b3VyIHBhdGggY29udGFpbnMgc3BhY2VzLCBpdCBuZWVkcyB0byBiZSBlbmNsb3NlZCBpbiBkb3VibGUgcXVvdGVzLlwiLFxuICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgIGRlZmF1bHQ6IFwiL3Vzci9iaW4vZysrXCIsXG4gICAgICBvcmRlciA6IDFcbiAgICB9LFxuICAgIGdjY0RlZmF1bHRDRmxhZ3M6IHtcbiAgICAgIHRpdGxlOiBcIkMgRmxhZ3NcIixcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlN1cHBvcnRzIHRoZSB1c2Ugb2YgZXNjYXBlZCBjaGFyYWN0ZXJzXCIsXG4gICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgZGVmYXVsdDogXCItYyAtV2FsbFwiLFxuICAgICAgb3JkZXIgOiAyXG4gICAgfSxcbiAgICBnY2NEZWZhdWx0Q3BwRmxhZ3M6IHtcbiAgICAgIHRpdGxlOiBcIkMrKyBGbGFnc1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiU3VwcG9ydHMgdGhlIHVzZSBvZiBlc2NhcGVkIGNoYXJhY3RlcnNcIixcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcIi1jIC1XYWxsIC1zdGQ9YysrMTFcIixcbiAgICAgIG9yZGVyIDogM1xuICAgIH0sXG4gICAgZ2NjSW5jbHVkZVBhdGhzOiB7XG4gICAgICB0aXRsZTogXCJHQ0MgSW5jbHVkZSBQYXRoc1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiRW50ZXIgeW91ciBpbmNsdWRlIHBhdGhzIGFzIGEgY29tbWEtc2VwYXJhdGVkIGxpc3QuIFBhdGhzIHN0YXJ0aW5nIHdpdGggYGBgLmBgYCBvciBgYGAuLmBgYCBhcmUgZXhwYW5kZWQgcmVsYXRpdmUgdG8gdGhlIHByb2plY3Qgcm9vdCBwYXRoIGFuZCBwYXRocyBzdGFydGluZyB3aXRoIGEgYGBgLWBgYCBhcmUgZXhwYW5kZWQgcmVsYXRpdmUgdG8gdGhlIHBhdGggb2YgdGhlIGFjdGl2ZSBmaWxlLiBJZiBhbnkgb2YgeW91ciBwYXRocyBjb250YWluIHNwYWNlcywgdGhleSBuZWVkIHRvIGJlIGVuY2xvc2VkIGluIGRvdWJsZSBxdW90ZXMuIFRvIGV4cGFuZCBhIGRpcmVjdG9yeSByZWN1cnNpdmVseSwgYWRkIGBgYC8qYGBgIHRvIHRoZSBlbmQgb2YgdGhlIHBhdGhcIixcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcIiBcIixcbiAgICAgIG9yZGVyIDogNFxuICAgIH0sXG4gICAgZ2NjRXJyb3JMaW1pdDoge1xuICAgICAgdGl0bGU6IFwiR0NDIEVycm9yIExpbWl0XCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJUbyBjb21wbGV0ZWx5IHJlbW92ZSBgLWZtYXgtZXJyb3JzYCwgc2ltcGx5IGVudGVyIGAtMWAgaGVyZS5cIixcbiAgICAgIHR5cGU6IFwiaW50ZWdlclwiLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICAgIG9yZGVyIDogNVxuICAgIH0sXG4gICAgZ2NjU3VwcHJlc3NXYXJuaW5nczoge1xuICAgICAgdGl0bGU6IFwiU3VwcHJlc3MgR0NDIFdhcm5pbmdzXCIsXG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgb3JkZXIgOiA2XG4gICAgfSxcbiAgICBnY2NFcnJvclN0cmluZzoge1xuICAgICAgICB0aXRsZTogXCJTdHJpbmcgR0NDIHByZXBlbmRzIHRvIGVycm9yc1wiLFxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICBkZWZhdWx0OiBcImVycm9yXCIsXG4gICAgICAgIG9yZGVyOiA3XG4gICAgfSxcbiAgICBnY2NXYXJuaW5nU3RyaW5nOiB7XG4gICAgICAgIHRpdGxlOiBcIlN0cmluZyBHQ0MgcHJlcGVuZHMgdG8gd2FybmluZ3NcIixcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZGVmYXVsdDogXCJ3YXJuaW5nXCIsXG4gICAgICAgIG9yZGVyOiA4XG4gICAgfSxcbiAgICBnY2NOb3RlU3RyaW5nOiB7XG4gICAgICAgIHRpdGxlOiBcIlN0cmluZyBHQ0MgcHJlcGVuZHMgdG8gbm90ZXNcIixcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgZGVmYXVsdDogXCJub3RlXCIsXG4gICAgICAgIG9yZGVyOiA5XG4gICAgfSxcbiAgICBnY2NMaW50T25UaGVGbHk6IHtcbiAgICAgIHRpdGxlOiBcIkxpbnQgb24tdGhlLWZseVwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiUGxlYXNlIGVuc3VyZSBhbnkgYXV0by1zYXZpbmcgcGFja2FnZXMgYXJlIGRpc2FibGVkIGJlZm9yZSB1c2luZyB0aGlzIGZlYXR1cmVcIixcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBvcmRlciA6IDEwXG4gICAgfSxcbiAgICBnY2NMaW50T25UaGVGbHlJbnRlcnZhbDoge1xuICAgICAgdGl0bGU6IFwiTGludCBvbi10aGUtZmx5IEludGVydmFsXCIsXG4gICAgICBkZXNjcmlwdGlvbjogXCJUaW1lIGludGVydmFsIChpbiBtcykgYmV0d2VlbiBsaW50aW5nXCIsXG4gICAgICB0eXBlOiBcImludGVnZXJcIixcbiAgICAgIGRlZmF1bHQ6IDMwMCxcbiAgICAgIG9yZGVyIDogMTFcbiAgICB9LFxuICAgIGdjY0RlYnVnOiB7XG4gICAgICB0aXRsZTogXCJTaG93IERlYnVnZ2luZyBNZXNzYWdlc1wiLFxuICAgICAgZGVzY3JpcHRpb246IFwiUGxlYXNlIHJlYWQgdGhlIGxpbnRlci1nY2Mgd2lraSBbaGVyZV0oaHR0cHM6Ly9naXRodWIuY29tL2hlYmFpc2hpL2xpbnRlci1nY2Mvd2lraSkgYmVmb3JlIHJlcG9ydGluZyBhbnkgaXNzdWVzLlwiLFxuICAgICAgdHlwZTogXCJib29sZWFuXCIsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIG9yZGVyIDogMTJcbiAgICB9LFxuICAgIGNvbXBpbGVDb21tYW5kc0ZpbGU6IHtcbiAgICAgIHRpdGxlOiBcIkNvbXBpbGUgY29tbWFuZHMgZmlsZVwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiUGF0aCB0byBjbWFrZSBjb21waWxlX2NvbW1hbmRzLmpzb25cIixcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcIi4vYnVpbGQvY29tcGlsZV9jb21tYW5kcy5qc29uXCIsXG4gICAgICBvcmRlciA6IDEzXG4gICAgfVxuICB9LFxuXG4gIG1lc3NhZ2VzOiB7fSxcbiAgbGludGVyX2djYzogdW5kZWZpbmVkLFxuXG4gIHRlbXBfZmlsZSA6IHtcbiAgICBcIkMrK1wiOiByZXF1aXJlKFwidGVtcGZpbGVcIikoXCIuY3BwXCIpLFxuICAgIFwiQ1wiOiByZXF1aXJlKFwidGVtcGZpbGVcIikoXCIuY1wiKVxuICB9LFxuXG4gIGxpbnQ6IGZ1bmN0aW9uKGVkaXRvciwgbGludGVkX2ZpbGUsIHJlYWxfZmlsZSl7XG4gICAgY29uc3QgaGVscGVycz1yZXF1aXJlKFwiYXRvbS1saW50ZXJcIik7XG4gICAgY29uc3QgcmVnZXggPSBgKD88ZmlsZT4uKyk6KD88bGluZT5cXFxcZCspOig/PGNvbD5cXFxcZCspOlxcXFxzKlxcXFx3KlxcXFxzKig/PHR5cGU+KCR7YXRvbS5jb25maWcuZ2V0KFwibGludGVyLWdjYy5nY2NFcnJvclN0cmluZ1wiKX18JHthdG9tLmNvbmZpZy5nZXQoXCJsaW50ZXItZ2NjLmdjY1dhcm5pbmdTdHJpbmdcIil9fCR7YXRvbS5jb25maWcuZ2V0KFwibGludGVyLWdjYy5nY2NOb3RlU3RyaW5nXCIpfSkpXFxcXHMqOlxcXFxzKig/PG1lc3NhZ2U+LiopYFxuICAgIGNvbW1hbmQgPSByZXF1aXJlKFwiLi91dGlsaXR5XCIpLmJ1aWxkQ29tbWFuZChlZGl0b3IsIGxpbnRlZF9maWxlKTtcbiAgICByZXR1cm4gaGVscGVycy5leGVjKGNvbW1hbmQuYmluYXJ5LCBjb21tYW5kLmFyZ3MsIHtzdHJlYW06IFwic3RkZXJyXCJ9KS50aGVuKG91dHB1dCA9PiB7XG4gICAgICBtc2dzID0gaGVscGVycy5wYXJzZShvdXRwdXQsIHJlZ2V4KVxuICAgICAgbXNncy5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KXtcbiAgICAgICAgaWYgKGVudHJ5LmZpbGVQYXRoID09PSBtb2R1bGUuZXhwb3J0cy50ZW1wX2ZpbGVbXCJDXCJdIHx8IGVudHJ5LmZpbGVQYXRoID09PSBtb2R1bGUuZXhwb3J0cy50ZW1wX2ZpbGVbXCJDKytcIl0pe1xuICAgICAgICAgIGVudHJ5LmZpbGVQYXRoID0gcmVhbF9maWxlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbnRyeS50eXBlID09PWAke2F0b20uY29uZmlnLmdldChcImxpbnRlci1nY2MuZ2NjV2FybmluZ1N0cmluZ1wiKX1gKVxuICAgICAgICAgICAgZW50cnkudHlwZSA9IFwid2FybmluZ1wiO1xuICAgICAgICBlbHNlIGlmIChlbnRyeS50eXBlID09PWAke2F0b20uY29uZmlnLmdldChcImxpbnRlci1nY2MuZ2NjRXJyb3JTdHJpbmdcIil9YClcbiAgICAgICAgICAgIGVudHJ5LnR5cGUgPSBcImVycm9yXCI7XG4gICAgICAgIGVsc2UgaWYgKGVudHJ5LnR5cGUgPT09YCR7YXRvbS5jb25maWcuZ2V0KFwibGludGVyLWdjYy5nY2NOb3RlU3RyaW5nXCIpfWApXG4gICAgICAgICAgICBlbnRyeS50eXBlID0gXCJub3RlXCI7XG4gICAgICB9KVxuICAgICAgaWYgKG1zZ3MubGVuZ3RoID09IDAgJiYgb3V0cHV0LmluZGV4T2YoXCJlcnJvclwiKSAhPSAtMSl7XG4gICAgICAgIG1zZ3MgPSBbe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgdGV4dDogb3V0cHV0LFxuICAgICAgICAgIGZpbGVQYXRoOiByZWFsX2ZpbGVcbiAgICAgICAgfV07XG4gICAgICB9XG4gICAgICBtb2R1bGUuZXhwb3J0cy5tZXNzYWdlc1tyZWFsX2ZpbGVdID0gbXNncztcbiAgICAgIC8vIGNvbnNvbGUubG9nKG1zZ3MpXG4gICAgICBpZiAodHlwZW9mIG1vZHVsZS5leHBvcnRzLmxpbnRlcl9nY2MgIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzLmxpbnRlcl9nY2Muc2V0TWVzc2FnZXMoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXF1aXJlKFwiLi91dGlsaXR5XCIpLmZsYXR0ZW5IYXNoKG1vZHVsZS5leHBvcnRzLm1lc3NhZ2VzKSkpKVxuICAgICAgfVxuICAgICAgcmV0dXJuIG1zZ3M7XG4gICAgfSlcbiAgfSxcblxuICBhY3RpdmF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIGlmKCFhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2VzKFwibGludGVyXCIpKSB7XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFxuICAgICAgXCJMaW50ZXIgcGFja2FnZSBub3QgZm91bmQuXCIsXG4gICAgICB7XG4gICAgICAgIGRldGFpbDogXCJQbGVhc2UgaW5zdGFsbCB0aGUgYGxpbnRlcmAgcGFja2FnZSBpbiB5b3VyIFNldHRpbmdzIHZpZXcuXCJcbiAgICAgIH1cbiAgICApO1xuICAgIH1cbiAgICByZXF1aXJlKFwiYXRvbS1wYWNrYWdlLWRlcHNcIikuaW5zdGFsbChcImxpbnRlci1nY2NcIik7XG4gICAgdGltZV9sYXN0X2xpbnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgIGxpbnRfd2FpdGluZyA9IGZhbHNlXG4gIH0sXG4gIGRlYWN0aXZhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfSxcbiAgY29uc3VtZUxpbnRlcjogZnVuY3Rpb24oaW5kaWVSZWdpc3RyeSkge1xuICAgIG1vZHVsZS5leHBvcnRzLmxpbnRlcl9nY2MgPSBpbmRpZVJlZ2lzdHJ5LnJlZ2lzdGVyKHtcbiAgICAgIG5hbWU6ICdHQ0MnXG4gICAgfSlcblxuICAgIHN1YnMgPSB0aGlzLnN1YnNjcmlwdGlvbnM7XG4gICAgdXRpbGl0eSA9IHJlcXVpcmUoXCIuL3V0aWxpdHlcIilcbiAgICBsaW50T25UaGVGbHkgPSBmdW5jdGlvbigpIHtcbiAgICAgIGVkaXRvciA9IHV0aWxpdHkuZ2V0VmFsaWRFZGl0b3IoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKTtcbiAgICAgIGlmICghZWRpdG9yKSByZXR1cm47XG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KFwibGludGVyLWdjYy5nY2NMaW50T25UaGVGbHlcIikgPT0gZmFsc2UpIHJldHVybjtcbiAgICAgIGlmIChsaW50X3dhaXRpbmcpIHJldHVybjtcbiAgICAgIGxpbnRfd2FpdGluZyA9IHRydWVcbiAgICAgIGludGVydmFsID0gYXRvbS5jb25maWcuZ2V0KFwibGludGVyLWdjYy5nY2NMaW50T25UaGVGbHlJbnRlcnZhbFwiKVxuICAgICAgdGltZV9ub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgICAgdGltZW91dCA9IGludGVydmFsIC0gKHRpbWVfbm93IC0gdGltZV9sYXN0X2xpbnQpO1xuICAgICAgc2V0VGltZW91dChcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZV9sYXN0X2xpbnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgICAgICAgIGxpbnRfd2FpdGluZyA9IGZhbHNlXG4gICAgICAgICAgZ3JhbW1hcl90eXBlID0gdXRpbGl0eS5ncmFtbWFyVHlwZShlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWUpXG4gICAgICAgICAgZmlsZW5hbWUgPSBTdHJpbmcobW9kdWxlLmV4cG9ydHMudGVtcF9maWxlW2dyYW1tYXJfdHlwZV0pXG4gICAgICAgICAgcmVxdWlyZSgnZnMtZXh0cmEnKS5vdXRwdXRGaWxlU3luYyhmaWxlbmFtZSwgZWRpdG9yLmdldFRleHQoKSk7XG4gICAgICAgICAgbW9kdWxlLmV4cG9ydHMubGludChlZGl0b3IsIGZpbGVuYW1lLCBlZGl0b3IuZ2V0UGF0aCgpKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGltZW91dFxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgbGludE9uU2F2ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICBlZGl0b3IgPSB1dGlsaXR5LmdldFZhbGlkRWRpdG9yKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSk7XG4gICAgICBpZiAoIWVkaXRvcikgcmV0dXJuO1xuICAgICAgaWYgKGF0b20uY29uZmlnLmdldChcImxpbnRlci1nY2MuZ2NjTGludE9uVGhlRmx5XCIpID09IHRydWUpIHJldHVybjtcbiAgICAgIHJlYWxfZmlsZSA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICBtb2R1bGUuZXhwb3J0cy5saW50KGVkaXRvciwgcmVhbF9maWxlLCByZWFsX2ZpbGUpO1xuICAgIH07XG5cbiAgICBjbGVhbnVwTWVzc2FnZXMgPSBmdW5jdGlvbigpe1xuICAgICAgZWRpdG9yX2hhc2ggPSB7fTtcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaCggZnVuY3Rpb24oZW50cnkpe1xuICAgICAgICB0cnl7XG4gICAgICAgICAgcGF0aCA9IGVudHJ5LmdldFBhdGgoKVxuICAgICAgICB9IGNhdGNoKGVycil7XG4gICAgICAgIH1cbiAgICAgICAgZWRpdG9yX2hhc2hbZW50cnkuZ2V0UGF0aCgpXSA9IDE7XG4gICAgICB9KTtcbiAgICAgIGZvciAodmFyIGZpbGUgaW4gbW9kdWxlLmV4cG9ydHMubWVzc2FnZXMpe1xuICAgICAgICBpZiAoIWVkaXRvcl9oYXNoLmhhc093blByb3BlcnR5KGZpbGUpKXtcbiAgICAgICAgICBkZWxldGUgbW9kdWxlLmV4cG9ydHMubWVzc2FnZXNbZmlsZV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbW9kdWxlLmV4cG9ydHMubGludGVyX2djYy5zZXRNZXNzYWdlcyhKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlcXVpcmUoXCIuL3V0aWxpdHlcIikuZmxhdHRlbkhhc2gobW9kdWxlLmV4cG9ydHMubWVzc2FnZXMpKSkpO1xuICAgIH07XG5cbiAgICBzdWJzLmFkZChtb2R1bGUuZXhwb3J0cy5saW50ZXJfZ2NjKVxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKGZ1bmN0aW9uKGVkaXRvcikge1xuICAgICAgc3Vicy5hZGQoZWRpdG9yLm9uRGlkU2F2ZShsaW50T25TYXZlKSlcbiAgICAgIHN1YnMuYWRkKGVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZyhsaW50T25UaGVGbHkpKVxuICAgICAgc3Vicy5hZGQoZWRpdG9yLm9uRGlkRGVzdHJveShjbGVhbnVwTWVzc2FnZXMpKVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==