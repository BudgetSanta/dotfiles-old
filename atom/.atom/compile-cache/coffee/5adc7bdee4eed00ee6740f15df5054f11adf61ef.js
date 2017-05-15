(function() {
  var OutputViewManager, emptyOrUndefined, getUpstream, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  emptyOrUndefined = function(thing) {
    return thing !== '' && thing !== void 0;
  };

  getUpstream = function(repo) {
    var branch, branchInfo, ref, remote;
    branchInfo = (ref = repo.getUpstreamBranch()) != null ? ref.substring('refs/remotes/'.length).split('/') : void 0;
    remote = branchInfo[0];
    branch = branchInfo.slice(1).join('/');
    return [remote, branch];
  };

  module.exports = function(repo, arg) {
    var args, extraArgs, startMessage, view;
    extraArgs = (arg != null ? arg : {}).extraArgs;
    if (extraArgs == null) {
      extraArgs = [];
    }
    view = OutputViewManager.create();
    startMessage = notifier.addInfo("Pulling...", {
      dismissable: true
    });
    args = ['pull'].concat(extraArgs).concat(getUpstream(repo)).filter(emptyOrUndefined);
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }, {
      color: true
    }).then(function(data) {
      view.setContent(data).finish();
      return startMessage.dismiss();
    })["catch"](function(error) {
      view.setContent(error).finish();
      return startMessage.dismiss();
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamFyZWQvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9fcHVsbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSOztFQUVwQixnQkFBQSxHQUFtQixTQUFDLEtBQUQ7V0FBVyxLQUFBLEtBQVcsRUFBWCxJQUFrQixLQUFBLEtBQVc7RUFBeEM7O0VBRW5CLFdBQUEsR0FBYyxTQUFDLElBQUQ7QUFDWixRQUFBO0lBQUEsVUFBQSxpREFBcUMsQ0FBRSxTQUExQixDQUFvQyxlQUFlLENBQUMsTUFBcEQsQ0FBMkQsQ0FBQyxLQUE1RCxDQUFrRSxHQUFsRTtJQUNiLE1BQUEsR0FBUyxVQUFXLENBQUEsQ0FBQTtJQUNwQixNQUFBLEdBQVMsVUFBVSxDQUFDLEtBQVgsQ0FBaUIsQ0FBakIsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixHQUF6QjtXQUNULENBQUMsTUFBRCxFQUFTLE1BQVQ7RUFKWTs7RUFNZCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ2YsUUFBQTtJQUR1QiwyQkFBRCxNQUFZOztNQUNsQyxZQUFhOztJQUNiLElBQUEsR0FBTyxpQkFBaUIsQ0FBQyxNQUFsQixDQUFBO0lBQ1AsWUFBQSxHQUFlLFFBQVEsQ0FBQyxPQUFULENBQWlCLFlBQWpCLEVBQStCO01BQUEsV0FBQSxFQUFhLElBQWI7S0FBL0I7SUFDZixJQUFBLEdBQU8sQ0FBQyxNQUFELENBQVEsQ0FBQyxNQUFULENBQWdCLFNBQWhCLENBQTBCLENBQUMsTUFBM0IsQ0FBa0MsV0FBQSxDQUFZLElBQVosQ0FBbEMsQ0FBb0QsQ0FBQyxNQUFyRCxDQUE0RCxnQkFBNUQ7V0FDUCxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQWQsRUFBK0M7TUFBQyxLQUFBLEVBQU8sSUFBUjtLQUEvQyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtNQUNKLElBQUksQ0FBQyxVQUFMLENBQWdCLElBQWhCLENBQXFCLENBQUMsTUFBdEIsQ0FBQTthQUNBLFlBQVksQ0FBQyxPQUFiLENBQUE7SUFGSSxDQUROLENBSUEsRUFBQyxLQUFELEVBSkEsQ0FJTyxTQUFDLEtBQUQ7TUFDTCxJQUFJLENBQUMsVUFBTCxDQUFnQixLQUFoQixDQUFzQixDQUFDLE1BQXZCLENBQUE7YUFDQSxZQUFZLENBQUMsT0FBYixDQUFBO0lBRkssQ0FKUDtFQUxlO0FBWmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbk91dHB1dFZpZXdNYW5hZ2VyID0gcmVxdWlyZSAnLi4vb3V0cHV0LXZpZXctbWFuYWdlcidcblxuZW1wdHlPclVuZGVmaW5lZCA9ICh0aGluZykgLT4gdGhpbmcgaXNudCAnJyBhbmQgdGhpbmcgaXNudCB1bmRlZmluZWRcblxuZ2V0VXBzdHJlYW0gPSAocmVwbykgLT5cbiAgYnJhbmNoSW5mbyA9IHJlcG8uZ2V0VXBzdHJlYW1CcmFuY2goKT8uc3Vic3RyaW5nKCdyZWZzL3JlbW90ZXMvJy5sZW5ndGgpLnNwbGl0KCcvJylcbiAgcmVtb3RlID0gYnJhbmNoSW5mb1swXVxuICBicmFuY2ggPSBicmFuY2hJbmZvLnNsaWNlKDEpLmpvaW4oJy8nKVxuICBbcmVtb3RlLCBicmFuY2hdXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHtleHRyYUFyZ3N9PXt9KSAtPlxuICBleHRyYUFyZ3MgPz0gW11cbiAgdmlldyA9IE91dHB1dFZpZXdNYW5hZ2VyLmNyZWF0ZSgpXG4gIHN0YXJ0TWVzc2FnZSA9IG5vdGlmaWVyLmFkZEluZm8gXCJQdWxsaW5nLi4uXCIsIGRpc21pc3NhYmxlOiB0cnVlXG4gIGFyZ3MgPSBbJ3B1bGwnXS5jb25jYXQoZXh0cmFBcmdzKS5jb25jYXQoZ2V0VXBzdHJlYW0ocmVwbykpLmZpbHRlcihlbXB0eU9yVW5kZWZpbmVkKVxuICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gIC50aGVuIChkYXRhKSAtPlxuICAgIHZpZXcuc2V0Q29udGVudChkYXRhKS5maW5pc2goKVxuICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgLmNhdGNoIChlcnJvcikgLT5cbiAgICB2aWV3LnNldENvbnRlbnQoZXJyb3IpLmZpbmlzaCgpXG4gICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuIl19
