
// ======================================================
// SNAPBOOK CUSTOMER DASHBOARD
// Customer Booking System using Local Storage
// Dynamic Packages Connected to Admin Dashboard
// ======================================================

const BOOKING_KEY = "snapbookBookings";
const CUSTOMER_KEY = "snapbookCustomers";
const CURRENT_USER_KEY = "snapbookCurrentUser";
const PACKAGE_KEY = "snapbookPackages";

// ------------------------------------------------------
// CUSTOMER LOGIN
// ------------------------------------------------------

const currentUsername = localStorage.getItem(CURRENT_USER_KEY);

if (!currentUsername) {
    alert("Please log in as a customer to access the dashboard.");
    window.location.replace("index.html");

} else {

    // --------------------------------------------------
    // READ LOCAL STORAGE
    // --------------------------------------------------

    function readStorageArray(key) {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("SnapBook storage error:", error);
            return [];
        }
    }

    // --------------------------------------------------
    // CUSTOMER INFORMATION
    // --------------------------------------------------

    const customers = readStorageArray(CUSTOMER_KEY);

    const currentCustomer = customers.find(
        customer => customer.username === currentUsername
    );

    const displayName =
        currentCustomer?.fullName ||
        currentCustomer?.name ||
        currentUsername;

    const customerEmail = currentCustomer?.email || "";

    const customerNameElement = document.getElementById("customerName");
    const heroNameElement = document.getElementById("heroName");
    const profileNameElement = document.getElementById("profileName");
    const profileUsernameElement = document.getElementById("profileUsername");
    const profileEmailElement = document.getElementById("profileEmail");
    const bookNameElement = document.getElementById("bookName");

    if (customerNameElement) customerNameElement.textContent = displayName;
    if (heroNameElement) heroNameElement.textContent = displayName + "!";
    if (profileNameElement) profileNameElement.textContent = displayName;
    if (profileUsernameElement) profileUsernameElement.textContent = currentUsername;
    if (profileEmailElement) profileEmailElement.textContent = customerEmail || "Not provided";
    if (bookNameElement) bookNameElement.value = displayName;

    // --------------------------------------------------
    // ESCAPE HTML
    // --------------------------------------------------

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    // --------------------------------------------------
    // PACKAGE DATA
    // --------------------------------------------------

    function getAllPackages() {
        return readStorageArray(PACKAGE_KEY);
    }

    function getActivePackages() {
        return getAllPackages().filter(packageItem =>
            String(packageItem.status || "Active").toLowerCase() === "active"
        );
    }

    function formatPrice(price) {
        const amount = Number(price);

        if (!Number.isFinite(amount)) {
            return "Price unavailable";
        }

        return "RM " + amount.toLocaleString("en-MY", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }

    function getPortfolioLink(packageName) {
        const name = String(packageName || "").toLowerCase();

        if (name.includes("wedding")) {
            return "portfolio.html?category=wedding";
        }

        if (name.includes("graduation")) {
            return "portfolio.html?category=graduation";
        }

        return "portfolio.html";
    }

    // --------------------------------------------------
    // RENDER PACKAGE CARDS
    // --------------------------------------------------

    function renderPackages() {

        const packageGrid = document.querySelector(".package-grid");

        if (!packageGrid) return;

        const activePackages = getActivePackages();

        if (activePackages.length === 0) {

            packageGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h5>No Packages Available</h5>
                    <p class="text-secondary">
                        Please check again later for available photography packages.
                    </p>
                </div>
            `;

        } else {

            packageGrid.innerHTML = activePackages.map(packageItem => {

                const name = escapeHTML(packageItem.name || "Photography Package");
                const description = escapeHTML(
                    packageItem.description || "Capture your special moments with SnapBook."
                );

                const image = escapeHTML(
                    packageItem.image || "wedding1.jpg"
                );

                const price = escapeHTML(formatPrice(packageItem.price));

                const portfolioLink = escapeHTML(
                    getPortfolioLink(packageItem.name)
                );

                return `
                    <article class="package-card">
                        <img
                            src="${image}"
                            alt="${name}"
                            onerror="this.style.display='none'"
                        >

                        <div class="body">
                            <h3>${name}</h3>

                            <p class="text-secondary">
                                ${description}
                            </p>

                            <div class="price">
                                ${price}
                            </div>

                            <a
                                class="btn btn-dark mt-3"
                                href="${portfolioLink}"
                            >
                                Portfolio
                            </a>
                        </div>
                    </article>
                `;

            }).join("");
        }

        // Update Available Packages statistic.
        const statsGrid = document.querySelector(".stats-grid");

        if (statsGrid) {
            const availablePackageCount = statsGrid.querySelector(
                ".stat-card:nth-child(4) strong"
            );

            if (availablePackageCount) {
                availablePackageCount.textContent = activePackages.length;
            }
        }

        // Update booking dropdown.
        renderPackageDropdown();
    }

    // --------------------------------------------------
    // RENDER BOOKING PACKAGE DROPDOWN
    // --------------------------------------------------

    function renderPackageDropdown() {

        const packageSelect = document.getElementById("packageSelect");

        if (!packageSelect) return;

        const previousValue = packageSelect.value;
        const activePackages = getActivePackages();

        packageSelect.innerHTML = `
            <option value="">Select a package</option>
        `;

        activePackages.forEach(packageItem => {

            const option = document.createElement("option");

            option.value = packageItem.name;
            option.textContent =
                packageItem.name + " - " + formatPrice(packageItem.price);

            packageSelect.appendChild(option);
        });

        // Keep previous selection if package is still active.
        if (activePackages.some(item => item.name === previousValue)) {
            packageSelect.value = previousValue;
        }

        if (activePackages.length === 0) {
            packageSelect.innerHTML = `
                <option value="">No packages available</option>
            `;
        }
    }

    // --------------------------------------------------
    // SINGLE-PAGE NAVIGATION
    // --------------------------------------------------

    function showPage(page) {

        const target = document.getElementById(page);

        if (!target) return;

        document.querySelectorAll(".nav-link[data-page]").forEach(link => {

            link.classList.toggle(
                "active",
                link.dataset.page === page
            );

        });

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    const requestedSection = window.location.hash.replace("#", "");

    if (
        requestedSection === "packages" ||
        requestedSection === "dashboard"
    ) {
        setTimeout(() => {
            showPage(requestedSection);
        }, 100);
    }

    document.querySelectorAll("[data-page]").forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();
            showPage(link.dataset.page);

        });

    });

    document.querySelectorAll("[data-go]").forEach(button => {

        button.addEventListener("click", () => {
            showPage(button.dataset.go);
        });

    });

    // --------------------------------------------------
    // ACTIVE NAVIGATION OBSERVER
    // --------------------------------------------------

    const sectionObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                document.querySelectorAll(".nav-link[data-page]").forEach(link => {

                    link.classList.toggle(
                        "active",
                        link.dataset.page === entry.target.id
                    );

                });

            }

        });

    }, {
        rootMargin: "-25% 0px -60% 0px"
    });

    document.querySelectorAll(".page-section").forEach(section => {
        sectionObserver.observe(section);
    });

    // --------------------------------------------------
    // GET CUSTOMER BOOKINGS
    // --------------------------------------------------

    function getCustomerBookings() {

        const allBookings = readStorageArray(BOOKING_KEY);

        return allBookings.filter(
            booking => booking.username === currentUsername
        );
    }

    // --------------------------------------------------
    // STATUS BADGE
    // --------------------------------------------------

    function getStatusBadge(status) {

        const safeStatus = escapeHTML(status);

        const badgeClass = {
            Pending: "text-bg-warning",
            Confirmed: "text-bg-success",
            Completed: "text-bg-primary",
            Cancelled: "text-bg-danger",
            Rejected: "text-bg-danger"
        }[status] || "text-bg-warning";

        return `
            <span class="badge ${badgeClass}">
                ${safeStatus}
            </span>
        `;
    }

    // --------------------------------------------------
    // RENDER CUSTOMER BOOKINGS
    // --------------------------------------------------

    function renderBookings() {

        const bookings = getCustomerBookings();

        const rows = document.getElementById("bookingRows");

        if (!rows) return;

        if (bookings.length === 0) {

            rows.innerHTML = `
                <tr>
                    <td colspan="4" class="text-secondary">
                        No bookings yet.
                    </td>
                </tr>
            `;

        } else {

            rows.innerHTML = bookings.map(booking => {

                const status = booking.status || "Pending";

                return `
                    <tr>
                        <td>
                            ${escapeHTML(booking.package || "—")}
                        </td>

                        <td>
                            ${escapeHTML(booking.date || "—")}
                        </td>

                        <td>
                            ${escapeHTML(booking.time || "—")}
                        </td>

                        <td>
                            ${getStatusBadge(status)}
                        </td>
                    </tr>
                `;

            }).join("");
        }

        const totalElement = document.getElementById("totalBookings");
        const pendingElement = document.getElementById("pendingBookings");
        const confirmedElement = document.getElementById("confirmedBookings");

        if (totalElement) {
            totalElement.textContent = bookings.length;
        }

        if (pendingElement) {
            pendingElement.textContent = bookings.filter(
                booking => (booking.status || "Pending") === "Pending"
            ).length;
        }

        if (confirmedElement) {
            confirmedElement.textContent = bookings.filter(
                booking => booking.status === "Confirmed"
            ).length;
        }
    }

    // --------------------------------------------------
    // SUBMIT NEW BOOKING
    // --------------------------------------------------

    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {

        bookingForm.addEventListener("submit", event => {

            event.preventDefault();

            const packageName =
                document.getElementById("packageSelect").value;

            const bookingDate =
                document.getElementById("bookDate").value;

            const bookingTime =
                document.getElementById("bookTime").value;

            const bookingNotes =
                document.getElementById("bookNotes").value;

            const feedback =
                document.getElementById("bookingFeedback");

            // Validate required information.
            if (!packageName || !bookingDate || !bookingTime) {

                feedback.textContent =
                    "Please complete all required booking information.";

                feedback.className =
                    "mt-3 small text-danger fw-semibold";

                return;
            }

            // Confirm that the selected package is still active.
            const selectedPackage = getActivePackages().find(
                item => item.name === packageName
            );

            if (!selectedPackage) {

                feedback.textContent =
                    "This package is no longer available. Please select another package.";

                feedback.className =
                    "mt-3 small text-danger fw-semibold";

                renderPackageDropdown();

                return;
            }

            const bookings = readStorageArray(BOOKING_KEY);

            const newBooking = {

                id: "BK" + Date.now(),

                username: currentUsername,

                fullName: displayName,

                email: customerEmail,

                package: packageName,

                date: bookingDate,

                time: bookingTime,

                notes: bookingNotes,

                status: "Pending"

            };

            bookings.push(newBooking);

            localStorage.setItem(
                BOOKING_KEY,
                JSON.stringify(bookings)
            );

            feedback.textContent =
                "Your booking has been submitted successfully!";

            feedback.className =
                "mt-3 small text-success fw-semibold";

            bookingForm.reset();

            if (bookNameElement) {
                bookNameElement.value = displayName;
            }

            renderPackageDropdown();
            renderBookings();

        });
    }

    // --------------------------------------------------
    // REFRESH WHEN ADMIN UPDATES DATA
    // --------------------------------------------------

    window.addEventListener("storage", event => {

        if (event.key === BOOKING_KEY) {
            renderBookings();
        }

        if (event.key === PACKAGE_KEY) {
            renderPackages();
        }

    });

    // Refresh when returning to customer tab.
    window.addEventListener("focus", () => {
        renderBookings();
        renderPackages();
    });

    document.addEventListener("visibilitychange", () => {

        if (!document.hidden) {
            renderBookings();
            renderPackages();
        }

    });

    // --------------------------------------------------
    // LOGOUT
    // --------------------------------------------------

    const logoutLink = document.getElementById("logoutLink");

    if (logoutLink) {

        logoutLink.addEventListener("click", () => {
            localStorage.removeItem(CURRENT_USER_KEY);
        });

    }

    // --------------------------------------------------
    // INITIALIZE CUSTOMER DASHBOARD
    // --------------------------------------------------

    renderPackages();
    renderBookings();

}
