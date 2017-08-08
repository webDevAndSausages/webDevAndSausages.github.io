(function(){
  // Check for any github-pages 404 redirect
  const redirect = sessionStorage.redirect
  delete sessionStorage.redirect
  if (redirect && redirect != location.href) history.replaceState(null, null, redirect)

})()