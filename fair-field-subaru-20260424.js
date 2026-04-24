(function () {
  var showcase = document.querySelector("[data-service-showcase]");
  if (!showcase) return;

  var slides = [
    {
      tag: "Service",
      title: "Quick Routine Care, Built for Davis Schedules.",
      desc: "Fairfield Subaru handles oil changes, tire rotations, multi-point inspections, and minor adjustments through Subaru Express Service, giving Davis owners a practical westbound stop for same-day maintenance.",
      points: [
        "No appointment required",
        "Genuine Subaru Parts",
        "Oil changes and tire rotations",
        "Fast multi-point inspections",
      ],
      image:
        "https://service.secureoffersites.com/images/GetLibraryImage?fileNameOrId=128044&width=0&type=jpeg",
      alt: "Subaru technician performing express service",
      primaryLabel: "Schedule Service",
      primaryHref: "/scheduleservice",
      secondaryLabel: "View Service Specials",
      secondaryHref: "/service-parts-coupons",
    },
    {
      tag: "Repair",
      title: "Warranty, Recall, and Diagnostic Work.",
      desc: "Factory-trained Subaru technicians handle warranty repairs, recall work, diagnostics, and larger service needs using Genuine Subaru Parts and Subaru-approved procedures.",
      points: [
        "Factory-trained technicians",
        "Warranty and recall support",
        "Diagnostics and larger repairs",
        "Subaru-approved repair process",
      ],
      image:
        "https://service.secureoffersites.com/images/GetLibraryImage?fileNameOrId=248821&width=0&type=jpeg",
      alt: "Subaru multi-point inspection form during service",
      primaryLabel: "Book Service",
      primaryHref: "/scheduleservice",
      secondaryLabel: "Vehicle Recalls",
      secondaryHref: "/vehicle-recalls",
    },
  ];

  var current = 0;
  var tag = showcase.querySelector("[data-service-tag]");
  var title = showcase.querySelector("[data-service-title]");
  var desc = showcase.querySelector("[data-service-desc]");
  var points = showcase.querySelector("[data-service-points]");
  var image = showcase.querySelector("[data-service-image]");
  var primary = showcase.querySelector("[data-service-primary]");
  var secondary = showcase.querySelector("[data-service-secondary]");
  var count = showcase.querySelector("[data-service-count]");

  function renderSlide(index) {
    var slide = slides[index];
    tag.textContent = slide.tag;
    title.textContent = slide.title;
    desc.textContent = slide.desc;
    image.src = slide.image;
    image.alt = slide.alt;
    primary.textContent = slide.primaryLabel;
    primary.href = slide.primaryHref;
    secondary.textContent = slide.secondaryLabel;
    secondary.href = slide.secondaryHref;
    count.textContent = String(index + 1).padStart(2, "0");
    points.innerHTML = slide.points
      .map(function (point) {
        return "<li>" + point + "</li>";
      })
      .join("");
  }

  showcase
    .querySelector("[data-service-prev]")
    .addEventListener("click", function () {
      current = (current - 1 + slides.length) % slides.length;
      renderSlide(current);
    });

  showcase
    .querySelector("[data-service-next]")
    .addEventListener("click", function () {
      current = (current + 1) % slides.length;
      renderSlide(current);
    });

  renderSlide(current);
})();

function toggleFaq(btn) {
  const item = btn.closest(".faq-item");
  const isOpen = item.classList.contains("open");
  document.querySelectorAll(".faq-item.open").forEach(function (node) {
    node.classList.remove("open");
  });
  if (!isOpen) item.classList.add("open");
}
document.querySelectorAll(".cite").forEach(function (cite) {
  var tooltip = cite.querySelector(".cite-tooltip");
  if (!tooltip) return;

  cite.addEventListener("mouseenter", function () {
    cite.classList.add("tooltip-visible");
  });
  cite.addEventListener("mouseleave", function () {
    cite.classList.remove("tooltip-visible");
  });
  cite.addEventListener("click", function (e) {
    e.stopPropagation();
    cite.classList.toggle("tooltip-visible");
  });
});
document.addEventListener("click", function () {
  document.querySelectorAll(".cite.tooltip-visible").forEach(function (c) {
    c.classList.remove("tooltip-visible");
  });
});
