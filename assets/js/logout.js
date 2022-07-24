function logout(){
    localStorage.setItem('dadosUser', '');
    window.location.replace('./index.html');
}
