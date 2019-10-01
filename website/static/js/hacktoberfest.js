window.onload = function setHacktoberfest() {

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
