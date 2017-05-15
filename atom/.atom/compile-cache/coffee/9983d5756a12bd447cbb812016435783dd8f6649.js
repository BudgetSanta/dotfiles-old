(function() {
  var CompositeDisposable, GitPull, GitPush, Path, cleanup, commit, destroyCommitEditor, disposables, fs, getStagedFiles, getTemplate, git, notifier, prepFile, showFile, trimFile, verboseCommitsEnabled;

  Path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  GitPush = require('./git-push');

  GitPull = require('./git-pull');

  disposables = new CompositeDisposable;

  verboseCommitsEnabled = function() {
    return atom.config.get('git-plus.commits.verboseCommits');
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      if (files.length >= 1) {
        return git.cmd(['-c', 'color.ui=false', 'status'], {
          cwd: repo.getWorkingDirectory()
        });
      } else {
        return Promise.reject("Nothing to commit.");
      }
    });
  };

  getTemplate = function(filePath) {
    var e;
    if (filePath) {
      try {
        return fs.readFileSync(fs.absolute(filePath.trim())).toString().trim();
      } catch (error) {
        e = error;
        throw new Error("Your configured commit template file can't be found.");
      }
    } else {
      return '';
    }
  };

  prepFile = function(arg) {
    var commentChar, commitEditor, content, cwd, diff, filePath, indexOfComments, ref, status, template, text;
    status = arg.status, filePath = arg.filePath, diff = arg.diff, commentChar = arg.commentChar, template = arg.template;
    if (commitEditor = (ref = atom.workspace.paneForURI(filePath)) != null ? ref.itemForURI(filePath) : void 0) {
      text = commitEditor.getText();
      indexOfComments = text.indexOf(commentChar);
      if (indexOfComments > 0) {
        template = text.substring(0, indexOfComments - 1);
      }
    }
    cwd = Path.dirname(filePath);
    status = status.replace(/\s*\(.*\)\n/g, "\n");
    status = status.trim().replace(/\n/g, "\n" + commentChar + " ");
    content = template + "\n" + commentChar + " Please enter the commit message for your changes. Lines starting\n" + commentChar + " with '" + commentChar + "' will be ignored, and an empty message aborts the commit.\n" + commentChar + "\n" + commentChar + " " + status;
    if (diff) {
      content += "\n" + commentChar + "\n" + commentChar + " ------------------------ >8 ------------------------\n" + commentChar + " Do not touch the line above.\n" + commentChar + " Everything below will be removed.\n" + diff;
    }
    return fs.writeFileSync(filePath, content);
  };

  destroyCommitEditor = function(filePath) {
    var ref, ref1;
    if (atom.config.get('git-plus.general.openInPane')) {
      return (ref = atom.workspace.paneForURI(filePath)) != null ? ref.destroy() : void 0;
    } else {
      return (ref1 = atom.workspace.paneForURI(filePath).itemForURI(filePath)) != null ? ref1.destroy() : void 0;
    }
  };

  trimFile = function(filePath, commentChar) {
    var content, cwd, startOfComments;
    cwd = Path.dirname(filePath);
    content = fs.readFileSync(fs.absolute(filePath)).toString();
    startOfComments = content.indexOf(content.split('\n').find(function(line) {
      return line.startsWith(commentChar);
    }));
    content = content.substring(0, startOfComments);
    return fs.writeFileSync(filePath, content);
  };

  commit = function(directory, filePath) {
    return git.cmd(['commit', "--cleanup=strip", "--file=" + filePath], {
      cwd: directory
    }).then(function(data) {
      notifier.addSuccess(data);
      destroyCommitEditor(filePath);
      return git.refresh();
    })["catch"](function(data) {
      notifier.addError(data);
      return destroyCommitEditor(filePath);
    });
  };

  cleanup = function(currentPane) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    return disposables.dispose();
  };

  showFile = function(filePath) {
    var commitEditor, ref, splitDirection;
    commitEditor = (ref = atom.workspace.paneForURI(filePath)) != null ? ref.itemForURI(filePath) : void 0;
    if (!commitEditor) {
      if (atom.config.get('git-plus.general.openInPane')) {
        splitDirection = atom.config.get('git-plus.general.splitPane');
        atom.workspace.getActivePane()["split" + splitDirection]();
      }
      return atom.workspace.open(filePath);
    } else {
      if (atom.config.get('git-plus.general.openInPane')) {
        atom.workspace.paneForURI(filePath).activate();
      } else {
        atom.workspace.paneForURI(filePath).activateItemForURI(filePath);
      }
      return Promise.resolve(commitEditor);
    }
  };

  module.exports = function(repo, arg) {
    var andPush, commentChar, currentPane, e, filePath, init, ref, ref1, stageChanges, startCommit, template;
    ref = arg != null ? arg : {}, stageChanges = ref.stageChanges, andPush = ref.andPush;
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    currentPane = atom.workspace.getActivePane();
    commentChar = (ref1 = git.getConfig(repo, 'core.commentchar')) != null ? ref1 : '#';
    try {
      template = getTemplate(git.getConfig(repo, 'commit.template'));
    } catch (error) {
      e = error;
      notifier.addError(e.message);
      return Promise.reject(e.message);
    }
    init = function() {
      return getStagedFiles(repo).then(function(status) {
        var args;
        if (verboseCommitsEnabled()) {
          args = ['diff', '--color=never', '--staged'];
          if (atom.config.get('git-plus.diffs.wordDiff')) {
            args.push('--word-diff');
          }
          return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          }).then(function(diff) {
            return prepFile({
              status: status,
              filePath: filePath,
              diff: diff,
              commentChar: commentChar,
              template: template
            });
          });
        } else {
          return prepFile({
            status: status,
            filePath: filePath,
            commentChar: commentChar,
            template: template
          });
        }
      });
    };
    startCommit = function() {
      return showFile(filePath).then(function(textEditor) {
        disposables.dispose();
        disposables = new CompositeDisposable;
        disposables.add(textEditor.onDidSave(function() {
          if (verboseCommitsEnabled()) {
            trimFile(filePath, commentChar);
          }
          return commit(repo.getWorkingDirectory(), filePath).then(function() {
            if (andPush) {
              return GitPush(repo);
            }
          });
        }));
        return disposables.add(textEditor.onDidDestroy(function() {
          return cleanup(currentPane);
        }));
      })["catch"](notifier.addError);
    };
    if (stageChanges) {
      return git.add(repo, {
        update: true
      }).then(init).then(startCommit);
    } else {
      return init().then(function() {
        return startCommit();
      })["catch"](function(message) {
        if (typeof message.includes === "function" ? message.includes('CRLF') : void 0) {
          return startCommit();
        } else {
          return notifier.addInfo(message);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtY29tbWl0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSOztFQUNWLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUjs7RUFFVixXQUFBLEdBQWMsSUFBSTs7RUFFbEIscUJBQUEsR0FBd0IsU0FBQTtXQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQ0FBaEI7RUFBSDs7RUFFeEIsY0FBQSxHQUFpQixTQUFDLElBQUQ7V0FDZixHQUFHLENBQUMsV0FBSixDQUFnQixJQUFoQixDQUFxQixDQUFDLElBQXRCLENBQTJCLFNBQUMsS0FBRDtNQUN6QixJQUFHLEtBQUssQ0FBQyxNQUFOLElBQWdCLENBQW5CO2VBQ0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLElBQUQsRUFBTyxnQkFBUCxFQUF5QixRQUF6QixDQUFSLEVBQTRDO1VBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7U0FBNUMsRUFERjtPQUFBLE1BQUE7ZUFHRSxPQUFPLENBQUMsTUFBUixDQUFlLG9CQUFmLEVBSEY7O0lBRHlCLENBQTNCO0VBRGU7O0VBT2pCLFdBQUEsR0FBYyxTQUFDLFFBQUQ7QUFDWixRQUFBO0lBQUEsSUFBRyxRQUFIO0FBQ0U7ZUFDRSxFQUFFLENBQUMsWUFBSCxDQUFnQixFQUFFLENBQUMsUUFBSCxDQUFZLFFBQVEsQ0FBQyxJQUFULENB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RUFIRjs7TUFESyxDQURQLEVBSEY7O0VBOUJlO0FBOUZqQiIsInNvdXJjZXNDb250ZW50IjpbIlBhdGggPSByZXF1aXJlICdwYXRoJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5HaXRQdXNoID0gcmVxdWlyZSAnLi9naXQtcHVzaCdcbkdpdFB1bGwgPSByZXF1aXJlICcuL2dpdC1wdWxsJ1xuXG5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbnZlcmJvc2VDb21taXRzRW5hYmxlZCA9IC0+IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuY29tbWl0cy52ZXJib3NlQ29tbWl0cycpXG5cbmdldFN0YWdlZEZpbGVzID0gKHJlcG8pIC0+XG4gIGdpdC5zdGFnZWRGaWxlcyhyZXBvKS50aGVuIChmaWxlcykgLT5cbiAgICBpZiBmaWxlcy5sZW5ndGggPj0gMVxuICAgICAgZ2l0LmNtZChbJy1jJywgJ2NvbG9yLnVpPWZhbHNlJywgJ3N0YXR1cyddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIGVsc2VcbiAgICAgIFByb21pc2UucmVqZWN0IFwiTm90aGluZyB0byBjb21taXQuXCJcblxuZ2V0VGVtcGxhdGUgPSAoZmlsZVBhdGgpIC0+XG4gIGlmIGZpbGVQYXRoXG4gICAgdHJ5XG4gICAgICBmcy5yZWFkRmlsZVN5bmMoZnMuYWJzb2x1dGUoZmlsZVBhdGgudHJpbSgpKSkudG9TdHJpbmcoKS50cmltKClcbiAgICBjYXRjaCBlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3VyIGNvbmZpZ3VyZWQgY29tbWl0IHRlbXBsYXRlIGZpbGUgY2FuJ3QgYmUgZm91bmQuXCIpXG4gIGVsc2VcbiAgICAnJ1xuXG5wcmVwRmlsZSA9ICh7c3RhdHVzLCBmaWxlUGF0aCwgZGlmZiwgY29tbWVudENoYXIsIHRlbXBsYXRlfSkgLT5cbiAgaWYgY29tbWl0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCk/Lml0ZW1Gb3JVUkkoZmlsZVBhdGgpXG4gICAgdGV4dCA9IGNvbW1pdEVkaXRvci5nZXRUZXh0KClcbiAgICBpbmRleE9mQ29tbWVudHMgPSB0ZXh0LmluZGV4T2YoY29tbWVudENoYXIpXG4gICAgaWYgaW5kZXhPZkNvbW1lbnRzID4gMFxuICAgICAgdGVtcGxhdGUgPSB0ZXh0LnN1YnN0cmluZygwLCBpbmRleE9mQ29tbWVudHMgLSAxKVxuXG4gIGN3ZCA9IFBhdGguZGlybmFtZShmaWxlUGF0aClcbiAgc3RhdHVzID0gc3RhdHVzLnJlcGxhY2UoL1xccypcXCguKlxcKVxcbi9nLCBcIlxcblwiKVxuICBzdGF0dXMgPSBzdGF0dXMudHJpbSgpLnJlcGxhY2UoL1xcbi9nLCBcIlxcbiN7Y29tbWVudENoYXJ9IFwiKVxuICBjb250ZW50ID1cbiAgICBcIlwiXCIje3RlbXBsYXRlfVxuICAgICN7Y29tbWVudENoYXJ9IFBsZWFzZSBlbnRlciB0aGUgY29tbWl0IG1lc3NhZ2UgZm9yIHlvdXIgY2hhbmdlcy4gTGluZXMgc3RhcnRpbmdcbiAgICAje2NvbW1lbnRDaGFyfSB3aXRoICcje2NvbW1lbnRDaGFyfScgd2lsbCBiZSBpZ25vcmVkLCBhbmQgYW4gZW1wdHkgbWVzc2FnZSBhYm9ydHMgdGhlIGNvbW1pdC5cbiAgICAje2NvbW1lbnRDaGFyfVxuICAgICN7Y29tbWVudENoYXJ9ICN7c3RhdHVzfVwiXCJcIlxuICBpZiBkaWZmXG4gICAgY29udGVudCArPVxuICAgICAgXCJcIlwiXFxuI3tjb21tZW50Q2hhcn1cbiAgICAgICN7Y29tbWVudENoYXJ9IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSA+OCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICN7Y29tbWVudENoYXJ9IERvIG5vdCB0b3VjaCB0aGUgbGluZSBhYm92ZS5cbiAgICAgICN7Y29tbWVudENoYXJ9IEV2ZXJ5dGhpbmcgYmVsb3cgd2lsbCBiZSByZW1vdmVkLlxuICAgICAgI3tkaWZmfVwiXCJcIlxuICBmcy53cml0ZUZpbGVTeW5jIGZpbGVQYXRoLCBjb250ZW50XG5cbmRlc3Ryb3lDb21taXRFZGl0b3IgPSAoZmlsZVBhdGgpIC0+XG4gIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJylcbiAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKT8uZGVzdHJveSgpXG4gIGVsc2VcbiAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5pdGVtRm9yVVJJKGZpbGVQYXRoKT8uZGVzdHJveSgpXG5cbnRyaW1GaWxlID0gKGZpbGVQYXRoLCBjb21tZW50Q2hhcikgLT5cbiAgY3dkID0gUGF0aC5kaXJuYW1lKGZpbGVQYXRoKVxuICBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZzLmFic29sdXRlKGZpbGVQYXRoKSkudG9TdHJpbmcoKVxuICBzdGFydE9mQ29tbWVudHMgPSBjb250ZW50LmluZGV4T2YoY29udGVudC5zcGxpdCgnXFxuJykuZmluZCAobGluZSkgLT4gbGluZS5zdGFydHNXaXRoIGNvbW1lbnRDaGFyKVxuICBjb250ZW50ID0gY29udGVudC5zdWJzdHJpbmcoMCwgc3RhcnRPZkNvbW1lbnRzKVxuICBmcy53cml0ZUZpbGVTeW5jIGZpbGVQYXRoLCBjb250ZW50XG5cbmNvbW1pdCA9IChkaXJlY3RvcnksIGZpbGVQYXRoKSAtPlxuICBnaXQuY21kKFsnY29tbWl0JywgXCItLWNsZWFudXA9c3RyaXBcIiwgXCItLWZpbGU9I3tmaWxlUGF0aH1cIl0sIGN3ZDogZGlyZWN0b3J5KVxuICAudGhlbiAoZGF0YSkgLT5cbiAgICBub3RpZmllci5hZGRTdWNjZXNzIGRhdGFcbiAgICBkZXN0cm95Q29tbWl0RWRpdG9yKGZpbGVQYXRoKVxuICAgIGdpdC5yZWZyZXNoKClcbiAgLmNhdGNoIChkYXRhKSAtPlxuICAgIG5vdGlmaWVyLmFkZEVycm9yIGRhdGFcbiAgICBkZXN0cm95Q29tbWl0RWRpdG9yKGZpbGVQYXRoKVxuXG5jbGVhbnVwID0gKGN1cnJlbnRQYW5lKSAtPlxuICBjdXJyZW50UGFuZS5hY3RpdmF0ZSgpIGlmIGN1cnJlbnRQYW5lLmlzQWxpdmUoKVxuICBkaXNwb3NhYmxlcy5kaXNwb3NlKClcblxuc2hvd0ZpbGUgPSAoZmlsZVBhdGgpIC0+XG4gIGNvbW1pdEVkaXRvciA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpPy5pdGVtRm9yVVJJKGZpbGVQYXRoKVxuICBpZiBub3QgY29tbWl0RWRpdG9yXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLm9wZW5JblBhbmUnKVxuICAgICAgc3BsaXREaXJlY3Rpb24gPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwuc3BsaXRQYW5lJylcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVtcInNwbGl0I3tzcGxpdERpcmVjdGlvbn1cIl0oKVxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4gZmlsZVBhdGhcbiAgZWxzZVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJylcbiAgICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpLmFjdGl2YXRlKClcbiAgICBlbHNlXG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5hY3RpdmF0ZUl0ZW1Gb3JVUkkoZmlsZVBhdGgpXG4gICAgUHJvbWlzZS5yZXNvbHZlKGNvbW1pdEVkaXRvcilcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywge3N0YWdlQ2hhbmdlcywgYW5kUHVzaH09e30pIC0+XG4gIGZpbGVQYXRoID0gUGF0aC5qb2luKHJlcG8uZ2V0UGF0aCgpLCAnQ09NTUlUX0VESVRNU0cnKVxuICBjdXJyZW50UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICBjb21tZW50Q2hhciA9IGdpdC5nZXRDb25maWcocmVwbywgJ2NvcmUuY29tbWVudGNoYXInKSA/ICcjJ1xuICB0cnlcbiAgICB0ZW1wbGF0ZSA9IGdldFRlbXBsYXRlKGdpdC5nZXRDb25maWcocmVwbywgJ2NvbW1pdC50ZW1wbGF0ZScpKVxuICBjYXRjaCBlXG4gICAgbm90aWZpZXIuYWRkRXJyb3IoZS5tZXNzYWdlKVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpXG5cbiAgaW5pdCA9IC0+IGdldFN0YWdlZEZpbGVzKHJlcG8pLnRoZW4gKHN0YXR1cykgLT5cbiAgICBpZiB2ZXJib3NlQ29tbWl0c0VuYWJsZWQoKVxuICAgICAgYXJncyA9IFsnZGlmZicsICctLWNvbG9yPW5ldmVyJywgJy0tc3RhZ2VkJ11cbiAgICAgIGFyZ3MucHVzaCAnLS13b3JkLWRpZmYnIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZGlmZnMud29yZERpZmYnKVxuICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgLnRoZW4gKGRpZmYpIC0+IHByZXBGaWxlIHtzdGF0dXMsIGZpbGVQYXRoLCBkaWZmLCBjb21tZW50Q2hhciwgdGVtcGxhdGV9XG4gICAgZWxzZVxuICAgICAgcHJlcEZpbGUge3N0YXR1cywgZmlsZVBhdGgsIGNvbW1lbnRDaGFyLCB0ZW1wbGF0ZX1cbiAgc3RhcnRDb21taXQgPSAtPlxuICAgIHNob3dGaWxlIGZpbGVQYXRoXG4gICAgLnRoZW4gKHRleHRFZGl0b3IpIC0+XG4gICAgICBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICAgIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICAgIGRpc3Bvc2FibGVzLmFkZCB0ZXh0RWRpdG9yLm9uRGlkU2F2ZSAtPlxuICAgICAgICB0cmltRmlsZShmaWxlUGF0aCwgY29tbWVudENoYXIpIGlmIHZlcmJvc2VDb21taXRzRW5hYmxlZCgpXG4gICAgICAgIGNvbW1pdChyZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwgZmlsZVBhdGgpXG4gICAgICAgIC50aGVuIC0+IEdpdFB1c2gocmVwbykgaWYgYW5kUHVzaFxuICAgICAgZGlzcG9zYWJsZXMuYWRkIHRleHRFZGl0b3Iub25EaWREZXN0cm95IC0+IGNsZWFudXAoY3VycmVudFBhbmUpXG4gICAgLmNhdGNoKG5vdGlmaWVyLmFkZEVycm9yKVxuXG4gIGlmIHN0YWdlQ2hhbmdlc1xuICAgIGdpdC5hZGQocmVwbywgdXBkYXRlOiB0cnVlKS50aGVuKGluaXQpLnRoZW4oc3RhcnRDb21taXQpXG4gIGVsc2VcbiAgICBpbml0KCkudGhlbiAtPiBzdGFydENvbW1pdCgpXG4gICAgLmNhdGNoIChtZXNzYWdlKSAtPlxuICAgICAgaWYgbWVzc2FnZS5pbmNsdWRlcz8oJ0NSTEYnKVxuICAgICAgICBzdGFydENvbW1pdCgpXG4gICAgICBlbHNlXG4gICAgICAgIG5vdGlmaWVyLmFkZEluZm8gbWVzc2FnZVxuIl19
