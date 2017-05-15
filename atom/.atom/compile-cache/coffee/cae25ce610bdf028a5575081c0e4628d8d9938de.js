(function() {
  var getCommands, git;

  git = require('./git');

  getCommands = function() {
    var GitCheckoutAllFiles, GitCheckoutBranch, GitCheckoutFile, GitCheckoutNewBranch, GitCherryPick, GitCommit, GitCommitAmend, GitDeleteBranch, GitDiff, GitDiffAll, GitDiffBranchFiles, GitDiffBranches, GitDifftool, GitFetch, GitFetchPrune, GitInit, GitLog, GitMerge, GitOpenChangedFiles, GitPull, GitPush, GitRebase, GitRemove, GitRun, GitShow, GitStageFiles, GitStageFilesBeta, GitStageHunk, GitStashApply, GitStashDrop, GitStashPop, GitStashSave, GitStashSaveMessage, GitStatus, GitTags, GitUnstageFiles;
    GitCheckoutNewBranch = require('./models/git-checkout-new-branch');
    GitCheckoutBranch = require('./models/git-checkout-branch');
    GitDeleteBranch = require('./models/git-delete-branch');
    GitCheckoutAllFiles = require('./models/git-checkout-all-files');
    GitCheckoutFile = require('./models/git-checkout-file');
    GitCherryPick = require('./models/git-cherry-pick');
    GitCommit = require('./models/git-commit');
    GitCommitAmend = require('./models/git-commit-amend');
    GitDiff = require('./models/git-diff');
    GitDiffBranches = require('./models/git-diff-branches');
    GitDiffBranchFiles = require('./models/git-diff-branch-files');
    GitDifftool = require('./models/git-difftool');
    GitDiffAll = require('./models/git-diff-all');
    GitFetch = require('./models/git-fetch');
    GitFetchPrune = require('./models/git-fetch-prune');
    GitInit = require('./models/git-init');
    GitLog = require('./models/git-log');
    GitPull = require('./models/git-pull');
    GitPush = require('./models/git-push');
    GitRemove = require('./models/git-remove');
    GitShow = require('./models/git-show');
    GitStageFiles = require('./models/git-stage-files');
    GitStageFilesBeta = require('./models/git-stage-files-beta');
    GitStageHunk = require('./models/git-stage-hunk');
    GitStashApply = require('./models/git-stash-apply');
    GitStashDrop = require('./models/git-stash-drop');
    GitStashPop = require('./models/git-stash-pop');
    GitStashSave = require('./models/git-stash-save');
    GitStashSaveMessage = require('./models/git-stash-save-message');
    GitStatus = require('./models/git-status');
    GitTags = require('./models/git-tags');
    GitUnstageFiles = require('./models/git-unstage-files');
    GitRun = require('./models/git-run');
    GitMerge = require('./models/git-merge');
    GitRebase = require('./models/git-rebase');
    GitOpenChangedFiles = require('./models/git-open-changed-files');
    return git.getRepo().then(function(repo) {
      var commands, currentFile, ref;
      currentFile = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
      git.refresh(repo);
      commands = [];
      if (atom.config.get('git-plus.experimental.customCommands')) {
        commands = commands.concat(require('./service').getCustomCommands());
      }
      commands.push([
        'git-plus:add', 'Add', function() {
          return git.add(repo, {
            file: currentFile
          });
        }
      ]);
      commands.push([
        'git-plus:add-modified', 'Add Modified', function() {
          return git.add(repo, {
            update: true
          });
        }
      ]);
      commands.push([
        'git-plus:add-all', 'Add All', function() {
          return git.add(repo);
        }
      ]);
      commands.push([
        'git-plus:log', 'Log', function() {
          return GitLog(repo);
        }
      ]);
      commands.push([
        'git-plus:log-current-file', 'Log Current File', function() {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        }
      ]);
      commands.push([
        'git-plus:remove-current-file', 'Remove Current File', function() {
          return GitRemove(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-all-files', 'Checkout All Files', function() {
          return GitCheckoutAllFiles(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-current-file', 'Checkout Current File', function() {
          return GitCheckoutFile(repo, {
            file: currentFile
          });
        }
      ]);
      commands.push([
        'git-plus:commit', 'Commit', function() {
          return GitCommit(repo);
        }
      ]);
      commands.push([
        'git-plus:commit-all', 'Commit All', function() {
          return GitCommit(repo, {
            stageChanges: true
          });
        }
      ]);
      commands.push([
        'git-plus:commit-amend', 'Commit Amend', function() {
          return GitCommitAmend(repo);
        }
      ]);
      commands.push([
        'git-plus:add-and-commit', 'Add And Commit', function() {
          return git.add(repo, {
            file: currentFile
          }).then(function() {
            return GitCommit(repo);
          });
        }
      ]);
      commands.push([
        'git-plus:add-and-commit-and-push', 'Add And Commit And Push', function() {
          return git.add(repo, {
            file: currentFile
          }).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        }
      ]);
      commands.push([
        'git-plus:add-all-and-commit', 'Add All And Commit', function() {
          return git.add(repo).then(function() {
            return GitCommit(repo);
          });
        }
      ]);
      commands.push([
        'git-plus:add-all-commit-and-push', 'Add All, Commit And Push', function() {
          return git.add(repo).then(function() {
            return GitCommit(repo, {
              andPush: true
            });
          });
        }
      ]);
      commands.push([
        'git-plus:commit-all-and-push', 'Commit All And Push', function() {
          return GitCommit(repo, {
            stageChanges: true,
            andPush: true
          });
        }
      ]);
      commands.push([
        'git-plus:checkout', 'Checkout', function() {
          return GitCheckoutBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:checkout-remote', 'Checkout Remote', function() {
          return GitCheckoutBranch(repo, {
            remote: true
          });
        }
      ]);
      commands.push([
        'git-plus:new-branch', 'Checkout New Branch', function() {
          return GitCheckoutNewBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-local-branch', 'Delete Local Branch', function() {
          return GitDeleteBranch(repo);
        }
      ]);
      commands.push([
        'git-plus:delete-remote-branch', 'Delete Remote Branch', function() {
          return GitDeleteBranch(repo, {
            remote: true
          });
        }
      ]);
      commands.push([
        'git-plus:cherry-pick', 'Cherry-Pick', function() {
          return GitCherryPick(repo);
        }
      ]);
      commands.push([
        'git-plus:diff', 'Diff', function() {
          return GitDiff(repo, {
            file: currentFile
          });
        }
      ]);
      if (atom.config.get('git-plus.experimental.diffBranches')) {
        commands.push([
          'git-plus:diff-branches', 'Diff branches', function() {
            return GitDiffBranches(repo);
          }
        ]);
        commands.push([
          'git-plus:diff-branch-files', 'Diff branch files', function() {
            return GitDiffBranchFiles(repo);
          }
        ]);
      }
      commands.push([
        'git-plus:difftool', 'Difftool', function() {
          return GitDifftool(repo);
        }
      ]);
      commands.push([
        'git-plus:diff-all', 'Diff All', function() {
          return GitDiffAll(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch', 'Fetch', function() {
          return GitFetch(repo);
        }
      ]);
      commands.push([
        'git-plus:fetch-prune', 'Fetch Prune', function() {
          return GitFetchPrune(repo);
        }
      ]);
      commands.push([
        'git-plus:pull', 'Pull', function() {
          return GitPull(repo);
        }
      ]);
      commands.push([
        'git-plus:push', 'Push', function() {
          return GitPush(repo);
        }
      ]);
      commands.push([
        'git-plus:push-set-upstream', 'Push -u', function() {
          return GitPush(repo, {
            setUpstream: true
          });
        }
      ]);
      commands.push([
        'git-plus:remove', 'Remove', function() {
          return GitRemove(repo, {
            showSelector: true
          });
        }
      ]);
      commands.push([
        'git-plus:reset', 'Reset HEAD', function() {
          return git.reset(repo);
        }
      ]);
      commands.push([
        'git-plus:show', 'Show', function() {
          return GitShow(repo);
        }
      ]);
      if (atom.config.get('git-plus.experimental.stageFilesBeta')) {
        commands.push([
          'git-plus:stage-files', 'Stage Files', function() {
            return GitStageFilesBeta(repo);
          }
        ]);
      } else {
        commands.push([
          'git-plus:stage-files', 'Stage Files', function() {
            return GitStageFiles(repo);
          }
        ]);
        commands.push([
          'git-plus:unstage-files', 'Unstage Files', function() {
            return GitUnstageFiles(repo);
          }
        ]);
      }
      commands.push([
        'git-plus:stage-hunk', 'Stage Hunk', function() {
          return GitStageHunk(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-save', 'Stash: Save Changes', function() {
          return GitStashSave(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-save-message', 'Stash: Save Changes With Message', function() {
          return GitStashSaveMessage(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-pop', 'Stash: Apply (Pop)', function() {
          return GitStashPop(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-apply', 'Stash: Apply (Keep)', function() {
          return GitStashApply(repo);
        }
      ]);
      commands.push([
        'git-plus:stash-delete', 'Stash: Delete (Drop)', function() {
          return GitStashDrop(repo);
        }
      ]);
      commands.push([
        'git-plus:status', 'Status', function() {
          return GitStatus(repo);
        }
      ]);
      commands.push([
        'git-plus:tags', 'Tags', function() {
          return GitTags(repo);
        }
      ]);
      commands.push([
        'git-plus:run', 'Run', function() {
          return new GitRun(repo);
        }
      ]);
      commands.push([
        'git-plus:merge', 'Merge', function() {
          return GitMerge(repo);
        }
      ]);
      commands.push([
        'git-plus:merge-remote', 'Merge Remote', function() {
          return GitMerge(repo, {
            remote: true
          });
        }
      ]);
      commands.push([
        'git-plus:merge-no-fast-forward', 'Merge without fast-forward', function() {
          return GitMerge(repo, {
            noFastForward: true
          });
        }
      ]);
      commands.push([
        'git-plus:rebase', 'Rebase', function() {
          return GitRebase(repo);
        }
      ]);
      commands.push([
        'git-plus:git-open-changed-files', 'Open Changed Files', function() {
          return GitOpenChangedFiles(repo);
        }
      ]);
      return commands;
    });
  };

  module.exports = getCommands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL2dpdC1wbHVzLWNvbW1hbmRzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSOztFQUVOLFdBQUEsR0FBYyxTQUFBO0FBQ1osUUFBQTtJQUFBLG9CQUFBLEdBQXlCLE9BQUEsQ0FBUSxrQ0FBUjtJQUN6QixpQkFBQSxHQUF5QixPQUFBLENBQVEsOEJBQVI7SUFDekIsZUFBQSxHQUF5QixPQUFBLENBQVEsNEJBQVI7SUFDekIsbUJBQUEsR0FBeUIsT0FBQSxDQUFRLGlDQUFSO0lBQ3pCLGVBQUEsR0FBeUIsT0FBQSxDQUFRLDRCQUFSO0lBQ3pCLGFBQUEsR0FBeUIsT0FBQSxDQUFRLDBCQUFSO0lBQ3pCLFNBQUEsR0FBeUIsT0FBQSxDQUFRLHFCQUFSO0lBQ3pCLGNBQUEsR0FBeUIsT0FBQSxDQUFRLDJCQUFSO0lBQ3pCLE9BQUEsR0FBeUIsT0FBQSxDQUFRLG1CQUFSO0lBQ3pCLGVBQUEsR0FBeUIsT0FBQSxDQUFRLDRCQUFSO0lBQ3pCLGtCQUFBLEdBQXdCLE9BQUEsQ0FBUSxnQ0FBUjtJQUN4QixXQUFBLEdBQXlCLE9BQUEsQ0FBUSx1QkFBUjtJQUN6QixVQUFBLEdBQXlCLE9BQUEsQ0FBUSx1QkFBUjtJQUN6QixRQUFBLEdBQXlCLE9BQUEsQ0FBUSxvQkFBUjtJQUN6QixhQUFBLEdBQXlCLE9BQUEsQ0FBUSwwQkFBUjtJQUN6QixPQUFBLEdBQXlCLE9BQUEsQ0FBUSxtQkFBUjtJQUN6QixNQUFBLEdBQXlCLE9BQUEsQ0FBUSxrQkFBUjtJQUN6QixPQUFBLEdBQXlCLE9BQUEsQ0FBUSxtQkFBUjtJQUN6QixPQUFBLEdBQXlCLE9BQUEsQ0FBUSxtQkFBUjtJQUN6QixTQUFBLEdBQXlCLE9BQUEsQ0FBUSxxQkFBUjtJQUN6QixPQUFBLEdBQXlCLE9B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QVA7UUFBUCxDQUF4QjtPQUFkO01BQ0EsUUFBUSxDQUFDLElBQVQsQ0FBYztRQUFDLGdCQUFELEVBQW1CLE9BQW5CLEVBQTRCLFNBQUE7aUJBQUcsUUFBQSxDQUFTLElBQVQ7UUFBSCxDQUE1QjtPQUFkO01BQ0EsUUFBUSxDQUFDLElBQVQsQ0FBYztRQUFDLHVCQUFELEVBQTBCLGNBQTFCLEVBQTBDLFNBQUE7aUJBQUcsUUFBQSxDQUFTLElBQVQsRUFBZTtZQUFBLE1BQUEsRUFBUSxJQUFSO1dBQWY7UUFBSCxDQUExQztPQUFkO01BQ0EsUUFBUSxDQUFDLElBQVQsQ0FBYztRQUFDLGdDQUFELEVBQW1DLDRCQUFuQyxFQUFpRSxTQUFBO2lCQUFHLFFBQUEsQ0FBUyxJQUFULEVBQWU7WUFBQSxhQUFBLEVBQWUsSUFBZjtXQUFmO1FBQUgsQ0FBakU7T0FBZDtNQUNBLFFBQVEsQ0FBQyxJQUFULENBQWM7UUFBQyxpQkFBRCxFQUFvQixRQUFwQixFQUE4QixTQUFBO2lCQUFHLFNBQUEsQ0FBVSxJQUFWO1FBQUgsQ0FBOUI7T0FBZDtNQUNBLFFBQVEsQ0FBQyxJQUFULENBQWM7UUFBQyxpQ0FBRCxFQUFvQyxvQkFBcEMsRUFBMEQsU0FBQTtpQkFBRyxtQkFBQSxDQUFvQixJQUFwQjtRQUFILENBQTFEO09BQWQ7QUFFQSxhQUFPO0lBOURILENBRFI7RUF0Q1k7O0VBdUdkLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBekdqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4vZ2l0J1xuXG5nZXRDb21tYW5kcyA9IC0+XG4gIEdpdENoZWNrb3V0TmV3QnJhbmNoICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtY2hlY2tvdXQtbmV3LWJyYW5jaCdcbiAgR2l0Q2hlY2tvdXRCcmFuY2ggICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jaGVja291dC1icmFuY2gnXG4gIEdpdERlbGV0ZUJyYW5jaCAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtZGVsZXRlLWJyYW5jaCdcbiAgR2l0Q2hlY2tvdXRBbGxGaWxlcyAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jaGVja291dC1hbGwtZmlsZXMnXG4gIEdpdENoZWNrb3V0RmlsZSAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtY2hlY2tvdXQtZmlsZSdcbiAgR2l0Q2hlcnJ5UGljayAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jaGVycnktcGljaydcbiAgR2l0Q29tbWl0ICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1jb21taXQnXG4gIEdpdENvbW1pdEFtZW5kICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtY29tbWl0LWFtZW5kJ1xuICBHaXREaWZmICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWRpZmYnXG4gIEdpdERpZmZCcmFuY2hlcyAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtZGlmZi1icmFuY2hlcydcbiAgR2l0RGlmZkJyYW5jaEZpbGVzICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWRpZmYtYnJhbmNoLWZpbGVzJ1xuICBHaXREaWZmdG9vbCAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWRpZmZ0b29sJ1xuICBHaXREaWZmQWxsICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWRpZmYtYWxsJ1xuICBHaXRGZXRjaCAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWZldGNoJ1xuICBHaXRGZXRjaFBydW5lICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWZldGNoLXBydW5lJ1xuICBHaXRJbml0ICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LWluaXQnXG4gIEdpdExvZyAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtbG9nJ1xuICBHaXRQdWxsICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXB1bGwnXG4gIEdpdFB1c2ggICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtcHVzaCdcbiAgR2l0UmVtb3ZlICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1yZW1vdmUnXG4gIEdpdFNob3cgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc2hvdydcbiAgR2l0U3RhZ2VGaWxlcyAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zdGFnZS1maWxlcydcbiAgR2l0U3RhZ2VGaWxlc0JldGEgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zdGFnZS1maWxlcy1iZXRhJ1xuICBHaXRTdGFnZUh1bmsgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXN0YWdlLWh1bmsnXG4gIEdpdFN0YXNoQXBwbHkgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3Rhc2gtYXBwbHknXG4gIEdpdFN0YXNoRHJvcCAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3Rhc2gtZHJvcCdcbiAgR2l0U3Rhc2hQb3AgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zdGFzaC1wb3AnXG4gIEdpdFN0YXNoU2F2ZSAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3Rhc2gtc2F2ZSdcbiAgR2l0U3Rhc2hTYXZlTWVzc2FnZSAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1zdGFzaC1zYXZlLW1lc3NhZ2UnXG4gIEdpdFN0YXR1cyAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtc3RhdHVzJ1xuICBHaXRUYWdzICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LXRhZ3MnXG4gIEdpdFVuc3RhZ2VGaWxlcyAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtdW5zdGFnZS1maWxlcydcbiAgR2l0UnVuICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vbW9kZWxzL2dpdC1ydW4nXG4gIEdpdE1lcmdlICAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtbWVyZ2UnXG4gIEdpdFJlYmFzZSAgICAgICAgICAgICAgPSByZXF1aXJlICcuL21vZGVscy9naXQtcmViYXNlJ1xuICBHaXRPcGVuQ2hhbmdlZEZpbGVzICAgID0gcmVxdWlyZSAnLi9tb2RlbHMvZ2l0LW9wZW4tY2hhbmdlZC1maWxlcydcblxuICBnaXQuZ2V0UmVwbygpXG4gICAgLnRoZW4gKHJlcG8pIC0+XG4gICAgICBjdXJyZW50RmlsZSA9IHJlcG8ucmVsYXRpdml6ZShhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKSlcbiAgICAgIGdpdC5yZWZyZXNoIHJlcG9cbiAgICAgIGNvbW1hbmRzID0gW11cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZXhwZXJpbWVudGFsLmN1c3RvbUNvbW1hbmRzJylcbiAgICAgICAgY29tbWFuZHMgPSBjb21tYW5kcy5jb25jYXQocmVxdWlyZSgnLi9zZXJ2aWNlJykuZ2V0Q3VzdG9tQ29tbWFuZHMoKSlcbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czphZGQnLCAnQWRkJywgLT4gZ2l0LmFkZChyZXBvLCBmaWxlOiBjdXJyZW50RmlsZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkLW1vZGlmaWVkJywgJ0FkZCBNb2RpZmllZCcsIC0+IGdpdC5hZGQocmVwbywgdXBkYXRlOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czphZGQtYWxsJywgJ0FkZCBBbGwnLCAtPiBnaXQuYWRkKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmxvZycsICdMb2cnLCAtPiBHaXRMb2cocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6bG9nLWN1cnJlbnQtZmlsZScsICdMb2cgQ3VycmVudCBGaWxlJywgLT4gR2l0TG9nKHJlcG8sIG9ubHlDdXJyZW50RmlsZTogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6cmVtb3ZlLWN1cnJlbnQtZmlsZScsICdSZW1vdmUgQ3VycmVudCBGaWxlJywgLT4gR2l0UmVtb3ZlKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNoZWNrb3V0LWFsbC1maWxlcycsICdDaGVja291dCBBbGwgRmlsZXMnLCAtPiBHaXRDaGVja291dEFsbEZpbGVzKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNoZWNrb3V0LWN1cnJlbnQtZmlsZScsICdDaGVja291dCBDdXJyZW50IEZpbGUnLCAtPiBHaXRDaGVja291dEZpbGUocmVwbywgZmlsZTogY3VycmVudEZpbGUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNvbW1pdCcsICdDb21taXQnLCAtPiBHaXRDb21taXQocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6Y29tbWl0LWFsbCcsICdDb21taXQgQWxsJywgLT4gR2l0Q29tbWl0KHJlcG8sIHN0YWdlQ2hhbmdlczogdHJ1ZSldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6Y29tbWl0LWFtZW5kJywgJ0NvbW1pdCBBbWVuZCcsIC0+IEdpdENvbW1pdEFtZW5kKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmFkZC1hbmQtY29tbWl0JywgJ0FkZCBBbmQgQ29tbWl0JywgLT4gZ2l0LmFkZChyZXBvLCBmaWxlOiBjdXJyZW50RmlsZSkudGhlbiAtPiBHaXRDb21taXQocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6YWRkLWFuZC1jb21taXQtYW5kLXB1c2gnLCAnQWRkIEFuZCBDb21taXQgQW5kIFB1c2gnLCAtPiBnaXQuYWRkKHJlcG8sIGZpbGU6IGN1cnJlbnRGaWxlKS50aGVuIC0+IEdpdENvbW1pdChyZXBvLCBhbmRQdXNoOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czphZGQtYWxsLWFuZC1jb21taXQnLCAnQWRkIEFsbCBBbmQgQ29tbWl0JywgLT4gZ2l0LmFkZChyZXBvKS50aGVuIC0+IEdpdENvbW1pdChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czphZGQtYWxsLWNvbW1pdC1hbmQtcHVzaCcsICdBZGQgQWxsLCBDb21taXQgQW5kIFB1c2gnLCAtPiBnaXQuYWRkKHJlcG8pLnRoZW4gLT4gR2l0Q29tbWl0KHJlcG8sIGFuZFB1c2g6IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNvbW1pdC1hbGwtYW5kLXB1c2gnLCAnQ29tbWl0IEFsbCBBbmQgUHVzaCcsIC0+IEdpdENvbW1pdChyZXBvLCBzdGFnZUNoYW5nZXM6IHRydWUsIGFuZFB1c2g6IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNoZWNrb3V0JywgJ0NoZWNrb3V0JywgLT4gR2l0Q2hlY2tvdXRCcmFuY2gocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6Y2hlY2tvdXQtcmVtb3RlJywgJ0NoZWNrb3V0IFJlbW90ZScsIC0+IEdpdENoZWNrb3V0QnJhbmNoKHJlcG8sIHtyZW1vdGU6IHRydWV9KV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpuZXctYnJhbmNoJywgJ0NoZWNrb3V0IE5ldyBCcmFuY2gnLCAtPiBHaXRDaGVja291dE5ld0JyYW5jaChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpkZWxldGUtbG9jYWwtYnJhbmNoJywgJ0RlbGV0ZSBMb2NhbCBCcmFuY2gnLCAtPiBHaXREZWxldGVCcmFuY2gocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6ZGVsZXRlLXJlbW90ZS1icmFuY2gnLCAnRGVsZXRlIFJlbW90ZSBCcmFuY2gnLCAtPiBHaXREZWxldGVCcmFuY2gocmVwbywge3JlbW90ZTogdHJ1ZX0pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmNoZXJyeS1waWNrJywgJ0NoZXJyeS1QaWNrJywgLT4gR2l0Q2hlcnJ5UGljayhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpkaWZmJywgJ0RpZmYnLCAtPiBHaXREaWZmKHJlcG8sIGZpbGU6IGN1cnJlbnRGaWxlKV1cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZXhwZXJpbWVudGFsLmRpZmZCcmFuY2hlcycpXG4gICAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpkaWZmLWJyYW5jaGVzJywgJ0RpZmYgYnJhbmNoZXMnLCAtPiBHaXREaWZmQnJhbmNoZXMocmVwbyldXG4gICAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpkaWZmLWJyYW5jaC1maWxlcycsICdEaWZmIGJyYW5jaCBmaWxlcycsIC0+IEdpdERpZmZCcmFuY2hGaWxlcyhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpkaWZmdG9vbCcsICdEaWZmdG9vbCcsIC0+IEdpdERpZmZ0b29sKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmRpZmYtYWxsJywgJ0RpZmYgQWxsJywgLT4gR2l0RGlmZkFsbChyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpmZXRjaCcsICdGZXRjaCcsIC0+IEdpdEZldGNoKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOmZldGNoLXBydW5lJywgJ0ZldGNoIFBydW5lJywgLT4gR2l0RmV0Y2hQcnVuZShyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpwdWxsJywgJ1B1bGwnLCAtPiBHaXRQdWxsKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnB1c2gnLCAnUHVzaCcsIC0+IEdpdFB1c2gocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6cHVzaC1zZXQtdXBzdHJlYW0nLCAnUHVzaCAtdScsIC0+IEdpdFB1c2gocmVwbywgc2V0VXBzdHJlYW06IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnJlbW92ZScsICdSZW1vdmUnLCAtPiBHaXRSZW1vdmUocmVwbywgc2hvd1NlbGVjdG9yOiB0cnVlKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpyZXNldCcsICdSZXNldCBIRUFEJywgLT4gZ2l0LnJlc2V0KHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnNob3cnLCAnU2hvdycsIC0+IEdpdFNob3cocmVwbyldXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmV4cGVyaW1lbnRhbC5zdGFnZUZpbGVzQmV0YScpXG4gICAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGFnZS1maWxlcycsICdTdGFnZSBGaWxlcycsIC0+IEdpdFN0YWdlRmlsZXNCZXRhKHJlcG8pXVxuICAgICAgZWxzZVxuICAgICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c3RhZ2UtZmlsZXMnLCAnU3RhZ2UgRmlsZXMnLCAtPiBHaXRTdGFnZUZpbGVzKHJlcG8pXVxuICAgICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6dW5zdGFnZS1maWxlcycsICdVbnN0YWdlIEZpbGVzJywgLT4gR2l0VW5zdGFnZUZpbGVzKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YWdlLWh1bmsnLCAnU3RhZ2UgSHVuaycsIC0+IEdpdFN0YWdlSHVuayhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGFzaC1zYXZlJywgJ1N0YXNoOiBTYXZlIENoYW5nZXMnLCAtPiBHaXRTdGFzaFNhdmUocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c3Rhc2gtc2F2ZS1tZXNzYWdlJywgJ1N0YXNoOiBTYXZlIENoYW5nZXMgV2l0aCBNZXNzYWdlJywgLT4gR2l0U3Rhc2hTYXZlTWVzc2FnZShyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpzdGFzaC1wb3AnLCAnU3Rhc2g6IEFwcGx5IChQb3ApJywgLT4gR2l0U3Rhc2hQb3AocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c3Rhc2gtYXBwbHknLCAnU3Rhc2g6IEFwcGx5IChLZWVwKScsIC0+IEdpdFN0YXNoQXBwbHkocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6c3Rhc2gtZGVsZXRlJywgJ1N0YXNoOiBEZWxldGUgKERyb3ApJywgLT4gR2l0U3Rhc2hEcm9wKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnN0YXR1cycsICdTdGF0dXMnLCAtPiBHaXRTdGF0dXMocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6dGFncycsICdUYWdzJywgLT4gR2l0VGFncyhyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czpydW4nLCAnUnVuJywgLT4gbmV3IEdpdFJ1bihyZXBvKV1cbiAgICAgIGNvbW1hbmRzLnB1c2ggWydnaXQtcGx1czptZXJnZScsICdNZXJnZScsIC0+IEdpdE1lcmdlKHJlcG8pXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOm1lcmdlLXJlbW90ZScsICdNZXJnZSBSZW1vdGUnLCAtPiBHaXRNZXJnZShyZXBvLCByZW1vdGU6IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOm1lcmdlLW5vLWZhc3QtZm9yd2FyZCcsICdNZXJnZSB3aXRob3V0IGZhc3QtZm9yd2FyZCcsIC0+IEdpdE1lcmdlKHJlcG8sIG5vRmFzdEZvcndhcmQ6IHRydWUpXVxuICAgICAgY29tbWFuZHMucHVzaCBbJ2dpdC1wbHVzOnJlYmFzZScsICdSZWJhc2UnLCAtPiBHaXRSZWJhc2UocmVwbyldXG4gICAgICBjb21tYW5kcy5wdXNoIFsnZ2l0LXBsdXM6Z2l0LW9wZW4tY2hhbmdlZC1maWxlcycsICdPcGVuIENoYW5nZWQgRmlsZXMnLCAtPiBHaXRPcGVuQ2hhbmdlZEZpbGVzKHJlcG8pXVxuXG4gICAgICByZXR1cm4gY29tbWFuZHNcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRDb21tYW5kc1xuIl19
