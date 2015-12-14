function CookieFactory() {
  function setCookie(name, value, daysToExpire) {
    let date = new Date(Date.now() + (daysToExpire || 90) * 24 * 60 * 60 * 1000);
    let expires = '; expires=' + date.toGMTString();
    let domain = '; domain=.' + location.hostname.split('.').slice(-2).join('.');
    document.cookie = name + '=' + value + expires + domain + '; path=/';
  }

  function getCookie(name) {
    if (!name) return null;
    let cookies = document.cookie.split(';');
    let filteredCookie = cookies.filter((cookie) => cookie.trim().indexOf(name + '=') === 0)[0];
    return filteredCookie ? filteredCookie.split('=')[1] : null;
  }

  function removeCookie(name) {
    setCookie(name, '', -1);
  }

  return {
    set: setCookie,
    get: getCookie,
    remove: removeCookie
  }
}

export default CookieFactory;