function loadFooter() {

  const footer =
    document.getElementById(
      "footer"
    );

  if (!footer) return;

  footer.innerHTML = `

    <footer class="site-footer">

      <p>

        © 2026 ManiNet Zone.
        Developed by Mani.

      </p>

    </footer>

  `;

}

document.addEventListener(
  "DOMContentLoaded",
  loadFooter
);