window.onload = function setHacktoberfest() {
  // var bodyElement = document.getElementsByTagName("body")[0];

  var hacktoberfestDiv = document.createElement("div");
  hacktoberfestDiv.innerHTML = `
  <section id="blast">
    <h2>
      Hacktoberfest is here! 
      <a href="https://substrate.dev/hacktoberfest">Hack with us</a>
    </h2>
  </section>
  `;
  
  document.body.insertBefore(hacktoberfestDiv, document.body.firstChild);
}
