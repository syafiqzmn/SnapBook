    // Portfolio is available only after a customer has logged in.
    if (!localStorage.getItem("snapbookCurrentUser")) {
      alert("Please log in as a customer to view the portfolio.");
      window.location.replace("index.html");
    }

    // Each package opens its own gallery. Wedding and Graduation photos never mix.
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const galleries = {
      wedding: [
        {src: "wedding1.jpg", alt: "Wedding photography"},
        {src: "wedding2.jpg", alt: "Wedding photography"},
        {src: "wedding3.jpg", alt: "Wedding photography"},
      ],
      graduation: [
        {src: "graduation1.jpg", alt: "Graduation photography"},
        {src: "graduation2.jpg", alt: "Graduation photography"},
        {src: "graduation3.jpg", alt: "Graduation photography"},
      ],
    };

    const selectedPhotos = galleries[category];
    const gallery = document.getElementById("portfolioGallery");
    if (!selectedPhotos) {
      window.location.replace("customer-dashboard.html#packages");
    } else {
      gallery.innerHTML = selectedPhotos.map(photo =>
        `<div class="portfolio-item"><img src="${photo.src}" alt="${photo.alt}" loading="lazy"></div>`
      ).join("");
    }

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    document.querySelectorAll(".portfolio-item img").forEach(photo => {
      photo.addEventListener("click", () => {
        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;
        lightbox.classList.add("show");
        document.body.style.overflow = "hidden";
      });
    });
    function closeLightbox(){
      lightbox.classList.remove("show");
      lightboxImage.src = "";
      document.body.style.overflow = "";
    }
    document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", event => { if(event.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", event => { if(event.key === "Escape") closeLightbox(); });
  