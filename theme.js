/* Idaho FSO Resource Coordination — Phase 1 theme helpers.
   Marks the workspace on <html> (for the colored band), tags the save bar with its state,
   and adds Ctrl/Cmd+K to jump to Find person. Reads the page; changes no data. */
(function () {
  var ws = new URLSearchParams(location.search).get('workspace') === 'operational' ? 'ws-ops' : 'ws-sim';
  document.documentElement.classList.add(ws);

  function saveState(text) {
    if (/saving|loading|checking/i.test(text)) return 'saving';
    if (/fail|error|could not|couldn|not saved|conflict|unavailable|took longer|unreadable/i.test(text)) return 'error';
    return 'saved';
  }
  function tagSaveBar() {
    var bar = document.querySelector('.savebar');
    if (!bar) return;
    var span = bar.querySelector(':scope > span:nth-of-type(2)');
    var state = saveState(span ? span.textContent : '');
    if (bar.getAttribute('data-save') !== state) bar.setAttribute('data-save', state);
  }
  var pending = false;
  new MutationObserver(function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; tagSaveBar(); });
  }).observe(document.documentElement, { subtree: true, childList: true, characterData: true });

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === 'k' || e.key === 'K')) {
      var input = document.querySelector('.person-finder input');
      if (input) { e.preventDefault(); input.focus(); input.select(); }
    }
  });
})();
